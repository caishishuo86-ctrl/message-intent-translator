import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { analyzeMessage } from "@/server/analyzeMessage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await analyzeMessage(body);

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "输入不合法" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "分析失败" },
      { status: 500 },
    );
  }
}
