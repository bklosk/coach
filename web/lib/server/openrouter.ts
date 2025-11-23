import "server-only";
import { OpenAI } from "@posthog/ai";
import { PostHog } from "posthog-node";

export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const posthogClient = new PostHog(
  process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_rlyBBUwJ4Ib4yN0apSWOapQlGHMPfhtsr6twteEPGhd",
  {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  }
);

export const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: OPENROUTER_API_KEY ?? "",
    posthog: posthogClient,
}); 