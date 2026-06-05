import { NextResponse } from "next/server";

type LarkMessageEvent = {
  event?: {
    message?: {
      chat_id?: string;
      chat_type?: string;
      content?: string;
    };
    sender?: {
      sender_id?: {
        open_id?: string;
      };
    };
  };
};

function parseTextContent(content?: string) {
  if (!content) return "";

  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object" && "text" in parsed && typeof parsed.text === "string") {
      return parsed.text.trim();
    }
  } catch {
    return content.trim();
  }

  return content.trim();
}

function isAllowedChat(chatId?: string) {
  const allowedChatIds = process.env.LARK_ENABLED_CHAT_IDS
    ?.split(",")
    .map((allowedChatId) => allowedChatId.trim())
    .filter(Boolean);

  if (!allowedChatIds?.length) return true;
  return Boolean(chatId && allowedChatIds.includes(chatId));
}

function isAdvisorMentioned(text: string) {
  const keywords = process.env.LARK_ADVISOR_TRIGGER_KEYWORDS
    ?.split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  if (!keywords?.length) return true;
  return keywords.some((keyword) => text.includes(keyword) || text.includes(`@${keyword}`));
}

export async function POST(request: Request) {
  const body = (await request.json()) as LarkMessageEvent;
  const message = body.event?.message;
  const senderOpenId = body.event?.sender?.sender_id?.open_id;
  const advisorOpenId = message?.chat_type === "group"
    ? process.env.LARK_PRIVATE_ADVISOR_USER_OPEN_ID
    : (senderOpenId ?? process.env.LARK_PRIVATE_ADVISOR_USER_OPEN_ID);

  if (!message || !isAllowedChat(message.chat_id)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const text = parseTextContent(message.content);
  if (text.length < 2) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (message.chat_type === "group" && !isAdvisorMentioned(text)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (!advisorOpenId) {
    throw new Error("LARK_PRIVATE_ADVISOR_USER_OPEN_ID is required when sender open_id is unavailable");
  }

  const [{ analyzeMessage }, { formatPrivateAdvice, sendPrivateLarkMessage }, { extractPersonFromMessage }] = await Promise.all([
    import("@/server/analyzeMessage"),
    import("@/lib/lark"),
    import("@/lib/personDetection"),
  ]);
  const result = await analyzeMessage({
    message: text,
    identity: "同事",
    outputFormat: "微信",
    personName: extractPersonFromMessage(text) || undefined,
  });

  await sendPrivateLarkMessage(advisorOpenId, formatPrivateAdvice(text, result));

  return NextResponse.json({ ok: true });
}
