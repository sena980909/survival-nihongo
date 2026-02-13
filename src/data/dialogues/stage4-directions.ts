import { StageDialogue } from "../dialogue";

export const stage4Dialogue: StageDialogue = {
  stageId: 4,
  initialStepId: "directions-1",
  requiredMilestones: ["greeting", "ask_direction", "confirm_direction"],
  successMessage: "길 찾기 미션 완료! 일본어로 방향을 묻고 이해할 수 있게 됐어요!",
  successNpcLine: "そうそう！頑張ってね！いい旅を！",
  successNpcLineKo: "맞아맞아! 힘내! 좋은 여행 되세요!",
  successNpcLinePronunciation: "소오소오! 감밧테네! 이이 타비오!",
  steps: [
    // ============================================================
    // STEP 1: 행인에게 말 걸기 [milestone: greeting]
    // ============================================================
    {
      id: "directions-1",
      npcLine: "（忙しそうに歩いている）...",
      npcLineKo: "(바쁘게 걷고 있다)...",
      npcLinePronunciation: "(이소가시소오니 아루이테 이루)...",
      npcEmotion: "neutral",
      isMilestone: true,
      milestoneTag: "greeting",
      choices: [
        {
          id: "directions-1-best",
          text: "すみません、ちょっとよろしいですか？",
          textKo: "저기요, 잠깐 괜찮으세요?",
          pronunciation: "스미마센, 촛토 요로시이 데스카?",
          quality: "best",
          damage: 0,
          feedback: "완벽! 'すみません'으로 시작하고 'よろしいですか'로 상대의 시간을 배려했어요. 매우 정중한 표현!",
          npcEmotion: "neutral",
          nextStepId: "directions-2",
        },
        {
          id: "directions-1-ok",
          text: "すみません！",
          textKo: "저기요!",
          pronunciation: "스미마센!",
          quality: "ok",
          damage: 5,
          feedback: "'すみません'은 기본 중의 기본! 통하지만, 'ちょっとよろしいですか'를 붙이면 더 정중해요.",
          npcEmotion: "neutral",
          nextStepId: "directions-2",
        },
        {
          id: "directions-1-bad",
          text: "ちょっと！ねえ！",
          textKo: "잠깐! 저기!",
          pronunciation: "촛토! 네에!",
          quality: "bad",
          damage: 20,
          feedback: "너무 무례해요! 일본에서 모르는 사람에게는 반드시 'すみません'으로 시작해야 해요. 이건 시비 거는 것처럼 들려요!",
          npcEmotion: "angry",
          nextStepId: "directions-recovery-1",
        },
      ],
      education: {
        keyExpression: {
          pattern: "すみません、ちょっとよろしいですか",
          patternKo: "저기요, 잠깐 괜찮으세요?",
          explanation: "모르는 사람에게 말을 걸 때의 정중한 표현. 'すみません'은 '실례합니다', 'よろしいですか'는 '괜찮으세요?'",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "すみません",
            reading: "すみません",
            pronunciation: "스미마센",
            meaning: "실례합니다 / 죄송합니다",
          },
          {
            word: "ちょっと",
            reading: "ちょっと",
            pronunciation: "촛토",
            meaning: "잠깐, 조금",
          },
          {
            word: "よろしい",
            reading: "よろしい",
            pronunciation: "요로시이",
            meaning: "괜찮다 (いい의 존경어)",
          },
        ],
      },
    },

    // ============================================================
    // RECOVERY 1: 다시 인사하기
    // ============================================================
    {
      id: "directions-recovery-1",
      npcLine: "え？...何ですか？",
      npcLineKo: "네?... 뭐예요?",
      npcLinePronunciation: "에?... 난 데스카?",
      npcEmotion: "angry",
      choices: [
        {
          id: "directions-r1-best",
          text: "あ、すみません！道を聞きたいんですが...",
          textKo: "아, 죄송합니다! 길을 물어보고 싶은데요...",
          pronunciation: "아, 스미마센! 미치오 키키타인 데스가...",
          quality: "best",
          damage: 0,
          feedback: "사과하면서 다시 정중하게! 'すみません'으로 분위기를 바꿨어요. 잘 했어요!",
          npcEmotion: "neutral",
          nextStepId: "directions-2",
        },
        {
          id: "directions-r1-ok",
          text: "すみません、すみません...",
          textKo: "죄송합니다, 죄송합니다...",
          pronunciation: "스미마센, 스미마센...",
          quality: "ok",
          damage: 10,
          feedback: "사과는 했지만, 용건도 함께 말해야 해요. '道を聞きたいんですが'를 이어서 말해보세요.",
          npcEmotion: "neutral",
          nextStepId: "directions-2",
        },
        {
          id: "directions-r1-bad",
          text: "Hey! English OK?",
          textKo: "헤이! 영어 돼요?",
          pronunciation: "헤이! 잉글리시 오게이?",
          quality: "bad",
          damage: 25,
          feedback: "여기는 일본! 게다가 이미 무례하게 말을 걸어놓고 영어로 전환하면 최악이에요. 'すみません'부터 다시!",
          npcEmotion: "angry",
          nextStepId: "directions-2",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜を聞きたいんですが",
          patternKo: "〜을/를 물어보고 싶은데요",
          explanation: "'〜たいんですが'는 '〜하고 싶은데요'라는 뜻. 부드럽게 요청할 때 사용하는 표현이에요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "道",
            reading: "みち",
            pronunciation: "미치",
            meaning: "길",
          },
          {
            word: "聞く",
            reading: "きく",
            pronunciation: "키쿠",
            meaning: "듣다, 묻다",
          },
        ],
      },
    },

    // ============================================================
    // STEP 2: 행인 응답, 목적지 묻기 [milestone: ask_direction]
    // ============================================================
    {
      id: "directions-2",
      npcLine: "はい、どうしました？",
      npcLineKo: "네, 무슨 일이세요?",
      npcLinePronunciation: "하이, 도오시마시타?",
      npcEmotion: "neutral",
      isMilestone: true,
      milestoneTag: "ask_direction",
      choices: [
        {
          id: "directions-2-best",
          text: "スカイツリーへの行き方を教えていただけますか？",
          textKo: "스카이트리로 가는 길을 알려주실 수 있나요?",
          pronunciation: "스카이츠리이에노 이키카타오 오시에테 이타다게마스카?",
          quality: "best",
          damage: 0,
          feedback: "완벽! '〜への行き方を教えていただけますか'는 매우 정중한 길 묻기 표현이에요. 존경어까지 완벽!",
          npcEmotion: "happy",
          nextStepId: "directions-3",
        },
        {
          id: "directions-2-ok",
          text: "スカイツリーはどこですか？",
          textKo: "스카이트리는 어디예요?",
          pronunciation: "스카이츠리이와 도코 데스카?",
          quality: "ok",
          damage: 10,
          feedback: "'どこですか'도 통하지만, '行き方を教えてください(가는 길을 알려주세요)'가 더 구체적이에요.",
          npcEmotion: "neutral",
          nextStepId: "directions-3",
        },
        {
          id: "directions-2-bad",
          text: "スカイツリー！スカイツリー！",
          textKo: "스카이트리! 스카이트리!",
          pronunciation: "스카이츠리이! 스카이츠리이!",
          quality: "bad",
          damage: 20,
          feedback: "장소 이름만 반복하면 안 돼요! 'スカイツリーはどこですか？(스카이트리는 어디예요?)'라고 문장으로 말해보세요!",
          npcEmotion: "confused",
          nextStepId: "directions-recovery-2",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜への行き方を教えていただけますか",
          patternKo: "〜로 가는 길을 알려주실 수 있나요?",
          explanation: "'行き方(いきかた)'는 '가는 법/방법'. 'いただけますか'는 'もらえますか'의 존경어로 매우 정중한 부탁 표현.",
          formality: "formal",
        },
        vocabulary: [
          {
            word: "行き方",
            reading: "いきかた",
            pronunciation: "이키카타",
            meaning: "가는 방법",
          },
          {
            word: "教える",
            reading: "おしえる",
            pronunciation: "오시에루",
            meaning: "가르치다, 알려주다",
          },
          {
            word: "どこ",
            reading: "どこ",
            pronunciation: "도코",
            meaning: "어디",
          },
        ],
        kanjiChallenge: {
          kanji: "駅",
          correctReading: "えき",
          wrongReadings: ["やく", "うま", "かけ"],
          meaning: "역 (기차역, 지하철역)",
          hint: "전차가 서는 곳! 일본 여행의 핵심 장소.",
        },
      },
    },

    // ============================================================
    // RECOVERY 2: 다시 질문하기
    // ============================================================
    {
      id: "directions-recovery-2",
      npcLine: "スカイツリー？ああ、スカイツリーに行きたいんですか？",
      npcLineKo: "스카이트리? 아아, 스카이트리에 가고 싶으신 거예요?",
      npcLinePronunciation: "스카이츠리이? 아아, 스카이츠리이니 이키타인 데스카?",
      npcEmotion: "neutral",
      choices: [
        {
          id: "directions-r2-best",
          text: "はい！行き方を教えてください。",
          textKo: "네! 가는 길을 알려주세요.",
          pronunciation: "하이! 이키카타오 오시에테 쿠다사이.",
          quality: "best",
          damage: 0,
          feedback: "좋아요! 'はい'로 확인하고 '教えてください'로 정중하게 부탁했어요.",
          npcEmotion: "happy",
          nextStepId: "directions-3",
        },
        {
          id: "directions-r2-ok",
          text: "はい、そうです。",
          textKo: "네, 맞아요.",
          pronunciation: "하이, 소오 데스.",
          quality: "ok",
          damage: 10,
          feedback: "확인은 했지만 '行き方を教えてください'를 붙이면 더 좋겠어요.",
          npcEmotion: "neutral",
          nextStepId: "directions-3",
        },
        {
          id: "directions-r2-bad",
          text: "うん。",
          textKo: "응.",
          pronunciation: "운.",
          quality: "bad",
          damage: 20,
          feedback: "'うん'은 친구 사이에서 쓰는 반말이에요! 모르는 사람에게는 'はい'를 써야 해요!",
          npcEmotion: "angry",
          nextStepId: "directions-3",
        },
      ],
      education: {
        keyExpression: {
          pattern: "はい、〜を教えてください",
          patternKo: "네, 〜을/를 알려주세요",
          explanation: "'はい'로 상대의 말을 확인하고 'てください'로 부탁하는 자연스러운 흐름이에요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "行きたい",
            reading: "いきたい",
            pronunciation: "이키타이",
            meaning: "가고 싶다",
          },
          {
            word: "教えて",
            reading: "おしえて",
            pronunciation: "오시에테",
            meaning: "알려줘 (て형)",
          },
        ],
      },
    },

    // ============================================================
    // STEP 3: NPC가 방향 설명
    // ============================================================
    {
      id: "directions-3",
      npcLine: "スカイツリーですね。えっと、この道をまっすぐ行って、二つ目の交差点を右に曲がってください。そうすると左側に駅が見えますから。",
      npcLineKo: "스카이트리요. 음, 이 길을 쭉 가서, 두 번째 교차로에서 오른쪽으로 꺾으세요. 그러면 왼쪽에 역이 보일 거예요.",
      npcLinePronunciation: "스카이츠리이 데스네. 엣토, 코노 미치오 맛스구 잇테, 후타츠메노 코오사텐오 미기니 마갓테 쿠다사이. 소오 스루토 히다리가와니 에키가 미에마스카라.",
      npcEmotion: "neutral",
      choices: [
        {
          id: "directions-3-best",
          text: "まっすぐ行って、二つ目の交差点を右ですね？",
          textKo: "쭉 가서, 두 번째 교차로에서 오른쪽이요?",
          pronunciation: "맛스구 잇테, 후타츠메노 코오사텐오 미기 데스네?",
          quality: "best",
          damage: 0,
          feedback: "완벽한 복창! 핵심 정보를 정확히 반복해서 확인했어요. 이렇게 하면 길을 잃을 일이 없어요!",
          npcEmotion: "happy",
          nextStepId: "directions-4",
        },
        {
          id: "directions-3-ok",
          text: "右に曲がるんですね？",
          textKo: "오른쪽으로 꺾는 거죠?",
          pronunciation: "미기니 마가룬 데스네?",
          quality: "ok",
          damage: 10,
          feedback: "방향은 확인했지만, '二つ目の交差点(두 번째 교차로)'도 함께 확인하면 더 정확해요!",
          npcEmotion: "neutral",
          nextStepId: "directions-4",
        },
        {
          id: "directions-3-bad",
          text: "えっと... もう一度お願いします...",
          textKo: "음... 한 번 더 부탁해요...",
          pronunciation: "엣토... 모오 이치도 오네가이시마스...",
          quality: "bad",
          damage: 15,
          feedback: "'もう一度お願いします(한 번 더 부탁해요)'는 유용한 표현이지만, 바쁜 행인에게 여러 번 반복하게 하면 미안하죠!",
          npcEmotion: "confused",
          nextStepId: "directions-recovery-3",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜を右/左に曲がってください",
          patternKo: "〜에서 오른쪽/왼쪽으로 꺾어주세요",
          explanation: "'曲がる(まがる)'는 '돌다/꺾다'. 방향 + に + 曲がる로 어느 쪽으로 꺾는지 표현해요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "交差点",
            reading: "こうさてん",
            pronunciation: "코오사텐",
            meaning: "교차로",
          },
          {
            word: "右",
            reading: "みぎ",
            pronunciation: "미기",
            meaning: "오른쪽",
          },
          {
            word: "まっすぐ",
            reading: "まっすぐ",
            pronunciation: "맛스구",
            meaning: "곧장, 쭉",
          },
        ],
        kanjiChallenge: {
          kanji: "右",
          correctReading: "みぎ",
          wrongReadings: ["ひだり", "うえ", "した"],
          meaning: "오른쪽",
          hint: "'口(입)'에 'ナ(나)'를 쓰는 손 = 오른손!",
        },
      },
    },

    // ============================================================
    // RECOVERY 3: 방향 재설명
    // ============================================================
    {
      id: "directions-recovery-3",
      npcLine: "あ、大丈夫ですよ。ゆっくり言いますね。この道をまっすぐ。そして二つ目の交差点を右。わかりますか？",
      npcLineKo: "아, 괜찮아요. 천천히 말할게요. 이 길을 쭉. 그리고 두 번째 교차로에서 오른쪽. 알겠어요?",
      npcLinePronunciation: "아, 다이죠오부 데스요. 유쿠리 이이마스네. 코노 미치오 맛스구. 소시테 후타츠메노 코오사텐오 미기. 와카리마스카?",
      npcEmotion: "neutral",
      choices: [
        {
          id: "directions-r3-best",
          text: "まっすぐ行って、二つ目の交差点を右！わかりました！",
          textKo: "쭉 가서, 두 번째 교차로에서 오른쪽! 알겠습니다!",
          pronunciation: "맛스구 잇테, 후타츠메노 코오사텐오 미기! 와카리마시타!",
          quality: "best",
          damage: 0,
          feedback: "이번엔 완벽하게 복창했어요! 천천히 들으니 이해할 수 있었죠? 잘했어요!",
          npcEmotion: "happy",
          nextStepId: "directions-4",
        },
        {
          id: "directions-r3-ok",
          text: "右ですね。わかりました。",
          textKo: "오른쪽이요. 알겠습니다.",
          pronunciation: "미기 데스네. 와카리마시타.",
          quality: "ok",
          damage: 10,
          feedback: "핵심 방향은 파악했어요! '交差点'도 기억해두면 더 좋겠어요.",
          npcEmotion: "neutral",
          nextStepId: "directions-4",
        },
        {
          id: "directions-r3-bad",
          text: "うーん、難しい...",
          textKo: "음, 어렵다...",
          pronunciation: "우운, 무즈카시이...",
          quality: "bad",
          damage: 20,
          feedback: "어렵더라도 핵심만 확인해보세요! 'まっすぐ(쭉) → 交差点(교차로) → 右(오른쪽)' 이 3단어가 핵심이에요!",
          npcEmotion: "confused",
          nextStepId: "directions-4",
        },
      ],
      education: {
        keyExpression: {
          pattern: "わかりました",
          patternKo: "알겠습니다",
          explanation: "'わかる'는 '알다/이해하다'. 과거형 'わかりました'로 '이해했습니다'라는 뜻이 됩니다.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "左",
            reading: "ひだり",
            pronunciation: "히다리",
            meaning: "왼쪽",
          },
          {
            word: "二つ目",
            reading: "ふたつめ",
            pronunciation: "후타츠메",
            meaning: "두 번째",
          },
          {
            word: "難しい",
            reading: "むずかしい",
            pronunciation: "무즈카시이",
            meaning: "어렵다",
          },
        ],
        kanjiChallenge: {
          kanji: "左",
          correctReading: "ひだり",
          wrongReadings: ["みぎ", "さ", "ひらり"],
          meaning: "왼쪽",
          hint: "'工(공)'에 'ナ(나)'를 쓰는 손 = 왼손! 右와 구별하세요!",
        },
      },
    },

    // ============================================================
    // STEP 4: 추가 설명 - 역 이용
    // ============================================================
    {
      id: "directions-4",
      npcLine: "あ、でも歩くとちょっと遠いかな... 駅から電車で行った方が早いですよ。押上駅から一本です！",
      npcLineKo: "아, 근데 걸으면 좀 멀 수도... 역에서 전차로 가는 게 빨라요. 오시아게역에서 한 번에 가요!",
      npcLinePronunciation: "아, 데모 아루쿠토 촛토 토오이 카나... 에키카라 덴샤데 잇타 호오가 하야이 데스요. 오시아게 에키카라 잇폰 데스!",
      npcEmotion: "neutral",
      choices: [
        {
          id: "directions-4-best",
          text: "駅はどこですか？東口はどちらですか？",
          textKo: "역은 어디예요? 동쪽 출구는 어느 쪽이에요?",
          pronunciation: "에키와 도코 데스카? 히가시구치와 도치라 데스카?",
          quality: "best",
          damage: 0,
          feedback: "훌륭해요! '駅(えき)'와 '東口(ひがしぐち)'를 정확히 사용했어요! 구체적인 질문이 길을 찾는 핵심이에요.",
          npcEmotion: "happy",
          nextStepId: "directions-5",
        },
        {
          id: "directions-4-ok",
          text: "駅はどこですか？",
          textKo: "역은 어디예요?",
          pronunciation: "에키와 도코 데스카?",
          quality: "ok",
          damage: 10,
          feedback: "역 위치를 물어봤어요. 좋아요! 'どちらの出口(어느 출구)'인지도 물어보면 더 완벽해요.",
          npcEmotion: "neutral",
          nextStepId: "directions-5",
        },
        {
          id: "directions-4-bad",
          text: "歩きます。大丈夫です。",
          textKo: "걸을게요. 괜찮아요.",
          pronunciation: "아루키마스. 다이죠오부 데스.",
          quality: "bad",
          damage: 15,
          feedback: "걸어갈 수는 있지만 꽤 먼데... 현지인의 조언을 듣는 것도 여행의 지혜예요! 전철이 훨씬 빨라요.",
          npcEmotion: "confused",
          nextStepId: "directions-5",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜から電車で行った方がいい",
          patternKo: "〜에서 전차로 가는 게 좋다",
          explanation: "'〜た方がいい'는 '~하는 편이 좋다'라는 조언/추천 표현. 일본인이 자주 써요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "駅",
            reading: "えき",
            pronunciation: "에키",
            meaning: "역",
          },
          {
            word: "東口",
            reading: "ひがしぐち",
            pronunciation: "히가시구치",
            meaning: "동쪽 출구",
          },
          {
            word: "電車",
            reading: "でんしゃ",
            pronunciation: "덴샤",
            meaning: "전철",
          },
        ],
        kanjiChallenge: {
          kanji: "東口",
          correctReading: "ひがしぐち",
          wrongReadings: ["とうぐち", "ひがしくち", "あずまぐち"],
          meaning: "동쪽 출구",
          hint: "'東'은 동쪽(ひがし), '口'는 입구/출구(ぐち). 역 출구 이름에 자주 나와요!",
        },
      },
    },

    // ============================================================
    // STEP 5: 역까지 상세 안내
    // ============================================================
    {
      id: "directions-5",
      npcLine: "駅はね、さっき言った交差点を右に曲がったら、左側にすぐ見えますよ。東口から入ってください。",
      npcLineKo: "역은요, 아까 말한 교차로에서 오른쪽으로 꺾으면, 왼쪽에 바로 보여요. 동쪽 출구로 들어가세요.",
      npcLinePronunciation: "에키와네, 삿키 잇타 코오사텐오 미기니 마갓타라, 히다리가와니 스구 미에마스요. 히가시구치카라 하잇테 쿠다사이.",
      npcEmotion: "neutral",
      choices: [
        {
          id: "directions-5-best",
          text: "交差点を右に曲がって、左側に駅。東口ですね！",
          textKo: "교차로에서 오른쪽으로 꺾고, 왼쪽에 역. 동쪽 출구요!",
          pronunciation: "코오사텐오 미기니 마갓테, 히다리가와니 에키. 히가시구치 데스네!",
          quality: "best",
          damage: 0,
          feedback: "완벽한 요약! 교차로 → 오른쪽 → 왼쪽에 역 → 동쪽 출구. 방향 감각이 훌륭해요!",
          npcEmotion: "happy",
          nextStepId: "directions-6",
        },
        {
          id: "directions-5-ok",
          text: "左側ですね。ありがとうございます。",
          textKo: "왼쪽이요. 감사합니다.",
          pronunciation: "히다리가와 데스네. 아리가또 고자이마스.",
          quality: "ok",
          damage: 10,
          feedback: "'左側(ひだりがわ)'를 확인했어요! 전체 경로를 복창하면 더 확실해져요.",
          npcEmotion: "neutral",
          nextStepId: "directions-6",
        },
        {
          id: "directions-5-bad",
          text: "左？右？どっち？？",
          textKo: "왼쪽? 오른쪽? 어느 쪽??",
          pronunciation: "히다리? 미기? 돗치??",
          quality: "bad",
          damage: 20,
          feedback: "혼란스럽죠! 정리하면: 교차로에서 '右(みぎ/오른쪽)' → 역은 '左側(ひだりがわ/왼쪽)' 에 보여요!",
          npcEmotion: "confused",
          nextStepId: "directions-recovery-4",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜を右/左に曲がったら、〜に見えます",
          patternKo: "〜에서 오른쪽/왼쪽으로 꺾으면, 〜에 보여요",
          explanation: "'〜たら'는 '~하면'이라는 조건 표현. '見える(みえる)'는 '보이다'.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "左側",
            reading: "ひだりがわ",
            pronunciation: "히다리가와",
            meaning: "왼쪽 편",
          },
          {
            word: "すぐ",
            reading: "すぐ",
            pronunciation: "스구",
            meaning: "바로, 곧",
          },
          {
            word: "入る",
            reading: "はいる",
            pronunciation: "하이루",
            meaning: "들어가다",
          },
        ],
        kanjiChallenge: {
          kanji: "交差点",
          correctReading: "こうさてん",
          wrongReadings: ["こうさつてん", "まじわりてん", "こさてん"],
          meaning: "교차로",
          hint: "'交'는 사귀다/교차하다, '差'는 차이, '点'은 점. 길이 교차하는 지점!",
        },
      },
    },

    // ============================================================
    // RECOVERY 4: 방향 혼란 정리
    // ============================================================
    {
      id: "directions-recovery-4",
      npcLine: "あ、ごめんなさい、ちょっとわかりにくかったですね。じゃあ簡単に言うと：まっすぐ行って、右に曲がる。駅は左にあります。OK？",
      npcLineKo: "아, 미안해요, 좀 이해하기 어려웠죠. 그럼 간단하게 말하면: 쭉 가서, 오른쪽으로 꺾기. 역은 왼쪽에 있어요. OK?",
      npcLinePronunciation: "아, 고멘나사이, 촛토 와카리니쿠캇타 데스네. 쟈아 칸탄니 이우토: 맛스구 잇테, 미기니 마가루. 에키와 히다리니 아리마스. 오게이?",
      npcEmotion: "neutral",
      choices: [
        {
          id: "directions-r4-best",
          text: "まっすぐ、右、駅は左！わかりました！",
          textKo: "쭉, 오른쪽, 역은 왼쪽! 알겠습니다!",
          pronunciation: "맛스구, 미기, 에키와 히다리! 와카리마시타!",
          quality: "best",
          damage: 0,
          feedback: "핵심을 3단어로 정리! 'まっすぐ → 右 → 左に駅'. 이제 완벽해요!",
          npcEmotion: "happy",
          nextStepId: "directions-6",
        },
        {
          id: "directions-r4-ok",
          text: "わかりました！右ですね。",
          textKo: "알겠어요! 오른쪽이죠.",
          pronunciation: "와카리마시타! 미기 데스네.",
          quality: "ok",
          damage: 10,
          feedback: "방향은 파악했어요! 다음엔 전체 경로를 확인하는 연습을 해보세요.",
          npcEmotion: "neutral",
          nextStepId: "directions-6",
        },
        {
          id: "directions-r4-bad",
          text: "タクシーで行きます...",
          textKo: "택시로 갈게요...",
          pronunciation: "타쿠시이데 이키마스...",
          quality: "bad",
          damage: 25,
          feedback: "포기하면 안 돼요! 핵심 3단어만 기억하세요: まっすぐ(쭉) → 右(오른쪽) → 左に駅(왼쪽에 역)!",
          npcEmotion: "confused",
          nextStepId: "directions-6",
        },
      ],
      education: {
        keyExpression: {
          pattern: "簡単に言うと",
          patternKo: "간단하게 말하면",
          explanation: "'簡単(かんたん)'은 '간단'. 복잡한 설명을 정리할 때 일본인이 자주 쓰는 표현이에요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "簡単",
            reading: "かんたん",
            pronunciation: "칸탄",
            meaning: "간단한",
          },
          {
            word: "わかりにくい",
            reading: "わかりにくい",
            pronunciation: "와카리니쿠이",
            meaning: "이해하기 어렵다",
          },
        ],
      },
    },

    // ============================================================
    // STEP 6: 소요 시간 확인
    // ============================================================
    {
      id: "directions-6",
      npcLine: "駅からは電車で二駅ですから、十分もかかりませんよ。",
      npcLineKo: "역에서 전철로 두 정거장이니까, 10분도 안 걸려요.",
      npcLinePronunciation: "에키카라와 덴샤데 후타에키 데스카라, 줍푼모 카카리마센요.",
      npcEmotion: "neutral",
      choices: [
        {
          id: "directions-6-best",
          text: "十分ですか。近いですね！ありがとうございます。",
          textKo: "10분이요. 가깝네요! 감사합니다.",
          pronunciation: "줍푼 데스카. 치카이 데스네! 아리가또 고자이마스.",
          quality: "best",
          damage: 0,
          feedback: "'近い(ちかい/가깝다)'를 자연스럽게 사용했어요! 시간 정보도 정확히 파악했네요.",
          npcEmotion: "happy",
          nextStepId: "directions-7",
        },
        {
          id: "directions-6-ok",
          text: "ありがとうございます！",
          textKo: "감사합니다!",
          pronunciation: "아리가또 고자이마스!",
          quality: "ok",
          damage: 5,
          feedback: "감사 인사는 좋아요! 소요 시간을 확인하면 더 좋겠어요.",
          npcEmotion: "neutral",
          nextStepId: "directions-7",
        },
        {
          id: "directions-6-bad",
          text: "十分？遠い...",
          textKo: "10분? 멀다...",
          pronunciation: "줍푼? 토오이...",
          quality: "bad",
          damage: 15,
          feedback: "전철로 10분이면 가까운 거예요! '遠い(とおい/멀다)'가 아니라 '近い(ちかい/가깝다)'! 도쿄에서 10분은 매우 가까운 거리예요.",
          npcEmotion: "confused",
          nextStepId: "directions-7",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜分もかかりません",
          patternKo: "〜분도 안 걸려요",
          explanation: "'かかる'는 '(시간이) 걸리다'. 'かかりません'은 부정형으로 '걸리지 않는다'는 뜻.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "近い",
            reading: "ちかい",
            pronunciation: "치카이",
            meaning: "가깝다",
          },
          {
            word: "遠い",
            reading: "とおい",
            pronunciation: "토오이",
            meaning: "멀다",
          },
          {
            word: "十分",
            reading: "じゅっぷん",
            pronunciation: "줍푼",
            meaning: "10분",
          },
        ],
      },
    },

    // ============================================================
    // STEP 7: 방향 최종 확인 [milestone: confirm_direction]
    // ============================================================
    {
      id: "directions-7",
      npcLine: "じゃあ、大丈夫そうですか？方向、わかりましたか？",
      npcLineKo: "그럼, 괜찮을 것 같아요? 방향, 이해했어요?",
      npcLinePronunciation: "쟈아, 다이죠오부 소오 데스카? 호오코오, 와카리마시타카?",
      npcEmotion: "neutral",
      isMilestone: true,
      milestoneTag: "confirm_direction",
      choices: [
        {
          id: "directions-7-best",
          text: "はい！この道をまっすぐ、二つ目の交差点を右、左に駅、東口から押上駅まで電車！完璧です！",
          textKo: "네! 이 길을 쭉, 두 번째 교차로에서 오른쪽, 왼쪽에 역, 동쪽 출구에서 오시아게역까지 전철! 완벽해요!",
          pronunciation: "하이! 코노 미치오 맛스구, 후타츠메노 코오사텐오 미기, 히다리니 에키, 히가시구치카라 오시아게에키마데 덴샤! 캄페키 데스!",
          quality: "best",
          damage: 0,
          feedback: "전체 경로를 완벽하게 복창했어요! 길 찾기 마스터! 일본 여행 문제없겠어요!",
          npcEmotion: "happy",
          nextStepId: "directions-8",
        },
        {
          id: "directions-7-ok",
          text: "はい、わかりました。まっすぐ行って右ですね！",
          textKo: "네, 알겠어요. 쭉 가서 오른쪽이요!",
          pronunciation: "하이, 와카리마시타. 맛스구 잇테 미기 데스네!",
          quality: "ok",
          damage: 10,
          feedback: "핵심 방향은 파악했어요! 역과 출구 이름도 기억해두면 더 좋아요.",
          npcEmotion: "happy",
          nextStepId: "directions-8",
        },
        {
          id: "directions-7-bad",
          text: "たぶん... 大丈夫です...",
          textKo: "아마... 괜찮을 거예요...",
          pronunciation: "타분... 다이죠오부 데스...",
          quality: "bad",
          damage: 20,
          feedback: "'たぶん(아마)'이라니 불안해요! 확실히 '右に曲がる(오른쪽으로 꺾다)'를 기억하고 있는지 확인하세요!",
          npcEmotion: "confused",
          nextStepId: "directions-8",
        },
      ],
      education: {
        keyExpression: {
          pattern: "方向、わかりましたか？",
          patternKo: "방향, 이해했어요?",
          explanation: "'方向(ほうこう)'는 '방향'. 상대가 이해했는지 확인하는 표현이에요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "方向",
            reading: "ほうこう",
            pronunciation: "호오코오",
            meaning: "방향",
          },
          {
            word: "完璧",
            reading: "かんぺき",
            pronunciation: "캄페키",
            meaning: "완벽",
          },
          {
            word: "たぶん",
            reading: "たぶん",
            pronunciation: "타분",
            meaning: "아마, 아마도",
          },
        ],
      },
    },

    // ============================================================
    // STEP 8: 추가 팁
    // ============================================================
    {
      id: "directions-8",
      npcLine: "あ、そうだ！押上駅に着いたら、東口から出てくださいね。スカイツリーの入口は東口が近いですから。",
      npcLineKo: "아, 맞다! 오시아게역에 도착하면, 동쪽 출구로 나와주세요. 스카이트리 입구는 동쪽 출구가 가까우니까.",
      npcLinePronunciation: "아, 소오다! 오시아게에키니 츠이타라, 히가시구치카라 데테 쿠다사이네. 스카이츠리이노 이리구치와 히가시구치가 치카이 데스카라.",
      npcEmotion: "happy",
      choices: [
        {
          id: "directions-8-best",
          text: "東口ですね！覚えました。本当にありがとうございます！",
          textKo: "동쪽 출구요! 기억했어요. 정말 감사합니다!",
          pronunciation: "히가시구치 데스네! 오보에마시타. 혼토오니 아리가또 고자이마스!",
          quality: "best",
          damage: 0,
          feedback: "'覚えました(おぼえました/기억했어요)'를 사용해서 확실히 기억했다는 걸 전달했어요! 감사 인사도 완벽!",
          npcEmotion: "happy",
          nextStepId: "directions-9",
        },
        {
          id: "directions-8-ok",
          text: "東口ですね。ありがとうございます！",
          textKo: "동쪽 출구요. 감사합니다!",
          pronunciation: "히가시구치 데스네. 아리가또 고자이마스!",
          quality: "ok",
          damage: 5,
          feedback: "핵심 정보 '東口'를 확인하고 감사했어요. 잘 했어요!",
          npcEmotion: "happy",
          nextStepId: "directions-9",
        },
        {
          id: "directions-8-bad",
          text: "東口？西口？何口？",
          textKo: "동쪽 출구? 서쪽 출구? 무슨 출구?",
          pronunciation: "히가시구치? 니시구치? 나니구치?",
          quality: "bad",
          damage: 15,
          feedback: "'東口(ひがしぐち/동쪽 출구)'예요! '東(ひがし)'는 동쪽, '西(にし)'는 서쪽. 방향 한자를 외워두세요!",
          npcEmotion: "confused",
          nextStepId: "directions-9",
        },
      ],
      education: {
        keyExpression: {
          pattern: "〜に着いたら",
          patternKo: "〜에 도착하면",
          explanation: "'着く(つく)'는 '도착하다'. '着いたら'는 '도착하면'이라는 조건 표현.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "入口",
            reading: "いりぐち",
            pronunciation: "이리구치",
            meaning: "입구",
          },
          {
            word: "出口",
            reading: "でぐち",
            pronunciation: "데구치",
            meaning: "출구",
          },
          {
            word: "覚える",
            reading: "おぼえる",
            pronunciation: "오보에루",
            meaning: "기억하다, 외우다",
          },
        ],
      },
    },

    // ============================================================
    // STEP 9: 마지막 인사 (FINAL)
    // ============================================================
    {
      id: "directions-9",
      npcLine: "いい旅を！スカイツリー、楽しんでくださいね！じゃあ、気をつけて！",
      npcLineKo: "좋은 여행 되세요! 스카이트리, 즐기세요! 그럼, 조심해서!",
      npcLinePronunciation: "이이 타비오! 스카이츠리이, 타노신데 쿠다사이네! 쟈아, 키오 츠케테!",
      npcEmotion: "happy",
      choices: [
        {
          id: "directions-9-best",
          text: "本当に助かりました！ありがとうございます！いい一日を！",
          textKo: "정말 도움이 됐어요! 감사합니다! 좋은 하루 되세요!",
          pronunciation: "혼토오니 타스카리마시타! 아리가또 고자이마스! 이이 이치니치오!",
          quality: "best",
          damage: 0,
          feedback: "최고의 마무리! '助かりました(たすかりました/도움이 됐어요)'는 도움 받았을 때 쓰는 완벽한 감사 표현이에요!",
          npcEmotion: "happy",
          nextStepId: "END",
        },
        {
          id: "directions-9-ok",
          text: "ありがとうございます！頑張ります！",
          textKo: "감사합니다! 힘내볼게요!",
          pronunciation: "아리가또 고자이마스! 감바리마스!",
          quality: "ok",
          damage: 5,
          feedback: "'頑張ります(がんばります)'는 '힘내겠습니다'. 감사 인사와 함께 의지를 보여줬어요!",
          npcEmotion: "happy",
          nextStepId: "END",
        },
        {
          id: "directions-9-bad",
          text: "バイバイ！",
          textKo: "바이바이!",
          pronunciation: "바이바이!",
          quality: "bad",
          damage: 15,
          feedback: "'バイバイ'는 친구 사이에서 쓰는 캐주얼한 인사예요. 도움을 준 사람에게는 'ありがとうございます'가 기본이에요!",
          npcEmotion: "neutral",
          nextStepId: "END",
        },
      ],
      education: {
        keyExpression: {
          pattern: "助かりました",
          patternKo: "도움이 됐어요",
          explanation: "'助かる(たすかる)'는 '도움이 되다'. 누군가에게 도움을 받았을 때 감사를 표현하는 자연스러운 일본어예요.",
          formality: "polite",
        },
        vocabulary: [
          {
            word: "助かる",
            reading: "たすかる",
            pronunciation: "타스카루",
            meaning: "도움이 되다",
          },
          {
            word: "気をつけて",
            reading: "きをつけて",
            pronunciation: "키오 츠케테",
            meaning: "조심해서 (가세요)",
          },
          {
            word: "旅",
            reading: "たび",
            pronunciation: "타비",
            meaning: "여행",
          },
        ],
      },
    },
  ],
};
