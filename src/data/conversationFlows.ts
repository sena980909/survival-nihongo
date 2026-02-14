// 각 시나리오의 대화 흐름 (OpenAI API 없이 로컬에서 동작)

export interface ConversationChoice {
  text: string;
  textKo: string;
  textPronunciation: string;
  quality: "best" | "acceptable" | "poor";
  correction: {
    wasCorrect: boolean;
    explanation: string;
    betterExpression?: string;
    betterExpressionKo?: string;
    betterExpressionPronunciation?: string;
    grammarPoint?: string;
  };
}

export interface KanjiNoteData {
  kanji: string;
  reading: string;
  pronunciation: string;
  meaning: string;
  explanation: string;
}

export interface ConversationNode {
  id: string;
  npcMessage: string;
  npcMessageKo: string;
  npcMessagePronunciation: string;
  npcEmotion: "neutral" | "happy" | "confused" | "encouraging";
  choices: ConversationChoice[];
  kanjiNote?: KanjiNoteData;
  isLast?: boolean;
}

export type ConversationFlow = ConversationNode[];

// ===== 입국심사 =====
const airportImmigration: ConversationFlow = [
  {
    id: "imm-1",
    npcMessage: "パスポートを見せてください。",
    npcMessageKo: "여권을 보여주세요.",
    npcMessagePronunciation: "파스포-토오 미세테쿠다사이",
    npcEmotion: "neutral",
    choices: [
      {
        text: "はい、こちらです。",
        textKo: "네, 여기 있습니다.",
        textPronunciation: "하이, 코치라데스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "아주 좋아요! 'こちらです'는 공손하게 물건을 건넬 때 사용하는 표현입니다.",
          grammarPoint: "'こちら'는 'これ(이것)'의 정중한 표현이에요.",
        },
      },
      {
        text: "うん、これ。",
        textKo: "응, 이거.",
        textPronunciation: "웅, 코레",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "'うん'은 친구 사이에서 쓰는 반말이에요. 공식적인 상황에서는 'はい'를 사용해야 합니다.",
          betterExpression: "はい、こちらです。",
          betterExpressionKo: "네, 여기 있습니다.",
          betterExpressionPronunciation: "하이, 코치라데스",
          grammarPoint: "공식적인 장소에서는 'うん' 대신 'はい'를 사용하세요.",
        },
      },
      {
        text: "はい、どうぞ。",
        textKo: "네, 여기요.",
        textPronunciation: "하이, 도-조",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "괜찮은 표현이에요! 'どうぞ'는 '여기요, 받으세요'라는 뜻입니다. 'こちらです'가 더 자연스러워요.",
          betterExpression: "はい、こちらです。",
          betterExpressionKo: "네, 여기 있습니다.",
          betterExpressionPronunciation: "하이, 코치라데스",
          grammarPoint: "'どうぞ'는 무언가를 권할 때 쓰는 표현이에요.",
        },
      },
    ],
  },
  {
    id: "imm-2",
    npcMessage: "旅行の目的は何ですか？",
    npcMessageKo: "여행의 목적은 무엇인가요?",
    npcMessagePronunciation: "료코-노 모쿠테키와 난데스카?",
    npcEmotion: "neutral",
    choices: [
      {
        text: "観光です。",
        textKo: "관광입니다.",
        textPronunciation: "캉코-데스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! '観光です'는 입국심사에서 관광 목적을 밝히는 정석 표현입니다.",
          grammarPoint: "'〇〇です'는 '〇〇입니다'라는 정중한 서술 표현이에요.",
        },
      },
      {
        text: "遊びに来ました。",
        textKo: "놀러 왔습니다.",
        textPronunciation: "아소비니 키마시타",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "의미는 통하지만, 입국심사에서는 '観光です'가 더 공식적이고 자연스러워요.",
          betterExpression: "観光です。",
          betterExpressionKo: "관광입니다.",
          betterExpressionPronunciation: "캉코-데스",
          grammarPoint: "'遊びに来ました'는 친구에게 쓰는 캐주얼한 표현이에요.",
        },
      },
      {
        text: "ただ来ました。",
        textKo: "그냥 왔습니다.",
        textPronunciation: "타다 키마시타",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "'그냥 왔습니다'는 입국심사에서 적절하지 않아요. 목적을 명확히 말해야 합니다.",
          betterExpression: "観光です。",
          betterExpressionKo: "관광입니다.",
          betterExpressionPronunciation: "캉코-데스",
          grammarPoint: "입국심사에서는 목적을 명확히 '観光(관광)', '仕事(일)', '留学(유학)' 등으로 답해야 해요.",
        },
      },
    ],
    kanjiNote: {
      kanji: "観光",
      reading: "かんこう",
      pronunciation: "캉코-",
      meaning: "관광",
      explanation: "観(볼 관) + 光(빛 광) — 경치를 보고 즐기는 여행",
    },
  },
  {
    id: "imm-3",
    npcMessage: "何日間滞在しますか？",
    npcMessageKo: "며칠간 체류합니까?",
    npcMessagePronunciation: "난니치캉 타이자이시마스카?",
    npcEmotion: "neutral",
    choices: [
      {
        text: "五日間です。",
        textKo: "5일간입니다.",
        textPronunciation: "이츠카캉데스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "정확해요! '五日間(いつかかん)'은 5일간이라는 뜻입니다.",
          grammarPoint: "일본어 날짜 세기: 1日(이치니치), 2日(후츠카), 3日(밋카), 4日(욧카), 5日(이츠카)",
        },
      },
      {
        text: "五日。",
        textKo: "5일.",
        textPronunciation: "이츠카",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "통하긴 하지만, '〜間です'를 붙이면 더 정중하고 자연스러워요.",
          betterExpression: "五日間です。",
          betterExpressionKo: "5일간입니다.",
          betterExpressionPronunciation: "이츠카캉데스",
          grammarPoint: "'〜間(캉)'은 '〜동안'이라는 기간을 나타내는 표현이에요.",
        },
      },
      {
        text: "わかりません。",
        textKo: "모르겠습니다.",
        textPronunciation: "와카리마셍",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "입국심사에서 체류 기간을 모른다고 하면 의심받을 수 있어요! 미리 준비해두세요.",
          betterExpression: "五日間です。",
          betterExpressionKo: "5일간입니다.",
          betterExpressionPronunciation: "이츠카캉데스",
          grammarPoint: "체류 기간은 반드시 미리 정해두고 답할 수 있어야 해요.",
        },
      },
    ],
    kanjiNote: {
      kanji: "滞在",
      reading: "たいざい",
      pronunciation: "타이자이",
      meaning: "체류",
      explanation: "滞(머무를 체) + 在(있을 재) — 일정 기간 머무는 것",
    },
  },
  {
    id: "imm-4",
    npcMessage: "どこに泊まりますか？",
    npcMessageKo: "어디에 묵으시나요?",
    npcMessagePronunciation: "도코니 토마리마스카?",
    npcEmotion: "neutral",
    choices: [
      {
        text: "新宿のホテルに泊まります。",
        textKo: "신주쿠 호텔에 묵습니다.",
        textPronunciation: "신주쿠노 호테루니 토마리마스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! 장소 + 'に泊まります'는 숙소를 알려주는 정확한 표현입니다.",
          grammarPoint: "'〇〇に泊まります'는 '〇〇에 묵습니다'라는 뜻이에요. 'に'는 장소를 나타내는 조사입니다.",
        },
      },
      {
        text: "ホテルです。",
        textKo: "호텔입니다.",
        textPronunciation: "호테루데스",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "통하지만, 구체적인 지역명을 넣으면 더 좋아요.",
          betterExpression: "新宿のホテルに泊まります。",
          betterExpressionKo: "신주쿠 호텔에 묵습니다.",
          betterExpressionPronunciation: "신주쿠노 호테루니 토마리마스",
          grammarPoint: "입국심사에서는 구체적인 숙소 이름이나 지역을 말하면 원활해요.",
        },
      },
      {
        text: "まだ決めていません。",
        textKo: "아직 정하지 않았습니다.",
        textPronunciation: "마다 키메테이마셍",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "숙소가 정해지지 않았다고 하면 심사관이 의심할 수 있어요. 미리 숙소를 준비해두세요!",
          betterExpression: "新宿のホテルに泊まります。",
          betterExpressionKo: "신주쿠 호텔에 묵습니다.",
          betterExpressionPronunciation: "신주쿠노 호테루니 토마리마스",
          grammarPoint: "'泊まる(토마루)'는 '묵다/숙박하다'라는 뜻이에요.",
        },
      },
    ],
  },
  {
    id: "imm-5",
    npcMessage: "はい、問題ありません。日本を楽しんでください。",
    npcMessageKo: "네, 문제없습니다. 일본을 즐겨주세요.",
    npcMessagePronunciation: "하이, 몬다이 아리마셍. 니혼오 타노신데쿠다사이.",
    npcEmotion: "happy",
    isLast: true,
    choices: [
      {
        text: "ありがとうございます。",
        textKo: "감사합니다.",
        textPronunciation: "아리가또고자이마스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! 'ありがとうございます'는 가장 정중한 감사 인사입니다.",
          grammarPoint: "'ありがとう'만 쓰면 반말, 'ございます'를 붙이면 존댓말이에요.",
        },
      },
      {
        text: "はい、ありがとう。",
        textKo: "네, 고마워요.",
        textPronunciation: "하이, 아리가또",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "괜찮지만, 공식적인 자리에서는 'ございます'를 붙이는 게 더 예의 바릅니다.",
          betterExpression: "ありがとうございます。",
          betterExpressionKo: "감사합니다.",
          betterExpressionPronunciation: "아리가또고자이마스",
          grammarPoint: "'ありがとう'는 반말, 'ありがとうございます'는 존댓말이에요.",
        },
      },
      {
        text: "うん。",
        textKo: "응.",
        textPronunciation: "웅",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "'うん'만 하면 무례하게 느껴져요. 감사 인사를 전하는 것이 예의입니다.",
          betterExpression: "ありがとうございます。",
          betterExpressionKo: "감사합니다.",
          betterExpressionPronunciation: "아리가또고자이마스",
          grammarPoint: "도움을 받으면 반드시 감사 인사를 해요. 일본에서는 예의가 매우 중요합니다!",
        },
      },
    ],
  },
];

