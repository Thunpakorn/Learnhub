import { NextResponse } from "next/server";

interface VisionResult {
  analysis: string;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const imageFile = formData.get("image");
  const query = formData.get("query")?.toString().trim();

  if (!imageFile || !(imageFile instanceof File)) {
    return NextResponse.json({ error: "ไม่มีไฟล์ภาพที่ส่งมาวิเคราะห์" }, { status: 400 });
  }

  const openAiKey = process.env.OPENAI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const apiKey = openAiKey ?? openRouterKey;
  if (!apiKey || /your-(openai|openrouter)-api-key|sk-your|or-your/i.test(apiKey)) {
    return NextResponse.json({ analysis: "ไม่สามารถวิเคราะห์ภาพได้ในขณะนี้ เนื่องจากไม่มีคีย์ API" });
  }

  const useOpenRouter = Boolean(openRouterKey) || /^(sk-or-|or-)/.test(openAiKey ?? "");
  const apiUrl = useOpenRouter
    ? process.env.OPENAI_BASE_URL?.trim().replace(/\/+$/, "") || "https://openrouter.ai/v1/responses"
    : "https://api.openai.com/v1/responses";

  const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
  const base64Image = fileBuffer.toString("base64");
  const dataUrl = `data:${imageFile.type};base64,${base64Image}`;

  const userPrompt = `คุณเป็นผู้ช่วยวิเคราะห์ภาพเพื่อการเรียนรู้วิทยาศาสตร์และคณิตศาสตร์ โปรดอธิบายภาพนี้ในภาษาไทยโดยเชื่อมกับหัวข้อหรือหลักการที่เกี่ยวข้อง${query ? ` และคำถามคือ "${query}"` : ""} ให้ย่อ สั้น กระชับ และเน้นสิ่งที่เห็นในภาพ`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: userPrompt },
              { type: "input_image", image_url: dataUrl },
            ],
          },
        ],
        max_output_tokens: 450,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data?.error?.message || "ไม่สามารถวิเคราะห์ภาพได้" }, { status: 500 });
    }

    const output = Array.isArray(data.output) ? data.output : data?.output?.[0]?.content;
    const analysis = Array.isArray(output)
      ? output.filter((item: any) => item.type === "output_text").map((item: any) => item.text).join(" ")
      : typeof output === "string"
      ? output
      : data?.output?.[0]?.content?.find((item: any) => item.type === "output_text")?.text;

    return NextResponse.json({ analysis: analysis?.trim() ?? "ไม่สามารถสรุปภาพได้" } as VisionResult);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
