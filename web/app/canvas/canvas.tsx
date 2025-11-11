"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { setEditor } from "../utils/editorStore";

export default function Canvas() {
  return (
    <div className="h-full w-full">
      <Tldraw onMount={(editor) => setEditor(editor)} />
    </div>
  );
}
