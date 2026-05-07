import type { Difficulty, Problem, ProblemModule } from "./types";

const TABLES: Record<Difficulty, number[]> = {
  easy: [1, 2, 5],
  normal: [2, 3, 4, 5],
  hard: [2, 3, 4, 5, 6, 7, 8, 9],
  boss: [2, 3, 4, 5, 6, 7, 8, 9],
};

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildKey(a: number, b: number) {
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  return `mult:${lo}x${hi}`;
}

export const multiplicationModule: ProblemModule = {
  id: "multiplication",
  generate(difficulty, recentKeys) {
    const tables = TABLES[difficulty];
    let a = pick(tables);
    let b = Math.floor(Math.random() * 9) + 1;

    for (let attempt = 0; attempt < 6 && recentKeys?.has(buildKey(a, b)); attempt++) {
      a = pick(tables);
      b = Math.floor(Math.random() * 9) + 1;
    }

    const product = a * b;
    const reverse = difficulty === "hard" || difficulty === "boss"
      ? Math.random() < (difficulty === "boss" ? 0.5 : 0.25)
      : false;

    if (reverse) {
      const display = `? × ${b} = ${product}`;
      return {
        moduleId: "multiplication",
        difficulty,
        key: buildKey(a, b),
        operands: [a, b],
        operator: "×",
        unknownIndex: 0,
        answer: a,
        display,
      } satisfies Problem;
    }

    return {
      moduleId: "multiplication",
      difficulty,
      key: buildKey(a, b),
      operands: [a, b],
      operator: "×",
      unknownIndex: 2,
      answer: product,
      display: `${a} × ${b} = ?`,
    };
  },
  hint(problem, attemptCount) {
    if (attemptCount < 2) return null;
    const [a, b] = problem.operands;
    if (problem.unknownIndex === 2) {
      return `${a}을(를) ${b}번 더해보자: ${a} + ${a} + … (${b}번)`;
    }
    return `${b}단에서 답이 ${problem.answer * b}이 되는 수를 떠올려봐.`;
  },
};
