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

function parseResultPayload(rawText: string): SearchResultItem[] | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  // Strip markdown code fences if present
  const jsonCandidate = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? trimmed;

  try {
    const parsed = JSON.parse(jsonCandidate);
    if (Array.isArray(parsed)) return parsed as SearchResultItem[];
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as Record<string, unknown>).items)) {
      return (parsed as Record<string, unknown>).items as SearchResultItem[];
    }
  } catch {
    // Could not parse JSON — return null to signal failure
  }
  return null;
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

ตอบเป็น JSON ที่ถูกต้องเท่านั้น ห้ามมีข้อความอื่นใด ห้ามใช้ markdown code block
รูปแบบที่ต้องการ (array ที่มี 1 รายการ):
[{
  "category": "ชื่อหมวดหมู่วิชา เช่น ฟิสิกส์ / คณิตศาสตร์ / เคมี / ชีววิทยา",
  "topicName": "ชื่อหัวข้อหลักที่เชื่อมกับ ${query}",
  "information": "คำอธิบาย 3-4 ประโยค อธิบายหลักการวิทยาศาสตร์หรือคณิตศาสตร์ที่ซ่อนอยู่ใน ${query} อย่างละเอียดและน่าสนใจ",
  "solution": "สรุปสั้นๆ 1-2 ประโยค ว่าหลักการนี้ทำงานอย่างไรในทางปฏิบัติ หรือมีสูตรอะไรที่สำคัญ",
  "trick": "เคล็ดลับหรือสิ่งที่น่าแปลกใจที่สุดเกี่ยวกับหัวข้อนี้ เพื่อช่วยจำหรือสร้างความเข้าใจ",
  "image": "emoji ที่เหมาะสมกับหัวข้อ 1 ตัว"
}]`;

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
          max_tokens: 700,
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

      const parsedResult = parseResultPayload(resultText);
      if (!parsedResult) {
        // LLM returned non-JSON — return raw text as information field
        return NextResponse.json({
          result: [
            {
              category: "วิทยาศาสตร์",
              topicName: query,
              information: resultText,
              solution: "ดูคำอธิบายด้านบน",
              trick: "AI ตอบกลับในรูปแบบข้อความ ไม่ใช่ JSON โครงสร้างมาตรฐาน",
              image: "🧠",
            },
          ],
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
