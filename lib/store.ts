"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Locale } from "./i18n/messages";
import type { ThemeId } from "./themes";

export interface UnlockState {
  /** Set of `${moduleId}:${difficulty}` strings that have been completed at ≥80%. */
  completedAtMastery: string[];
}

interface AppState {
  level: number;
  xp: number;
  coins: number;
  totalProblemsSolved: number;
  totalCorrect: number;
  locale: Locale;
  theme: ThemeId;
  soundEnabled: boolean;
  unlock: UnlockState;
  hydrated: boolean;
  setLocale: (l: Locale) => void;
  setTheme: (t: ThemeId) => void;
  setSoundEnabled: (b: boolean) => void;
  applySessionResult: (input: {
    xpGained: number;
    coinsGained: number;
    correct: number;
    total: number;
    moduleId: string;
    difficulty: string;
  }) => { leveledUp: boolean; newLevel: number };
  setHydrated: () => void;
}

import { applyXp } from "./progression";

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      coins: 0,
      totalProblemsSolved: 0,
      totalCorrect: 0,
      locale: "ko",
      theme: "space",
      soundEnabled: true,
      unlock: { completedAtMastery: [] },
      hydrated: false,
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setHydrated: () => set({ hydrated: true }),
      applySessionResult: ({
        xpGained,
        coinsGained,
        correct,
        total,
        moduleId,
        difficulty,
      }) => {
        const state = get();
        const prog = applyXp(state.level, state.xp, xpGained);
        const masteryKey = `${moduleId}:${difficulty}`;
        const accuracy = total === 0 ? 0 : correct / total;
        const newUnlock = { ...state.unlock };
        if (accuracy >= 0.8 && !newUnlock.completedAtMastery.includes(masteryKey)) {
          newUnlock.completedAtMastery = [
            ...newUnlock.completedAtMastery,
            masteryKey,
          ];
        }
        set({
          level: prog.level,
          xp: prog.xp,
          coins: state.coins + coinsGained,
          totalProblemsSolved: state.totalProblemsSolved + total,
          totalCorrect: state.totalCorrect + correct,
          unlock: newUnlock,
        });
        return { leveledUp: prog.leveledUp, newLevel: prog.level };
      },
    }),
    {
      name: "math-tutor-state",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

/** Boss difficulty for a module unlocks once any other difficulty hits 80%+ accuracy. */
export function isBossUnlocked(unlock: UnlockState, moduleId: string) {
  return unlock.completedAtMastery.some((k) => {
    const [m, d] = k.split(":");
    return m === moduleId && d !== "boss";
  });
}