// ===== 편의점 =====
const convenienceStore: ConversationFlow = [
  {
    id: "conv-1",
    npcMessage: "いらっしゃいませ！",
    npcMessageKo: "어서 오세요!",
    npcMessagePronunciation: "이랏샤이마세!",
    npcEmotion: "happy",
    choices: [
      {
        text: "すみません、このお弁当をお願いします。",
        textKo: "실례합니다, 이 도시락 부탁합니다.",
        textPronunciation: "스미마셍, 코노 오벤또-오 오네가이시마스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "아주 자연스러워요! 'お願いします'를 붙이면 정중한 요청이 됩니다.",
          grammarPoint: "'すみません'은 '실례합니다/저기요'라는 뜻으로 말을 걸 때 사용해요.",
        },
      },
      {
        text: "これ。",
        textKo: "이거.",
        textPronunciation: "코레",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "'これ'만 하면 너무 무뚝뚝해요. 'お願いします'를 붙여야 합니다.",
          betterExpression: "これ、お願いします。",
          betterExpressionKo: "이거 부탁합니다.",
          betterExpressionPronunciation: "코레, 오네가이시마스",
          grammarPoint: "가게에서 물건을 살 때는 'お願いします(부탁합니다)'를 붙이세요.",
        },
      },
      {
        text: "このお弁当をください。",
        textKo: "이 도시락을 주세요.",
        textPronunciation: "코노 오벤또-오 쿠다사이",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "좋아요! 'ください'도 괜찮지만, 'お願いします'가 더 부드러운 느낌이에요.",
          betterExpression: "このお弁当をお願いします。",
          betterExpressionKo: "이 도시락 부탁합니다.",
          betterExpressionPronunciation: "코노 오벤또-오 오네가이시마스",
          grammarPoint: "'ください'는 '주세요', 'お願いします'는 '부탁합니다' — 둘 다 정중하지만 뉘앙스가 달라요.",
        },
      },
    ],
  },
  {
    id: "conv-2",
    npcMessage: "温めますか？",
    npcMessageKo: "데울까요?",
    npcMessagePronunciation: "아타타메마스카?",
    npcEmotion: "neutral",
    choices: [
      {
        text: "はい、お願いします。",
        textKo: "네, 부탁합니다.",
        textPronunciation: "하이, 오네가이시마스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! 편의점에서 도시락을 데워달라고 할 때 가장 자연스러운 표현이에요.",
          grammarPoint: "'はい、お願いします'는 어떤 서비스를 요청할 때 만능으로 쓸 수 있는 표현이에요.",
        },
      },
      {
        text: "温めてください。",
        textKo: "데워주세요.",
        textPronunciation: "아타타메테쿠다사이",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "의미는 통하지만, 점원이 먼저 물어봤으니 'はい、お願いします'가 더 자연스러워요.",
          betterExpression: "はい、お願いします。",
          betterExpressionKo: "네, 부탁합니다.",
          betterExpressionPronunciation: "하이, 오네가이시마스",
          grammarPoint: "상대방이 먼저 물어봤을 때는 간단히 'はい/いいえ'로 대답하는 게 자연스러워요.",
        },
      },
      {
        text: "何ですか？",
        textKo: "뭐라고요?",
        textPronunciation: "난데스카?",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "'温めますか？'는 '데울까요?'라는 뜻이에요. 편의점에서 자주 듣는 표현이니 기억해두세요!",
          betterExpression: "はい、お願いします。",
          betterExpressionKo: "네, 부탁합니다.",
          betterExpressionPronunciation: "하이, 오네가이시마스",
          grammarPoint: "'温める(아타타메루)'는 '데우다'라는 뜻이에요. 편의점 필수 표현!",
        },
      },
    ],
    kanjiNote: {
      kanji: "温める",
      reading: "あたためる",
      pronunciation: "아타타메루",
      meaning: "데우다",
      explanation: "温(따뜻할 온) — 전자레인지로 음식을 데울 때 사용",
    },
  },
  {
    id: "conv-3",
    npcMessage: "袋はご利用ですか？有料になりますが。",
    npcMessageKo: "봉투 사용하시겠어요? 유료입니다만.",
    npcMessagePronunciation: "후쿠로와 고리요-데스카? 유-료-니 나리마스가.",
    npcEmotion: "neutral",
    choices: [
      {
        text: "いいえ、大丈夫です。",
        textKo: "아니요, 괜찮습니다.",
        textPronunciation: "이-에, 다이죠-부데스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "자연스러워요! '大丈夫です'는 거절할 때 부드럽게 쓸 수 있는 만능 표현이에요.",
          grammarPoint: "'大丈夫です(다이죠-부데스)'는 '괜찮습니다'라는 뜻으로, 부드러운 거절에 자주 사용해요.",
        },
      },
      {
        text: "袋をお願いします。",
        textKo: "봉투 부탁합니다.",
        textPronunciation: "후쿠로오 오네가이시마스",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "봉투가 필요하면 이렇게 말하면 돼요! 자연스러운 표현입니다.",
          grammarPoint: "'袋(후쿠로)'는 '봉투'라는 뜻이에요. 일본 편의점은 봉투가 유료(3~5엔)예요.",
        },
      },
      {
        text: "いらない。",
        textKo: "필요 없어.",
        textPronunciation: "이라나이",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "'いらない'는 반말이에요. 가게에서는 'いらないです' 또는 '大丈夫です'를 사용하세요.",
          betterExpression: "いいえ、大丈夫です。",
          betterExpressionKo: "아니요, 괜찮습니다.",
          betterExpressionPronunciation: "이-에, 다이죠-부데스",
          grammarPoint: "'いらない'에 'です'를 붙이면 정중한 거절이 됩니다.",
        },
      },
    ],
    kanjiNote: {
      kanji: "袋",
      reading: "ふくろ",
      pronunciation: "후쿠로",
      meaning: "봉투",
      explanation: "일본 편의점에서는 2020년부터 비닐봉투가 유료화되었어요 (약 3~5엔)",
    },
  },
  {
    id: "conv-4",
    npcMessage: "お支払いはどうなさいますか？",
    npcMessageKo: "결제는 어떻게 하시겠어요?",
    npcMessagePronunciation: "오시하라이와 도-나사이마스카?",
    npcEmotion: "neutral",
    choices: [
      {
        text: "カードでお願いします。",
        textKo: "카드로 부탁합니다.",
        textPronunciation: "카-도데 오네가이시마스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! 결제 수단을 말할 때 '〇〇でお願いします'가 정석이에요.",
          grammarPoint: "'で'는 수단/방법을 나타내는 조사예요. '카드로', '현금으로' 등.",
        },
      },
      {
        text: "現金で。",
        textKo: "현금으로.",
        textPronunciation: "겡킹데",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "통하지만, 'お願いします'를 붙이면 더 정중해요.",
          betterExpression: "現金でお願いします。",
          betterExpressionKo: "현금으로 부탁합니다.",
          betterExpressionPronunciation: "겡킹데 오네가이시마스",
          grammarPoint: "'現金(겡킹)'은 '현금'이라는 뜻이에요.",
        },
      },
      {
        text: "えっと... お金...?",
        textKo: "음... 돈...?",
        textPronunciation: "엣또... 오카네...?",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "결제 수단을 명확히 말해야 해요. 'カード(카드)', '現金(현금)', '〇〇ペイ(페이)' 중 선택!",
          betterExpression: "カードでお願いします。",
          betterExpressionKo: "카드로 부탁합니다.",
          betterExpressionPronunciation: "카-도데 오네가이시마스",
          grammarPoint: "일본 편의점 결제 수단: 現金(현금), カード(카드), 交通系IC(교통카드), 〇〇ペイ(QR결제)",
        },
      },
    ],
    kanjiNote: {
      kanji: "現金",
      reading: "げんきん",
      pronunciation: "겡킹",
      meaning: "현금",
      explanation: "現(나타날 현) + 金(돈 금) — 지폐와 동전을 의미",
    },
  },
  {
    id: "conv-5",
    npcMessage: "ありがとうございました！またお越しくださいませ。",
    npcMessageKo: "감사합니다! 또 오세요.",
    npcMessagePronunciation: "아리가또고자이마시타! 마타 오코시쿠다사이마세.",
    npcEmotion: "happy",
    isLast: true,
    choices: [
      {
        text: "ありがとうございます。",
        textKo: "감사합니다.",
        textPronunciation: "아리가또고자이마스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "자연스러워요! 일본에서는 가게를 나갈 때도 감사 인사를 하는 것이 일반적이에요.",
          grammarPoint: "'ありがとうございます'는 현재형, 'ありがとうございました'는 과거형이에요. 둘 다 가능!",
        },
      },
      {
        text: "どうも。",
        textKo: "고마워요.",
        textPronunciation: "도-모",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "'どうも'는 가볍게 쓸 수 있는 감사 표현이에요. 편의점에서는 충분해요!",
          grammarPoint: "'どうも'는 'ありがとう'의 축약형이에요. 친근한 느낌!",
        },
      },
      {
        text: "...",
        textKo: "(아무 말 없이 나가기)",
        textPronunciation: "...",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "일본에서는 가게를 나갈 때 가벼운 인사를 하는 것이 예의예요.",
          betterExpression: "ありがとうございます。",
          betterExpressionKo: "감사합니다.",
          betterExpressionPronunciation: "아리가또고자이마스",
          grammarPoint: "가게에서 나올 때 짧게라도 'どうも' 정도는 말하는 것이 좋아요.",
        },
      },
    ],
  },
];

