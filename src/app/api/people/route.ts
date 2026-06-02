import { NextResponse } from "next/server";
import { listPeople } from "@/lib/people";

export async function GET() {
  const people = await listPeople();
  return NextResponse.json({ people });
}
