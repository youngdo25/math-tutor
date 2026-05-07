"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Messages } from "@/lib/i18n/messages";
import type { Difficulty, ProblemModuleId } from "@/lib/problems/types";
import { THEMES } from "@/lib/themes";
import { useAppStore } from "@/lib/store";
import { playLevelUp } from "@/lib/sound";

export interface SessionResult {
  moduleId: ProblemModuleId;
  difficulty: Difficulty;
  total: number;
  correct: number;
  xpGained: number;
  coinsGained: number;
  bestCombo: number;
  outcomes: { display: string; isCorrect: boolean }[];
  leveledUp?: boolean;
  newLevel?: number;
}

export default function ResultScreen({
  t,
  result,
  onAgain,
  onHome,
}: {
  t: Messages;
  result: SessionResult;
  onAgain: () => void;
  onHome: () => void;
}) {
  const theme = useAppStore((s) => s.theme);
  const themeDef = THEMES[theme];
  const accuracy = Math.round((result.correct / result.total) * 100);
  const sparkles = themeDef.celebrate;

  useEffect(() => {
    if (result.leveledUp) playLevelUp();
  }, [result.leveledUp]);

  return (
    <div className="flex flex-1 flex-col items-center gap-6 py-6">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="text-7xl"
      >
        {accuracy >= 90 ? "🏆" : accuracy >= 70 ? "🎉" : accuracy >= 50 ? "💪" : "🌱"}
      </motion.div>

      <h2 className="text-3xl font-black sm:text-4xl">{t.resultTitle}</h2>

      <div className="surface flex w-full max-w-md flex-col gap-3 p-6 text-center">
        <div className="text-5xl font-black">{accuracy}%</div>
        <div className="text-white/70">
          {t.resultCorrect(result.correct, result.total)}
        </div>
        <div className="my-2 h-px bg-white/10" />
        <div className="flex justify-around text-base">
          <div>
            <div className="text-xs text-white/50">{t.xpLabel}</div>
            <div className="font-bold text-emerald-300">
              {t.resultXp(result.xpGained)}
            </div>
          </div>
          <div>
            <div className="text-xs text-white/50">{t.coinsLabel}</div>
            <div className="font-bold text-amber-300">
              {t.resultCoins(result.coinsGained)}
            </div>
          </div>
          <div>
            <div className="text-xs text-white/50">{t.comboLabel}</div>
            <div className="font-bold">{result.bestCombo}🔥</div>
          </div>
        </div>
      </div>

      {result.leveledUp && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -6 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 12 }}
          className="rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-5 py-2 text-lg font-black text-black"
        >
          {sparkles[0]} {t.levelUp} Lv.{result.newLevel}
        </motion.div>
      )}

      <div className="surface flex w-full max-w-md flex-wrap gap-2 p-4">
        {result.outcomes.map((o, i) => (
          <span
            key={i}
            className={`rounded-full px-3 py-1 text-sm font-mono ${
              o.isCorrect
                ? "bg-emerald-500/20 text-emerald-200"
                : "bg-rose-500/20 text-rose-200"
            }`}
          >
            {o.isCorrect ? "✓" : "✗"} {o.display}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onHome} className="kid-btn">
          🏠 {t.home}
        </button>
        <button onClick={onAgain} className="kid-btn kid-btn-primary px-8 text-lg">
          {t.again} →
        </button>
      </div>
    </div>
  );
}
