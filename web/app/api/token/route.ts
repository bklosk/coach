"use server";
import "server-only";
import { OPENAI_API_KEY } from "@/lib/server/openai";

export async function GET() {
  // Optional: check cookies/session here to gate who can mint tokens

  const r = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session: {
        type: "realtime",
        model: "gpt-realtime",
        audio: { output: { voice: "marin" } },
      },
    }),
  });

  const data = await r.text(); // pass through JSON from OpenAI
  return new Response(data, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}
