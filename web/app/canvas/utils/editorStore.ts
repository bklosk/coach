"use client";

import type { Editor } from "tldraw";

let currentEditor: Editor | null = null;

export function setEditor(editor: Editor) {
  currentEditor = editor;
}

export function getEditor(): Editor {
  if (!currentEditor) {
    throw new Error("Tldraw editor is not mounted yet.");
  }
  return currentEditor;
}


