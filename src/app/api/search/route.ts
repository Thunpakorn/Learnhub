import { NextResponse } from "next/server";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENROUTER_API_URL = "https://openrouter.ai/v1/chat/completions";

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
  return Boolean(key) && /^(sk-or-|or-)/.test(key);
}

export async function POST(request: Request) {
  const openAiKey = process.env.OPENAI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAiBaseUrl = process.env.OPENAI_BASE_URL;
  const hasOpenAIKey = Boolean(openAiKey);
  const apiKey = openAiKey ?? openRouterKey;
  const isOpenRouter = Boolean(openRouterKey) || isOpenRouterKey(openAiKey);
  const apiUrl = isOpenRouter
    ? openAiBaseUrl
      ? normalizeBaseUrl(openAiBaseUrl)
      : OPENROUTER_API_URL
    : OPENAI_API_URL;
  const providerName = isOpenRouter ? "OPENROUTER_API_KEY / OpenRouter" : "OPENAI_API_KEY";

  if (!apiKey) {
    return NextResponse.json(
      { error: `Missing ${providerName} environment variable.` },
      { status: 500 }
    );
  }

  if (isPlaceholderKey(apiKey)) {
    return NextResponse.json(
      {
        error:
          "Your API key is a placeholder. Please replace the key in .env.local with a real OPENAI_API_KEY or OPENROUTER_API_KEY value and restart the server.",
      },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const query = body?.query?.toString().trim();

  if (!query) {
    return NextResponse.json(
      { error: "คำค้นหาต้องไม่ว่างเปล่า" },
      { status: 400 }
    );
  }

  const prompt = `You are a helpful discovery assistant for a Thai science and math learning platform. A user asked: "${query}". Reply in Thai with a concise explanation of the relevant physics, chemistry, biology, or mathematics concept that best matches the query. Keep the answer friendly and educational, and avoid suggesting code or implementation details.`;

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
      return NextResponse.json(
        { error: data?.error?.message || "ไม่สามารถดึงผลลัพธ์จาก AI ได้" },
        { status: openAiResponse.status }
      );
    }

    const resultText = data?.choices?.[0]?.message?.content;
    if (!resultText) {
      return NextResponse.json(
        { error: "AI ไม่ได้ส่งผลลัพธ์กลับมา" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: resultText });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการค้นหา" },
      { status: 500 }
    );
  }
}
