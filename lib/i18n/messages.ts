export type Locale = "ko" | "en";

export interface Messages {
  appName: string;
  tagline: string;
  start: string;
  home: string;
  back: string;
  next: string;
  again: string;
  submit: string;
  skip: string;
  locked: string;
  levelLabel: string;
  xpLabel: string;
  coinsLabel: string;
  comboLabel: string;
  correct: string;
  wrong: string;
  answerWas: (n: number) => string;
  chooseMode: string;
  chooseDifficulty: string;
  modes: { multiplication: string; addition: string; subtraction: string };
  difficulties: { easy: string; normal: string; hard: string; boss: string };
  bossLocked: string;
  resultTitle: string;
  resultCorrect: (n: number, total: number) => string;
  resultXp: (n: number) => string;
  resultCoins: (n: number) => string;
  levelUp: string;
  quitConfirm: string;
  yes: string;
  no: string;
  themes: { space: string; monster: string };
  themeLabel: string;
  languageLabel: string;
  soundLabel: string;
  on: string;
  off: string;
  hint: string;
  parentMode: string;
  todaysMission: string;
  progressLabel: string;
  keepGoing: string;
  bossAvailable: string;
  practice: string;
  learn: string;
  learnTitle: string;
  learnSubtitle: string;
  lessonHint: { multiplication: string; addition: string; subtraction: string };
  chart: string;
  chartTitle: string;
  chartHint: string;
}

export const messages: Record<Locale, Messages> = {
  ko: {
    appName: "수학 모험",
    tagline: "오늘도 문제 풀고 모험 떠나자!",
    start: "시작하기",
    home: "홈",
    back: "뒤로",
    next: "다음",
    again: "한 판 더",
    submit: "확인",
    skip: "넘기기",
    locked: "잠김",
    levelLabel: "레벨",
    xpLabel: "경험치",
    coinsLabel: "코인",
    comboLabel: "콤보",
    correct: "정답!",
    wrong: "다시!",
    answerWas: (n: number) => `정답은 ${n}이었어`,
    chooseMode: "오늘 뭐 풀까?",
    chooseDifficulty: "난이도를 골라봐",
    modes: {
      multiplication: "구구단",
      addition: "두자리수 덧셈",
      subtraction: "두자리수 뺄셈",
    },
    difficulties: {
      easy: "쉬움",
      normal: "보통",
      hard: "어려움",
      boss: "보스전",
    },
    bossLocked: "다른 난이도에서 80% 이상 맞히면 열려!",
    resultTitle: "결과",
    resultCorrect: (n: number, total: number) => `${total}문제 중 ${n}문제 정답`,
    resultXp: (n: number) => `+${n} 경험치`,
    resultCoins: (n: number) => `+${n} 코인`,
    levelUp: "레벨 업!",
    quitConfirm: "정말 그만할래?",
    yes: "응",
    no: "아니",
    themes: {
      space: "🚀 우주 탐험",
      monster: "⚔️ 몬스터 헌터",
    },
    themeLabel: "테마",
    languageLabel: "언어",
    soundLabel: "소리",
    on: "켬",
    off: "끔",
    hint: "힌트",
    parentMode: "부모 모드",
    todaysMission: "오늘의 미션",
    progressLabel: "진행도",
    keepGoing: "계속 가자!",
    bossAvailable: "🔥 보스전 도전 가능!",
    practice: "풀기",
    learn: "배우기",
    learnTitle: "원리 배우기",
    learnSubtitle: "외우지 말고, 그림으로 이해해보자!",
    lessonHint: {
      multiplication: "곱셈은 묶음과 배열로!",
      addition: "십·일 자릿값 블록으로 합치기",
      subtraction: "받아내림은 십을 풀어 일로!",
    },
    chart: "곱셈표",
    chartTitle: "곱셈표 (×9 × ×9)",
    chartHint: "칸을 누르면 그림으로 보여줄게!",
  },
  en: {
    appName: "Math Quest",
    tagline: "Solve problems and go on an adventure!",
    start: "Start",
    home: "Home",
    back: "Back",
    next: "Next",
    again: "Play again",
    submit: "OK",
    skip: "Skip",
    locked: "Locked",
    levelLabel: "Level",
    xpLabel: "XP",
    coinsLabel: "Coins",
    comboLabel: "Combo",
    correct: "Correct!",
    wrong: "Try again!",
    answerWas: (n: number) => `The answer was ${n}`,
    chooseMode: "What shall we solve?",
    chooseDifficulty: "Pick a difficulty",
    modes: {
      multiplication: "Multiplication",
      addition: "Addition",
      subtraction: "Subtraction",
    },
    difficulties: {
      easy: "Easy",
      normal: "Normal",
      hard: "Hard",
      boss: "Boss",
    },
    bossLocked: "Score 80%+ on another difficulty to unlock!",
    resultTitle: "Result",
    resultCorrect: (n: number, total: number) => `${n} of ${total} correct`,
    resultXp: (n: number) => `+${n} XP`,
    resultCoins: (n: number) => `+${n} coins`,
    levelUp: "Level Up!",
    quitConfirm: "Really quit?",
    yes: "Yes",
    no: "No",
    themes: {
      space: "🚀 Space Quest",
      monster: "⚔️ Monster Hunter",
    },
    themeLabel: "Theme",
    languageLabel: "Language",
    soundLabel: "Sound",
    on: "On",
    off: "Off",
    hint: "Hint",
    parentMode: "Parent mode",
    todaysMission: "Today's mission",
    progressLabel: "Progress",
    keepGoing: "Keep going!",
    bossAvailable: "🔥 Boss battle ready!",
    practice: "Practice",
    learn: "Learn",
    learnTitle: "Learn the idea",
    learnSubtitle: "See it, don't just memorize it!",
    lessonHint: {
      multiplication: "Groups and arrays make sense of it",
      addition: "Stack tens & ones, then combine",
      subtraction: "Borrow by breaking a ten into ones",
    },
    chart: "Times Chart",
    chartTitle: "Multiplication Chart (×9 × ×9)",
    chartHint: "Tap a cell to see the picture!",
  },
};
