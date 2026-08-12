import { NextResponse } from "next/server";

// Correct OpenRouter base URL (must include /api)
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENAI_BASE_URL = "https://api.openai.com/v1/chat/completions";

interface SearchResultItem {
  category: string;
  topicName: string;
  information: string;
  solution: string;
  trick: string;
  image: string;
}

function isPlaceholderKey(key: string) {
  return ["your-openai-api-key", "your-openrouter-api-key", "sk-your", "or-your"].some((p) =>
    key.toLowerCase().includes(p)
  );
}

function isOpenRouterKey(key?: string) {
  return Boolean(key) && typeof key === "string" && /^(sk-or-|or-)/.test(key);
}

function buildFallbackResult(query: string): SearchResultItem[] {
  return [
    {
      category: "วิทยาศาสตร์",
      topicName: `${query || "หัวข้อที่คุณสนใจ"} — มุมมองวิทยาศาสตร์`,
      information: `"${query}" มีความเชื่อมโยงกับหลักการวิทยาศาสตร์หลายด้าน เช่น ฟิสิกส์ เคมี หรือชีววิทยา ซึ่งสามารถอธิบายปรากฏการณ์ในชีวิตประจำวันได้อย่างลึกซึ้ง`,
      solution: "ศึกษาจากหลักการพื้นฐานและตัวอย่างที่เกิดขึ้นจริงในธรรมชาติ",
      trick: "ลองเชื่อมโยงสิ่งที่เห็นในชีวิตประจำวันกับทฤษฎีวิทยาศาสตร์เพื่อเข้าใจง่ายขึ้น",
      image: "🔬",
    },
    {
      category: "คณิตศาสตร์",
      topicName: `${query || "หัวข้อที่คุณสนใจ"} — มุมมองคณิตศาสตร์`,
      information: `ในเชิงคณิตศาสตร์ "${query}" สามารถวิเคราะห์ได้ผ่านรูปแบบเชิงตัวเลข สมการ หรือเรขาคณิต ซึ่งช่วยให้เข้าใจโครงสร้างที่ซ่อนอยู่ในธรรมชาติและเทคโนโลยี`,
      solution: "ใช้สูตรและกราฟเพื่อแสดงความสัมพันธ์ระหว่างตัวแปรต่างๆ",
      trick: "หาความสมมาตรหรือรูปแบบซ้ำในข้อมูลเพื่อลดความซับซ้อนของปัญหา",
      image: "📐",
    },
    {
      category: "ความรู้ทั่วไป",
      topicName: `${query || "หัวข้อที่คุณสนใจ"} — ข้อเท็จจริงน่าสนใจ`,
      information: `"${query}" เป็นหัวข้อที่ปรากฏในหลายบริบท ตั้งแต่วัฒนธรรม ประวัติศาสตร์ ไปจนถึงวิศวกรรมและนวัตกรรมสมัยใหม่ ซึ่งทำให้เป็นที่น่าสนใจในหลายสาขาวิชา`,
      solution: "สำรวจมุมมองที่หลากหลายเพื่อสร้างความเข้าใจที่ครบถ้วน",
      trick: "การรู้บริบทและประวัติที่มาของเรื่องช่วยให้จำและเข้าใจได้ดีกว่าการท่องจำเนื้อหาเพียงอย่างเดียว",
      image: "💡",
    },
  ];
}

