"use client";

import { motion } from "framer-motion";
import type { Messages } from "@/lib/i18n/messages";
import type { ProblemModuleId } from "@/lib/problems/types";

const MODES: { id: ProblemModuleId; emoji: string }[] = [
  { id: "multiplication", emoji: "✖️" },
  { id: "addition", emoji: "➕" },
  { id: "subtraction", emoji: "➖" },
];

export default function ModeSelectScreen({
  t,
  onPick,
  onLearn,
  onBack,
}: {
  t: Messages;
  onPick: (id: ProblemModuleId) => void;
  onLearn: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-6">
      <h2 className="text-3xl font-black sm:text-4xl">{t.chooseMode}</h2>
      <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {MODES.map((m, i) => (
          <motion.button
            key={m.id}
            onClick={() => onPick(m.id)}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            className="surface flex h-40 flex-col items-center justify-center gap-2 p-4 text-center hover:border-white/30"
          >
            <div className="text-5xl">{m.emoji}</div>
            <div className="text-lg font-bold">{t.modes[m.id]}</div>
            <div className="text-[11px] uppercase tracking-wider text-white/50">
              {t.practice}
            </div>
          </motion.button>
        ))}
        <motion.button
          onClick={onLearn}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: MODES.length * 0.06 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.96 }}
          className="surface flex h-40 flex-col items-center justify-center gap-2 p-4 text-center hover:border-white/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,92,255,0.18), rgba(34,211,238,0.18))",
            borderColor: "rgba(255,255,255,0.18)",
          }}
        >
          <div className="text-5xl">📚</div>
          <div className="text-lg font-bold">{t.learn}</div>
          <div className="text-[11px] uppercase tracking-wider text-white/60">
            {t.learnTitle}
          </div>
        </motion.button>
      </div>
      <button onClick={onBack} className="kid-btn">
        ← {t.back}
      </button>
    </div>
  );
}
