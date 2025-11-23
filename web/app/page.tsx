"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Calculator, Sigma, ArrowRightLeft } from "lucide-react";
import Canvas from "./canvas/canvas";

export default function Home() {
  const router = useRouter();
  const options = [
    { id: "basic-algebra", label: "Basic Algebra", Icon: Calculator, desc: "Solve simple linear equations", grad: "from-blue-500 to-blue-600" },
    { id: "combine-like-terms", label: "Combine Like Terms", Icon: ArrowRightLeft, desc: "Simplify expressions by grouping", grad: "from-purple-500 to-purple-600" },
    { id: "integral", label: "Integral", Icon: Sigma, desc: "Calculate integrals", grad: "from-orange-500 to-orange-600" },
  ];

  return (
    <main className="h-screen w-screen relative overflow-hidden bg-neutral-50">
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/5 backdrop-blur-[2px]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4 tracking-tight">Choose a Problem Type</h1>
            <p className="text-lg text-neutral-600">Select the type of math problem you want to work on</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {options.map(({ id, label, Icon, desc, grad }, i) => (
              <motion.button key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }} onClick={() => router.push(`/canvas?problem_type=${id}`)}
                className="relative group flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-neutral-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad} text-white  flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                  <Icon size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800 group-hover:text-blue-600 transition-colors">{label}</h3>
                <p className="text-neutral-500 leading-relaxed">{desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
