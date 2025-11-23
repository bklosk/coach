interface Problem {
  problem: string;
  type: string;
  answer: string;
}

export default function Overlay({ problem }: { problem: Problem }) {
  return (
    <div className="absolute z-10 top-4 left-4 flex flex-col gap-2">
      <h1 className="text-2xl md:text-4xl font-bold text-neutral-800 tracking-tight px-4 py-2 rounded-md">
        Solve the{" "}{problem.type}: {problem.problem} 
      </h1>
    </div>
  );
}
