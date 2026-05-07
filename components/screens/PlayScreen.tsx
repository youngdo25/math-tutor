"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Messages } from "@/lib/i18n/messages";
import type { Difficulty, Problem, ProblemModuleId } from "@/lib/problems/types";
import { getModule } from "@/lib/problems";
import { THEMES } from "@/lib/themes";
import { useAppStore } from "@/lib/store";
import { coinsForCorrect, xpForCorrect } from "@/lib/progression";
import { recordAttempt } from "@/lib/storage";
import { playCorrect, playWrong } from "@/lib/sound";
import type { SessionResult } from "./ResultScreen";

const PROBLEMS_PER_ROUND = 10;
const RECENT_WINDOW = 5;

interface Outcome {
  problem: Problem;
  attemptCount: number;
  isCorrect: boolean;
  timeMs: number;
  xpEarned: number;
  coinsEarned: number;
}

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function PlayScreen({
  t,
  moduleId,
  difficulty,
  onFinish,
  onQuit,
}: {
  t: Messages;
  moduleId: ProblemModuleId;
  difficulty: Difficulty;
  onFinish: (result: SessionResult) => void;
  onQuit: () => void;
}) {
  const theme = useAppStore((s) => s.theme);
  const themeDef = THEMES[theme];
  const mod = useMemo(() => getModule(moduleId), [moduleId]);

  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const recentKeys = useRef<Set<string>>(new Set());
  const [problem, setProblem] = useState<Problem>(() =>
    mod.generate(difficulty),
  );
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">("none");
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const startedAt = useRef<number>(0);
  const attemptCountRef = useRef(1);

  const foe = useMemo(() => {
    if (difficulty === "boss") return themeDef.bossEmoji;
    const list = themeDef.foeEmoji;
    return list[hashStr(problem.key + outcomes.length) % list.length];
  }, [difficulty, themeDef, problem.key, outcomes.length]);

  useEffect(() => {
    startedAt.current = performance.now();
  }, [problem.key]);

  const advance = useCallback(
    (currOutcomes: Outcome[]) => {
      if (currOutcomes.length >= PROBLEMS_PER_ROUND) {
        const correct = currOutcomes.filter((o) => o.isCorrect).length;
        const xpGained = currOutcomes.reduce((a, o) => a + o.xpEarned, 0);
        const coinsGained = currOutcomes.reduce((a, o) => a + o.coinsEarned, 0);
        const result: SessionResult = {
          moduleId,
          difficulty,
          total: currOutcomes.length,
          correct,
          xpGained,
          coinsGained,
          bestCombo,
          outcomes: currOutcomes.map((o) => ({
            display: o.problem.display.replace("?", String(o.problem.answer)),
            isCorrect: o.isCorrect,
          })),
        };
        const apply = useAppStore.getState().applySessionResult({
          xpGained,
          coinsGained,
          correct,
          total: currOutcomes.length,
          moduleId,
          difficulty,
        });
        onFinish({
          ...result,
          leveledUp: apply.leveledUp,
          newLevel: apply.newLevel,
        });
        return;
      }
      recentKeys.current.add(problem.key);
      if (recentKeys.current.size > RECENT_WINDOW) {
        const first = recentKeys.current.values().next().value;
        if (first !== undefined) recentKeys.current.delete(first);
      }
      setProblem(mod.generate(difficulty, recentKeys.current));
      setInput("");
      setHint(null);
      setFeedback("none");
      attemptCountRef.current = 1;
    },
    [bestCombo, difficulty, mod, moduleId, onFinish, problem.key],
  );

  const submit = useCallback(() => {
    if (feedback !== "none") return;
    if (input.length === 0) return;
    const ans = parseInt(input, 10);
    if (Number.isNaN(ans)) return;

    if (ans === problem.answer) {
      const timeMs = Math.round(performance.now() - startedAt.current);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setBestCombo((b) => Math.max(b, newCombo));
      const xpEarned = xpForCorrect(difficulty, newCombo);
      const coinsEarned = coinsForCorrect(difficulty);
      const outcome: Outcome = {
        problem,
        attemptCount: attemptCountRef.current,
        isCorrect: true,
        timeMs,
        xpEarned,
        coinsEarned,
      };
      const nextOutcomes = [...outcomes, outcome];
      setOutcomes(nextOutcomes);
      setFeedback("correct");
      playCorrect();
      void recordAttempt({
        problemKey: problem.key,
        moduleId,
        difficulty,
        isCorrect: true,
        timeMs,
      });
      setTimeout(() => advance(nextOutcomes), 700);
    } else {
      attemptCountRef.current += 1;
      setFeedback("wrong");
      playWrong();
      const h = mod.hint?.(problem, attemptCountRef.current);
      if (h) setHint(h);
      setTimeout(() => {
        setFeedback("none");
        setInput("");
      }, 600);
      if (attemptCountRef.current > 3) {
        const timeMs = Math.round(performance.now() - startedAt.current);
        setCombo(0);
        const outcome: Outcome = {
          problem,
          attemptCount: attemptCountRef.current,
          isCorrect: false,
          timeMs,
          xpEarned: 0,
          coinsEarned: 0,
        };
        const nextOutcomes = [...outcomes, outcome];
        setOutcomes(nextOutcomes);
        void recordAttempt({
          problemKey: problem.key,
          moduleId,
          difficulty,
          isCorrect: false,
          timeMs,
        });
        setTimeout(() => advance(nextOutcomes), 900);
      }
    }
  }, [advance, combo, difficulty, feedback, input, mod, moduleId, outcomes, problem]);

  const appendDigit = useCallback(
    (d: string) => {
      if (feedback !== "none") return;
      setInput((v) => (v.length >= 4 ? v : v + d));
    },
    [feedback],
  );

  const backspace = useCallback(() => {
    if (feedback !== "none") return;
    setInput((v) => v.slice(0, -1));
  }, [feedback]);

  // Keyboard support
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") appendDigit(e.key);
      else if (e.key === "Backspace") backspace();
      else if (e.key === "Enter") submit();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [appendDigit, backspace, submit]);

  const progress = (outcomes.length / PROBLEMS_PER_ROUND) * 100;
  const displayWithInput = problem.display.replace(
    "?",
    input.length === 0 ? "▢" : input,
  );

  return (
    <div className="flex flex-1 flex-col gap-4 py-4">
      <div className="flex items-center gap-3">
        <button onClick={onQuit} className="kid-btn px-3 py-2 text-sm">
          ✕
        </button>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex justify-between text-xs text-white/60">
            <span>
              {outcomes.length} / {PROBLEMS_PER_ROUND}
            </span>
            <span>
              {t.comboLabel}: <span className="font-bold text-white">{combo}</span>
              {combo >= 3 ? " 🔥" : ""}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full"
              style={{
                background: `linear-gradient(90deg, ${themeDef.vars["--accent"]}, ${themeDef.vars["--accent-2"]})`,
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="surface relative flex flex-col items-center gap-6 p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={problem.key + outcomes.length}
            initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="text-7xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] sm:text-8xl"
          >
            {feedback === "correct" ? "💥" : foe}
          </motion.div>
        </AnimatePresence>

        <motion.div
          key={problem.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center font-mono text-5xl font-black tracking-wide sm:text-6xl ${
            feedback === "wrong" ? "shake" : ""
          }`}
        >
          {displayWithInput}
        </motion.div>

        {feedback === "correct" && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-4 top-4 rounded-full bg-emerald-400 px-3 py-1 text-sm font-bold text-emerald-950"
          >
            {t.correct}
          </motion.div>
        )}
        {feedback === "wrong" && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-4 top-4 rounded-full bg-rose-400 px-3 py-1 text-sm font-bold text-rose-950"
          >
            {t.wrong}
          </motion.div>
        )}
        {hint && feedback !== "wrong" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-white/80"
          >
            💡 {hint}
          </motion.div>
        )}
      </div>

      <Keypad
        onDigit={appendDigit}
        onBackspace={backspace}
        onSubmit={submit}
        canSubmit={input.length > 0}
        submitLabel={t.submit}
      />
    </div>
  );
}

function Keypad({
  onDigit,
  onBackspace,
  onSubmit,
  canSubmit,
  submitLabel,
}: {
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  submitLabel: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
        <button
          key={d}
          onClick={() => onDigit(d)}
          className="kid-btn py-5 text-2xl sm:text-3xl"
        >
          {d}
        </button>
      ))}
      <button onClick={onBackspace} className="kid-btn py-5 text-2xl">
        ⌫
      </button>
      <button onClick={() => onDigit("0")} className="kid-btn py-5 text-2xl sm:text-3xl">
        0
      </button>
      <button
        disabled={!canSubmit}
        onClick={onSubmit}
        className="kid-btn kid-btn-primary py-5 text-xl"
      >
        {submitLabel}
      </button>
    </div>
  );
}
