import type { AnalysisResult } from "@/types/analysis";

const larkBaseUrl = process.env.LARK_BASE_URL ?? "https://open.feishu.cn";

async function getTenantAccessToken() {
  const appId = process.env.LARK_APP_ID;
  const appSecret = process.env.LARK_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("LARK_APP_ID and LARK_APP_SECRET are required");
  }

  const response = await fetch(`${larkBaseUrl.replace(/\/$/, "")}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });

  const data = await response.json();
  if (!response.ok || data.code !== 0 || typeof data.tenant_access_token !== "string") {
    throw new Error(`Lark token request failed: ${data.msg ?? response.status}`);
  }

  return data.tenant_access_token as string;
}

export function formatPrivateAdvice(message: string, result: AnalysisResult) {
  return [
    "【群聊私聊建议】",
    `原消息：${message}`,
    "",
    `真实意图：${result.realIntent.join("；")}`,
    `处理建议：${result.solutionOutline.join("；") || "暂无具体行动项"}`,
    `风险提示：${result.risks.join("；") || "暂无明显风险"}`,
    result.reply ? `可直接回复：${result.reply}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendPrivateLarkMessage(openId: string, text: string) {
  const tenantAccessToken = await getTenantAccessToken();
  const response = await fetch(`${larkBaseUrl.replace(/\/$/, "")}/open-apis/im/v1/messages?receive_id_type=open_id`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tenantAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      receive_id: openId,
      msg_type: "text",
      content: JSON.stringify({ text }),
    }),
  });

  const data = await response.json();
  if (!response.ok || data.code !== 0) {
    throw new Error(`Lark message send failed: ${data.msg ?? response.status}`);
  }
}
