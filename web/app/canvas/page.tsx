"use client";

import { Suspense, useEffect, useState } from "react";
import Canvas from "./canvas";
import Overlay from "./components/overlay";

interface Problem {
  problem: string;
  type: string;
  answer: string;
}

function CanvasContent() {
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    fetch("/api/problem")
      .then((res) => res.json())
      .then((data) => setProblem(data));
  }, []);

  return (
    <main className="h-screen w-screen relative">
      {problem && (
        <>
          <Overlay problem={problem} />
          <Canvas problem={problem} />
        </>
      )}
    </main>
  );
}

export default function CanvasPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CanvasContent />
    </Suspense>
  );
}
