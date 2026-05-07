"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { messages, type Locale } from "@/lib/i18n/messages";
import { THEMES, type ThemeId } from "@/lib/themes";
import { setSoundEnabled as setEngineSound } from "@/lib/sound";
import type { Difficulty, ProblemModuleId } from "@/lib/problems/types";
import HomeScreen from "./screens/HomeScreen";
import ModeSelectScreen from "./screens/ModeSelectScreen";
import DifficultyScreen from "./screens/DifficultyScreen";
import PlayScreen from "./screens/PlayScreen";
import ResultScreen, { type SessionResult } from "./screens/ResultScreen";
import LearnScreen from "./screens/LearnScreen";
import MultiplyLesson from "./screens/lessons/MultiplyLesson";
import AddLesson from "./screens/lessons/AddLesson";
import SubtractLesson from "./screens/lessons/SubtractLesson";
import MultiplicationChart from "./screens/MultiplicationChart";

export type Screen =
  | { name: "home" }
  | { name: "mode" }
  | { name: "difficulty"; moduleId: ProblemModuleId }
  | { name: "play"; moduleId: ProblemModuleId; difficulty: Difficulty }
  | {
      name: "result";
      moduleId: ProblemModuleId;
      difficulty: Difficulty;
      result: SessionResult;
    }
  | { name: "learn" }
  | { name: "lesson"; moduleId: ProblemModuleId }
  | { name: "chart" };

export default function Shell() {
  const hydrated = useAppStore((s) => s.hydrated);
  const theme = useAppStore((s) => s.theme);
  const locale = useAppStore((s) => s.locale);
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  useEffect(() => {
    const t = THEMES[theme];
    const root = document.documentElement;
    Object.entries(t.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const soundEnabled = useAppStore((s) => s.soundEnabled);
  useEffect(() => {
    setEngineSound(soundEnabled);
  }, [soundEnabled]);

  const t = useMemo(() => messages[locale], [locale]);
  const themeDef = THEMES[theme];

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,#3b1d70_0%,#0b0f2c_55%,#04060f_100%)]">
        <div className="text-2xl text-white/70">…</div>
      </div>
    );
  }

  const screenKey =
    screen.name +
    ("moduleId" in screen ? `:${screen.moduleId}` : "") +
    ("difficulty" in screen ? `:${screen.difficulty}` : "");

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${themeDef.bgClass} stars-overlay`}
    >
      <TopBar />
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-4xl flex-col items-stretch px-4 pb-12 pt-2 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col"
          >
            {screen.name === "home" && (
              <HomeScreen t={t} onStart={() => setScreen({ name: "mode" })} />
            )}
            {screen.name === "mode" && (
              <ModeSelectScreen
                t={t}
                onPick={(moduleId) => setScreen({ name: "difficulty", moduleId })}
                onLearn={() => setScreen({ name: "learn" })}
                onBack={() => setScreen({ name: "home" })}
              />
            )}
            {screen.name === "learn" && (
              <LearnScreen
                t={t}
                onPick={(moduleId) => setScreen({ name: "lesson", moduleId })}
                onChart={() => setScreen({ name: "chart" })}
                onBack={() => setScreen({ name: "mode" })}
              />
            )}
            {screen.name === "chart" && (
              <MultiplicationChart
                t={t}
                onBack={() => setScreen({ name: "learn" })}
              />
            )}
            {screen.name === "lesson" && screen.moduleId === "multiplication" && (
              <MultiplyLesson
                t={t}
                onExit={() => setScreen({ name: "learn" })}
                onPractice={() =>
                  setScreen({ name: "difficulty", moduleId: "multiplication" })
                }
              />
            )}
            {screen.name === "lesson" && screen.moduleId === "addition" && (
              <AddLesson
                t={t}
                onExit={() => setScreen({ name: "learn" })}
                onPractice={() =>
                  setScreen({ name: "difficulty", moduleId: "addition" })
                }
              />
            )}
            {screen.name === "lesson" && screen.moduleId === "subtraction" && (
              <SubtractLesson
                t={t}
                onExit={() => setScreen({ name: "learn" })}
                onPractice={() =>
                  setScreen({ name: "difficulty", moduleId: "subtraction" })
                }
              />
            )}
            {screen.name === "difficulty" && (
              <DifficultyScreen
                t={t}
                moduleId={screen.moduleId}
                onPick={(difficulty) =>
                  setScreen({ name: "play", moduleId: screen.moduleId, difficulty })
                }
                onBack={() => setScreen({ name: "mode" })}
              />
            )}
            {screen.name === "play" && (
              <PlayScreen
                t={t}
                moduleId={screen.moduleId}
                difficulty={screen.difficulty}
                onFinish={(result) =>
                  setScreen({
                    name: "result",
                    moduleId: screen.moduleId,
                    difficulty: screen.difficulty,
                    result,
                  })
                }
                onQuit={() => setScreen({ name: "home" })}
              />
            )}
            {screen.name === "result" && (
              <ResultScreen
                t={t}
                result={screen.result}
                onAgain={() =>
                  setScreen({
                    name: "play",
                    moduleId: screen.moduleId,
                    difficulty: screen.difficulty,
                  })
                }
                onHome={() => setScreen({ name: "home" })}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function TopBar() {
  const {
    locale,
    theme,
    setLocale,
    setTheme,
    level,
    xp,
    coins,
    soundEnabled,
    setSoundEnabled,
  } = useAppStore();
  const t = messages[locale];
  const nextLocale: Locale = locale === "ko" ? "en" : "ko";
  const nextTheme: ThemeId = theme === "space" ? "monster" : "space";

  return (
    <header className="relative z-20 mx-auto flex w-full max-w-4xl items-center justify-between px-4 pt-4 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-black tracking-tight">{t.appName}</div>
      </div>
      <div className="flex items-center gap-2">
        <Stat label={t.levelLabel} value={`Lv.${level}`} />
        <Stat label={t.xpLabel} value={`${xp}`} />
        <Stat label={t.coinsLabel} value={`🪙 ${coins}`} />
        <button
          aria-label="Toggle sound"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="kid-btn px-3 py-2 text-base"
          title={t.soundLabel}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(nextTheme)}
          className="kid-btn px-3 py-2 text-base"
          title={t.themeLabel}
        >
          {t.themes[theme]}
        </button>
        <button
          aria-label="Toggle language"
          onClick={() => setLocale(nextLocale)}
          className="kid-btn px-3 py-2 text-base"
          title={t.languageLabel}
        >
          {locale === "ko" ? "한 / EN" : "KO / Eng"}
        </button>
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm sm:block">
      <div className="text-[10px] uppercase tracking-wider text-white/50">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}
