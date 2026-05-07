export type ThemeId = "space" | "monster";

export interface Theme {
  id: ThemeId;
  /** CSS variables to set on <html data-theme=...>. */
  vars: Record<string, string>;
  /** Emoji that represents the player's foe (for the play screen). */
  foeEmoji: string[];
  bossEmoji: string;
  /** Emoji shown after a correct answer (celebration). */
  celebrate: string[];
  /** Background gradient (Tailwind classes). */
  bgClass: string;
  /** Display name key in messages.themes. */
  nameKey: "space" | "monster";
}

export const THEMES: Record<ThemeId, Theme> = {
  space: {
    id: "space",
    nameKey: "space",
    vars: {
      "--accent": "#7c5cff",
      "--accent-2": "#22d3ee",
      "--good": "#4ade80",
      "--bad": "#fb7185",
      "--surface": "rgba(255,255,255,0.08)",
      "--surface-strong": "rgba(255,255,255,0.16)",
      "--ink": "#f8fafc",
      "--ink-muted": "rgba(248,250,252,0.7)",
    },
    foeEmoji: ["👾", "🛸", "👽", "🪐", "☄️"],
    bossEmoji: "🛸",
    celebrate: ["⭐", "✨", "🌟", "💫"],
    bgClass:
      "bg-[radial-gradient(ellipse_at_top,#3b1d70_0%,#0b0f2c_55%,#04060f_100%)]",
  },
  monster: {
    id: "monster",
    nameKey: "monster",
    vars: {
      "--accent": "#fb923c",
      "--accent-2": "#facc15",
      "--good": "#86efac",
      "--bad": "#f87171",
      "--surface": "rgba(255,255,255,0.06)",
      "--surface-strong": "rgba(255,255,255,0.14)",
      "--ink": "#fef3c7",
      "--ink-muted": "rgba(254,243,199,0.7)",
    },
    foeEmoji: ["👹", "👺", "🐲", "🦂", "🦴", "🧌"],
    bossEmoji: "🐉",
    celebrate: ["⚔️", "🛡️", "🔥", "💥"],
    bgClass:
      "bg-[radial-gradient(ellipse_at_top,#5a1a1a_0%,#1a1208_55%,#0a0604_100%)]",
  },
};

export const THEME_IDS: ThemeId[] = ["space", "monster"];
