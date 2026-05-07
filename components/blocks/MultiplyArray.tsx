"use client";

import Cube from "./Cube";
import { DIGIT_COLORS } from "@/lib/visuals";

export interface MultiplyArrayProps {
  rows: number;
  cols: number;
  /** Reveal only the first `visibleRows` rows; the rest are hidden. */
  visibleRows?: number;
  /** Highlight (slightly brighten) the latest visible row. */
  highlightLatest?: boolean;
  /** Use a single color for all cubes; otherwise color each row by its index (1..rows). */
  singleColorIdx?: number;
  size?: number;
  /** Render a face on the bottom-right cube to give the array a character vibe. */
  faceOnCorner?: boolean;
}

export default function MultiplyArray({
  rows,
  cols,
  visibleRows,
  highlightLatest = true,
  singleColorIdx,
  size = 26,
  faceOnCorner = true,
}: MultiplyArrayProps) {
  const reveal = visibleRows ?? rows;
  const gap = Math.max(2, Math.round(size * 0.12));

  return (
    <div className="flex flex-col" style={{ gap }}>
      {Array.from({ length: rows }).map((_, r) => {
        const visible = r < reveal;
        const isLatest = visible && r === reveal - 1;
        const colorIdx = singleColorIdx ?? ((r % 9) + 1);
        const color = DIGIT_COLORS[colorIdx];
        return (
          <div
            key={r}
            className={`flex transition-transform ${
              isLatest && highlightLatest ? "scale-105" : ""
            }`}
            style={{ gap, opacity: visible ? 1 : 0.18 }}
          >
            {Array.from({ length: cols }).map((_, c) => (
              <Cube
                key={c}
                color={color}
                size={size}
                delay={visible ? r * 0.05 + c * 0.025 : 0}
                noAnim={!visible}
                face={faceOnCorner && r === reveal - 1 && c === cols - 1}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
