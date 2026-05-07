"use client";

import { motion } from "framer-motion";
import type { Messages } from "@/lib/i18n/messages";
import type { Difficulty, ProblemModuleId } from "@/lib/problems/types";
import { isBossUnlocked, useAppStore } from "@/lib/store";

export default function DifficultyScreen({
  t,
  moduleId,
  onPick,
  onBack,
}: {
  t: Messages;
  moduleId: ProblemModuleId;
  onPick: (d: Difficulty) => void;
  onBack: () => void;
}) {
  const unlock = useAppStore((s) => s.unlock);
  const bossOpen = isBossUnlocked(unlock, moduleId);

  const items: {
    id: Difficulty;
    emoji: string;
    locked?: boolean;
  }[] = [
    { id: "easy", emoji: "🌱" },
    { id: "normal", emoji: "🌳" },
    { id: "hard", emoji: "🔥" },
    { id: "boss", emoji: "💀", locked: !bossOpen },
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-6">
      <h2 className="text-3xl font-black sm:text-4xl">{t.chooseDifficulty}</h2>
      <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((d, i) => (
          <motion.button
            key={d.id}
            disabled={d.locked}
            onClick={() => onPick(d.id)}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={d.locked ? undefined : { y: -4 }}
            whileTap={d.locked ? undefined : { scale: 0.96 }}
            className={`surface flex h-36 flex-col items-center justify-center gap-2 p-4 text-center ${
              d.locked ? "opacity-50" : "hover:border-white/30"
            }`}
          >
            <div className="text-4xl">{d.locked ? "🔒" : d.emoji}</div>
            <div className="text-base font-bold">{t.difficulties[d.id]}</div>
          </motion.button>
        ))}
      </div>
      {!bossOpen && (
        <p className="max-w-md text-center text-sm text-white/60">
          {t.bossLocked}
        </p>
      )}
      <button onClick={onBack} className="kid-btn">
        ← {t.back}
      </button>
    </div>
  );
}
