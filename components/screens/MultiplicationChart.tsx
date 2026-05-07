"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MultiplyArray from "@/components/blocks/MultiplyArray";
import { DIGIT_COLORS } from "@/lib/visuals";
import { playPop, playClick } from "@/lib/sound";
import type { Messages } from "@/lib/i18n/messages";

const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function MultiplicationChart({
  t,
  onBack,
}: {
  t: Messages;
  onBack: () => void;
}) {
  const [picked, setPicked] = useState<{ a: number; b: number } | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-4 py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="kid-btn px-3 py-2 text-sm"
        >
          ←
        </button>
        <div>
          <div className="text-sm text-white/60">📊 {t.chartTitle}</div>
          <div className="text-xs text-white/50">{t.chartHint}</div>
        </div>
      </div>

      <div
        className="surface mx-auto w-full max-w-3xl overflow-x-auto p-3 sm:p-5"
        role="grid"
        aria-label="Multiplication chart"
      >
        <table className="mx-auto border-separate text-center" style={{ borderSpacing: 4 }}>
          <thead>
            <tr>
              <th className="w-9 text-white/40">×</th>
              {ROWS.map((b) => (
                <th key={b} className="w-9 text-xs font-bold text-white/60 sm:w-12">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((a) => (
              <tr key={a}>
                <td className="text-xs font-bold text-white/60">{a}</td>
                {ROWS.map((b) => (
                  <ChartCell
                    key={b}
                    a={a}
                    b={b}
                    onPick={() => {
                      playPop();
                      setPicked({ a, b });
                    }}
                    isOpen={picked?.a === a && picked?.b === b}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {picked && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setPicked(null)}
          >
            <motion.div
              key={`m-${picked.a}-${picked.b}`}
              initial={{ scale: 0.85, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="surface flex max-h-[90vh] max-w-[95vw] flex-col items-center gap-4 overflow-auto p-6"
            >
              <div className="font-mono text-3xl font-black tabular-nums">
                {picked.a} × {picked.b} = {picked.a * picked.b}
              </div>
              <div className="text-sm text-white/60">
                {picked.a}줄 × {picked.b}개 = {picked.a * picked.b}개
              </div>
              <MultiplyArray
                rows={picked.a}
                cols={picked.b}
                size={24}
                faceOnCorner
              />
              <button
                onClick={() => setPicked(null)}
                className="kid-btn kid-btn-primary px-8"
              >
                {t.next} →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChartCell({
  a,
  b,
  onPick,
  isOpen,
}: {
  a: number;
  b: number;
  onPick: () => void;
  isOpen: boolean;
}) {
  const product = a * b;
  // Color cells subtly by the times-table row color.
  const c = DIGIT_COLORS[a];
  return (
    <td>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onPick}
        className={`flex h-9 w-9 items-center justify-center rounded-lg font-mono text-xs font-bold tabular-nums sm:h-12 sm:w-12 sm:text-sm ${
          isOpen ? "ring-2 ring-white" : ""
        }`}
        style={{
          background: `linear-gradient(160deg, ${c.highlight} 0%, ${c.bg} 60%, ${c.shadow} 100%)`,
          color: c.ink,
          boxShadow: `0 1px 0 ${c.shadow}, inset 0 1px 0 rgba(255,255,255,0.25)`,
        }}
        aria-label={`${a} times ${b} equals ${product}`}
      >
        {product}
      </motion.button>
    </td>
  );
}
