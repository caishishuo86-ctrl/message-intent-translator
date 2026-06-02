import type { AnalysisResult, Identity, OutputFormat } from "@/types/analysis";
import { buildAnalyzePrompt } from "@/lib/prompts";
import { analysisResultSchema } from "@/lib/validators";

type AnalyzeInput = {
  message: string;
  imageDataUrl?: string;
  identity: Identity;
  outputFormat?: OutputFormat;
  personName?: string;
  personProfile?: string;
};

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not contain JSON");
  }
  return text.slice(start, end + 1);
}

function providerOptions() {
  const raw = process.env.AI_PROVIDER_CONFIG;
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return undefined;

    const entries = Object.entries(parsed).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== "";
    });

    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  } catch {
    throw new Error("AI_PROVIDER_CONFIG must be valid JSON");
  }
}

function buildMessageContent(input: AnalyzeInput) {
  const prompt = buildAnalyzePrompt({
    message: input.message,
    hasImage: Boolean(input.imageDataUrl),
    identity: input.identity,
    outputFormat: input.outputFormat,
    personName: input.personName,
    personProfile: input.personProfile,
  });

  if (!input.imageDataUrl || process.env.AI_ENABLE_VISION !== "true") {
    return prompt;
  }

  return [
    {
      type: "image_url",
      image_url: {
        url: input.imageDataUrl,
      },
    },
    {
      type: "text",
      text: prompt,
    },
  ];
}

export async function analyzeWithModel(input: AnalyzeInput): Promise<AnalysisResult> {
  if (input.imageDataUrl && process.env.AI_ENABLE_VISION !== "true" && !input.message.trim()) {
    throw new Error("当前模型暂不支持截图分析，请先粘贴截图里的文字内容再分析。");
  }

  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const model = input.imageDataUrl && process.env.AI_ENABLE_VISION === "true"
    ? (process.env.AI_VISION_MODEL ?? process.env.AI_MODEL)
    : (process.env.AI_TEXT_MODEL ?? process.env.AI_MODEL);
  const provider = providerOptions();

  if (!apiKey) {
    throw new Error("AI_API_KEY is required");
  }

  if (!baseUrl) {
    throw new Error("AI_BASE_URL is required");
  }

  if (!model) {
    throw new Error("AI_MODEL is required");
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [{ role: "user", content: buildMessageContent(input) }],
      ...(process.env.AI_RESPONSE_FORMAT === "json_object" ? { response_format: { type: "json_object" } } : {}),
      ...(provider ? { provider } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI request failed: ${response.status}${errorText ? ` ${errorText}` : ""}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("AI response content is empty");
  }

  return analysisResultSchema.parse(JSON.parse(extractJson(content)));
}
