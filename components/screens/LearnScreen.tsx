"use client";

import { motion } from "framer-motion";
import type { Messages } from "@/lib/i18n/messages";
import type { ProblemModuleId } from "@/lib/problems/types";

export type LessonId = ProblemModuleId;

const LESSONS: { id: LessonId; emoji: string }[] = [
  { id: "multiplication", emoji: "✖️" },
  { id: "addition", emoji: "➕" },
  { id: "subtraction", emoji: "➖" },
];

export default function LearnScreen({
  t,
  onPick,
  onChart,
  onBack,
}: {
  t: Messages;
  onPick: (id: LessonId) => void;
  onChart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-6">
      <h2 className="text-3xl font-black sm:text-4xl">📚 {t.learnTitle}</h2>
      <p className="max-w-md text-center text-white/70">{t.learnSubtitle}</p>
      <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {LESSONS.map((m, i) => (
          <motion.button
            key={m.id}
            onClick={() => onPick(m.id)}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            className="surface flex h-44 flex-col items-center justify-center gap-3 p-4 text-center hover:border-white/30"
          >
            <div className="text-5xl">{m.emoji}</div>
            <div className="text-base font-bold">{t.modes[m.id]}</div>
            <div className="text-[11px] text-white/55">{t.lessonHint[m.id]}</div>
          </motion.button>
        ))}
        <motion.button
          onClick={onChart}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: LESSONS.length * 0.06 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.96 }}
          className="surface flex h-44 flex-col items-center justify-center gap-3 p-4 text-center hover:border-white/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(250,204,21,0.16), rgba(244,114,182,0.16))",
            borderColor: "rgba(255,255,255,0.18)",
          }}
        >
          <div className="text-5xl">📊</div>
          <div className="text-base font-bold">{t.chart}</div>
          <div className="text-[11px] text-white/65">{t.chartHint}</div>
        </motion.button>
      </div>
      <button onClick={onBack} className="kid-btn">
        ← {t.back}
      </button>
    </div>
  );
}
