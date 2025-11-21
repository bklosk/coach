"use client";

import { getEditor } from "./editorStore";

export default async function getImage(): Promise<
  { document: File } | { message: string }
> {
  const editor = getEditor() as unknown as {
    getCurrentPageShapeIds: () => Iterable<unknown> | unknown[];
    toImage: (
      shapes: unknown[],
      opts?: { format?: "jpeg" | "png" | "webp" | "svg"; background?: boolean }
    ) => Promise<Blob | { blob: Blob }>;
  };
  const ids = editor.getCurrentPageShapeIds();
  const arr = Array.isArray(ids) ? ids : Array.from(ids ?? []);

  if (arr.length === 0) {
    return { message: "no user drawing" };
  }

  const result = await editor.toImage(arr, {
    format: "png",
    background: false,
  });
  const blob = result instanceof Blob ? result : result.blob;
  return {
    document: new File([blob], "canvas.png", { type: "image/png" }),
  };
}
