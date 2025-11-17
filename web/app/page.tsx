"use client";

import Canvas from "./canvas/canvas";
import {
  createRealtimeSession,
  RealtimeSession,
} from "./session/session_manager";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mic } from "lucide-react";
import Subtitles from "./canvas/subtitles";

export default function Home() {
  const [session, setSession] = useState<RealtimeSession | null>(null);

  return (
    <main className="h-screen w-screen">
      <Canvas />
      <motion.button
        onClick={async () => {
          if (session) {
            session.close();
            setSession(null);
          } else {
            setSession(await createRealtimeSession());
          }
        }}
        animate={{
          scale: session ? [1, 1.05, 1] : 1,
          background: session
            ? "linear-gradient(to right, #dc2626, #ef4444)"
            : "linear-gradient(to right, #6366f1, #a855f7)",
        }}
        transition={{ scale: { duration: 1, repeat: session ? Infinity : 0 } }}
        className="absolute bottom-8 left-8 z-50 p-4 rounded-full text-white shadow-xl hover:scale-105 hover:shadow-2xl"
      >
        <Mic className="w-6 h-6" />
      </motion.button>
      {session && <Subtitles dataChannel={session.dataChannel} />}
    </main>
  );
}
