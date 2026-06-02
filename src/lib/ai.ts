import type { AnalysisResult, Scenario } from "@/types/analysis";
import { buildAnalyzePrompt } from "@/lib/prompts";
import { analysisResultSchema } from "@/lib/validators";

function detectDeadline(message: string) {
  const rules = [
    "今天",
    "明天",
    "今晚",
    "本周",
    "这周",
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六",
    "周日",
    "月底",
    "下周",
    "尽快",
    "马上",
  ];
  return rules.find((item) => message.includes(item)) ?? "未明确，需要确认";
}

function detectPriority(message: string): AnalysisResult["priority"] {
  if (/(今天|今晚|马上|立刻|尽快|本周|这周|周五前|截止|急)/.test(message)) return "高";
  if (/(有空|方便|不急|抽空|可以的话)/.test(message)) return "低";
  return "中";
}

function scenarioAddress(scenario: Scenario) {
  if (scenario === "老板/老师") return "您";
  if (scenario === "客户" || scenario === "合作方") return "您";
  return "你";
}

function deadlinePhrase(deadline: string) {
  if (deadline === "未明确，需要确认") return "";
  return /(本周|这周|下周|月底|今天|明天|今晚|尽快|马上)/.test(deadline)
    ? deadline
    : `${deadline} 前`;
}

export function fallbackAnalyzeMessage(message: string, scenario: Scenario): AnalysisResult {
  const deadline = detectDeadline(message);
  const priority = detectPriority(message);
  const address = scenarioAddress(scenario);
  const deliveryTime = deadlinePhrase(deadline);
  const hasScopeRisk = /(看一下|处理一下|弄一下|优化一下|别太复杂|简单|有个版本|推进一下)/.test(message);
  const wantsDraft = /(版本|方案|文档|汇报|demo|演示|初稿|草稿|看一下)/i.test(message);

  return {
    realIntent: [
      wantsDraft ? "对方希望先看到一个可讨论或可展示的初版成果" : "对方希望你对这条消息背后的事项做出回应或推进",
      deadline === "未明确，需要确认" ? "时间要求没有被直接说明，需要主动确认节奏" : `对方对时间有预期：${deadline}`,
      hasScopeRisk ? "对方倾向于先控制范围，不希望一开始做得过重" : "当前信息不足，部分意图只能判断为可能",
    ],
    tasks: [
      "确认对方期望的交付物和完成标准",
      wantsDraft ? "先完成一个主流程可跑通的最小版本" : "拆解需要自己负责推进的具体事项",
      deadline === "未明确，需要确认" ? "补充确认截止时间" : `按 ${deadline} 安排交付或同步`,
    ],
    priority,
    priorityReason:
      priority === "高"
        ? "消息中出现明确或隐含的时间压力，需要优先处理。"
        : priority === "低"
          ? "消息语气较缓，没有明显强截止时间。"
          : "事项需要推进，但截止时间和交付标准仍需确认。",
    deadline,
    risks: [
      hasScopeRisk ? "需求范围表达较模糊，容易出现“做少了不够、做多了浪费”的偏差。" : "上下文不足，真实意图可能需要结合前后对话判断。",
      deadline === "未明确，需要确认" ? "没有明确截止时间，容易导致优先级误判。" : "即使有时间预期，也需要确认交付标准。",
    ],
    suggestedReply: `好的，我先按最小可交付范围推进，优先把主流程和关键结果做出来。${deadline === "未明确，需要确认" ? `为避免理解偏差，我想再确认一下${address}期望的截止时间和交付标准。` : `我会在${deliveryTime}先同步一版给${address}。`}`,
    replyVariants: {
      stronger: `可以，我会先按主流程可交付版本推进；复杂细节暂不展开，避免影响进度。${deadline === "未明确，需要确认" ? "请再确认截止时间和验收标准。" : `我会在${deliveryTime}同步结果。`}`,
      softer: `好的，我先做一个轻量版本看看方向是否一致。${deadline === "未明确，需要确认" ? "如果方便的话，也想确认一下大概希望什么时候看到结果。" : `我尽量在${deliveryTime}给${address}看一版。`}`,
      professional: `收到。我会先锁定最小可用范围，优先保证核心流程可演示，并同步范围、风险和下一步计划。${deadline === "未明确，需要确认" ? "请确认期望交付时间。" : `计划在${deliveryTime}完成首版同步。`}`,
    },
    needsConfirmation: [
      "最终交付物具体是什么形式？",
      "哪些内容属于本轮必须完成，哪些可以后续迭代？",
      deadline === "未明确，需要确认" ? "期望截止时间是什么？" : "当前截止时间是否准确？",
    ],
  };
}

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not contain JSON");
  }
  return text.slice(start, end + 1);
}

export async function analyzeWithModel(message: string, scenario: Scenario): Promise<AnalysisResult> {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    return fallbackAnalyzeMessage(message, scenario);
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
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: buildAnalyzePrompt(message, scenario) }],
    }),
  });

  if (!response.ok) {
    return fallbackAnalyzeMessage(message, scenario);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    return fallbackAnalyzeMessage(message, scenario);
  }

  try {
    return analysisResultSchema.parse(JSON.parse(extractJson(content)));
  } catch {
    return fallbackAnalyzeMessage(message, scenario);
  }
}
