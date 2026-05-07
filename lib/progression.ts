import { DIFFICULTY_XP_MULTIPLIER, type Difficulty } from "./problems/types";

export const BASE_XP_PER_PROBLEM = 10;

export function xpForCorrect(difficulty: Difficulty, comboCount: number) {
  const base = BASE_XP_PER_PROBLEM * DIFFICULTY_XP_MULTIPLIER[difficulty];
  let comboBonus = 0;
  if (comboCount === 3) comboBonus = 5;
  else if (comboCount === 5) comboBonus = 15;
  else if (comboCount >= 10) comboBonus = 30;
  return Math.round(base + comboBonus);
}

export function coinsForCorrect(difficulty: Difficulty) {
  if (difficulty === "boss") return 5;
  if (difficulty === "hard") return 3;
  if (difficulty === "normal") return 2;
  return 1;
}

/** XP required to reach (level + 1). Easy at start, slower later. */
export function xpToNextLevel(level: number) {
  if (level <= 0) return 50;
  return Math.round(50 + 30 * Math.pow(level, 1.4));
}

export function applyXp(currentLevel: number, currentXp: number, gained: number) {
  let level = currentLevel;
  let xp = currentXp + gained;
  let leveledUp = false;
  while (xp >= xpToNextLevel(level)) {
    xp -= xpToNextLevel(level);
    level += 1;
    leveledUp = true;
  }
  return { level, xp, leveledUp };
}
