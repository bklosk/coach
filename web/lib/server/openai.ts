import "server-only";
import { OpenAI } from "@posthog/ai";
import { PostHog } from "posthog-node";

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("Missing OPENAI_API_KEY environment variable");
}

const posthogClient = new PostHog(
  process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_rlyBBUwJ4Ib4yN0apSWOapQlGHMPfhtsr6twteEPGhd",
  {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  }
);

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY ?? "",
  posthog: posthogClient,
});

