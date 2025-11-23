"use client";

import { Tldraw, Editor } from "tldraw";
import "tldraw/tldraw.css";
import { setEditor } from "./utils/editorStore";
import { useState } from "react";
import { useCanvasDetection } from "./hooks/useCanvasDetection";

interface Problem {
  problem: string;
  type: string;
  answer: string;
}

export default function Canvas({problem}: {problem: Problem}) {
  const [editor, setEditorState] = useState<Editor | null>(null);
  
  useCanvasDetection(editor, problem);

  return (
    <div className="h-full w-full">
      <Tldraw
        onMount={(editor) => {
          setEditor(editor);
          setEditorState(editor);
        }}
        components={{
          ContextMenu: null,
          ActionsMenu: null,
          HelpMenu: null,
          ZoomMenu: null,
          MainMenu: null,
          Minimap: null,
          StylePanel: null,
          PageMenu: null,
          NavigationPanel: null,
          QuickActions: null,
          HelperButtons: null,
          DebugPanel: null,
          DebugMenu: null,
          SharePanel: null,
          MenuPanel: null,
          TopPanel: null,
          CursorChatBubble: null,
          RichTextToolbar: null,
          ImageToolbar: null,
          VideoToolbar: null,
          Dialogs: null,
          Toasts: null,
        }}
      />
    </div>
  );
}