// ===== 이자카야 =====
const izakaya: ConversationFlow = [
  {
    id: "iza-1",
    npcMessage: "いらっしゃい！何名様ですか？",
    npcMessageKo: "어서 오세요! 몇 분이세요?",
    npcMessagePronunciation: "이랏샤이! 난메-사마데스카?",
    npcEmotion: "happy",
    choices: [
      {
        text: "二人です。",
        textKo: "두 명입니다.",
        textPronunciation: "후타리데스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! '二人(ふたり)'는 두 사람을 셀 때 사용하는 표현이에요.",
          grammarPoint: "사람 세기: 一人(히토리/1명), 二人(후타리/2명), 三人(산닝/3명), 四人(요닝/4명)",
        },
      },
      {
        text: "二名です。",
        textKo: "2명입니다.",
        textPronunciation: "니메-데스",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "'二名(にめい)'도 정확해요! 더 격식 있는 표현이에요. 이자카야에서는 '二人'가 더 자연스러워요.",
          grammarPoint: "'名(메-)'는 사람을 세는 격식 표현, '人(리/닝)'는 일반 표현이에요.",
        },
      },
      {
        text: "二つ。",
        textKo: "두 개.",
        textPronunciation: "후타츠",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "'二つ(후타츠)'는 물건을 셀 때 쓰는 표현이에요. 사람은 '二人(후타리)'라고 해야 해요!",
          betterExpression: "二人です。",
          betterExpressionKo: "두 명입니다.",
          betterExpressionPronunciation: "후타리데스",
          grammarPoint: "사람은 '人(닝/리)', 물건은 'つ(츠)'로 세요. 완전히 다른 조수사에요!",
        },
      },
    ],
  },
  {
    id: "iza-2",
    npcMessage: "お飲み物はいかがですか？",
    npcMessageKo: "음료는 어떻게 하시겠어요?",
    npcMessagePronunciation: "오노미모노와 이카가데스카?",
    npcEmotion: "encouraging",
    choices: [
      {
        text: "生ビールを二つください。",
        textKo: "생맥주 두 잔 주세요.",
        textPronunciation: "나마비-루오 후타츠 쿠다사이",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! 이자카야에서 생맥주 주문하기 성공이에요!",
          grammarPoint: "'生ビール(나마비-루)'는 '생맥주', 음료/물건은 'つ(츠)'로 세요.",
        },
      },
      {
        text: "ビールをお願いします。",
        textKo: "맥주 부탁합니다.",
        textPronunciation: "비-루오 오네가이시마스",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "좋아요! 하지만 수량을 말하면 더 정확해요. '生ビール'이라고 하면 생맥주를 받을 수 있어요.",
          betterExpression: "生ビールを二つください。",
          betterExpressionKo: "생맥주 두 잔 주세요.",
          betterExpressionPronunciation: "나마비-루오 후타츠 쿠다사이",
          grammarPoint: "수량 + ください: 一つ(히토츠/1개), 二つ(후타츠/2개), 三つ(밋츠/3개)",
        },
      },
      {
        text: "水。",
        textKo: "물.",
        textPronunciation: "미즈",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "물도 괜찮지만, 반말이에요! 'お水をください'로 정중하게 요청하세요.",
          betterExpression: "お水をください。",
          betterExpressionKo: "물 주세요.",
          betterExpressionPronunciation: "오미즈오 쿠다사이",
          grammarPoint: "'お水(오미즈)'는 '물'의 정중한 표현이에요. 'お'를 붙이면 정중해져요.",
        },
      },
    ],
    kanjiNote: {
      kanji: "生ビール",
      reading: "なまビール",
      pronunciation: "나마비-루",
      meaning: "생맥주",
      explanation: "生(날 생) — '생(가공하지 않은)'이라는 의미. 생맥주는 일본 이자카야의 기본!",
    },
  },
  {
    id: "iza-3",
    npcMessage: "おすすめは焼き鳥と刺身ですよ！今日の刺身は新鮮で美味しいですよ。",
    npcMessageKo: "추천은 닭꼬치와 회에요! 오늘 회는 신선하고 맛있어요.",
    npcMessagePronunciation: "오스스메와 야키토리토 사시미데스요! 쿄-노 사시미와 신센데 오이시-데스요.",
    npcEmotion: "happy",
    choices: [
      {
        text: "じゃあ、焼き鳥と刺身をお願いします。",
        textKo: "그러면 닭꼬치와 회 부탁합니다.",
        textPronunciation: "쟈-, 야키토리토 사시미오 오네가이시마스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "자연스러워요! 'じゃあ'로 추천을 받아들이고, 주문까지 완벽해요.",
          grammarPoint: "'じゃあ(쟈-)'는 '그러면'이라는 뜻으로, 자연스러운 연결어예요.",
        },
      },
      {
        text: "おすすめは何ですか？",
        textKo: "추천은 뭐예요?",
        textPronunciation: "오스스메와 난데스카?",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "추천을 물어보는 좋은 표현이에요! 다만 이미 추천해줬으니 주문으로 넘어가면 좋겠어요.",
          grammarPoint: "'おすすめは何ですか'는 이자카야에서 가장 많이 쓰는 표현 중 하나에요!",
        },
      },
      {
        text: "いらない。",
        textKo: "필요 없어.",
        textPronunciation: "이라나이",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "점원의 추천을 반말로 거절하면 실례예요. '結構です(켓코-데스)'를 사용하세요.",
          betterExpression: "結構です。他のメニューを見てもいいですか？",
          betterExpressionKo: "괜찮습니다. 다른 메뉴를 봐도 될까요?",
          betterExpressionPronunciation: "켓코-데스. 호카노 메뉴-오 미테모 이-데스카?",
          grammarPoint: "'結構です(켓코-데스)'는 정중한 거절 표현이에요.",
        },
      },
    ],
    kanjiNote: {
      kanji: "焼き鳥",
      reading: "やきとり",
      pronunciation: "야키토리",
      meaning: "닭꼬치",
      explanation: "焼(구울 소) + 鳥(새 조) — 꼬치에 꿴 닭고기를 숯불에 구운 요리",
    },
  },
  {
    id: "iza-4",
    npcMessage: "かしこまりました！少々お待ちください。",
    npcMessageKo: "알겠습니다! 잠시만 기다려주세요.",
    npcMessagePronunciation: "카시코마리마시타! 쇼-쇼- 오마치쿠다사이.",
    npcEmotion: "happy",
    isLast: true,
    choices: [
      {
        text: "はい、お願いします。",
        textKo: "네, 부탁합니다.",
        textPronunciation: "하이, 오네가이시마스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "자연스러워요! 주문 후 확인으로 완벽한 표현이에요.",
          grammarPoint: "'かしこまりました'는 '알겠습니다'의 매우 정중한 표현이에요. 가게 직원이 자주 사용해요.",
        },
      },
      {
        text: "ありがとうございます。",
        textKo: "감사합니다.",
        textPronunciation: "아리가또고자이마스",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "감사 인사도 좋아요! 'はい、お願いします'와 함께 쓰면 더 자연스러워요.",
          grammarPoint: "주문 후에는 'お願いします'로 확인하는 것이 가장 자연스러운 흐름이에요.",
        },
      },
      {
        text: "早くして。",
        textKo: "빨리 해줘.",
        textPronunciation: "하야쿠시테",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "'早くして'는 '빨리 해'라는 반말이에요. 절대 가게에서 쓰면 안 됩니다!",
          betterExpression: "はい、お願いします。",
          betterExpressionKo: "네, 부탁합니다.",
          betterExpressionPronunciation: "하이, 오네가이시마스",
          grammarPoint: "일본에서 음식을 재촉하는 것은 매우 실례예요. 기다리는 것도 문화의 일부!",
        },
      },
    ],
  },
];

