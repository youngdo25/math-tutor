# math-tutor

초등 1–2학년 아들을 위한 수학 연습·개념 학습 웹 앱. 곱셈/두자리수 덧셈·뺄셈 연습 + Numberblocks 스타일의 자릿값·배열 시각화 레슨 + 게이미피케이션 (XP, 레벨, 우주↔몬스터 테마).

스택: Next.js 16 · React 19 · TypeScript · Tailwind v4 · Zustand · Framer Motion · idb · Web Audio.

자세한 제품 정의는 [PRD.md](./PRD.md).

## 접속 주소

`launchctl`로 등록된 LaunchAgent가 부팅 시 자동으로 production 서버를 띄웁니다.

| 어디서 | URL |
|---|---|
| 이 Mac | <http://localhost:3000> |
| 같은 wifi의 태블릿/폰 | <http://192.168.0.78:3000> |

## 로컬 개발

```bash
npm install         # 최초 1회
npm run dev         # http://localhost:3000 (Hot reload)
npm run lint
npx tsc --noEmit
```

> ⚠️ 포트 3000은 LaunchAgent가 점유 중일 수 있습니다. 개발할 때는 먼저 `launchctl unload` 하거나 `PORT=3001 npm run dev` 로 띄우세요.

## 운영 명령 (LaunchAgent)

설정 파일: `~/Library/LaunchAgents/com.youngdo.math-tutor.plist`
원본: [`scripts/com.youngdo.math-tutor.plist`](./scripts/com.youngdo.math-tutor.plist)
구동 스크립트: [`scripts/serve.sh`](./scripts/serve.sh)
로그: `/tmp/math-tutor.log`, `/tmp/math-tutor.err`

```bash
# 상태 확인
launchctl list | grep math-tutor
tail -f /tmp/math-tutor.log

# 멈추기 / 다시 켜기
launchctl unload ~/Library/LaunchAgents/com.youngdo.math-tutor.plist
launchctl load   ~/Library/LaunchAgents/com.youngdo.math-tutor.plist

# 새 코드 배포 (코드 변경 후)
npm run build
launchctl kickstart -k "gui/$(id -u)/com.youngdo.math-tutor"

# plist 자체를 수정했을 때 (plist 변경 → 재배치 → 재로드)
cp scripts/com.youngdo.math-tutor.plist ~/Library/LaunchAgents/
launchctl unload ~/Library/LaunchAgents/com.youngdo.math-tutor.plist
launchctl load   ~/Library/LaunchAgents/com.youngdo.math-tutor.plist
```

`KeepAlive=true` · `RunAtLoad=true` 설정이라 로그인 시 자동 시작, 죽으면 자동 재시작합니다.

## 디렉토리 구조

```
app/                  # Next.js App Router (root)
components/
├── Shell.tsx         # 화면 라우팅 + TopBar
├── blocks/           # Cube, PlaceValue, MultiplyArray, Regroup*
└── screens/          # Home, Mode, Difficulty, Play, Result, Learn, Lesson, Chart
lib/
├── problems/         # 문제 모듈 (곱셈/덧셈/뺄셈) — 새 연산 추가는 여기
├── i18n/             # ko/en 메시지
├── progression.ts    # XP / 레벨 / 코인 로직
├── store.ts          # Zustand + persist
├── storage.ts        # IndexedDB (학습 기록 / 약점 추적)
├── sound.ts          # Web Audio 효과음
├── themes.ts         # 우주 / 몬스터 테마
└── visuals.ts        # Numberblocks 색상 팔레트
scripts/              # serve.sh, plist
```

## 새 연산 추가하기

`lib/problems/types.ts`의 `ProblemModule` 인터페이스를 구현하고 `lib/problems/index.ts`의 레지스트리에 등록하면 됩니다. 게임/테마/진행 시스템과 자동 통합.
