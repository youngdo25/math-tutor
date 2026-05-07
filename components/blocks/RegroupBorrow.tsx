"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Cube from "./Cube";
import { ACCENT_COLOR, TENS_COLOR } from "@/lib/visuals";
import { playBreak } from "@/lib/sound";

/**
 * Animates: 1 ten-bar shakes → bursts apart → becomes 10 individual ones.
 */
export default function RegroupBorrow({
  size = 24,
  autoplay = true,
}: {
  size?: number;
  autoplay?: boolean;
}) {
  const [phase, setPhase] = useState<"ten" | "shaking" | "ones">("ten");
  const playedRef = useRef(false);
  const gap = Math.max(2, Math.round(size * 0.12));

  useEffect(() => {
    if (!autoplay) return;
    const t1 = setTimeout(() => {
      setPhase("shaking");
      if (!playedRef.current) {
        playedRef.current = true;
        playBreak();
      }
    }, 700);
    const t2 = setTimeout(() => setPhase("ones"), 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [autoplay]);

  return (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative flex h-[260px] items-end"
          style={{ width: size + 8 }}
        >
          <AnimatePresence>
            {phase !== "ones" && (
              <motion.div
                key="ten"
                initial={false}
                animate={{
                  rotate: phase === "shaking" ? [-3, 3, -2, 2, 0] : 0,
                  scale: phase === "shaking" ? [1, 1.06, 0.95, 1] : 1,
                  filter:
                    phase === "shaking"
                      ? "drop-shadow(0 0 14px rgba(248,113,113,0.85))"
                      : "none",
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col-reverse"
                style={{ gap }}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <Cube
                    key={i}
                    color={TENS_COLOR}
                    size={size}
                    delay={i * 0.02}
                    face={i === 9}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="text-xs text-white/60">십 1개를 풀어…</div>
      </div>

      <motion.div
        animate={{
          x: phase === "shaking" ? [0, 6, 0] : 0,
          scale: phase === "shaking" ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.5 }}
        className="pb-12 text-3xl"
      >
        💥
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <div
          className="relative flex h-[260px] items-end"
          style={{ width: size + 8 }}
        >
          <AnimatePresence>
            {phase === "ones" && (
              <motion.div
                key="ones"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="flex flex-col-reverse"
                style={{ gap }}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <Cube
                    key={i}
                    color={ACCENT_COLOR}
                    size={size}
                    delay={i * 0.04}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="text-xs text-white/60">= 일 10개로!</div>
      </div>
    </div>
  );
}