// ===== 길 묻기 =====
const askingDirections: ConversationFlow = [
  {
    id: "dir-1",
    npcMessage: "はい？",
    npcMessageKo: "네?",
    npcMessagePronunciation: "하이?",
    npcEmotion: "neutral",
    choices: [
      {
        text: "すみません、スカイツリーはどこですか？",
        textKo: "실례합니다, 스카이트리는 어디인가요?",
        textPronunciation: "스미마셍, 스카이츠리-와 도코데스카?",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! 'すみません'으로 시작하고 '〇〇はどこですか'로 장소를 물어보는 정석이에요.",
          grammarPoint: "'〇〇はどこですか'는 '〇〇는 어디인가요?'라는 기본 길 묻기 표현이에요.",
        },
      },
      {
        text: "スカイツリーへの行き方を教えてください。",
        textKo: "스카이트리 가는 길을 알려주세요.",
        textPronunciation: "스카이츠리-에노 이키카타오 오시에테쿠다사이",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "아주 정중한 표현이에요! 다만 조금 길어서 'どこですか'가 더 실용적이에요.",
          grammarPoint: "'行き方(이키카타)'는 '가는 방법'이라는 뜻. '方(카타)'는 방법을 뜻해요.",
        },
      },
      {
        text: "ねえ、スカイツリーどっち？",
        textKo: "저기, 스카이트리 어느 쪽?",
        textPronunciation: "네-, 스카이츠리- 돗치?",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "'ねえ'는 친구에게 쓰는 말이에요. 모르는 사람에게는 'すみません'으로 시작하세요!",
          betterExpression: "すみません、スカイツリーはどこですか？",
          betterExpressionKo: "실례합니다, 스카이트리는 어디인가요?",
          betterExpressionPronunciation: "스미마셍, 스카이츠리-와 도코데스카?",
          grammarPoint: "모르는 사람에게 말을 걸 때는 반드시 'すみません'으로 시작하세요.",
        },
      },
    ],
  },
  {
    id: "dir-2",
    npcMessage: "ああ、スカイツリーですね。この道をまっすぐ行って、二つ目の交差点を右に曲がってください。",
    npcMessageKo: "아, 스카이트리요. 이 길을 쭉 가서 두 번째 교차로에서 오른쪽으로 도세요.",
    npcMessagePronunciation: "아-, 스카이츠리-데스네. 코노 미치오 맛스구 잇테, 후타츠메노 코-사텡오 미기니 마갓테쿠다사이.",
    npcEmotion: "encouraging",
    choices: [
      {
        text: "右に曲がるんですね？",
        textKo: "오른쪽으로 도는 거죠?",
        textPronunciation: "미기니 마가룬데스네?",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! 방향을 확인하는 아주 자연스러운 표현이에요.",
          grammarPoint: "'〜んですね'는 상대방의 말을 확인할 때 쓰는 표현이에요. '〜는 거죠?'",
        },
      },
      {
        text: "わかりました。ありがとうございます。",
        textKo: "알겠습니다. 감사합니다.",
        textPronunciation: "와카리마시타. 아리가또고자이마스.",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "좋아요! 다만 방향을 확인하고 나서 감사 인사를 하면 더 안전해요.",
          betterExpression: "右に曲がるんですね？ありがとうございます。",
          betterExpressionKo: "오른쪽으로 도는 거죠? 감사합니다.",
          betterExpressionPronunciation: "미기니 마가룬데스네? 아리가또고자이마스.",
          grammarPoint: "방향을 복기(확인)하면 길을 잘못 갈 확률이 줄어요!",
        },
      },
      {
        text: "え？もう一回言ってください。",
        textKo: "네? 한 번 더 말해주세요.",
        textPronunciation: "에? 모-잇카이 잇테쿠다사이.",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "다시 말해달라고 요청하는 것 자체는 괜찮지만, 핵심을 확인하는 것이 더 효율적이에요.",
          betterExpression: "右に曲がるんですね？",
          betterExpressionKo: "오른쪽으로 도는 거죠?",
          betterExpressionPronunciation: "미기니 마가룬데스네?",
          grammarPoint: "'もう一回(모-잇카이)'는 '한 번 더'라는 뜻이에요. 'もう一度(모-이치도)'와 같아요.",
        },
      },
    ],
    kanjiNote: {
      kanji: "交差点",
      reading: "こうさてん",
      pronunciation: "코-사텡",
      meaning: "교차로",
      explanation: "交(사귈 교) + 差(다를 차) + 点(점 점) — 길이 교차하는 지점",
    },
  },
  {
    id: "dir-3",
    npcMessage: "そうです！歩いて10分くらいですよ。頑張ってね！",
    npcMessageKo: "맞아요! 걸어서 10분 정도예요. 힘내세요!",
    npcMessagePronunciation: "소-데스! 아루이테 쥿풍쿠라이데스요. 감밧테네!",
    npcEmotion: "happy",
    isLast: true,
    choices: [
      {
        text: "ありがとうございます！助かりました。",
        textKo: "감사합니다! 도움이 되었어요.",
        textPronunciation: "아리가또고자이마스! 타스카리마시타.",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! '助かりました'는 '도움이 되었습니다'라는 감사의 표현이에요.",
          grammarPoint: "'助かる(타스카루)'는 '도움이 되다/살았다'라는 뜻이에요. 도움을 받았을 때 자주 써요.",
        },
      },
      {
        text: "ありがとう！",
        textKo: "고마워요!",
        textPronunciation: "아리가또!",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "친근한 감사 표현이에요! 행인이 친절했으니 충분해요.",
          grammarPoint: "반말인 'ありがとう'도 친절한 행인에게는 자연스러울 수 있어요.",
        },
      },
      {
        text: "...",
        textKo: "(그냥 가기)",
        textPronunciation: "...",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "도움을 받으면 꼭 감사 인사를 해야 해요!",
          betterExpression: "ありがとうございます！",
          betterExpressionKo: "감사합니다!",
          betterExpressionPronunciation: "아리가또고자이마스!",
          grammarPoint: "일본에서는 도움을 받은 후 감사 인사를 하지 않으면 매우 무례하게 여겨져요.",
        },
      },
    ],
  },
];

