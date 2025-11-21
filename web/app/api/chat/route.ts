import { openai } from "@/lib/server/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { messages } = body;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages || [{ role: "user", content: "Tell me a fun fact about hedgehogs" }],
    posthogDistinctId: "ben_klosky",
  });

  return NextResponse.json(completion);
}

