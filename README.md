# Survival Nihongo (서바이벌 니혼고)

일본 여행 실전 회화 시뮬레이터 — 상황별 대화를 선택지로 연습하며 자연스럽게 일본어를 익히는 웹앱

## 주요 기능

- **16개 실전 시나리오** — 공항 입국심사부터 편의점, 택시, 온천까지 여행에서 만나는 상황
- **선택지 기반 대화** — best / acceptable / poor 3단계 선택지로 자연스럽게 학습
- **교정 피드백** — 선택 직후 문법 해설, 더 자연스러운 표현, 한자 읽기 안내
- **TTS 음성 재생** — OpenAI TTS API로 네이티브 발음 확인 (nova 음성)
- **북마크** — 중요 표현을 저장하고 나중에 복습
- **복습 퀴즈** — 북마크한 표현을 플래시카드로 복습
- **학습 통계** — 연습 횟수, 완료 시나리오, 카테고리별 진행률
- **온보딩** — 첫 사용자를 위한 3페이지 가이드
- **보너스 표현** — 시나리오 완료 후 관련 실용 표현 레퍼런스 제공 (긴급 시나리오)
- **PWA 지원** — 홈 화면 설치, 오프라인 기본 캐싱

## 시나리오 목록

| 카테고리 | 시나리오 | ID |
|---|---|---|
| 공항 | 입국 심사 | `immigration` |
| 공항 | 공항에서 교통편 찾기 | `airport-transport` |
| 교통 | 택시 타기 | `taxi-ride` |
| 교통 | 전철역 이용 | `train-station` |
| 교통 | 길 묻기 | `asking-directions` |
| 교통 | IC카드 충전 | `ic-card` |
| 음식 | 레스토랑 주문 | `restaurant-order` |
| 음식 | 편의점 이용 | `convenience-store` |
| 음식 | 카페 주문 | `cafe-order` |
| 음식 | 이자카야 | `izakaya` |
| 숙소 | 호텔 체크인 | `hotel-checkin` |
| 쇼핑 | 쇼핑 | `shopping` |
| 쇼핑 | 드럭스토어 | `drugstore` |
| 일상 | 화장실 찾기 | `find-restroom` |
| 일상 | 와이파이 연결 | `wifi-connect` |
| 긴급 | 긴급 상황 | `emergency` |

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript, React 19
- **상태 관리**: Zustand 5 (persist middleware, localStorage)
- **스타일링**: Tailwind CSS 4
- **애니메이션**: Framer Motion
- **TTS**: OpenAI TTS API (`tts-1`, nova voice)
- **PWA**: Web App Manifest + Service Worker
- **배포**: Vercel

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts       # (미사용 — 향후 자유입력 모드용)
│   │   └── tts/route.ts        # OpenAI TTS API 프록시
│   ├── globals.css
│   ├── icon.png
│   ├── layout.tsx              # PWA 메타데이터, SW 등록
│   └── page.tsx                # 메인 라우팅 (온보딩/시나리오/대화/퀴즈/통계)
├── components/
│   ├── BookmarkList.tsx        # 북마크 목록
│   ├── ConversationRoom.tsx    # 대화 진행 화면
│   ├── ConversationComplete.tsx # 대화 완료 요약
│   ├── ConversationReview.tsx  # 대화 리뷰
│   ├── CorrectionCard.tsx      # 교정 피드백 카드
│   ├── KanjiCard.tsx           # 한자 학습 카드
│   ├── LearningStats.tsx       # 학습 통계
│   ├── Onboarding.tsx          # 온보딩 슬라이드
│   ├── ProgressDots.tsx        # 진행 인디케이터
│   ├── ReviewQuiz.tsx          # 복습 플래시카드 퀴즈
│   └── ScenarioSelect.tsx      # 시나리오 선택 화면
├── data/
│   ├── scenarios.ts            # 16개 시나리오 메타데이터
│   └── conversationFlows.ts    # 대화 트리 (노드별 선택지, 교정, 한자)
└── store/
    └── learningStore.ts        # Zustand 스토어 (진행상태, 북마크, 통계)
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 환경변수 (.env.local)
OPENAI_API_KEY=sk-...

# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build && npm start
```

`http://localhost:3000`에서 확인.

TTS 기능은 OpenAI API 키가 필요합니다. 키 없이도 대화 연습은 정상 동작합니다.

## 배포

Vercel에 배포되어 있습니다. `git push`하면 자동 배포됩니다.

## 향후 계획

`nextplan.txt` 참고:
1. 직접 입력 모드 (자유 응답 + AI 평가)
2. 분기형 대화 (선택에 따른 NPC 반응 분기)
3. 자동 복습 시스템 (간격 반복)
4. 오프라인 TTS
5. 시각적 몰입감 향상 (픽셀아트 NPC, 배경)

## 라이선스

Private project
