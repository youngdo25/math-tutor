"use client";

import { motion } from "framer-motion";
import type { Messages } from "@/lib/i18n/messages";
import { useAppStore, isBossUnlocked } from "@/lib/store";
import { THEMES } from "@/lib/themes";
import { xpToNextLevel } from "@/lib/progression";

export default function HomeScreen({
  t,
  onStart,
}: {
  t: Messages;
  onStart: () => void;
}) {
  const { level, xp, theme, totalCorrect, totalProblemsSolved, unlock } =
    useAppStore();
  const themeDef = THEMES[theme];
  const xpNeeded = xpToNextLevel(level);
  const xpPct = Math.min(100, Math.round((xp / xpNeeded) * 100));
  const accuracy =
    totalProblemsSolved === 0
      ? 0
      : Math.round((totalCorrect / totalProblemsSolved) * 100);

  const moduleIds = ["multiplication", "addition", "subtraction"] as const;
  const anyBossUnlocked = moduleIds.some((m) => isBossUnlocked(unlock, m));

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="text-[128px] leading-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] sm:text-[160px]"
      >
        {theme === "space" ? "🚀" : "⚔️"}
      </motion.div>

      <div>
        <h1 className="text-4xl font-black sm:text-5xl">{t.appName}</h1>
        <p className="mt-2 text-lg text-white/70">{t.tagline}</p>
      </div>

      <div className="surface flex w-full max-w-md flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-white/60">{t.levelLabel}</span>
          <span className="text-3xl font-black">Lv.{level}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${themeDef.vars["--accent"]}, ${themeDef.vars["--accent-2"]})`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/60">
          <span>
            {xp} / {xpNeeded} {t.xpLabel}
          </span>
          {totalProblemsSolved > 0 && <span>정답률 {accuracy}%</span>}
        </div>
      </div>

      {anyBossUnlocked && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-4 py-2 text-sm font-bold text-black"
        >
          {t.bossAvailable}
        </motion.div>
      )}

      <button
        onClick={onStart}
        className="kid-btn kid-btn-primary px-12 py-5 text-2xl"
      >
        {t.start} →
      </button>
    </div>
  );
}
