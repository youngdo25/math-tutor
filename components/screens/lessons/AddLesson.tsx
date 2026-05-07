"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LessonShell from "./LessonShell";
import PlaceValue from "@/components/blocks/PlaceValue";
import RegroupCarry from "@/components/blocks/RegroupCarry";
import type { Messages } from "@/lib/i18n/messages";

interface Props {
  t: Messages;
  onExit: () => void;
  onPractice: () => void;
}

/**
 * Lesson plan for two-digit addition:
 *   0. Show 23 = 2 tens + 3 ones (place value).
 *   1. Show 15 = 1 ten + 5 ones beside it.
 *   2. Combine the ones first: 3 + 5 = 8.
 *   3. Combine the tens: 2 + 1 = 3.
 *   4. = 38 (no carry).
 *   5. New problem with carry: 27 + 15. Combine ones → 12 ones (too many!).
 *   6. 10 ones bundle into 1 new ten (carry animation).
 *   7. Combine tens: 2 + 1 + 1 = 4 tens, leaving 2 ones. = 42.
 *   8. CTA practice.
 */
export default function AddLesson({ t, onExit, onPractice }: Props) {
  const [step, setStep] = useState(0);
  const stepCount = 9;

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
    "23은 십 두 묶음과 일 세 개야. 자릿값을 보자!",
    "15는 십 한 묶음과 일 다섯 개. 두 수를 같이 놓아봐.",
    "일의 자리부터 합치자: 3 + 5 = 8.",
    "그다음 십의 자리: 2 + 1 = 3.",
    "그래서 23 + 15 = 38!",
    "이번엔 27 + 15. 일을 합치면 7 + 5 = 12 — 너무 많아!",
    "10개가 모이면 새로운 십! 한 묶음을 만들어 십의 자리로 보내.",
    "이제 십이 2 + 1 + 1 = 4개, 일은 2개. 27 + 15 = 42!",
    "잘했어! 이제 직접 풀어볼래?",
  ];

  return (
    <LessonShell
      t={t}
      title="➕ 두자리 덧셈의 원리"
      stepIdx={step}
      stepCount={stepCount}
      caption={captions[step] ?? ""}
      onBack={onExit}
      onPrev={prev}
      onNext={next}
      isFinal={step === stepCount - 1}
    >
      {step === 0 && (
        <PlaceValue value={23} highlight="all" size={22} label="23" />
      )}
      {step === 1 && (
        <Pair left={<PlaceValue value={23} size={20} label="23" />} op="+" right={<PlaceValue value={15} size={20} label="15" />} />
      )}
      {step === 2 && (
        <Pair
          left={<PlaceValue value={23} size={20} label="23" highlight="ones" />}
          op="+"
          right={
            <PlaceValue value={15} size={20} label="15" highlight="ones" />
          }
          eq={<HighlightedSum value={8} caption="3 + 5 = 8" />}
        />
      )}
      {step === 3 && (
        <Pair
          left={<PlaceValue value={23} size={20} label="23" highlight="tens" />}
          op="+"
          right={
            <PlaceValue value={15} size={20} label="15" highlight="tens" />
          }
          eq={<HighlightedSum value={3} caption="2 + 1 = 3" />}
        />
      )}
      {step === 4 && (
        <div className="flex flex-col items-center gap-4">
          <PlaceValue value={38} size={22} label="38" faceOnTop />
          <Equation lhs="23 + 15" rhs="38" />
        </div>
      )}
      {step === 5 && (
        <Pair
          left={<PlaceValue value={27} size={20} label="27" highlight="ones" />}
          op="+"
          right={
            <PlaceValue value={15} size={20} label="15" highlight="ones" />
          }
          eq={<HighlightedSum value={12} caption="7 + 5 = 12 (이중!)" warning />}
        />
      )}
      {step === 6 && (
        <div key="carry" className="flex flex-col items-center gap-3">
          <RegroupCarry extraOnes={2} size={22} />
        </div>
      )}
      {step === 7 && (
        <div className="flex flex-col items-center gap-4">
          <PlaceValue value={42} size={22} accentTens={1} label="42" faceOnTop />
          <Equation lhs="27 + 15" rhs="42" />
        </div>
      )}
      {step === 8 && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-7xl">🎉</div>
          <div className="text-2xl font-black">덧셈 자릿값까지 이해 완료!</div>
        </div>
      )}
    </LessonShell>
  );
}

function Pair({
  left,
  op,
  right,
  eq,
}: {
  left: React.ReactNode;
  op: string;
  right: React.ReactNode;
  eq?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-end gap-4 sm:gap-6">
        {left}
        <div className="pb-8 text-3xl font-black sm:text-4xl">{op}</div>
        {right}
      </div>
      {eq}
    </div>
  );
}

function HighlightedSum({
  value,
  caption,
  warning,
}: {
  value: number;
  caption: string;
  warning?: boolean;
}) {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`rounded-2xl px-4 py-2 font-mono text-2xl font-black ${
        warning ? "bg-amber-400/20 text-amber-200" : "bg-white/10"
      }`}
    >
      {caption}
      <span className="ml-2 text-3xl">= {value}</span>
    </motion.div>
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
