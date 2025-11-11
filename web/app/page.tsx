"use client";

import Canvas from "./canvas/canvas";
import { createRealtimeSession } from "./session/session_manager";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <Canvas />
      <button
        onClick={async () => {
          const session = await createRealtimeSession();
        }}
        className="absolute top-8 left-8 z-50 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-700 text-white font-semibold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-all flex items-center gap-2"
      >
        <span className="w-5 h-5 rounded-full bg-white bg-opacity-10 flex items-center justify-center mr-2"></span>
        Start Session
      </button>
    </main>
  );
}