// ===== 택시 =====
const taxiRide: ConversationFlow = [
  {
    id: "taxi-1",
    npcMessage: "どちらまで？",
    npcMessageKo: "어디까지 가시나요?",
    npcMessagePronunciation: "도치라마데?",
    npcEmotion: "neutral",
    choices: [
      {
        text: "東京タワーまでお願いします。",
        textKo: "도쿄타워까지 부탁합니다.",
        textPronunciation: "토-쿄-타와-마데 오네가이시마스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! '〇〇までお願いします'는 택시에서 목적지를 말하는 정석이에요.",
          grammarPoint: "'まで'는 '~까지'라는 도착점을 나타내는 조사예요.",
        },
      },
      {
        text: "東京タワー。",
        textKo: "도쿄타워.",
        textPronunciation: "토-쿄-타와-",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "통하지만, 'までお願いします'를 붙이면 더 정중해요.",
          betterExpression: "東京タワーまでお願いします。",
          betterExpressionKo: "도쿄타워까지 부탁합니다.",
          betterExpressionPronunciation: "토-쿄-타와-마데 오네가이시마스",
          grammarPoint: "택시에서는 '〇〇までお願いします'가 기본 패턴이에요.",
        },
      },
      {
        text: "あの... どこか有名な所...",
        textKo: "저... 어디 유명한 곳...",
        textPronunciation: "아노... 도코카 유-메-나 토코로...",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "목적지를 정확히 말해야 해요. 택시 기사는 구체적인 장소명이 필요합니다.",
          betterExpression: "東京タワーまでお願いします。",
          betterExpressionKo: "도쿄타워까지 부탁합니다.",
          betterExpressionPronunciation: "토-쿄-타와-마데 오네가이시마스",
          grammarPoint: "택시를 탈 때는 미리 목적지 이름을 일본어로 준비해두세요!",
        },
      },
    ],
  },
  {
    id: "taxi-2",
    npcMessage: "東京タワーですね。かしこまりました。少し渋滞していますが、大丈夫ですか？",
    npcMessageKo: "도쿄타워요. 알겠습니다. 좀 막히는데 괜찮으세요?",
    npcMessagePronunciation: "토-쿄-타와-데스네. 카시코마리마시타. 스코시 쥬-타이시테이마스가, 다이죠-부데스카?",
    npcEmotion: "neutral",
    choices: [
      {
        text: "はい、大丈夫です。",
        textKo: "네, 괜찮습니다.",
        textPronunciation: "하이, 다이죠-부데스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "자연스러워요! '大丈夫です'는 만능 긍정 응답이에요.",
          grammarPoint: "'渋滞(쥬-타이)'는 '교통체증'이라는 뜻이에요. 택시에서 자주 듣는 단어!",
        },
      },
      {
        text: "急いでください。",
        textKo: "서둘러 주세요.",
        textPronunciation: "이소이데쿠다사이",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "의미는 통하지만, 일본에서 택시 기사에게 서두르라고 하면 약간 실례일 수 있어요.",
          betterExpression: "はい、大丈夫です。",
          betterExpressionKo: "네, 괜찮습니다.",
          betterExpressionPronunciation: "하이, 다이죠-부데스",
          grammarPoint: "일본 택시 기사는 안전운전을 최우선으로 해요. 서두르라는 말은 피하는 게 좋아요.",
        },
      },
      {
        text: "えー、遅いですね。",
        textKo: "에-, 느리네요.",
        textPronunciation: "에-, 오소이데스네",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "기사에게 느리다고 하면 실례예요! 교통체증은 기사 탓이 아니에요.",
          betterExpression: "はい、大丈夫です。",
          betterExpressionKo: "네, 괜찮습니다.",
          betterExpressionPronunciation: "하이, 다이죠-부데스",
          grammarPoint: "택시에서는 기사에게 불만을 표현하는 것보다 이해하는 태도가 좋아요.",
        },
      },
    ],
    kanjiNote: {
      kanji: "渋滞",
      reading: "じゅうたい",
      pronunciation: "쥬-타이",
      meaning: "교통체증",
      explanation: "渋(떫을 삽) + 滞(머무를 체) — 차가 막혀서 나아가지 못하는 상태",
    },
  },
  {
    id: "taxi-3",
    npcMessage: "着きましたよ。料金は1,500円になります。",
    npcMessageKo: "도착했습니다. 요금은 1,500엔입니다.",
    npcMessagePronunciation: "츠키마시타요. 료-킹와 센고햐쿠엥니 나리마스.",
    npcEmotion: "happy",
    isLast: true,
    choices: [
      {
        text: "カードでお願いします。ありがとうございました。",
        textKo: "카드로 부탁합니다. 감사했습니다.",
        textPronunciation: "카-도데 오네가이시마스. 아리가또고자이마시타.",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! 결제하고 감사 인사까지 자연스러워요.",
          grammarPoint: "'ありがとうございました'는 과거형 감사예요. 서비스가 끝났을 때 사용해요.",
        },
      },
      {
        text: "はい、ここで大丈夫です。",
        textKo: "네, 여기서 괜찮습니다.",
        textPronunciation: "하이, 코코데 다이죠-부데스",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "내릴 곳을 확인하는 표현은 좋지만, 결제와 감사 인사도 해야 해요!",
          betterExpression: "カードでお願いします。ありがとうございました。",
          betterExpressionKo: "카드로 부탁합니다. 감사했습니다.",
          betterExpressionPronunciation: "카-도데 오네가이시마스. 아리가또고자이마시타.",
          grammarPoint: "택시에서 내릴 때는 결제 + 감사 인사가 세트예요!",
        },
      },
      {
        text: "高い！",
        textKo: "비싸!",
        textPronunciation: "타카이!",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "택시 기사에게 '비싸다'고 하면 매우 실례예요. 미터기 요금은 정해져 있어요.",
          betterExpression: "カードでお願いします。ありがとうございました。",
          betterExpressionKo: "카드로 부탁합니다. 감사했습니다.",
          betterExpressionPronunciation: "카-도데 오네가이시마스. 아리가또고자이마시타.",
          grammarPoint: "일본 택시 요금은 미터기로 정해져요. 흥정은 없고, 팁도 불필요해요.",
        },
      },
    ],
  },
];

