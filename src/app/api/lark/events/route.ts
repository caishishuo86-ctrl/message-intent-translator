import { NextResponse } from "next/server";

export const runtime = "edge";

type LarkMessageEvent = {
  event?: {
    message?: {
      chat_type?: string;
      message_type?: string;
    };
  };
  challenge?: string;
};

function enqueueProcessing(request: Request, body: LarkMessageEvent) {
  const url = new URL("/api/lark/process", request.url);

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch((error) => {
    console.error(error);
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as LarkMessageEvent;

  if (body.challenge) {
    return NextResponse.json({ challenge: body.challenge });
  }

  if (body.event?.message?.chat_type === "group" && body.event.message.message_type === "text") {
    enqueueProcessing(request, body);
  }

  return NextResponse.json({ ok: true });
}