function parseResultPayload(rawText: string, query: string): SearchResultItem[] | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  // Strip markdown code fences if present
  const jsonCandidate = trimmed.match(/\`\`\`(?:json)?\s*([\s\S]*?)\`\`\`/i)?.[1] ?? trimmed;

  try {
    const parsed = JSON.parse(jsonCandidate);

    if (Array.isArray(parsed)) {
      return parsed as SearchResultItem[];
    }

    if (parsed && typeof parsed === "object") {
      const asRecord = parsed as Record<string, unknown>;
      if (Array.isArray(asRecord.items)) {
        return asRecord.items as SearchResultItem[];
      }

      if (
        typeof asRecord.information === "string" ||
        typeof asRecord.answer === "string" ||
        typeof asRecord.topicName === "string"
      ) {
        return [
          {
            category: String(asRecord.category ?? "วิทยาศาสตร์"),
            topicName: String(asRecord.topicName ?? asRecord.topic ?? query ?? "หัวข้อที่คุณสนใจ"),
            information: String(asRecord.information ?? asRecord.answer ?? asRecord.summary ?? trimmed),
            solution: String(asRecord.solution ?? asRecord.answer ?? "ดูคำอธิบายจาก AI แล้วสรุปสาระสำคัญ"),
            trick: String(asRecord.trick ?? asRecord.tip ?? "เชื่อมข้อมูลกับตัวอย่างที่เข้าใจง่าย"),
            image: String(asRecord.image ?? "🔍"),
          },
        ];
      }
    }
  } catch {
    // ignore parse errors and fall back to using the raw AI response
  }

  return [
    {
      category: "วิทยาศาสตร์",
      topicName: query || "ข้อมูลจาก AI",
      information: trimmed,
      solution: "อ่านคำอธิบายจาก AI และสรุปสาระสำคัญ",
      trick: "เชื่อมข้อมูลกับตัวอย่างที่เข้าใจง่าย",
      image: "🧠",
    },
  ];
}

// Model priority list — tries each in order until one succeeds
const MODELS_TO_TRY = [
  "openai/gpt-5.6-luna",
  "google/gemini-2.0-flash-lite-001",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-4o-mini",
  "anthropic/claude-3.5-sonnet",
];

export async function POST(request: Request) {
  const openAiKey = process.env.OPENAI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  // Prefer OpenRouter key; fallback to OpenAI key
  const apiKey = openRouterKey ?? openAiKey;
  const useOpenRouter = Boolean(openRouterKey) || isOpenRouterKey(openAiKey);
  const apiUrl = useOpenRouter ? OPENROUTER_BASE_URL : OPENAI_BASE_URL;

  const body = await request.json().catch(() => null);
  const query = body?.query?.toString().trim();

  if (!query) {
    return NextResponse.json({ error: "คำค้นหาต้องไม่ว่างเปล่า" }, { status: 400 });
  }

  if (!apiKey || isPlaceholderKey(apiKey)) {
    return NextResponse.json(
      { error: "ไม่พบ API Key กรุณาตั้งค่า OPENROUTER_API_KEY หรือ OPENAI_API_KEY ใน .env.local" },
      { status: 500 }
    );
  }

  const prompt = `คุณคือผู้ช่วยการค้นพบความรู้ STEM สำหรับแพลตฟอร์มเรียนฟิสิกส์ คณิตศาสตร์ และวิทยาศาสตร์ไทย
ผู้ใช้ถามเกี่ยวกับ: "${query}"

ตอบเป็น JSON array เท่านั้น ห้ามมีข้อความอื่นใด ห้ามใช้ markdown code block
สร้าง 3 ถึง 5 รายการ โดยแต่ละรายการต้องเป็นมุมมองหรือหมวดหมู่ความรู้ที่แตกต่างกัน (เช่น ฟิสิกส์, ชีววิทยา, คณิตศาสตร์, เคมี, ความรู้ทั่วไป) ที่เชื่อมโยงกับ "${query}"
รูปแบบที่ต้องการ:
[
  {
    "category": "ชื่อหมวดหมู่วิชา เช่น ฟิสิกส์ / คณิตศาสตร์ / เคมี / ชีววิทยา / ความรู้ทั่วไป",
    "topicName": "ชื่อหัวข้อที่เชื่อมกับ ${query} ในมุมมองนี้",
    "information": "คำอธิบาย 3-4 ประโยค อธิบายหลักการที่ซ่อนอยู่อย่างละเอียดและน่าสนใจ",
    "solution": "สรุปสั้นๆ 1-2 ประโยค ว่าหลักการนี้ทำงานอย่างไร หรือมีสูตร/ข้อเท็จจริงสำคัญอะไร",
    "trick": "เคล็ดลับหรือสิ่งที่น่าแปลกใจที่สุดเกี่ยวกับหัวข้อนี้ เพื่อช่วยจำหรือสร้างความเข้าใจ",
    "image": "emoji ที่เหมาะสมกับหมวดหมู่นี้ 1 ตัว"
  }
]`;

  let lastError = "";

  for (const model of (useOpenRouter ? MODELS_TO_TRY : [MODELS_TO_TRY[0]])) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "LearnHub Discovery Engine",
        },
        body: JSON.stringify({
          model: useOpenRouter ? model : "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful STEM education assistant. Always respond with valid JSON only, no markdown." },
            { role: "user", content: prompt },
          ],
          max_tokens: 1800,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        lastError = data?.error?.message ?? `HTTP ${response.status} from model ${model}`;
        console.warn(`[AI] Model ${model} failed (${response.status}):`, lastError);
        continue; // Try next model
      }

      const resultText = data?.choices?.[0]?.message?.content;
      if (!resultText) {
        lastError = `Model ${model} returned empty content`;
        continue;
      }

      const parsedResult = parseResultPayload(resultText, query);
      if (!parsedResult) {
        return NextResponse.json({
          result: buildFallbackResult(query),
          modelUsed: model,
        });
      }

      return NextResponse.json({ result: parsedResult, modelUsed: model });
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[AI] Error with model ${model}:`, lastError);
    }
  }

  // All models failed — return error to client (not silently swallow)
  return NextResponse.json(
    { error: `ไม่สามารถเชื่อมต่อ AI ได้: ${lastError}` },
    { status: 502 }
  );
}