// ===== 기차역 =====
const trainStation: ConversationFlow = [
  {
    id: "train-1",
    npcMessage: "はい、いらっしゃいませ。",
    npcMessageKo: "네, 어서 오세요.",
    npcMessagePronunciation: "하이, 이랏샤이마세.",
    npcEmotion: "neutral",
    choices: [
      {
        text: "すみません、渋谷までの切符をください。",
        textKo: "실례합니다, 시부야까지 표 주세요.",
        textPronunciation: "스미마셍, 시부야마데노 킷푸오 쿠다사이",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! '〇〇までの切符をください'는 표를 살 때 쓰는 정석 표현이에요.",
          grammarPoint: "'までの'는 '~까지의'라는 뜻. 'まで(~까지)' + 'の(~의)' 조합이에요.",
        },
      },
      {
        text: "渋谷に行きたいです。",
        textKo: "시부야에 가고 싶습니다.",
        textPronunciation: "시부야니 이키타이데스",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "의미는 통하지만, 창구에서는 직접적으로 '切符をください'가 더 효율적이에요.",
          betterExpression: "渋谷までの切符をください。",
          betterExpressionKo: "시부야까지 표 주세요.",
          betterExpressionPronunciation: "시부야마데노 킷푸오 쿠다사이",
          grammarPoint: "'〜たいです'는 '〜하고 싶습니다'라는 희망 표현이에요.",
        },
      },
      {
        text: "渋谷。",
        textKo: "시부야.",
        textPronunciation: "시부야",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "지명만 말하면 무엇을 원하는지 알 수 없어요. '切符をください'를 붙여야 해요.",
          betterExpression: "渋谷までの切符をください。",
          betterExpressionKo: "시부야까지 표 주세요.",
          betterExpressionPronunciation: "시부야마데노 킷푸오 쿠다사이",
          grammarPoint: "'切符(킷푸)'는 '표/승차권'이라는 뜻이에요.",
        },
      },
    ],
    kanjiNote: {
      kanji: "切符",
      reading: "きっぷ",
      pronunciation: "킷푸",
      meaning: "표 (승차권)",
      explanation: "切(끊을 절) + 符(부호 부) — 원래 종이를 잘라서 만든 표에서 유래",
    },
  },
  {
    id: "train-2",
    npcMessage: "渋谷までですね。片道ですか、往復ですか？",
    npcMessageKo: "시부야까지요. 편도인가요, 왕복인가요?",
    npcMessagePronunciation: "시부야마데데스네. 카타미치데스카, 오-후쿠데스카?",
    npcEmotion: "neutral",
    choices: [
      {
        text: "片道でお願いします。",
        textKo: "편도로 부탁합니다.",
        textPronunciation: "카타미치데 오네가이시마스",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! '片道(카타미치)'는 편도, '往復(오-후쿠)'는 왕복이에요.",
          grammarPoint: "片道(편도) vs 往復(왕복) — 기차/버스 표를 살 때 반드시 아는 단어!",
        },
      },
      {
        text: "往復でお願いします。",
        textKo: "왕복으로 부탁합니다.",
        textPronunciation: "오-후쿠데 오네가이시마스",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "돌아올 계획이 있다면 왕복이 편리해요! 자연스러운 표현이에요.",
          grammarPoint: "'往復(오-후쿠)'는 '왕복'이라는 뜻. 往(갈 왕) + 復(돌아올 복)",
        },
      },
      {
        text: "何ですか、それ？",
        textKo: "그게 뭐예요?",
        textPronunciation: "난데스카, 소레?",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "'片道'는 편도, '往復'는 왕복이에요. 여행에서 꼭 알아야 할 단어입니다!",
          betterExpression: "片道でお願いします。",
          betterExpressionKo: "편도로 부탁합니다.",
          betterExpressionPronunciation: "카타미치데 오네가이시마스",
          grammarPoint: "片道(카타미치/편도), 往復(오-후쿠/왕복) — 교통 필수 단어!",
        },
      },
    ],
  },
  {
    id: "train-3",
    npcMessage: "3番線から出る電車に乗ってください。乗り換えはありません。",
    npcMessageKo: "3번 선에서 출발하는 전철을 타세요. 환승은 없습니다.",
    npcMessagePronunciation: "산방센카라 데루 덴샤니 놋테쿠다사이. 노리카에와 아리마셍.",
    npcEmotion: "encouraging",
    isLast: true,
    choices: [
      {
        text: "3番線ですね。ありがとうございます。",
        textKo: "3번 선이죠. 감사합니다.",
        textPronunciation: "산방센데스네. 아리가또고자이마스.",
        quality: "best",
        correction: {
          wasCorrect: true,
          explanation: "완벽해요! 플랫폼 번호를 확인하고 감사 인사까지 자연스러워요.",
          grammarPoint: "'〇番線(〇방센)'은 '〇번 선(플랫폼)'이라는 뜻이에요.",
        },
      },
      {
        text: "ありがとうございます。",
        textKo: "감사합니다.",
        textPronunciation: "아리가또고자이마스",
        quality: "acceptable",
        correction: {
          wasCorrect: true,
          explanation: "감사 인사 좋아요! 플랫폼 번호도 확인하면 더 안심이에요.",
          grammarPoint: "'乗り換え(노리카에)'는 '환승'이라는 뜻. 직행이면 '乗り換えなし'!",
        },
      },
      {
        text: "はい。",
        textKo: "네.",
        textPronunciation: "하이",
        quality: "poor",
        correction: {
          wasCorrect: false,
          explanation: "'はい'만으로는 아쉬워요. 정보를 확인하고 감사 인사를 하면 좋아요.",
          betterExpression: "3番線ですね。ありがとうございます。",
          betterExpressionKo: "3번 선이죠. 감사합니다.",
          betterExpressionPronunciation: "산방센데스네. 아리가또고자이마스.",
          grammarPoint: "안내를 받으면 핵심 정보를 복기(확인)하는 습관을 들이세요!",
        },
      },
    ],
    kanjiNote: {
      kanji: "乗換",
      reading: "のりかえ",
      pronunciation: "노리카에",
      meaning: "환승",
      explanation: "乗(탈 승) + 換(바꿀 환) — 다른 노선으로 갈아타는 것",
    },
  },
];

// 모든 대화 흐름을 시나리오 ID로 매핑
export const conversationFlows: Record<string, ConversationFlow> = {
  "airport-immigration": airportImmigration,
  "convenience-store": convenienceStore,
  "izakaya": izakaya,
  "asking-directions": askingDirections,
  "taxi-ride": taxiRide,
  "train-station": trainStation,
  // 아래 시나리오는 추후 추가 (현재는 입국심사 대화를 기본으로 사용)
  "restaurant-reservation": airportImmigration,
  "hotel-checkin": airportImmigration,
  "clothing-store": airportImmigration,
  "tourist-spot": airportImmigration,
  "hospital": airportImmigration,
  "pharmacy": airportImmigration,
};
