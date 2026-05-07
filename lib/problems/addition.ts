import type { Difficulty, Problem, ProblemModule } from "./types";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function carryCount(a: number, b: number) {
  let carries = 0;
  let carry = 0;
  let aa = a;
  let bb = b;
  while (aa > 0 || bb > 0 || carry > 0) {
    const sum = (aa % 10) + (bb % 10) + carry;
    if (sum >= 10) carries++;
    carry = sum >= 10 ? 1 : 0;
    aa = Math.floor(aa / 10);
    bb = Math.floor(bb / 10);
    if (aa === 0 && bb === 0) break;
  }
  return carries;
}

function generatePair(difficulty: Difficulty): [number, number] {
  for (let i = 0; i < 50; i++) {
    const a = rand(10, 99);
    const b = rand(10, 99);
    const carries = carryCount(a, b);
    if (difficulty === "easy" && carries === 0) return [a, b];
    if (difficulty === "normal" && carries === 1) return [a, b];
    if (difficulty === "hard" && (carries >= 1 || a + b >= 100)) return [a, b];
    if (difficulty === "boss" && a + b >= 100 && carries >= 1) return [a, b];
  }
  return [rand(10, 99), rand(10, 99)];
}

export const additionModule: ProblemModule = {
  id: "addition",
  generate(difficulty, recentKeys) {
    let pair = generatePair(difficulty);
    for (let attempt = 0; attempt < 4; attempt++) {
      const k = `add:${pair[0]}+${pair[1]}`;
      if (!recentKeys?.has(k)) break;
      pair = generatePair(difficulty);
    }
    const [a, b] = pair;
    const sum = a + b;
    return {
      moduleId: "addition",
      difficulty,
      key: `add:${a}+${b}`,
      operands: [a, b],
      operator: "+",
      unknownIndex: 2,
      answer: sum,
      display: `${a} + ${b} = ?`,
    } satisfies Problem;
  },
  hint(problem, attemptCount) {
    if (attemptCount < 2) return null;
    const [a, b] = problem.operands;
    const aTens = Math.floor(a / 10) * 10;
    const aOnes = a % 10;
    const bTens = Math.floor(b / 10) * 10;
    const bOnes = b % 10;
    return `십의 자리끼리 ${aTens} + ${bTens} = ${aTens + bTens}, 일의 자리끼리 ${aOnes} + ${bOnes} = ${aOnes + bOnes}을 합쳐봐.`;
  },
};
