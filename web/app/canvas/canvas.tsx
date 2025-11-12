"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { setEditor } from "../utils/editorStore";

export default function Canvas() {
  return (
    <div className="h-full w-full">
      <Tldraw
        onMount={(editor) => setEditor(editor)}
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
