import { StageDialogue } from "../dialogue";

export const stage3Dialogue: StageDialogue = {
  stageId: 3,
  initialStepId: "izakaya-1",
  requiredMilestones: ["seats", "recommendation", "order", "drink"],
  successMessage: "이자카야 주문을 성공적으로 완료했습니다! 일본 술집 문화를 체험했네요!",
  successNpcLine: "かしこまりました！少々お待ちくださいませ！",
  successNpcLineKo: "알겠습니다! 잠시만 기다려주세요!",
  successNpcLinePronunciation: "카시코마리마시타! 쇼오쇼오 오마치 쿠다사이마세!",
  steps: [
    // ============================================================
    // STEP 1: 인원수 묻기 (How many people?) [milestone: seats]
    // ============================================================
    {
      id: "izakaya-1",
      npcLine: "いらっしゃい！何名様ですか？",
      npcLineKo: "어서오세요! 몇 분이세요?",
      npcLinePronunciation: "이랏샤이! 난메이사마 데스카?",
      npcEmotion: "happy",
      isMilestone: true,
      milestoneTag: "seats",
      choices: [
        {
          id: "izakaya-1-best",
          text: "二人です。",
          textKo: "두 명이에요.",
          pronunciation: "후타리 데스",
          quality: "best",
          damage: 0,
          feedback: "완벽해요! '二人(ふたり)'는 두 사람을 뜻하는 기본 표현이에요.",
          npcEmotion: "happy",
          nextStepId: "izakaya-2",
        },
        {
          id: "izakaya-1-ok",
          text: "二名です。",
          textKo: "두 명입니다.",
          pronunciation: "니메이 데스",
          quality: "ok",
          damage: 5,
          feedback: "'二名(にめい)'도 맞지만, 일상적으로는 '二人(ふたり)'가 더 자연스러워요.",
          npcEmotion: "neutral",
          nextStepId: "izakaya-2",
        },
        {
          id: "izakaya-1-bad",
          text: "えっと... テーブル？",
          textKo: "음... 테이블?",
          pronunciation: "엣토... 테에부루?",
          quality: "bad",
          damage: 15,
          feedback: "인원수를 물어보는 건데 테이블이라고 대답하면 안 돼요! '何名様(なんめいさま)'는 '몇 분'이라는 뜻이에요.",
          npcEmotion: "confused",
          nextStepId: "izakaya-recovery-1",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜人です",
          patternKo: "〜명이에요",
          explanation: "인원수를 말할 때 사용합니다. 一人(ひとり), 二人(ふたり), 三人(さんにん)... 주의: 1명과 2명은 불규칙 읽기!",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "何名様",
            reading: "なんめいさま",
            pronunciation: "난메이사마",
            meaning: "몇 분 (존경어)",
          },
          {
            word: "二人",
            reading: "ふたり",
            pronunciation: "후타리",
            meaning: "두 사람",
          },
          {
            word: "席",
            reading: "せき",
            pronunciation: "세키",
            meaning: "좌석",
          },
        ],
      },
    },

    // ============================================================
    // RECOVERY 1: 인원수 다시 묻기
    // ============================================================
    {
      id: "izakaya-recovery-1",
      npcLine: "あ、すみません。何人ですか？何名様？",
      npcLineKo: "아, 죄송해요. 몇 분이세요? 몇 명이세요?",
      npcLinePronunciation: "아, 스미마센. 난닌 데스카? 난메이사마?",
      npcEmotion: "neutral",
      choices: [
        {
          id: "izakaya-r1-best",
          text: "あ、二人です！",
          textKo: "아, 두 명이에요!",
          pronunciation: "아, 후타리 데스!",
          quality: "best",
          damage: 0,
          feedback: "좋아요! 이번엔 제대로 인원수를 말했어요.",
          npcEmotion: "happy",
          nextStepId: "izakaya-2",
        },
        {
          id: "izakaya-r1-ok",
          text: "ツー... いや、二人。",
          textKo: "투... 아니, 두 명.",
          pronunciation: "츠우... 이야, 후타리.",
          quality: "ok",
          damage: 5,
          feedback: "영어가 먼저 나왔지만 일본어로 바로잡았어요. 다음엔 처음부터 일본어로!",
          npcEmotion: "happy",
          nextStepId: "izakaya-2",
        },
        {
          id: "izakaya-r1-bad",
          text: "ピープル... ツー...",
          textKo: "피플... 투...",
          pronunciation: "피이푸루... 츠우...",
          quality: "bad",
          damage: 15,
          feedback: "여기는 일본이에요! 영어로는 통하지 않아요. '二人(ふたり) です'를 기억하세요!",
          npcEmotion: "confused",
          nextStepId: "izakaya-2",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜人です",
          patternKo: "〜명이에요",
          explanation: "인원수를 말하는 기본 표현. 一人(ひとり), 二人(ふたり)는 꼭 외우세요!",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "一人",
            reading: "ひとり",
            pronunciation: "히토리",
            meaning: "한 사람",
          },
          {
            word: "二人",
            reading: "ふたり",
            pronunciation: "후타리",
            meaning: "두 사람",
          },
        ],
      },
    },

    // ============================================================
    // STEP 2: 자리 안내
    // ============================================================
    {
      id: "izakaya-2",
      npcLine: "こちらのお席へどうぞ！メニューです。ごゆっくりどうぞ。",
      npcLineKo: "이쪽 자리로 오세요! 메뉴입니다. 천천히 보세요.",
      npcLinePronunciation: "코치라노 오세키에 도오조! 메뉴우 데스. 고유쿠리 도오조.",
      npcEmotion: "happy",
      choices: [
        {
          id: "izakaya-2-best",
          text: "ありがとうございます。",
          textKo: "감사합니다.",
          pronunciation: "아리가또 고자이마스",
          quality: "best",
          damage: 0,
          feedback: "정중한 감사 인사! 이자카야에서도 예의 바르게!",
          npcEmotion: "happy",
          nextStepId: "izakaya-3",
        },
        {
          id: "izakaya-2-ok",
          text: "どうも。",
          textKo: "어, 네.",
          pronunciation: "도오모",
          quality: "ok",
          damage: 5,
          feedback: "'どうも'도 감사의 뜻이지만 좀 캐주얼해요. 'ありがとうございます'가 더 정중해요.",
          npcEmotion: "neutral",
          nextStepId: "izakaya-3",
        },
        {
          id: "izakaya-2-bad",
          text: "（무시하고 앉는다）",
          textKo: "(아무 말 없이 앉는다)",
          pronunciation: "(무시)",
          quality: "bad",
          damage: 10,
          feedback: "안내해주는 점원에게 감사 인사 정도는 해야죠! 'ありがとうございます'를 말해보세요.",
          npcEmotion: "neutral",
          nextStepId: "izakaya-3",
        },
      ],
      education: {
        keyExpression: {
          pattern: "こちらへどうぞ",
          patternKo: "이쪽으로 오세요",
          explanation: "'こちら'는 '이쪽', 'どうぞ'는 '자, 어서'라는 뜻. 안내할 때 자주 쓰는 표현이에요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "お席",
            reading: "おせき",
            pronunciation: "오세키",
            meaning: "좌석 (존경어)",
          },
          {
            word: "メニュー",
            reading: "メニュー",
            pronunciation: "메뉴우",
            meaning: "메뉴",
          },
          {
            word: "ごゆっくり",
            reading: "ごゆっくり",
            pronunciation: "고유쿠리",
            meaning: "천천히 (존경어)",
          },
        ],
      },
    },

    // ============================================================
    // STEP 3: 음료 주문 [milestone: drink]
    // ============================================================
    {
      id: "izakaya-3",
      npcLine: "お飲み物はいかがですか？生ビール、ハイボール、サワーなどありますよ！",
      npcLineKo: "음료는 어떠세요? 생맥주, 하이볼, 사워 등 있어요!",
      npcLinePronunciation: "오노미모노와 이카가 데스카? 나마비이루, 하이보오루, 사와아 나도 아리마스요!",
      npcEmotion: "happy",
      isMilestone: true,
      milestoneTag: "drink",
      choices: [
        {
          id: "izakaya-3-best",
          text: "生ビールを二つください。",
          textKo: "생맥주 두 잔 주세요.",
          pronunciation: "나마비이루오 후타츠 쿠다사이",
          quality: "best",
          damage: 0,
          feedback: "완벽해요! '生ビール(なまビール)'를 정확히 읽고 주문했어요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-4",
        },
        {
          id: "izakaya-3-ok",
          text: "ビール、二つお願いします。",
          textKo: "맥주 두 잔 부탁합니다.",
          pronunciation: "비이루, 후타츠 오네가이시마스",
          quality: "ok",
          damage: 5,
          feedback: "통하긴 하지만, 이자카야에서는 '生(なま)ビール'이라고 말하면 더 자연스러워요!",
          npcEmotion: "neutral",
          nextStepId: "izakaya-4",
        },
        {
          id: "izakaya-3-bad",
          text: "水をください。",
          textKo: "물 주세요.",
          pronunciation: "미즈오 쿠다사이",
          quality: "bad",
          damage: 15,
          feedback: "이자카야에 와서 물만 시키면 좀... 미션은 생맥주 주문이에요! '生ビールを二つください'를 말해보세요!",
          npcEmotion: "confused",
          nextStepId: "izakaya-recovery-2",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜を〜つください",
          patternKo: "〜을/를 〜개 주세요",
          explanation: "'を'는 목적어 조사, 'ください'는 '주세요'. 개수는 一つ(ひとつ), 二つ(ふたつ), 三つ(みっつ)...",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "生ビール",
            reading: "なまビール",
            pronunciation: "나마비이루",
            meaning: "생맥주",
          },
          {
            word: "飲み物",
            reading: "のみもの",
            pronunciation: "노미모노",
            meaning: "음료",
          },
          {
            word: "二つ",
            reading: "ふたつ",
            pronunciation: "후타츠",
            meaning: "두 개",
          },
        ],
        kanjiChallenge: {
          kanji: "生ビール",
          correctReading: "なまビール",
          wrongReadings: ["せいビール", "いきビール", "しょうビール"],
          meaning: "생맥주",
          hint: "이자카야에서 '나마'라고 하면 생맥주!",
        },
      },
    },

    // ============================================================
    // RECOVERY 2: 음료 다시 주문
    // ============================================================
    {
      id: "izakaya-recovery-2",
      npcLine: "お水はもちろん出しますよ！でもせっかくだから、何か飲みませんか？生ビールとか？",
      npcLineKo: "물은 당연히 드릴게요! 그래도 왔으니까 뭔가 마시지 않을래요? 생맥주라든가?",
      npcLinePronunciation: "오미즈와 모치론 다시마스요! 데모 세캇쿠 다카라, 나니카 노미마센카? 나마비이루 토카?",
      npcEmotion: "happy",
      choices: [
        {
          id: "izakaya-r2-best",
          text: "じゃあ、生ビールを二つお願いします！",
          textKo: "그럼, 생맥주 두 잔 부탁합니다!",
          pronunciation: "쟈아, 나마비이루오 후타츠 오네가이시마스!",
          quality: "best",
          damage: 0,
          feedback: "좋아요! 점원의 제안을 자연스럽게 받아들였어요. '生ビール'도 잘 읽었어요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-4",
        },
        {
          id: "izakaya-r2-ok",
          text: "生ビール、二つ。",
          textKo: "생맥주, 두 잔.",
          pronunciation: "나마비이루, 후타츠.",
          quality: "ok",
          damage: 5,
          feedback: "'ください'나 'お願いします'를 붙이면 더 정중하지만, 의사소통은 됐어요!",
          npcEmotion: "neutral",
          nextStepId: "izakaya-4",
        },
        {
          id: "izakaya-r2-bad",
          text: "いいです。水だけ。",
          textKo: "괜찮아요. 물만요.",
          pronunciation: "이이 데스. 미즈 다케.",
          quality: "bad",
          damage: 20,
          feedback: "미션 실패 위기! 생맥주 주문이 미션이에요. 다시 한번 도전해보세요!",
          npcEmotion: "neutral",
          nextStepId: "izakaya-4",
        },
      ],
      education: {
        keyExpression: {
          pattern: "じゃあ、〜をお願いします",
          patternKo: "그럼, 〜을/를 부탁합니다",
          explanation: "'じゃあ'는 '그럼'이라는 뜻. 상대의 제안을 받아들일 때 자연스럽게 쓸 수 있어요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "せっかく",
            reading: "せっかく",
            pronunciation: "셋카쿠",
            meaning: "모처럼, 일부러",
          },
          {
            word: "飲む",
            reading: "のむ",
            pronunciation: "노무",
            meaning: "마시다",
          },
        ],
      },
    },

    // ============================================================
    // STEP 4: 생맥주 나오고 건배
    // ============================================================
    {
      id: "izakaya-4",
      npcLine: "はい、生ビール二つです！どうぞ！とりあえず乾杯ですね！",
      npcLineKo: "네, 생맥주 두 잔이요! 여기요! 우선 건배하세요!",
      npcLinePronunciation: "하이, 나마비이루 후타츠 데스! 도오조! 토리아에즈 캄파이 데스네!",
      npcEmotion: "happy",
      choices: [
        {
          id: "izakaya-4-best",
          text: "乾杯！ありがとうございます！",
          textKo: "건배! 감사합니다!",
          pronunciation: "캄파이! 아리가또 고자이마스!",
          quality: "best",
          damage: 0,
          feedback: "'乾杯(かんぱい)'! 이자카야의 필수 표현이에요. 분위기 최고!",
          npcEmotion: "happy",
          nextStepId: "izakaya-5",
        },
        {
          id: "izakaya-4-ok",
          text: "カンパイ！",
          textKo: "건배!",
          pronunciation: "캄파이!",
          quality: "ok",
          damage: 0,
          feedback: "건배! 이자카야 분위기에 딱이에요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-5",
        },
        {
          id: "izakaya-4-bad",
          text: "（조용히 마신다）",
          textKo: "(말없이 마신다)",
          pronunciation: "(시즈카니 노무)",
          quality: "bad",
          damage: 10,
          feedback: "일본에서 '乾杯(かんぱい)!'를 안 하면 좀 어색해요. 다함께 '캄파이!'",
          npcEmotion: "neutral",
          nextStepId: "izakaya-5",
        },
      ],
      education: {
        keyExpression: {
          pattern: "乾杯！",
          patternKo: "건배!",
          explanation: "이자카야에서 첫 잔을 마시기 전에 반드시 하는 인사. 'とりあえず(일단) 乾杯!'가 정석!",
          formality: "casual",
        },
        vocabulary: [
          {
            word: "乾杯",
            reading: "かんぱい",
            pronunciation: "캄파이",
            meaning: "건배",
          },
          {
            word: "とりあえず",
            reading: "とりあえず",
            pronunciation: "토리아에즈",
            meaning: "일단, 우선",
          },
          {
            word: "どうぞ",
            reading: "どうぞ",
            pronunciation: "도오조",
            meaning: "자, 여기요",
          },
        ],
      },
    },

    // ============================================================
    // STEP 5: 추천 메뉴 묻기 [milestone: recommendation]
    // ============================================================
    {
      id: "izakaya-5",
      npcLine: "お食事のほうはいかがですか？ご注文はお決まりですか？",
      npcLineKo: "식사 쪽은 어떠세요? 주문 정하셨나요?",
      npcLinePronunciation: "오쇼쿠지노 호오와 이카가 데스카? 고츄우몬와 오키마리 데스카?",
      npcEmotion: "neutral",
      isMilestone: true,
      milestoneTag: "recommendation",
      choices: [
        {
          id: "izakaya-5-best",
          text: "おすすめは何ですか？",
          textKo: "추천 메뉴는 뭔가요?",
          pronunciation: "오스스메와 난 데스카?",
          quality: "best",
          damage: 0,
          feedback: "완벽! 'おすすめは何ですか？'는 이자카야에서 꼭 써야 할 핵심 표현이에요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-6",
        },
        {
          id: "izakaya-5-ok",
          text: "何がおいしいですか？",
          textKo: "뭐가 맛있어요?",
          pronunciation: "나니가 오이시이 데스카?",
          quality: "ok",
          damage: 5,
          feedback: "의미는 통해요! 하지만 'おすすめは何ですか'가 더 자연스러운 표현이에요.",
          npcEmotion: "happy",
          nextStepId: "izakaya-6",
        },
        {
          id: "izakaya-5-bad",
          text: "まだです...",
          textKo: "아직이요...",
          pronunciation: "마다 데스...",
          quality: "bad",
          damage: 15,
          feedback: "메뉴를 못 읽겠으면 'おすすめは何ですか？(추천은 뭔가요?)'라고 물어보세요!",
          npcEmotion: "neutral",
          nextStepId: "izakaya-recovery-3",
        },
      ],
      education: {
        keyExpression: {
          pattern: "おすすめは何ですか？",
          patternKo: "추천은 뭔가요?",
          explanation: "메뉴를 모를 때 가장 유용한 표현! 일본 어디서든 사용 가능해요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "おすすめ",
            reading: "おすすめ",
            pronunciation: "오스스메",
            meaning: "추천",
          },
          {
            word: "注文",
            reading: "ちゅうもん",
            pronunciation: "츄우몬",
            meaning: "주문",
          },
          {
            word: "お決まり",
            reading: "おきまり",
            pronunciation: "오키마리",
            meaning: "정하신 것 (존경어)",
          },
        ],
        kanjiChallenge: {
          kanji: "飲み放題",
          correctReading: "のみほうだい",
          wrongReadings: ["のみほうだい", "いんほうだい", "のみはなだい"],
          meaning: "음료 무한리필",
          hint: "'飲み'는 마시다, '放題'는 마음대로!",
        },
      },
    },

    // ============================================================
    // RECOVERY 3: 추천 메뉴 다시 시도
    // ============================================================
    {
      id: "izakaya-recovery-3",
      npcLine: "ゆっくりでいいですよ！あ、よかったらおすすめ聞きますか？うちの焼き鳥、人気ですよ！",
      npcLineKo: "천천히 해도 돼요! 아, 괜찮으시면 추천 들으실래요? 저희 야키토리 인기 있어요!",
      npcLinePronunciation: "유쿠리데 이이 데스요! 아, 요캇타라 오스스메 키키마스카? 우치노 야키토리, 닌키 데스요!",
      npcEmotion: "happy",
      choices: [
        {
          id: "izakaya-r3-best",
          text: "はい！おすすめを教えてください！",
          textKo: "네! 추천 메뉴를 알려주세요!",
          pronunciation: "하이! 오스스메오 오시에테 쿠다사이!",
          quality: "best",
          damage: 0,
          feedback: "좋아요! 적극적으로 추천을 물어봤어요. '教えてください'는 '알려주세요'라는 뜻이에요.",
          npcEmotion: "happy",
          nextStepId: "izakaya-6",
        },
        {
          id: "izakaya-r3-ok",
          text: "おすすめ、お願いします。",
          textKo: "추천, 부탁해요.",
          pronunciation: "오스스메, 오네가이시마스.",
          quality: "ok",
          damage: 5,
          feedback: "간결하지만 잘 전달됐어요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-6",
        },
        {
          id: "izakaya-r3-bad",
          text: "焼き鳥って何ですか？",
          textKo: "야키토리가 뭐예요?",
          pronunciation: "야키토리잇테 난 데스카?",
          quality: "bad",
          damage: 10,
          feedback: "'焼き鳥(やきとり)'는 꼬치구이예요! 일단 추천을 들어볼까요?",
          npcEmotion: "neutral",
          nextStepId: "izakaya-6",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜を教えてください",
          patternKo: "〜을/를 알려주세요",
          explanation: "'教える(おしえる)'는 '가르치다/알려주다'. 정보를 요청할 때 널리 쓰이는 표현이에요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "焼き鳥",
            reading: "やきとり",
            pronunciation: "야키토리",
            meaning: "꼬치구이 (닭)",
          },
          {
            word: "人気",
            reading: "にんき",
            pronunciation: "닌키",
            meaning: "인기",
          },
        ],
        kanjiChallenge: {
          kanji: "焼き鳥",
          correctReading: "やきとり",
          wrongReadings: ["しょうちょう", "やけどり", "やきちょう"],
          meaning: "닭꼬치구이",
          hint: "'焼き'는 굽다, '鳥'는 새/닭!",
        },
      },
    },

    // ============================================================
    // STEP 6: NPC가 추천 메뉴 소개
    // ============================================================
    {
      id: "izakaya-6",
      npcLine: "おすすめですね！今日は焼き鳥の盛り合わせと、刺身がめちゃくちゃ新鮮ですよ！あと枝豆もどうですか？",
      npcLineKo: "추천이요! 오늘은 야키토리 모듬과, 사시미가 엄청 신선해요! 그리고 에다마메도 어떠세요?",
      npcLinePronunciation: "오스스메 데스네! 쿄오와 야키토리노 모리아와세토, 사시미가 메챠쿠챠 신센 데스요! 아토 에다마메모 도오 데스카?",
      npcEmotion: "happy",
      choices: [
        {
          id: "izakaya-6-best",
          text: "じゃあ、焼き鳥の盛り合わせと刺身をお願いします。",
          textKo: "그럼, 야키토리 모듬과 사시미를 부탁합니다.",
          pronunciation: "쟈아, 야키토리노 모리아와세토 사시미오 오네가이시마스.",
          quality: "best",
          damage: 0,
          feedback: "완벽한 주문! 추천 메뉴를 자연스럽게 주문했어요. 한자 메뉴도 잘 읽었네요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-7",
        },
        {
          id: "izakaya-6-ok",
          text: "焼き鳥と刺身ください。",
          textKo: "야키토리랑 사시미 주세요.",
          pronunciation: "야키토리토 사시미 쿠다사이.",
          quality: "ok",
          damage: 5,
          feedback: "잘 전달됐어요! 'お願いします'를 쓰면 좀 더 정중해져요.",
          npcEmotion: "happy",
          nextStepId: "izakaya-7",
        },
        {
          id: "izakaya-6-bad",
          text: "全部ください！",
          textKo: "전부 주세요!",
          pronunciation: "젠부 쿠다사이!",
          quality: "bad",
          damage: 15,
          feedback: "너무 많이 시키면 큰일! 이자카야에서는 조금씩 시키는 게 문화에요. 추천 메뉴부터 시작해보세요.",
          npcEmotion: "confused",
          nextStepId: "izakaya-7",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜と〜をお願いします",
          patternKo: "〜와/과 〜을/를 부탁합니다",
          explanation: "'と'는 '~와/과'로 여러 메뉴를 연결할 때 사용. 'をお願いします'로 마무리하면 정중한 주문!",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "刺身",
            reading: "さしみ",
            pronunciation: "사시미",
            meaning: "회 (날생선)",
          },
          {
            word: "盛り合わせ",
            reading: "もりあわせ",
            pronunciation: "모리아와세",
            meaning: "모듬",
          },
          {
            word: "枝豆",
            reading: "えだまめ",
            pronunciation: "에다마메",
            meaning: "풋콩",
          },
        ],
        kanjiChallenge: {
          kanji: "刺身",
          correctReading: "さしみ",
          wrongReadings: ["さしからだ", "しみ", "つきみ"],
          meaning: "회 (날생선)",
          hint: "'刺'는 찌르다, '身'은 몸/살. 생선살을 칼로 썰어낸 것!",
        },
      },
    },

    // ============================================================
    // STEP 7: 추가 주문 + 에다마메 [milestone: order]
    // ============================================================
    {
      id: "izakaya-7",
      npcLine: "かしこまりました！枝豆もいかがですか？ビールに合いますよ！",
      npcLineKo: "알겠습니다! 에다마메도 어떠세요? 맥주에 잘 어울려요!",
      npcLinePronunciation: "카시코마리마시타! 에다마메모 이카가 데스카? 비이루니 아이마스요!",
      npcEmotion: "happy",
      isMilestone: true,
      milestoneTag: "order",
      choices: [
        {
          id: "izakaya-7-best",
          text: "いいですね！枝豆もお願いします。",
          textKo: "좋네요! 에다마메도 부탁합니다.",
          pronunciation: "이이 데스네! 에다마메모 오네가이시마스.",
          quality: "best",
          damage: 0,
          feedback: "완벽! 점원의 추천을 자연스럽게 수락했어요. 에다마메는 이자카야의 정석 안주!",
          npcEmotion: "happy",
          nextStepId: "izakaya-8",
        },
        {
          id: "izakaya-7-ok",
          text: "じゃあ、それも。",
          textKo: "그럼, 그것도.",
          pronunciation: "쟈아, 소레모.",
          quality: "ok",
          damage: 5,
          feedback: "'それも'는 '그것도'라는 뜻. 간결하지만 통해요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-8",
        },
        {
          id: "izakaya-7-bad",
          text: "枝豆？なんですか、それ？",
          textKo: "에다마메? 그게 뭐예요?",
          pronunciation: "에다마메? 난 데스카, 소레?",
          quality: "bad",
          damage: 10,
          feedback: "'枝豆(えだまめ)'는 소금에 삶은 풋콩이에요. 일본 이자카야의 대표 안주! 알아두면 좋아요.",
          npcEmotion: "neutral",
          nextStepId: "izakaya-8",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜もお願いします",
          patternKo: "〜도 부탁합니다",
          explanation: "'も'는 '~도'라는 뜻. 추가 주문할 때 '〜もお願いします'로 자연스럽게!",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "枝豆",
            reading: "えだまめ",
            pronunciation: "에다마메",
            meaning: "풋콩 (이자카야 대표 안주)",
          },
          {
            word: "合う",
            reading: "あう",
            pronunciation: "아우",
            meaning: "어울리다, 맞다",
          },
          {
            word: "いかが",
            reading: "いかが",
            pronunciation: "이카가",
            meaning: "어떠세요 (정중)",
          },
        ],
        kanjiChallenge: {
          kanji: "枝豆",
          correctReading: "えだまめ",
          wrongReadings: ["えだとう", "しまめ", "えだず"],
          meaning: "풋콩",
          hint: "'枝'는 가지, '豆'는 콩! 가지에 달린 콩이에요.",
        },
      },
    },

    // ============================================================
    // STEP 8: 주문 확인
    // ============================================================
    {
      id: "izakaya-8",
      npcLine: "ご注文を確認しますね。生ビール二つ、焼き鳥の盛り合わせ、刺身、枝豆。ご注文は以上でよろしいですか？",
      npcLineKo: "주문 확인할게요. 생맥주 두 잔, 야키토리 모듬, 사시미, 에다마메. 주문은 이게 다 맞으시죠?",
      npcLinePronunciation: "고츄우몬오 카쿠닌시마스네. 나마비이루 후타츠, 야키토리노 모리아와세, 사시미, 에다마메. 고츄우몬와 이죠오데 요로시이 데스카?",
      npcEmotion: "neutral",
      choices: [
        {
          id: "izakaya-8-best",
          text: "はい、以上でお願いします。",
          textKo: "네, 그걸로 부탁합니다.",
          pronunciation: "하이, 이죠오데 오네가이시마스.",
          quality: "best",
          damage: 0,
          feedback: "완벽! '以上(いじょう)で'는 '그걸로/이상입니다'라는 뜻. 주문 마무리의 정석 표현이에요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-9",
        },
        {
          id: "izakaya-8-ok",
          text: "はい、大丈夫です。",
          textKo: "네, 괜찮아요.",
          pronunciation: "하이, 다이죠오부 데스.",
          quality: "ok",
          damage: 5,
          feedback: "'大丈夫です'도 통하지만 '以上でお願いします'가 더 자연스러운 주문 마무리예요.",
          npcEmotion: "neutral",
          nextStepId: "izakaya-9",
        },
        {
          id: "izakaya-8-bad",
          text: "あと、飲み放題ありますか？",
          textKo: "그리고, 음료 무한리필 있어요?",
          pronunciation: "아토, 노미호오다이 아리마스카?",
          quality: "bad",
          damage: 10,
          feedback: "주문 확인 단계에서 새로운 메뉴를 추가하면 혼란스러워요! 하지만 '飲み放題'를 알고 있다니 대단해요!",
          npcEmotion: "confused",
          nextStepId: "izakaya-recovery-4",
        },
      ],
      education: {
        keyExpression: {
          pattern: "以上でお願いします",
          patternKo: "이상으로 부탁합니다",
          explanation: "'以上(いじょう)'는 '이상'. 주문을 마무리할 때 '以上でお願いします'라고 하면 완벽!",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "以上",
            reading: "いじょう",
            pronunciation: "이죠오",
            meaning: "이상, 이것으로 (끝)",
          },
          {
            word: "確認",
            reading: "かくにん",
            pronunciation: "카쿠닌",
            meaning: "확인",
          },
          {
            word: "よろしい",
            reading: "よろしい",
            pronunciation: "요로시이",
            meaning: "괜찮으시다 (いい의 존경어)",
          },
        ],
      },
    },

    // ============================================================
    // RECOVERY 4: 주문 확인 다시
    // ============================================================
    {
      id: "izakaya-recovery-4",
      npcLine: "飲み放題は今日はやってないんです、すみません！じゃあ、さっきのご注文でよろしいですか？",
      npcLineKo: "음료 무한리필은 오늘은 안 하고 있어요, 죄송합니다! 그러면, 아까 주문으로 괜찮으시죠?",
      npcLinePronunciation: "노미호오다이와 쿄오와 얏테나인 데스, 스미마센! 쟈아, 삿키노 고츄우몬데 요로시이 데스카?",
      npcEmotion: "neutral",
      choices: [
        {
          id: "izakaya-r4-best",
          text: "はい、以上でお願いします！",
          textKo: "네, 그걸로 부탁합니다!",
          pronunciation: "하이, 이죠오데 오네가이시마스!",
          quality: "best",
          damage: 0,
          feedback: "좋아요! 주문 마무리 표현을 잘 사용했어요.",
          npcEmotion: "happy",
          nextStepId: "izakaya-9",
        },
        {
          id: "izakaya-r4-ok",
          text: "はい、お願いします。",
          textKo: "네, 부탁합니다.",
          pronunciation: "하이, 오네가이시마스.",
          quality: "ok",
          damage: 5,
          feedback: "OK! 주문이 확정됐어요.",
          npcEmotion: "neutral",
          nextStepId: "izakaya-9",
        },
        {
          id: "izakaya-r4-bad",
          text: "えー、残念...",
          textKo: "에-, 아쉽다...",
          pronunciation: "에에, 잔넨...",
          quality: "bad",
          damage: 10,
          feedback: "'残念(ざんねん)'은 '아쉽다'라는 뜻. 마음은 알지만, 주문을 확인해야 해요!",
          npcEmotion: "neutral",
          nextStepId: "izakaya-9",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜でよろしいですか？",
          patternKo: "〜으로 괜찮으시죠?",
          explanation: "'よろしいですか'는 'いいですか'의 존경어. 상대를 존중하는 확인 표현이에요.",
          formality: "formal",
        },
        vocabulary: [
          {
            word: "飲み放題",
            reading: "のみほうだい",
            pronunciation: "노미호오다이",
            meaning: "음료 무한리필",
          },
          {
            word: "残念",
            reading: "ざんねん",
            pronunciation: "잔넨",
            meaning: "아쉽다, 유감",
          },
        ],
      },
    },

    // ============================================================
    // STEP 9: 음식 서빙
    // ============================================================
    {
      id: "izakaya-9",
      npcLine: "お待たせしました！焼き鳥の盛り合わせと刺身です！熱いうちにどうぞ！",
      npcLineKo: "오래 기다리셨습니다! 야키토리 모듬과 사시미입니다! 뜨거울 때 드세요!",
      npcLinePronunciation: "오마타세시마시타! 야키토리노 모리아와세토 사시미 데스! 아츠이 우치니 도오조!",
      npcEmotion: "happy",
      choices: [
        {
          id: "izakaya-9-best",
          text: "わぁ、おいしそう！いただきます！",
          textKo: "와, 맛있겠다! 잘 먹겠습니다!",
          pronunciation: "와아, 오이시소오! 이타다키마스!",
          quality: "best",
          damage: 0,
          feedback: "최고! 'いただきます'는 식사 전 필수 인사. 일본 문화를 완벽히 이해하고 있어요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-10",
        },
        {
          id: "izakaya-9-ok",
          text: "ありがとうございます。",
          textKo: "감사합니다.",
          pronunciation: "아리가또 고자이마스.",
          quality: "ok",
          damage: 5,
          feedback: "감사 인사도 좋지만, 'いただきます(잘 먹겠습니다)'를 함께 말하면 더 좋아요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-10",
        },
        {
          id: "izakaya-9-bad",
          text: "（바로 먹기 시작한다）",
          textKo: "(아무 말 없이 먹기 시작한다)",
          pronunciation: "(스구 타베루)",
          quality: "bad",
          damage: 15,
          feedback: "일본에서 식사 전 'いただきます!'를 말하는 건 기본 매너예요! 잊지 마세요!",
          npcEmotion: "neutral",
          nextStepId: "izakaya-10",
        },
      ],
      education: {
        keyExpression: {
          pattern: "いただきます",
          patternKo: "잘 먹겠습니다",
          explanation: "식사 전에 하는 일본의 필수 인사. 음식과 만들어준 사람에게 감사하는 마음을 담은 표현이에요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "おいしそう",
            reading: "おいしそう",
            pronunciation: "오이시소오",
            meaning: "맛있어 보인다",
          },
          {
            word: "熱い",
            reading: "あつい",
            pronunciation: "아츠이",
            meaning: "뜨겁다",
          },
          {
            word: "お待たせしました",
            reading: "おまたせしました",
            pronunciation: "오마타세시마시타",
            meaning: "오래 기다리셨습니다",
          },
        ],
      },
    },

    // ============================================================
    // STEP 10: 식사 중 추가 주문
    // ============================================================
    {
      id: "izakaya-10",
      npcLine: "お味はいかがですか？何か追加のご注文はありますか？",
      npcLineKo: "맛은 어떠세요? 추가 주문 있으세요?",
      npcLinePronunciation: "오아지와 이카가 데스카? 나니카 츠이카노 고츄우몬와 아리마스카?",
      npcEmotion: "neutral",
      choices: [
        {
          id: "izakaya-10-best",
          text: "すごくおいしいです！大丈夫です、ありがとう。",
          textKo: "엄청 맛있어요! 괜찮아요, 감사해요.",
          pronunciation: "스고쿠 오이시이 데스! 다이죠오부 데스, 아리가또.",
          quality: "best",
          damage: 0,
          feedback: "맛에 대한 감상과 정중한 거절을 완벽하게! 점원도 기분 좋아하겠어요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-11",
        },
        {
          id: "izakaya-10-ok",
          text: "おいしいです！",
          textKo: "맛있어요!",
          pronunciation: "오이시이 데스!",
          quality: "ok",
          damage: 0,
          feedback: "'おいしい'는 '맛있다'. 짧지만 확실한 칭찬이에요!",
          npcEmotion: "happy",
          nextStepId: "izakaya-11",
        },
        {
          id: "izakaya-10-bad",
          text: "まあまあ...",
          textKo: "그저 그래요...",
          pronunciation: "마아마아...",
          quality: "bad",
          damage: 15,
          feedback: "'まあまあ(그저 그래요)'라니... 추천 메뉴를 깎아내리면 점원이 슬퍼해요!",
          npcEmotion: "angry",
          nextStepId: "izakaya-11",
        },
      ],
      education: {
        keyExpression: {
          pattern: "すごくおいしいです",
          patternKo: "엄청 맛있어요",
          explanation: "'すごく'는 '엄청/매우'. 'おいしい'에 강조를 더해 더 큰 칭찬이 됩니다!",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "味",
            reading: "あじ",
            pronunciation: "아지",
            meaning: "맛",
          },
          {
            word: "追加",
            reading: "ついか",
            pronunciation: "츠이카",
            meaning: "추가",
          },
          {
            word: "すごく",
            reading: "すごく",
            pronunciation: "스고쿠",
            meaning: "엄청, 매우",
          },
        ],
      },
    },

    // ============================================================
    // STEP 11: 계산 요청
    // ============================================================
    {
      id: "izakaya-11",
      npcLine: "ごゆっくりどうぞ！何かあったら呼んでくださいね！",
      npcLineKo: "천천히 즐기세요! 뭔가 있으면 불러주세요!",
      npcLinePronunciation: "고유쿠리 도오조! 나니카 앗타라 욘데 쿠다사이네!",
      npcEmotion: "happy",
      choices: [
        {
          id: "izakaya-11-best",
          text: "すみません、お会計お願いします。",
          textKo: "저기요, 계산 부탁합니다.",
          pronunciation: "스미마센, 오카이게이 오네가이시마스.",
          quality: "best",
          damage: 0,
          feedback: "완벽! 'お会計(おかいけい)お願いします'는 계산 요청의 정석 표현이에요!",
          npcEmotion: "neutral",
          nextStepId: "izakaya-12",
        },
        {
          id: "izakaya-11-ok",
          text: "チェックお願いします。",
          textKo: "체크 부탁합니다.",
          pronunciation: "쳇쿠 오네가이시마스.",
          quality: "ok",
          damage: 5,
          feedback: "'チェック'보다 'お会計(おかいけい)'가 더 일본식 표현이에요. 하지만 통해요!",
          npcEmotion: "neutral",
          nextStepId: "izakaya-12",
        },
        {
          id: "izakaya-11-bad",
          text: "いくらですか？",
          textKo: "얼마예요?",
          pronunciation: "이쿠라 데스카?",
          quality: "bad",
          damage: 10,
          feedback: "이자카야에서는 'お会計お願いします'라고 해야 해요. 'いくらですか'는 물건 살 때 쓰는 표현!",
          npcEmotion: "confused",
          nextStepId: "izakaya-12",
        },
      ],
      education: {
        keyExpression: {
          pattern: "お会計お願いします",
          patternKo: "계산 부탁합니다",
          explanation: "'お会計(おかいけい)'는 '계산'. 식당에서 계산할 때 이 표현을 쓰세요!",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "お会計",
            reading: "おかいけい",
            pronunciation: "오카이게이",
            meaning: "계산",
          },
          {
            word: "呼ぶ",
            reading: "よぶ",
            pronunciation: "요부",
            meaning: "부르다",
          },
          {
            word: "何か",
            reading: "なにか",
            pronunciation: "나니카",
            meaning: "뭔가, 무엇인가",
          },
        ],
      },
    },

    // ============================================================
    // STEP 12: 마무리 인사 (FINAL)
    // ============================================================
    {
      id: "izakaya-12",
      npcLine: "全部で三千五百円になります！ありがとうございました！またお越しくださいね！",
      npcLineKo: "전부 3,500엔입니다! 감사합니다! 또 와주세요!",
      npcLinePronunciation: "젠부데 산젠 고햐쿠엔니 나리마스! 아리가또 고자이마시타! 마타 오코시 쿠다사이네!",
      npcEmotion: "happy",
      choices: [
        {
          id: "izakaya-12-best",
          text: "ごちそうさまでした！とてもおいしかったです！",
          textKo: "잘 먹었습니다! 정말 맛있었어요!",
          pronunciation: "고치소오사마 데시타! 토테모 오이시캇타 데스!",
          quality: "best",
          damage: 0,
          feedback: "완벽한 마무리! 'ごちそうさまでした'는 식후 필수 인사. 이자카야 미션 클리어!",
          npcEmotion: "happy",
          nextStepId: "END",
        },
        {
          id: "izakaya-12-ok",
          text: "ありがとうございました！",
          textKo: "감사합니다!",
          pronunciation: "아리가또 고자이마시타!",
          quality: "ok",
          damage: 5,
          feedback: "감사 인사는 좋지만, 'ごちそうさまでした(잘 먹었습니다)'를 함께 말하면 더 좋아요!",
          npcEmotion: "happy",
          nextStepId: "END",
        },
        {
          id: "izakaya-12-bad",
          text: "（무언으로 나간다）",
          textKo: "(아무 말 없이 나간다)",
          pronunciation: "(다마잇테 데루)",
          quality: "bad",
          damage: 20,
          feedback: "식사 후에는 꼭 'ごちそうさまでした!'라고 해야 해요! 일본 기본 매너예요!",
          npcEmotion: "angry",
          nextStepId: "END",
        },
      ],
      education: {
        keyExpression: {
          pattern: "ごちそうさまでした",
          patternKo: "잘 먹었습니다",
          explanation: "식사 후에 하는 필수 인사. 'いただきます'와 짝을 이루는 표현이에요. 식당을 나갈 때도 말해요!",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "ごちそうさま",
            reading: "ごちそうさま",
            pronunciation: "고치소오사마",
            meaning: "잘 먹었습니다",
          },
          {
            word: "おいしかった",
            reading: "おいしかった",
            pronunciation: "오이시캇타",
            meaning: "맛있었다 (과거형)",
          },
          {
            word: "また",
            reading: "また",
            pronunciation: "마타",
            meaning: "또, 다시",
          },
        ],
      },
    },
  ],
};
