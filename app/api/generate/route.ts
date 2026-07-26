import { NextResponse } from "next/server";
import { buildExtensionFiles, inferExtensionInput, type ExtensionInput } from "@/lib/extension";

export async function POST(request: Request) {
  const { prompt } = await request.json() as { prompt?: string };
  if (!prompt?.trim()) return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ input: inferExtensionInput(prompt), source: "fallback" });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Return JSON for a Chrome extension generator with keys prompt,name,description,popupTitle,buttonText,primaryColor. Use a hex primaryColor." },
        { role: "user", content: prompt }
      ]
    })
  });
  if (!response.ok) return NextResponse.json({ error: "OpenAI generation failed." }, { status: 502 });
  const data = await response.json();
  const input = JSON.parse(data.choices?.[0]?.message?.content || "{}") as ExtensionInput;
  const normalized = { ...inferExtensionInput(prompt), ...input, prompt };
  return NextResponse.json({ input: normalized, files: buildExtensionFiles(normalized), source: "openai" });
}
