export type Difficulty = "easy" | "normal" | "hard" | "boss";

export type ProblemModuleId = "multiplication" | "addition" | "subtraction";

export interface Problem {
  moduleId: ProblemModuleId;
  difficulty: Difficulty;
  /** Stable key used for mastery tracking (e.g. "mult:7x8", "add:23+15"). */
  key: string;
  /** Operands or facts that make up the problem (renderer-agnostic). */
  operands: number[];
  operator: "×" | "+" | "−";
  /** Which operand is the unknown (0-indexed). For "3 × ? = 12" pass index 1. */
  unknownIndex: number;
  /** The correct numeric answer. */
  answer: number;
  /** Pretty display of the question, with `?` for the unknown. */
  display: string;
}

export interface ProblemModule {
  id: ProblemModuleId;
  /** Generate a single problem at the given difficulty. */
  generate: (difficulty: Difficulty, recentKeys?: Set<string>) => Problem;
  /** Hint string keyed by attempt count (1-based). */
  hint?: (problem: Problem, attemptCount: number) => string | null;
}

export const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard", "boss"];

export const DIFFICULTY_XP_MULTIPLIER: Record<Difficulty, number> = {
  easy: 1,
  normal: 1.5,
  hard: 2,
  boss: 3,
};
