export type CubeColor = {
  bg: string;
  highlight: string;
  shadow: string;
  ink: string;
};

/** Numberblocks-inspired digit colors (1–9 + ten). */
export const DIGIT_COLORS: Record<number, CubeColor> = {
  1: { bg: "#ef4444", highlight: "#fca5a5", shadow: "#991b1b", ink: "#7f1d1d" },
  2: { bg: "#f97316", highlight: "#fdba74", shadow: "#9a3412", ink: "#7c2d12" },
  3: { bg: "#facc15", highlight: "#fde68a", shadow: "#854d0e", ink: "#713f12" },
  4: { bg: "#22c55e", highlight: "#86efac", shadow: "#166534", ink: "#14532d" },
  5: { bg: "#38bdf8", highlight: "#bae6fd", shadow: "#075985", ink: "#0c4a6e" },
  6: { bg: "#a855f7", highlight: "#d8b4fe", shadow: "#6b21a8", ink: "#581c87" },
  7: { bg: "#ec4899", highlight: "#f9a8d4", shadow: "#9d174d", ink: "#831843" },
  8: { bg: "#14b8a6", highlight: "#5eead4", shadow: "#115e59", ink: "#134e4a" },
  9: { bg: "#6366f1", highlight: "#a5b4fc", shadow: "#3730a3", ink: "#312e81" },
  10: { bg: "#94a3b8", highlight: "#e2e8f0", shadow: "#334155", ink: "#1e293b" },
};

/** Place-value palette: tens vs ones. */
export const TENS_COLOR: CubeColor = DIGIT_COLORS[5];
export const ONES_COLOR: CubeColor = DIGIT_COLORS[2];
/** Color for newly-formed ten during a carry, or freshly-broken ones during a borrow. */
export const ACCENT_COLOR: CubeColor = DIGIT_COLORS[4];
