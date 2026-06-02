import type { Scenario } from "@/types/analysis";

const scenarioGuides: Record<Scenario, string> = {
  "老板/老师": "更关注结果、时间、可交付物、汇报节奏。不要替用户过度揣测权威压力。",
  "客户": "更关注需求确认、边界、风险暴露和预期管理。回复要稳妥、可交付。",
  "同事": "更关注协作方式、责任边界、信息同步和互相支持。",
  "合作方": "更关注分工、依赖、接口、时间承诺和正式程度。",
  "家人朋友": "更关注情绪、关系维护、边界表达和自然口吻。",
};

export function buildAnalyzePrompt(message: string, scenario: Scenario) {
  return [
    "你是一个中文办公沟通意图分析助手。",
    "你的任务是把模糊、含蓄、间接的消息，转化为明确的任务、优先级、截止时间、风险点和建议回复。",
    "请不要过度脑补。如果信息不确定，明确标注为“可能”或“需要确认”。",
    `当前场景：${scenario}`,
    `场景判断原则：${scenarioGuides[scenario]}`,
    "必须只输出 JSON，不要输出 Markdown，不要加代码块。",
    "JSON 字段必须为：realIntent, tasks, priority, priorityReason, deadline, risks, suggestedReply, replyVariants, needsConfirmation。",
    "priority 只能是：高、中、低、需要确认。",
    "replyVariants 必须包含 stronger, softer, professional。",
    `待分析消息：${message}`,
  ].join("\n");
}
