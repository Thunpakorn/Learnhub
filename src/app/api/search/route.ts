import { NextResponse } from "next/server";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENROUTER_API_URL = "https://openrouter.ai/v1/chat/completions";

interface SearchResultItem {
  category: string;
  topicName: string;
  information: string;
  solution: string;
  trick: string;
  image: string;
}

function normalizeBaseUrl(baseUrl: string) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/chat/completions")
    ? trimmed
    : `${trimmed}/chat/completions`;
}

function isPlaceholderKey(key: string) {
  return [
    "your-openai-api-key",
    "your-openrouter-api-key",
    "sk-your",
    "or-your",
  ].some((placeholder) => key.toLowerCase().includes(placeholder));
}

function isOpenRouterKey(key?: string) {
  return Boolean(key) && typeof key === "string" && /^(sk-or-|or-)/.test(key);
}

function buildFallbackResult(query: string): SearchResultItem[] {
  const normalized = query.toLowerCase();
  const isMath = /(เลข|สมการ|ฟังก์ชัน|คณิต|จำนวน|กราฟ|เศษ|อสมการ|พื้นที่|ทฤษฎี)/.test(normalized);
  const isScience = /(ฟิสิกส์|เคมี|ชีว|แสง|คลื่น|เสียง|ดาว|น้ำ|สาร|เซลล์|พลัง|รุ้ง|สบู่|กีตาร์|ผึ้ง|บาส|ลูก)/.test(normalized);
  const category = isMath && isScience ? "วิทยาศาสตร์ & คณิตศาสตร์" : isMath ? "คณิตศาสตร์" : isScience ? "วิทยาศาสตร์" : "วิทยาศาสตร์";

  return [
    {
      category,
      topicName: query || "หัวข้อที่คุณสนใจ",
      information: `คำถามนี้มีความเกี่ยวข้องกับหลักการ${category}ในชีวิตประจำวันและสามารถอธิบายได้ด้วยตัวอย่างที่เข้าใจง่าย`,
      solution: "ใช้แนวคิดพื้นฐานของหัวข้อนั้น ๆ และเชื่อมกับตัวอย่างจากสิ่งที่เห็นรอบตัว",
      trick: "แบ่งคำถามออกเป็นคำสำคัญเล็ก ๆ เพื่อช่วยจำและเชื่อมกับสูตรหรือกฎที่จำเป็น",
      image: category.includes("คณิต") ? "📐" : "🔬",
    },
  ];
}

function parseResultPayload(rawText: string): SearchResultItem[] | null {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return null;
  }

  const jsonCandidate = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? trimmed;

  try {
    const parsed = JSON.parse(jsonCandidate);
    if (Array.isArray(parsed)) {
      return parsed as SearchResultItem[];
    }

    if (parsed && typeof parsed === "object" && Array.isArray((parsed as Record<string, unknown>).items)) {
      return (parsed as Record<string, unknown>).items as SearchResultItem[];
    }
  } catch {
    // ignore and fall back to a simple fallback shape
  }

  return null;
}

export async function POST(request: Request) {
  const openAiKey = process.env.OPENAI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAiBaseUrl = process.env.OPENAI_BASE_URL;
  const apiKey = openAiKey ?? openRouterKey;
  const isOpenRouter = Boolean(openRouterKey) || isOpenRouterKey(openAiKey);
  const apiUrl = isOpenRouter
    ? openAiBaseUrl
      ? normalizeBaseUrl(openAiBaseUrl)
      : OPENROUTER_API_URL
    : OPENAI_API_URL;
  const providerName = isOpenRouter ? "OPENROUTER_API_KEY / OpenRouter" : "OPENAI_API_KEY";

  const body = await request.json().catch(() => null);
  const query = body?.query?.toString().trim();

  if (!query) {
    return NextResponse.json(
      { error: "คำค้นหาต้องไม่ว่างเปล่า" },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json({ result: buildFallbackResult(query) });
  }

  if (isPlaceholderKey(apiKey)) {
    return NextResponse.json({ result: buildFallbackResult(query) });
  }

  const prompt = `You are a helpful discovery assistant for a Thai science and math learning platform. A user asked: "${query}". Return ONLY valid JSON in Thai. Use this exact shape: [{"category":"คณิตศาสตร์","topicName":"...","information":"...","solution":"...","trick":"...","image":"📐"}] . If the topic is science-related use "วิทยาศาสตร์" or "ฟิสิกส์" or "เคมี" or "ชีววิทยา". Keep each item short and educational.`;

  try {
    const openAiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [
          { role: "system", content: "You are a helpful education assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 450,
      }),
    });

    const data = await openAiResponse.json();

    if (!openAiResponse.ok) {
      return NextResponse.json({ result: buildFallbackResult(query) });
    }

    const resultText = data?.choices?.[0]?.message?.content;
    if (!resultText) {
      return NextResponse.json({ result: buildFallbackResult(query) });
    }

    const parsedResult = parseResultPayload(resultText);
    return NextResponse.json({ result: parsedResult ?? buildFallbackResult(query) });
  } catch {
    return NextResponse.json({ result: buildFallbackResult(query) });
  }
}
