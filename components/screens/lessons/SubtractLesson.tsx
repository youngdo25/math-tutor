"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LessonShell from "./LessonShell";
import PlaceValue from "@/components/blocks/PlaceValue";
import RegroupBorrow from "@/components/blocks/RegroupBorrow";
import type { Messages } from "@/lib/i18n/messages";

interface Props {
  t: Messages;
  onExit: () => void;
  onPractice: () => void;
}

/**
 * Lesson plan for two-digit subtraction:
 *   0. Show 45 = 4 tens + 5 ones.
 *   1. We will subtract 23 — first take 3 ones (5 → 2).
 *   2. Then take 2 tens (4 → 2). Result: 22.
 *   3. New problem: 32 - 14. Try ones: 2 - 4 — not enough!
 *   4. Break a ten into 10 ones (borrow). Now 2 tens + 12 ones.
 *   5. Take 4 ones (12 → 8).
 *   6. Take 1 ten (2 → 1). = 18.
 *   7. CTA practice.
 */
export default function SubtractLesson({ t, onExit, onPractice }: Props) {
  const [step, setStep] = useState(0);
  const stepCount = 8;

  function next() {
    if (step >= stepCount - 1) {
      onPractice();
      return;
    }
    setStep((s) => s + 1);
  }
  function prev() {
    setStep((s) => Math.max(0, s - 1));
  }

  const captions: string[] = [
    "45는 십 네 묶음과 일 다섯 개. 자릿값을 보자!",
    "23을 빼볼게. 일의 자리부터: 5에서 3을 빼면 2!",
    "이제 십의 자리: 4에서 2를 빼면 2. 그래서 45 − 23 = 22!",
    "이번엔 32 − 14. 일을 빼려는데… 2에서 4를 못 빼!",
    "괜찮아! 십 한 묶음을 풀어 일 10개로 바꾸자.",
    "이제 12 − 4 = 8. 일 4개를 빼!",
    "마지막으로 십 2개에서 1개를 빼면 1. 32 − 14 = 18!",
    "잘했어! 이제 직접 풀어볼래?",
  ];

  return (
    <LessonShell
      t={t}
      title="➖ 두자리 뺄셈의 원리"
      stepIdx={step}
      stepCount={stepCount}
      caption={captions[step] ?? ""}
      onBack={onExit}
      onPrev={prev}
      onNext={next}
      isFinal={step === stepCount - 1}
    >
      {step === 0 && (
        <PlaceValue value={45} size={22} label="45" highlight="all" />
      )}
      {step === 1 && (
        <Side
          before={
            <PlaceValue
              value={45}
              size={20}
              label="45"
              visibleOnes={5}
              highlight="ones"
            />
          }
          op="−3"
          after={<PlaceValue value={42} size={20} label="42" />}
        />
      )}
      {step === 2 && (
        <div className="flex flex-col items-center gap-4">
          <PlaceValue value={22} size={22} label="22" faceOnTop />
          <Equation lhs="45 − 23" rhs="22" />
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col items-center gap-4">
          <PlaceValue value={32} size={22} label="32" highlight="ones" />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl bg-rose-500/30 px-4 py-2 font-mono text-2xl font-black text-rose-200"
          >
            2 − 4 = ❓ (안돼!)
          </motion.div>
        </div>
      )}
      {step === 4 && (
        <div key="borrow" className="flex flex-col items-center gap-3">
          <RegroupBorrow size={22} />
          <p className="text-sm text-white/70">
            이제 32는 “2십 + 12일”이 됐어!
          </p>
        </div>
      )}
      {step === 5 && (
        <Side
          before={
            <PlaceValue
              value={32}
              size={20}
              visibleTens={2}
              visibleOnes={12}
              accentOnes={10}
              label="2십 + 12일"
              highlight="ones"
            />
          }
          op="−4일"
          after={
            <PlaceValue
              value={28}
              size={20}
              visibleTens={2}
              visibleOnes={8}
              accentOnes={6}
              label="2십 + 8일"
            />
          }
        />
      )}
      {step === 6 && (
        <div className="flex flex-col items-center gap-4">
          <PlaceValue value={18} size={22} label="18" faceOnTop />
          <Equation lhs="32 − 14" rhs="18" />
        </div>
      )}
      {step === 7 && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-7xl">🎉</div>
          <div className="text-2xl font-black">받아내림까지 마스터!</div>
        </div>
      )}
    </LessonShell>
  );
}

function Side({
  before,
  op,
  after,
}: {
  before: React.ReactNode;
  op: string;
  after: React.ReactNode;
}) {
  return (
    <div className="flex items-end gap-4 sm:gap-6">
      {before}
      <div className="pb-8 text-2xl font-black sm:text-3xl">{op}</div>
      <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
        {after}
      </motion.div>
    </div>
  );
}

function Equation({ lhs, rhs }: { lhs: string; rhs: string }) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
      className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-2 font-mono text-2xl font-black text-emerald-950"
    >
      {lhs} = {rhs}
    </motion.div>
  );
}
