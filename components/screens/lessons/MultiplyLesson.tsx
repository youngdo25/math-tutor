"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LessonShell from "./LessonShell";
import MultiplyArray from "@/components/blocks/MultiplyArray";
import Cube from "@/components/blocks/Cube";
import { DIGIT_COLORS } from "@/lib/visuals";
import type { Messages } from "@/lib/i18n/messages";

interface Props {
  t: Messages;
  onExit: () => void;
  onPractice: () => void;
}

/**
 * Lesson plan for multiplication:
 *   0. Repeated addition: 3 + 3 + 3 + 3 = 12 (four piles of 3 dots).
 *   1. Same arrangement, named: 4 × 3 = 12.
 *   2. Rectangular array view: 4 rows × 3 cols.
 *   3. Commutativity: same 12 cubes can be 3 rows × 4 cols.
 *   4–6. Walk a small times table (×3): show 1×3, 2×3, ..., 5×3 building up.
 *   7. CTA: practice.
 */
export default function MultiplyLesson({ t, onExit, onPractice }: Props) {
  const [step, setStep] = useState(0);
  // For the build-up step (idx 4 onwards through 6), this is the current row count.
  const buildBase = 4; // step idx where build-up starts
  const buildEnd = 6; // last step of build-up
  const buildCount = step >= buildBase ? Math.min(5, step - buildBase + 1) : 0;
  const total = step;

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
    "3 + 3 + 3 + 3 = 12. 같은 수를 네 번 더했어!",
    "이걸 짧게 쓰면 4 × 3 = 12 야. 곱셈은 같은 수를 여러 번 더하는 것!",
    "4묶음을 가지런히 줄 세우면 직사각형이 돼. 4줄 × 3개 = 12!",
    "같은 12개를 3줄 × 4개로 봐도 답은 똑같아 — 곱셈은 순서를 바꿔도 돼!",
    "이번엔 3단을 한 줄씩 만들어보자. 1 × 3 = 3.",
    "한 줄 더! 2 × 3 = 6. 3씩 두 번 더한 거야.",
    "또 한 줄! 3 × 3 = 9.",
    "잘했어! 이제 직접 풀어볼래?",
  ];

  return (
    <LessonShell
      t={t}
      title="✖️ 곱셈의 원리"
      stepIdx={step}
      stepCount={stepCount}
      caption={captions[step] ?? ""}
      onBack={onExit}
      onPrev={prev}
      onNext={next}
      nextLabel={total === stepCount - 1 ? `${t.start} →` : undefined}
      isFinal={total === stepCount - 1}
    >
      {step === 0 && <RepeatedAddition groups={4} per={3} />}
      {step === 1 && <RepeatedAdditionLabeled groups={4} per={3} />}
      {step === 2 && (
        <ArrayView rows={4} cols={3} label="4 × 3 = 12" />
      )}
      {step === 3 && (
        <ArrayView rows={3} cols={4} label="3 × 4 = 12" />
      )}
      {step >= buildBase && step <= buildEnd && (
        <ArrayView
          rows={buildCount}
          cols={3}
          label={`${buildCount} × 3 = ${buildCount * 3}`}
          colorByRow
        />
      )}
      {step === 7 && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-7xl">🎉</div>
          <div className="text-2xl font-black">곱셈 마스터로 한 걸음!</div>
        </div>
      )}
    </LessonShell>
  );
}

function RepeatedAddition({ groups, per }: { groups: number; per: number }) {
  const colors = [DIGIT_COLORS[3], DIGIT_COLORS[4], DIGIT_COLORS[6], DIGIT_COLORS[8]];
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 sm:gap-4">
        {Array.from({ length: groups }).map((_, g) => (
          <div key={g} className="flex flex-col items-center gap-2">
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: per }).map((_, i) => (
                <Cube
                  key={i}
                  color={colors[g % colors.length]}
                  size={28}
                  delay={g * 0.15 + i * 0.05}
                />
              ))}
            </div>
            <div className="font-mono text-lg font-bold text-white/80">{per}</div>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: groups * 0.18 }}
        className="font-mono text-3xl font-black tabular-nums"
      >
        {Array.from({ length: groups }).map((_, g) => (
          <span key={g}>
            {g > 0 ? " + " : ""}
            {per}
          </span>
        ))}
        {" = "}
        {groups * per}
      </motion.div>
    </div>
  );
}

function RepeatedAdditionLabeled({
  groups,
  per,
}: {
  groups: number;
  per: number;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <RepeatedAddition groups={groups} per={per} />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 18 }}
        className="rounded-2xl bg-white/10 px-5 py-2 font-mono text-3xl font-black"
      >
        = {groups} × {per}
      </motion.div>
    </div>
  );
}

function ArrayView({
  rows,
  cols,
  label,
  colorByRow,
}: {
  rows: number;
  cols: number;
  label: string;
  colorByRow?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <MultiplyArray
        rows={rows}
        cols={cols}
        size={28}
        singleColorIdx={colorByRow ? undefined : 5}
      />
      <div className="font-mono text-3xl font-black tabular-nums">{label}</div>
    </div>
  );
}
