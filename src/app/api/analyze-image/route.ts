import { NextResponse } from "next/server";

// Vision-capable models to try in order (OpenRouter)
const VISION_MODELS = [
  "google/gemini-2.0-flash-001",
  "google/gemini-2.5-flash",
  "openai/gpt-4o-mini",
  "openai/gpt-4.1-mini",
  "anthropic/claude-3.5-haiku",
];

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENAI_BASE_URL = "https://api.openai.com/v1/chat/completions";

function isPlaceholderKey(key: string) {
  return ["your-openai-api-key", "your-openrouter-api-key", "sk-your", "or-your"].some((p) =>
    key.toLowerCase().includes(p)
  );
}

function isOpenRouterKey(key?: string) {
  return Boolean(key) && typeof key === "string" && /^(sk-or-|or-)/.test(key);
}

export async function POST(request: Request) {
  const openAiKey = process.env.OPENAI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  const apiKey = openRouterKey ?? openAiKey;
  const useOpenRouter = Boolean(openRouterKey) || isOpenRouterKey(openAiKey);
  const apiUrl = useOpenRouter ? OPENROUTER_BASE_URL : OPENAI_BASE_URL;

  if (!apiKey || isPlaceholderKey(apiKey)) {
    return NextResponse.json(
      { error: "ไม่พบ API Key กรุณาตั้งค่า OPENROUTER_API_KEY หรือ OPENAI_API_KEY ใน .env.local" },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "ไม่สามารถอ่านข้อมูลไฟล์ได้" }, { status: 400 });
  }

  // Collect all images (field names: image0, image1, …)
  const imageEntries: { file: File; index: number }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("image") && value instanceof File) {
      const idx = parseInt(key.replace("image", ""), 10);
      imageEntries.push({ file: value, index: isNaN(idx) ? imageEntries.length : idx });
    }
  }

  if (imageEntries.length === 0) {
    return NextResponse.json({ error: "ไม่มีไฟล์ภาพที่ส่งมาวิเคราะห์" }, { status: 400 });
  }

  const hintQuery = formData.get("query")?.toString().trim() || "";

  // Convert all images to base64 data URLs
  const imageContentParts: object[] = [];
  for (const { file } of imageEntries) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type || "image/jpeg"};base64,${base64}`;
    imageContentParts.push({
      type: "image_url",
      image_url: { url: dataUrl, detail: "auto" },
    });
  }

  const systemPrompt = `คุณคือผู้เชี่ยวชาญวิเคราะห์ภาพเชิงลึกเพื่อการเรียนรู้ STEM สำหรับแพลตฟอร์มการศึกษาไทย
คุณมีความเชี่ยวชาญในการเชื่อมโยงสิ่งที่เห็นในภาพกับหลักการฟิสิกส์ คณิตศาสตร์ เคมี และชีววิทยาอย่างละเอียดและลึกซึ้ง
ตอบเฉพาะ JSON array เท่านั้น ห้ามมีข้อความอื่นใด ห้ามใช้ markdown code block`;

  const userPromptText = `วิเคราะห์ภาพที่แนบมานี้${hintQuery ? ` โดยเน้นที่ "${hintQuery}"` : ""} อย่างละเอียดและลึกซึ้ง อธิบายหลักการ STEM ที่ซ่อนอยู่ในภาพ
สร้าง JSON array 3-5 รายการ โดยแต่ละรายการคือมุมมองความรู้ที่แตกต่างกัน (ฟิสิกส์ คณิตศาสตร์ ชีววิทยา เคมี ความรู้ทั่วไป)
รูปแบบ JSON:
[
  {
    "category": "ชื่อหมวดหมู่วิชา เช่น ฟิสิกส์ / คณิตศาสตร์ / เคมี / ชีววิทยา / ความรู้ทั่วไป",
    "topicName": "ชื่อหัวข้อที่เชื่อมกับสิ่งที่เห็นในภาพ",
    "information": "คำอธิบายเชิงลึก 4-6 ประโยค อธิบายหลักการและกลไกที่ซ่อนอยู่อย่างละเอียด",
    "solution": "อธิบาย 2-3 ประโยค ว่าหลักการนี้ทำงานอย่างไร พร้อมสูตรหรือข้อเท็จจริงสำคัญ",
    "trick": "เคล็ดลับหรือข้อค้นพบที่น่าแปลกใจที่ช่วยให้เข้าใจและจำได้ดีขึ้น",
    "image": "emoji ที่เหมาะสมกับหมวดหมู่นี้ 1 ตัว"
  }
]`;

  const messageContent: object[] = [
    { type: "text", text: userPromptText },
    ...imageContentParts,
  ];

  let lastError = "";
  const modelsToTry = useOpenRouter ? VISION_MODELS : ["gpt-4o-mini"];

  for (const model of modelsToTry) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "LearnHub Vision Analyzer",
        },
        body: JSON.stringify({
          model: useOpenRouter ? model : "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: messageContent },
          ],
          max_tokens: 2400,
          temperature: 0.6,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        lastError = data?.error?.message ?? `HTTP ${response.status} from ${model}`;
        console.warn(`[Vision] Model ${model} failed:`, lastError);
        continue;
      }

      const rawText: string = data?.choices?.[0]?.message?.content ?? "";
      if (!rawText.trim()) {
        lastError = `Model ${model} returned empty content`;
        continue;
      }

      // Strip markdown fences if present
      const jsonCandidate = rawText.trim().match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? rawText.trim();

      try {
        const parsed = JSON.parse(jsonCandidate);
        const items = Array.isArray(parsed) ? parsed : parsed?.items ?? [parsed];
        return NextResponse.json({ result: items, modelUsed: model });
      } catch {
        return NextResponse.json({
          result: [
            {
              category: "การวิเคราะห์ภาพ",
              topicName: hintQuery || "ผลการวิเคราะห์ภาพจาก AI",
              information: rawText.trim(),
              solution: "อ่านคำอธิบายจาก AI และสรุปสาระสำคัญ",
              trick: "เชื่อมข้อมูลกับตัวอย่างที่เข้าใจง่ายในชีวิตประจำวัน",
              image: "🔍",
            },
          ],
          modelUsed: model,
        });
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[Vision] Error with model ${model}:`, lastError);
    }
  }

  return NextResponse.json(
    { error: `ไม่สามารถวิเคราะห์ภาพได้: ${lastError}` },
    { status: 502 }
  );
}
