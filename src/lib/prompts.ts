import type { Identity, OutputFormat } from "@/types/analysis";

const identityGuides: Record<Identity, string> = {
  上级: "更关注任务优先级、交付时间、结果质量、汇报节奏和潜在压力。回复要清楚、主动、有时间点。",
  客户: "更关注需求确认、预期管理、信任感、边界和风险暴露。回复要稳妥、可执行、避免过度承诺。",
  同事: "更关注协作方式、责任边界、信息同步和依赖关系。回复要自然、明确、方便推进。",
  家人朋友: "更关注情绪、关系维护、边界表达和自然口吻。回复要有人情味，不要过度职场化。",
  对象: "更关注情绪、亲密关系中的感受、误解和安全感。回复要真诚、具体、避免冷冰冰的分析腔。",
};

function replyGuide(outputFormat?: OutputFormat) {
  if (outputFormat === "微信") {
    return "需要生成回复。回复格式为微信：短一点、自然一点、像聊天消息，可以直接复制发送。";
  }

  if (outputFormat === "邮件") {
    return "需要生成回复。回复格式为邮件：正式一点，有称呼，表达完整，适合邮件发送。";
  }

  return "用户没有选择回复输出形式，reply 必须返回 null。";
}

type BuildAnalyzePromptInput = {
  message: string;
  hasImage: boolean;
  identity: Identity;
  outputFormat?: OutputFormat;
  personName?: string;
  personProfile?: string;
};

export function buildAnalyzePrompt({ message, hasImage, identity, outputFormat, personName, personProfile }: BuildAnalyzePromptInput) {
  return [
    "你是一个中文沟通意图分析助手。",
    "用户会输入聊天记录、邮件内容、任务截图或文字粘贴内容。输入可能是单方叙事，例如导师、领导、客户单独布置任务；也可能是双方或多方对话，例如微信、飞书、邮件往来。",
    hasImage && process.env.AI_ENABLE_VISION === "true" ? "本次输入包含截图，请先读取截图里的文字、发言人关系和上下文，再结合用户补充文字分析。" : "本次输入是文字内容，请结合上下文分析。",
    "你的任务不是泛泛总结，而是判断对方真实想表达什么、用户接下来该怎么处理、有哪些风险，以及在用户需要时生成可直接发送的回复。",
    "请不要过度脑补。如果信息不确定，明确标注为“可能”或“需要确认”。",
    `对方身份：${identity}`,
    `身份判断原则：${identityGuides[identity]}`,
    personName ? `本次指定具体人物：${personName}` : "本次未指定具体人物，不要输出人物画像更新。",
    personProfile ? `该人物已有画像，请在生成回复前参考：\n${personProfile}` : "该人物暂无已有画像，若指定了具体人物，请从本次聊天记录提取可复用的沟通特征。",
    replyGuide(outputFormat),
    "必须只输出 JSON，不要输出 Markdown，不要加代码块。",
    "JSON 字段必须为：realIntent, solutionOutline, risks, reply, personProfileUpdate。",
    "realIntent 必须是字符串数组，说明对方真实意图。",
    "solutionOutline 必须是字符串数组；如果有具体事项，给出解决方案纲要；如果没有具体事项，返回空数组。",
    "risks 必须是字符串数组，说明误解、延期、关系、承诺、边界等风险。",
    "reply 必须是字符串或 null；只有用户选择了微信或邮件时才生成回复。",
    "personProfileUpdate 必须是字符串或 null；只有指定具体人物时，才用简短 Markdown 写入这个人的长期画像更新，包含语言风格、偏好、压力信号、边界和回复建议，不要记录隐私细节或一次性任务内容。",
    `文字输入：${message || "无"}`,
  ].join("\n");
}
