"use client";

import { Tldraw, Editor } from "tldraw";
import "tldraw/tldraw.css";
import { setEditor } from "../utils/editorStore";
import getImage from "../utils/getImage";
import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";

export default function Canvas() {
  const [editor, setEditorState] = useState<Editor | null>(null);
  const isWritingRef = useRef(false);

  //TODO: think carefully about the debounce delay
  // the debounce should be the "magic" in this app
  useEffect(() => {
    if (!editor) return;

    let debounceTimer: NodeJS.Timeout;
    const STOP_WRITING_DELAY = 1500;

    const cleanupListener = editor.store.listen((entry) => {
      if (entry.source !== "user" || Object.keys(entry.changes.added).length === 0) return;
      if (!isWritingRef.current) {
        posthog.capture("user_started_writing");
        isWritingRef.current = true;
        console.log("User started writing/editing", isWritingRef.current);
      }

      console.log(entry.changes);

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        getImage().then((result) => {
          if ("message" in result) {
            return;
          }
          console.log("User stopped writing/editing", isWritingRef.current, result.document);
          isWritingRef.current = false;
          posthog.capture("user_stopped_writing");

          // Convert File to Base64
          const reader = new FileReader();
          reader.readAsDataURL(result.document);
          reader.onloadend = () => {
            const base64data = reader.result;
            fetch("/api/detection", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                document: base64data,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Detection result", data);
                if (data.output_parsed) {
                  console.log(data.output_parsed.error_detected);
                }
              })
              .catch((e) => {
                console.error("Error in detection fetch:", e);
              });
          };
        });
      }, STOP_WRITING_DELAY);
    });

    return () => {
      cleanupListener();
      clearTimeout(debounceTimer);
    };
  }, [editor]);

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
