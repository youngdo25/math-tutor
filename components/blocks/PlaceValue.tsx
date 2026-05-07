"use client";

import { AnimatePresence } from "framer-motion";
import Cube from "./Cube";
import {
  ACCENT_COLOR,
  ONES_COLOR,
  TENS_COLOR,
  type CubeColor,
} from "@/lib/visuals";

export interface PlaceValueProps {
  /** 0–99. */
  value: number;
  /** When given, only this many ones are rendered (rest fade out for subtraction). */
  visibleOnes?: number;
  /** When given, only this many tens are rendered. */
  visibleTens?: number;
  /** Highlight a specific column to draw the eye. */
  highlight?: "tens" | "ones" | "all";
  /** Color overrides (e.g. for accent on a freshly carried ten). */
  tensColor?: CubeColor;
  onesColor?: CubeColor;
  /** Per-cube size in pixels (defaults responsive 22). */
  size?: number;
  /** Use accent color for the last `accentTens` tens (e.g. carried). */
  accentTens?: number;
  /** Use accent color for the last `accentOnes` ones (e.g. broken-out borrowed). */
  accentOnes?: number;
  /** Show a face on the topmost ones cube. */
  faceOnTop?: boolean;
  /** Optional text label below. */
  label?: string;
}

export default function PlaceValue({
  value,
  visibleOnes,
  visibleTens,
  highlight,
  tensColor = TENS_COLOR,
  onesColor = ONES_COLOR,
  size = 22,
  accentTens = 0,
  accentOnes = 0,
  faceOnTop = true,
  label,
}: PlaceValueProps) {
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  const renderTens = visibleTens ?? tens;
  const renderOnes = visibleOnes ?? ones;
  const gap = Math.max(2, Math.round(size * 0.12));
  // Decide where to place the face: prefer ones-top, else tens-top of last column.
  const faceOnOnes = faceOnTop && renderOnes > 0;
  const faceOnTens = faceOnTop && renderOnes === 0 && renderTens > 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-end"
        style={{ gap: gap * 2 }}
      >
        {renderTens > 0 && (
          <div
            className={`flex items-end ${highlight === "tens" ? "ring-2 ring-white/40 rounded-xl p-1" : ""}`}
            style={{ gap }}
          >
            {Array.from({ length: renderTens }).map((_, i) => (
              <TenStack
                key={i}
                color={i >= renderTens - accentTens ? ACCENT_COLOR : tensColor}
                size={size}
                gap={gap}
                ghost={i >= tens && visibleTens === undefined}
                faceOnTop={faceOnTens && i === renderTens - 1}
              />
            ))}
          </div>
        )}
        {renderOnes > 0 && (
          <div
            className={`flex flex-col-reverse ${highlight === "ones" ? "ring-2 ring-white/40 rounded-xl p-1" : ""}`}
            style={{ gap }}
          >
            {Array.from({ length: renderOnes }).map((_, i) => (
              <Cube
                key={i}
                color={i >= renderOnes - accentOnes ? ACCENT_COLOR : onesColor}
                size={size}
                delay={i * 0.04}
                face={faceOnOnes && i === renderOnes - 1}
              />
            ))}
          </div>
        )}
      </div>
      {label && (
        <div className="font-mono text-2xl font-black tabular-nums text-white/90">
          {label}
        </div>
      )}
    </div>
  );
}

function TenStack({
  color,
  size,
  gap,
  ghost,
  faceOnTop = false,
}: {
  color: CubeColor;
  size: number;
  gap: number;
  ghost: boolean;
  faceOnTop?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse" style={{ gap }}>
      <AnimatePresence>
        {Array.from({ length: 10 }).map((_, i) => (
          <Cube
            key={i}
            color={color}
            size={size}
            delay={i * 0.02}
            ghost={ghost}
            face={faceOnTop && i === 9}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
