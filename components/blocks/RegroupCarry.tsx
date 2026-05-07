"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Cube from "./Cube";
import { ACCENT_COLOR, ONES_COLOR, TENS_COLOR } from "@/lib/visuals";
import { playRegroup } from "@/lib/sound";

/**
 * Animates: 10 ones cubes lined up → fuse together → become 1 new ten-bar.
 * Optionally renders `extraOnes` ones (e.g. the 2 left over from "12 ones") that stay put.
 */
export default function RegroupCarry({
  extraOnes = 0,
  size = 24,
  autoplay = true,
}: {
  extraOnes?: number;
  size?: number;
  autoplay?: boolean;
}) {
  const [phase, setPhase] = useState<"ones" | "fusing" | "ten">("ones");
  const playedRef = useRef(false);
  const gap = Math.max(2, Math.round(size * 0.12));

  useEffect(() => {
    if (!autoplay) return;
    const t1 = setTimeout(() => {
      setPhase("fusing");
      if (!playedRef.current) {
        playedRef.current = true;
        playRegroup();
      }
    }, 800);
    const t2 = setTimeout(() => setPhase("ten"), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [autoplay]);

  return (
    <div className="flex items-end gap-6">
      {/* Left: the 10 ones that will fuse */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative flex h-[260px] items-end"
          style={{ width: size + 8 }}
        >
          <AnimatePresence>
            {phase !== "ten" && (
              <motion.div
                key="ones-stack"
                initial={false}
                animate={{
                  scale: phase === "fusing" ? 0.92 : 1,
                  filter:
                    phase === "fusing"
                      ? "brightness(1.4) drop-shadow(0 0 12px rgba(34,197,94,0.8))"
                      : "none",
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col-reverse"
                style={{ gap }}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <Cube
                    key={i}
                    color={ONES_COLOR}
                    size={size}
                    delay={i * 0.025}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="text-xs text-white/60">일 10개</div>
      </div>

      <motion.div
        animate={{
          x: phase === "fusing" ? [0, 6, 0] : 0,
          scale: phase === "fusing" ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.5 }}
        className="pb-12 text-3xl"
      >
        ➜
      </motion.div>

      {/* Right: the new ten-bar appears */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative flex h-[260px] items-end"
          style={{ width: size + 8 }}
        >
          <AnimatePresence>
            {phase === "ten" && (
              <motion.div
                key="new-ten"
                initial={{ scale: 0.4, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 14,
                }}
                className="flex flex-col-reverse"
                style={{ gap }}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <Cube
                    key={i}
                    color={ACCENT_COLOR}
                    size={size}
                    delay={i * 0.02}
                    face={i === 9}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="text-xs text-white/60">= 새 십 1개</div>
      </div>

      {/* Extras */}
      {extraOnes > 0 && (
        <div className="ml-2 flex flex-col items-center gap-2">
          <div className="flex flex-col-reverse" style={{ gap }}>
            {Array.from({ length: extraOnes }).map((_, i) => (
              <Cube
                key={i}
                color={TENS_COLOR}
                size={size}
                delay={1.4 + i * 0.05}
                face={i === extraOnes - 1}
              />
            ))}
          </div>
          <div className="text-xs text-white/60">+ {extraOnes}일 남음</div>
        </div>
      )}
    </div>
  );
}
