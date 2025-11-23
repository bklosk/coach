import { useEffect, useRef } from "react";
import { Editor } from "tldraw";
import posthog from "posthog-js";
import getImage from "../utils/getImage";

interface Problem {
  problem: string;
  type: string;
  answer: string;
  status: string;
}

export function useCanvasDetection(editor: Editor | null, problem: Problem, onSolved: () => void) {
  const isWritingRef = useRef(false);

  //TODO: think carefully about the debounce delay
  // the debounce should be the "magic" in this app

  // thought: if there's an in-flight request when the debounce fires, we should cancel it and start a new one
  // that way we can reduce latency (and the debounce delay) without getting duplicates
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
                problem,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Detection result", data);
                if (data.output_parsed) {
                  console.log(data.output_parsed.error_detected);
                  if (data.output_parsed.solved) {
                    onSolved();
                  }
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
  }, [editor, problem, onSolved]);
}
