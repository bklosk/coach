import { openrouter } from "@/lib/server/openrouter";
import { NextResponse } from "next/server";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const schema = z.object({
  error_detected: z.boolean(),
  diagnosis: z.string(),
  solved: z.boolean(),
  next_step: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { document, problem } = body;

//TODO: get bounding box of the error IF AN ERROR IS DETECTED
//TODO: get etiology of the error

  const completion = await openrouter.chat.completions.create({
    model: "google/gemini-2.5-flash-preview-09-2025",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `The student is working on the following problem:
Problem Statement: ${problem?.problem}
Problem Type: ${problem?.type}
Expected Answer: ${problem?.answer}

Is there a mathematical error in the image? In a very short sentence, describe the error. If no error is detected, the diagnosis must be an empty string. Identify if the student has solved the problem, even if the form is different from the expected answer.`,
          },
          {
            type: "image_url",
            image_url: {
              url: document,
              detail: "high",
            },
          },
        ],
      },
    ],
    response_format: zodResponseFormat(schema, "error_detection"),
  });

  const rawContent = completion.choices[0]?.message?.content;
  let parsedContent = null;
  if (rawContent) {
    try {
      parsedContent = JSON.parse(rawContent);
    } catch (e) {
      console.error("Failed to parse response content", e);
    }
  }

  return NextResponse.json({ ...completion, output_parsed: parsedContent });
}
