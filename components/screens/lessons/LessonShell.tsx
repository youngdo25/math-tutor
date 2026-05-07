"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Messages } from "@/lib/i18n/messages";
import { playClick, playLevelUp } from "@/lib/sound";

export interface LessonShellProps {
  t: Messages;
  title: string;
  stepIdx: number;
  stepCount: number;
  caption: string;
  children: ReactNode;
  onBack: () => void;
  onPrev?: () => void;
  onNext: () => void;
  nextLabel?: string;
  isFinal?: boolean;
}

export default function LessonShell({
  t,
  title,
  stepIdx,
  stepCount,
  caption,
  children,
  onBack,
  onPrev,
  onNext,
  nextLabel,
  isFinal,
}: LessonShellProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 py-2">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="kid-btn px-3 py-2 text-sm">
          ←
        </button>
        <div className="flex-1">
          <div className="text-sm text-white/60">{title}</div>
          <div className="mt-1 flex gap-1">
            {Array.from({ length: stepCount }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= stepIdx ? "bg-white" : "bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="surface flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden p-4 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="flex w-full flex-1 flex-col items-center justify-center"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3">
        <motion.p
          key={caption + stepIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-lg font-medium text-white/90 sm:text-xl"
        >
          {caption}
        </motion.p>
        <div className="flex justify-center gap-3">
          {onPrev && stepIdx > 0 && (
            <button onClick={onPrev} className="kid-btn">
              ← {t.back}
            </button>
          )}
          <button
            onClick={() => {
              if (isFinal) playLevelUp();
              else playClick();
              onNext();
            }}
            className="kid-btn kid-btn-primary px-10 text-lg"
          >
            {nextLabel ?? (isFinal ? `${t.start} →` : `${t.next} →`)}
          </button>
        </div>
      </div>
    </div>
  );
}
