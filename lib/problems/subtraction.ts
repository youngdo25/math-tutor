import type { Difficulty, Problem, ProblemModule } from "./types";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function borrowCount(a: number, b: number) {
  // a >= b assumed
  let borrows = 0;
  let aa = a;
  let bb = b;
  while (bb > 0) {
    const aOnes = aa % 10;
    const bOnes = bb % 10;
    if (aOnes < bOnes) borrows++;
    aa = Math.floor(aa / 10);
    bb = Math.floor(bb / 10);
  }
  return borrows;
}

function generatePair(difficulty: Difficulty): [number, number] {
  for (let i = 0; i < 50; i++) {
    if (difficulty === "easy") {
      // 두자리수 - 한자리수
      const a = rand(11, 99);
      const b = rand(1, 9);
      if (a - b >= 0) return [a, b];
      continue;
    }
    const a = rand(20, 99);
    const b = rand(10, a);
    const borrows = borrowCount(a, b);
    if (difficulty === "normal" && borrows <= 1) return [a, b];
    if (difficulty === "hard" && borrows >= 1) return [a, b];
    if (difficulty === "boss" && borrows >= 1 && (a % 10 === 0 || b % 10 === 0)) return [a, b];
  }
  const a = rand(20, 99);
  const b = rand(10, a);
  return [a, b];
}

export const subtractionModule: ProblemModule = {
  id: "subtraction",
  generate(difficulty, recentKeys) {
    let pair = generatePair(difficulty);
    for (let attempt = 0; attempt < 4; attempt++) {
      const k = `sub:${pair[0]}-${pair[1]}`;
      if (!recentKeys?.has(k)) break;
      pair = generatePair(difficulty);
    }
    const [a, b] = pair;
    return {
      moduleId: "subtraction",
      difficulty,
      key: `sub:${a}-${b}`,
      operands: [a, b],
      operator: "−",
      unknownIndex: 2,
      answer: a - b,
      display: `${a} − ${b} = ?`,
    } satisfies Problem;
  },
  hint(problem, attemptCount) {
    if (attemptCount < 2) return null;
    const [a, b] = problem.operands;
    if (b < 10) {
      return `${a}에서 ${b}만큼 거꾸로 세어봐.`;
    }
    return `${a}에서 ${Math.floor(b / 10) * 10}을 먼저 빼고, 그다음 ${b % 10}을 빼봐.`;
  },
};
