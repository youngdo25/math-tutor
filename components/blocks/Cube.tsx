"use client";

import { motion } from "framer-motion";
import type { CubeColor } from "@/lib/visuals";

export interface CubeProps {
  color: CubeColor;
  size?: number;
  delay?: number;
  /** Render a tiny smile face on this cube. */
  face?: boolean;
  /** Dimmed style (e.g. about to disappear during subtraction). */
  ghost?: boolean;
  /** Disable entry animation. */
  noAnim?: boolean;
}

export default function Cube({
  color,
  size = 28,
  delay = 0,
  face = false,
  ghost = false,
  noAnim = false,
}: CubeProps) {
  const radius = size * 0.22;
  return (
    <motion.div
      initial={noAnim ? false : { scale: 0, opacity: 0, y: -6 }}
      animate={{ scale: 1, opacity: ghost ? 0.25 : 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 8 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 320,
        damping: 18,
      }}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(160deg, ${color.highlight} 0%, ${color.bg} 55%, ${color.shadow} 100%)`,
        boxShadow: `0 2px 0 ${color.shadow}, inset 0 1px 0 rgba(255,255,255,0.35)`,
        position: "relative",
      }}
    >
      {face && (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <circle cx="11" cy="13" r="2" fill={color.ink} />
          <circle cx="21" cy="13" r="2" fill={color.ink} />
          <path
            d="M 11 20 Q 16 24 21 20"
            stroke={color.ink}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
    </motion.div>
  );
}
