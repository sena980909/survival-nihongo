export type ScenarioCategory =
  | "airport"
  | "food"
  | "transport"
  | "accommodation"
  | "shopping"
  | "daily"
  | "emergency";

export interface KeyExpression {
  japanese: string;
  reading: string;
  korean: string;
  koreanPronunciation: string;
  usage: string;
}

export interface KanjiItem {
  kanji: string;
  reading: string;
  koreanPronunciation: string;
  meaning: string;
  context: string;
}

export interface Scenario {
  id: string;
  category: ScenarioCategory;
  name: string;
  nameJa: string;
  description: string;
  emoji: string;
  npcName: string;
  npcRole: string;
  learningObjectives: string[];
  keyExpressions: KeyExpression[];
  kanjiList: KanjiItem[];
  estimatedMinutes: number;
  systemPrompt: string;
}

export const categoryInfo: Record<
  ScenarioCategory,
  { name: string; emoji: string; color: string }
> = {
  airport: { name: "공항", emoji: "✈️", color: "blue" },
  food: { name: "음식", emoji: "🍽️", color: "orange" },
  transport: { name: "교통", emoji: "🚃", color: "green" },
  accommodation: { name: "숙소", emoji: "🏨", color: "purple" },
  shopping: { name: "쇼핑", emoji: "🛍️", color: "pink" },
  daily: { name: "일상", emoji: "💬", color: "teal" },
  emergency: { name: "긴급", emoji: "🏥", color: "red" },
};

export const scenarios: Scenario[] = [
  // ===== 공항 =====
  {
    id: "airport-immigration",
    category: "airport",
    name: "입국심사",
    nameJa: "入国審査",
    description:
      "나리타 공항에 도착했습니다. 입국심사대에서 심사관과 대화해봅시다.",
    emoji: "🛂",
    npcName: "심사관",
    npcRole: "入国審査官",
    learningObjectives: [
      "です/ます 경어 사용하기",
      "체류 목적 표현하기",
      "숫자 + 기간 말하기",
    ],
    keyExpressions: [
      {
        japanese: "観光です",
        reading: "かんこうです",
        korean: "관광입니다",
        koreanPronunciation: "캉코-데스",
        usage: "체류 목적을 물어볼 때",
      },
      {
        japanese: "五日間です",
        reading: "いつかかんです",
        korean: "5일간입니다",
        koreanPronunciation: "이츠카캉데스",
        usage: "체류 기간을 답할 때",
      },
      {
        japanese: "ホテルに泊まります",
        reading: "ホテルにとまります",
        korean: "호텔에 묵습니다",
        koreanPronunciation: "호테루니 토마리마스",
        usage: "숙소를 답할 때",
      },
    ],
    kanjiList: [
      {
        kanji: "入国",
        reading: "にゅうこく",
        koreanPronunciation: "뉴-코쿠",
        meaning: "입국",
        context: "나라에 들어가는 것",
      },
      {
        kanji: "審査",
        reading: "しんさ",
        koreanPronunciation: "신사",
        meaning: "심사",
        context: "서류나 자격을 확인하는 것",
      },
      {
        kanji: "観光",
        reading: "かんこう",
        koreanPronunciation: "캉코-",
        meaning: "관광",
        context: "여행하며 구경하는 것",
      },
    ],
    estimatedMinutes: 5,
    systemPrompt: `あなたは成田空港の入国審査官です。以下のルールを厳守してください：

【ペルソナ】
- 真面目で厳格な入国審査官
- 丁寧語（です・ます）を使うが、表情は硬い
- 外国人に慣れているので、ゆっくり話す

【会話の流れ】
1. まず「パスポートを見せてください」から始める
2. 旅行の目的を聞く（観光？仕事？）
3. 滞在期間を聞く
4. 滞在先を聞く
5. 全て適切に答えられたら通過させる

【教育ガイダンス】
- bestを選んだ場合: NPCは自然に会話を進める。feedbackで褒めてポイントを説明
- acceptableを選んだ場合: NPCは理解して進めるが、feedbackでより自然な表現を紹介
- poorを選んだ場合: NPCは少し困惑するが親切に対応。feedbackで正しい表現と理由を説明

【学習ポイント】
- です/ます の丁寧表現
- 数字＋期間（〇日間、〇泊）
- 場所の表現（〇〇ホテル、〇〇に泊まります）

【完了条件】
- 滞在目的・期間・場所の3つを伝えたら conversation_status: "completed"`,
  },

  // ===== 교통 =====
  {
    id: "asking-directions",
    category: "transport",
    name: "길 묻기",
    nameJa: "道を聞く",
    description:
      "구글맵이 안 됩니다. 스카이트리까지 가야 하는데 지나가는 사람에게 길을 물어봅시다.",
    emoji: "🗺️",
    npcName: "행인",
    npcRole: "通行人",
    learningObjectives: [
      "길을 정중하게 묻기",
      "방향 표현 이해하기",
      "확인/되묻기 표현",
    ],
    keyExpressions: [
      {
        japanese: "すみません、道を教えてください",
        reading: "すみません、みちをおしえてください",
        korean: "실례합니다, 길을 알려주세요",
        koreanPronunciation: "스미마셍, 미치오 오시에테 쿠다사이",
        usage: "처음 말을 걸 때",
      },
      {
        japanese: "右に曲がるんですね",
        reading: "みぎにまがるんですね",
        korean: "오른쪽으로 도는 거죠?",
        koreanPronunciation: "미기니 마가룬데스네",
        usage: "방향을 확인할 때",
      },
      {
        japanese: "ありがとうございます",
        reading: "ありがとうございます",
        korean: "감사합니다",
        koreanPronunciation: "아리가또고자이마스",
        usage: "감사 인사",
      },
    ],
    kanjiList: [
      {
        kanji: "右",
        reading: "みぎ",
        koreanPronunciation: "미기",
        meaning: "오른쪽",
        context: "방향을 나타낼 때",
      },
      {
        kanji: "左",
        reading: "ひだり",
        koreanPronunciation: "히다리",
        meaning: "왼쪽",
        context: "방향을 나타낼 때",
      },
      {
        kanji: "交差点",
        reading: "こうさてん",
        koreanPronunciation: "코-사텡",
        meaning: "교차로",
        context: "도로가 만나는 지점",
      },
      {
        kanji: "駅",
        reading: "えき",
        koreanPronunciation: "에키",
        meaning: "역",
        context: "전철이나 기차가 정차하는 곳",
      },
    ],
    estimatedMinutes: 5,
    systemPrompt: `あなたは東京の街を歩いている日本人の通行人です。以下のルールを厳守してください：

【ペルソナ】
- 急いでいるけど外国人には親切にしようとする一般人
- 自然な日本語を使う
- 方向を身振り手振りで説明するような話し方

【会話の流れ】
1. ユーザーが話しかけてくるのを待つ（最初は「はい？」と返す）
2. 道を聞かれたら「ああ、スカイツリーですね」と確認
3. 方向を説明する：「この道をまっすぐ行って、二つ目の交差点を右に曲がって...」
4. 駅を使うことも提案する
5. 最後に「頑張ってね！」と励ます

【教育ガイダンス】
- bestを選んだ場合: 通行人は嬉しそうに教える。feedbackで丁寧な聞き方のポイントを説明
- acceptableを選んだ場合: 通行人は理解する。feedbackでより自然な道の聞き方を紹介
- poorを選んだ場合: 通行人は困惑するが親切に対応。feedbackで正しい表現を説明

【学習ポイント】
- すみません の使い方
- 方向の表現（右、左、まっすぐ）
- 確認の表現（〜んですね？）

【完了条件】
- 丁寧に道を聞いて、方向を確認できたら conversation_status: "completed"`,
  },
  {
    id: "taxi-ride",
    category: "transport",
    name: "택시 타기",
    nameJa: "タクシー",
    description:
      "짐이 많아서 택시를 탔습니다. 기사님에게 목적지를 알려주고 요금을 확인해봅시다.",
    emoji: "🚕",
    npcName: "택시 기사",
    npcRole: "タクシー運転手",
    learningObjectives: [
      "목적지 전달하기",
      "경유지/요청 표현",
      "요금 확인하기",
    ],
    keyExpressions: [
      {
        japanese: "東京タワーまでお願いします",
        reading: "とうきょうタワーまでおねがいします",
        korean: "도쿄타워까지 부탁합니다",
        koreanPronunciation: "토-쿄-타와-마데 오네가이시마스",
        usage: "목적지를 말할 때",
      },
      {
        japanese: "ここで止めてください",
        reading: "ここでとめてください",
        korean: "여기서 세워주세요",
        koreanPronunciation: "코코데 토메테 쿠다사이",
        usage: "내릴 곳을 지정할 때",
      },
      {
        japanese: "いくらですか",
        reading: "いくらですか",
        korean: "얼마예요?",
        koreanPronunciation: "이쿠라데스카",
        usage: "요금을 물어볼 때",
      },
    ],
    kanjiList: [
      {
        kanji: "右折",
        reading: "うせつ",
        koreanPronunciation: "우세츠",
        meaning: "우회전",
        context: "택시 기사에게 방향을 알려줄 때",
      },
      {
        kanji: "左折",
        reading: "させつ",
        koreanPronunciation: "사세츠",
        meaning: "좌회전",
        context: "택시 기사에게 방향을 알려줄 때",
      },
      {
        kanji: "信号",
        reading: "しんごう",
        koreanPronunciation: "싱고-",
        meaning: "신호등",
        context: "교차로의 신호등",
      },
    ],
    estimatedMinutes: 5,
    systemPrompt: `あなたはタクシーの運転手です。以下のルールを厳守してください：

【ペルソナ】
- ベテランで穏やかなタクシー運転手
- 丁寧だが親しみやすい
- 外国人客にも慣れている

【会話の流れ】
1. 「どちらまで？」から始める
2. 目的地を聞いたら「○○ですね、かしこまりました」と確認
3. 道中「渋滞していますね」などの世間話
4. 到着したら「着きましたよ」と伝える
5. 料金を伝えて「ありがとうございました」

【教育ガイダンス】
- bestを選んだ場合: 運転手はスムーズに対応。feedbackで使った表現を褒める
- acceptableを選んだ場合: 運転手は理解する。feedbackでより自然な表現を紹介
- poorを選んだ場合: 運転手は聞き返す。feedbackで正しい伝え方を説明

【学習ポイント】
- 〜までお願いします（目的地の伝え方）
- 〜てください（依頼表現）
- 料金の確認表現

【完了条件】
- 目的地を伝えて、到着後に料金を確認したら conversation_status: "completed"`,
  },
  {
    id: "train-station",
    category: "transport",
    name: "기차역",
    nameJa: "駅",
    description:
      "전철을 타고 이동해야 합니다. 역 창구에서 표를 사고 타는 곳을 확인해봅시다.",
    emoji: "🚃",
    npcName: "역무원",
    npcRole: "駅員",
    learningObjectives: [
      "표 구매하기",
      "노선/플랫폼 확인하기",
      "환승 방법 묻기",
    ],
    keyExpressions: [
      {
        japanese: "渋谷までの切符をください",
        reading: "しぶやまでのきっぷをください",
        korean: "시부야까지 표 주세요",
        koreanPronunciation: "시부야마데노 킷푸오 쿠다사이",
        usage: "표를 살 때",
      },
      {
        japanese: "何番線ですか",
        reading: "なんばんせんですか",
        korean: "몇 번 선이에요?",
        koreanPronunciation: "남방셍데스카",
        usage: "플랫폼을 물어볼 때",
      },
      {
        japanese: "乗り換えはありますか",
        reading: "のりかえはありますか",
        korean: "환승이 있나요?",
        koreanPronunciation: "노리카에와 아리마스카",
        usage: "환승 여부를 확인할 때",
      },
    ],
    kanjiList: [
      {
        kanji: "切符",
        reading: "きっぷ",
        koreanPronunciation: "킷푸",
        meaning: "표 (승차권)",
        context: "전철이나 기차를 탈 때 필요한 표",
      },
      {
        kanji: "乗換",
        reading: "のりかえ",
        koreanPronunciation: "노리카에",
        meaning: "환승",
        context: "다른 노선으로 갈아타는 것",
      },
      {
        kanji: "出口",
        reading: "でぐち",
        koreanPronunciation: "데구치",
        meaning: "출구",
        context: "역이나 건물에서 나가는 곳",
      },
    ],
    estimatedMinutes: 6,
    systemPrompt: `あなたは駅の窓口にいる駅員です。以下のルールを厳守してください：

【ペルソナ】
- 親切で丁寧な駅員
- 外国人観光客に慣れている
- わかりやすく説明しようとする

【会話の流れ】
1. 「はい、いらっしゃいませ」から始める
2. 行き先を聞く
3. 切符の種類を案内する（片道/往復）
4. 何番線か、乗り換えの有無を説明する
5. 「お気をつけて」と見送る

【教育ガイダンス】
- bestを選んだ場合: 駅員はスムーズに案内。feedbackで交通関連表現を説明
- acceptableを選んだ場合: 駅員は理解して案内。feedbackでより正確な表現を紹介
- poorを選んだ場合: 駅員は丁寧に聞き返す。feedbackで正しい聞き方を説明

【学習ポイント】
- 〜までの切符（目的地＋切符の表現）
- 何番線（プラットフォームの聞き方）
- 乗り換え関連の表現

【完了条件】
- 切符を購入し、乗る場所を確認したら conversation_status: "completed"`,
  },
  {
    id: "narita-skyliner",
    category: "transport",
    name: "나리타→우에노 (스카이라이너)",
    nameJa: "成田空港→上野（スカイライナー）",
    description:
      "나리타 공항에서 우에노까지 스카이라이너 또는 버스 표를 현장에서 구매해봅시다.",
    emoji: "🚄",
    npcName: "매표소 직원",
    npcRole: "京成電鉄のチケットカウンター職員",
    learningObjectives: [
      "교통편 표 현장 구매하기",
      "목적지와 좌석 요청하기",
      "출발 시간 확인하기",
    ],
    keyExpressions: [
      {
        japanese: "上野までのスカイライナーをお願いします",
        reading: "うえのまでのスカイライナーをおねがいします",
        korean: "우에노까지 스카이라이너 부탁합니다",
        koreanPronunciation: "우에노마데노 스카이라이나-오 오네가이시마스",
        usage: "스카이라이너 표를 구매할 때",
      },
      {
        japanese: "次の便は何時ですか",
        reading: "つぎのびんはなんじですか",
        korean: "다음 편은 몇 시인가요",
        koreanPronunciation: "츠기노 빙와 난지데스카",
        usage: "출발 시간을 물어볼 때",
      },
      {
        japanese: "バスと電車、どちらが早いですか",
        reading: "バスとでんしゃ、どちらがはやいですか",
        korean: "버스와 전철, 어느 쪽이 빠른가요",
        koreanPronunciation: "바스토 덴샤, 도치라가 하야이데스카",
        usage: "교통수단을 비교할 때",
      },
    ],
    kanjiList: [
      {
        kanji: "空港",
        reading: "くうこう",
        koreanPronunciation: "쿠-코-",
        meaning: "공항",
        context: "飛行機が発着する場所",
      },
      {
        kanji: "片道",
        reading: "かたみち",
        koreanPronunciation: "카타미치",
        meaning: "편도",
        context: "行きだけの切符",
      },
      {
        kanji: "指定席",
        reading: "していせき",
        koreanPronunciation: "시테-세키",
        meaning: "지정석",
        context: "座席が決まっている切符",
      },
    ],
    estimatedMinutes: 5,
    systemPrompt: `あなたは成田空港の京成電鉄チケットカウンターの職員です。
名前：山田（やまだ）
性格：親切で効率的。外国人旅行者の対応に慣れている。

【シナリオ設定】
成田空港第1ターミナルの京成線チケットカウンター。
ユーザー（韓国人旅行者）が上野方面の切符を買いに来た。

【会話の流れ】
1. 「いらっしゃいませ」から始める
2. 行き先と交通手段（スカイライナー/アクセス特急/バス）を確認
3. 片道・往復、枚数を確認
4. 出発時間とホームの案内
5. 支払い

【教育ガイダンス】
- bestを選んだ場合: スムーズに対応。feedbackで交通関連の表現を説明
- acceptableを選んだ場合: 理解して対応。より正確な表現を紹介
- poorを選んだ場合: 優しく聞き返す。正しい伝え方を説明

【学習ポイント】
- 〇〇までお願いします（目的地の指定）
- 片道/往復の選択
- 出発時間の確認
- 支払い方法の指定

【完了条件】
- 切符を購入し、出発ホームを確認したら conversation_status: "completed"`,
  },

  {
    id: "ic-card",
    category: "transport",
    name: "IC카드 충전",
    nameJa: "ICカードチャージ",
    description:
      "IC카드(Suica/PASMO) 잔액이 부족합니다. 역의 충전기에서 충전하거나 역무원에게 도움을 요청해봅시다.",
    emoji: "💳",
    npcName: "역무원",
    npcRole: "駅員",
    learningObjectives: [
      "IC카드 충전 요청하기",
      "잔액 확인 표현",
      "금액 말하기",
    ],
    keyExpressions: [
      {
        japanese: "チャージしたいのですが",
        reading: "チャージしたいのですが",
        korean: "충전하고 싶은데요",
        koreanPronunciation: "차-지시타이노데스가",
        usage: "충전을 요청할 때",
      },
      {
        japanese: "残高が足りません",
        reading: "ざんだかがたりません",
        korean: "잔액이 부족합니다",
        koreanPronunciation: "잔다카가 타리마셍",
        usage: "잔액 부족을 말할 때",
      },
      {
        japanese: "千円お願いします",
        reading: "せんえんおねがいします",
        korean: "천 엔 부탁합니다",
        koreanPronunciation: "셍엥 오네가이시마스",
        usage: "충전 금액을 말할 때",
      },
    ],
    kanjiList: [
      {
        kanji: "残高",
        reading: "ざんだか",
        koreanPronunciation: "잔다카",
        meaning: "잔액",
        context: "카드에 남아있는 금액",
      },
      {
        kanji: "千円",
        reading: "せんえん",
        koreanPronunciation: "셍엥",
        meaning: "천 엔",
        context: "일본 화폐 단위",
      },
      {
        kanji: "精算",
        reading: "せいさん",
        koreanPronunciation: "세-상",
        meaning: "정산",
        context: "부족한 요금을 정산하는 것",
      },
    ],
    estimatedMinutes: 5,
    systemPrompt: `あなたは駅員です。以下のルールを厳守してください：

【ペルソナ】
- 丁寧で親切な駅員
- 外国人にもわかりやすく説明する
- ICカードの使い方を優しく教える

【会話の流れ】
1. 「どうされましたか？」から始める
2. ICカードの問題を確認する
3. チャージ方法を案内する
4. 金額を確認する
5. チャージ完了を伝える

【学習ポイント】
- チャージ関連の表現
- 金額の言い方
- 駅で使える基本表現

【完了条件】
- チャージが完了したら conversation_status: "completed"`,
  },

  // ===== 음식 =====
  {
    id: "convenience-store",
    category: "food",
    name: "편의점",
    nameJa: "コンビニ",
    description:
      "배가 고파서 편의점에 들어왔습니다. 도시락을 사면서 점원과 대화해봅시다.",
    emoji: "🏪",
    npcName: "편의점 점원",
    npcRole: "コンビニ店員",
    learningObjectives: [
      "요청 표현 (~てください)",
      "예/아니오 대답하기",
      "결제 수단 말하기",
    ],
    keyExpressions: [
      {
        japanese: "温めてください",
        reading: "あたためてください",
        korean: "데워 주세요",
        koreanPronunciation: "아타타메테 쿠다사이",
        usage: "도시락을 데워달라고 할 때",
      },
      {
        japanese: "袋はいらないです",
        reading: "ふくろはいらないです",
        korean: "봉투는 필요 없습니다",
        koreanPronunciation: "후쿠로와 이라나이데스",
        usage: "봉투를 거절할 때",
      },
      {
        japanese: "カードでお願いします",
        reading: "カードでおねがいします",
        korean: "카드로 부탁합니다",
        koreanPronunciation: "카-도데 오네가이시마스",
        usage: "카드 결제를 요청할 때",
      },
    ],
    kanjiList: [
      {
        kanji: "温める",
        reading: "あたためる",
        koreanPronunciation: "아타타메루",
        meaning: "데우다",
        context: "전자레인지로 음식을 데울 때",
      },
      {
        kanji: "袋",
        reading: "ふくろ",
        koreanPronunciation: "후쿠로",
        meaning: "봉투",
        context: "물건을 담는 비닐봉투",
      },
      {
        kanji: "現金",
        reading: "げんきん",
        koreanPronunciation: "겡킹",
        meaning: "현금",
        context: "지폐와 동전을 총칭",
      },
    ],
    estimatedMinutes: 5,
    systemPrompt: `あなたはコンビニのアルバイト店員です。以下のルールを厳守してください：

【ペルソナ】
- テキパキ動く若いアルバイト店員
- 丁寧だが早口
- マニュアル通りの接客

【会話の流れ】
1. 「いらっしゃいませ」から始める
2. お弁当をレジに持ってきたら「温めますか？」と聞く
3. 「袋はご利用ですか？」と聞く
4. お会計の方法を聞く「お支払いは？」
5. 全て完了したら「ありがとうございました」

【教育ガイダンス】
- bestを選んだ場合: 店員は自然に対応。feedbackで表現のポイントを説明
- acceptableを選んだ場合: 店員は理解して進める。feedbackでより自然な表現を紹介
- poorを選んだ場合: 店員は聞き返す。feedbackで正しい言い方を優しく説明

【学習ポイント】
- 〜てください（丁寧な依頼）
- はい/いいえ の使い分け
- 支払い方法の表現

【完了条件】
- 温め・袋・支払いの3つのやりとりを完了したら conversation_status: "completed"`,
  },
  {
    id: "izakaya",
    category: "food",
    name: "이자카야",
    nameJa: "居酒屋",
    description:
      "현지인이 추천해준 이자카야에 왔습니다. 메뉴를 보고 주문해봅시다.",
    emoji: "🍺",
    npcName: "이자카야 점원",
    npcRole: "居酒屋の店員",
    learningObjectives: [
      "추천 메뉴 물어보기",
      "음식/음료 주문하기",
      "이자카야 전문 용어 익히기",
    ],
    keyExpressions: [
      {
        japanese: "おすすめは何ですか",
        reading: "おすすめはなんですか",
        korean: "추천은 뭐예요?",
        koreanPronunciation: "오스스메와 난데스카",
        usage: "추천 메뉴를 물어볼 때",
      },
      {
        japanese: "生ビールを二つください",
        reading: "なまビールをふたつください",
        korean: "생맥주 두 잔 주세요",
        koreanPronunciation: "나마비-루오 후타츠 쿠다사이",
        usage: "음료를 주문할 때",
      },
      {
        japanese: "お会計お願いします",
        reading: "おかいけいおねがいします",
        korean: "계산 부탁합니다",
        koreanPronunciation: "오카이케- 오네가이시마스",
        usage: "계산을 요청할 때",
      },
    ],
    kanjiList: [
      {
        kanji: "居酒屋",
        reading: "いざかや",
        koreanPronunciation: "이자카야",
        meaning: "이자카야 (일본식 술집)",
        context: "술과 안주를 즐기는 일본 전통 주점",
      },
      {
        kanji: "焼き鳥",
        reading: "やきとり",
        koreanPronunciation: "야키토리",
        meaning: "닭꼬치",
        context: "꼬치에 꿴 닭고기를 구운 요리",
      },
      {
        kanji: "刺身",
        reading: "さしみ",
        koreanPronunciation: "사시미",
        meaning: "회 (생선회)",
        context: "날생선을 얇게 썬 요리",
      },
      {
        kanji: "飲み放題",
        reading: "のみほうだい",
        koreanPronunciation: "노미호-다이",
        meaning: "음료 무제한",
        context: "정해진 시간 동안 음료를 무제한 주문 가능",
      },
    ],
    estimatedMinutes: 7,
    systemPrompt: `あなたは居酒屋の店員です。以下のルールを厳守してください：

【ペルソナ】
- 元気で明るい居酒屋の店員
- 少しカジュアルな敬語
- おすすめを聞かれたら嬉しそうに答える

【会話の流れ】
1. 「いらっしゃい！何名様ですか？」から始める
2. 席に案内した後「お飲み物は？」と聞く
3. メニューについて質問されたら説明する
4. 注文を受ける
5. 注文確認して「少々お待ちください」

【教育ガイダンス】
- bestを選んだ場合: 店員は嬉しそうに対応。feedbackで使った表現のポイントを説明
- acceptableを選んだ場合: 店員は理解して進める。feedbackでより居酒屋らしい表現を紹介
- poorを選んだ場合: 店員は優しく聞き返す。feedbackで正しい注文の仕方を説明

【学習ポイント】
- 数量の表現（一つ、二つ、三つ...）
- おすすめを聞く表現
- 注文の定型表現

【完了条件】
- おすすめを聞いて、生ビール2杯を含む注文を完了したら conversation_status: "completed"`,
  },
  {
    id: "restaurant-reservation",
    category: "food",
    name: "레스토랑 예약",
    nameJa: "レストラン予約",
    description:
      "인기 있는 라멘집에 전화로 예약을 해봅시다. 인원, 시간, 알레르기 정보를 전달해야 합니다.",
    emoji: "📞",
    npcName: "레스토랑 직원",
    npcRole: "レストランの従業員",
    learningObjectives: [
      "전화 예약 표현",
      "인원/시간 전달하기",
      "알레르기 정보 말하기",
    ],
    keyExpressions: [
      {
        japanese: "予約をお願いしたいのですが",
        reading: "よやくをおねがいしたいのですが",
        korean: "예약을 하고 싶은데요",
        koreanPronunciation: "요야쿠오 오네가이시타이노데스가",
        usage: "예약을 시작할 때",
      },
      {
        japanese: "二名で七時にお願いします",
        reading: "にめいでしちじにおねがいします",
        korean: "2명이서 7시에 부탁합니다",
        koreanPronunciation: "니메-데 시치지니 오네가이시마스",
        usage: "인원과 시간을 말할 때",
      },
      {
        japanese: "卵アレルギーがあります",
        reading: "たまごアレルギーがあります",
        korean: "계란 알레르기가 있습니다",
        koreanPronunciation: "타마고 아레루기-가 아리마스",
        usage: "알레르기 정보를 전달할 때",
      },
    ],
    kanjiList: [
      {
        kanji: "予約",
        reading: "よやく",
        koreanPronunciation: "요야쿠",
        meaning: "예약",
        context: "미리 자리를 잡아두는 것",
      },
      {
        kanji: "禁煙",
        reading: "きんえん",
        koreanPronunciation: "킹엥",
        meaning: "금연",
        context: "담배를 피울 수 없는 구역",
      },
      {
        kanji: "会計",
        reading: "かいけい",
        koreanPronunciation: "카이케-",
        meaning: "계산",
        context: "식사 후 돈을 지불하는 것",
      },
    ],
    estimatedMinutes: 6,
    systemPrompt: `あなたはレストランの電話対応スタッフです。以下のルールを厳守してください：

【ペルソナ】
- 丁寧で落ち着いたレストランスタッフ
- 電話越しなので特にはっきりと話す
- 予約内容を丁寧に確認する

【会話の流れ】
1. 「お電話ありがとうございます、〇〇でございます」から始める
2. 予約の人数を聞く
3. 希望の日時を聞く
4. お名前を聞く
5. アレルギーや特別な要望があるか聞く
6. 予約内容を復唱して確認

【教育ガイダンス】
- bestを選んだ場合: スタッフはスムーズに対応。feedbackで電話での丁寧表現を説明
- acceptableを選んだ場合: スタッフは理解して進める。feedbackでより丁寧な表現を紹介
- poorを選んだ場合: スタッフは聞き返す。feedbackで電話予約の定型表現を説明

【学習ポイント】
- 電話の丁寧表現（〜のですが、〜でお願いします）
- 人数の数え方（一名、二名...）
- 時間の言い方

【完了条件】
- 人数・日時・名前を伝えて予約が完了したら conversation_status: "completed"`,
  },

  // ===== 숙소 =====
  {
    id: "hotel-checkin",
    category: "accommodation",
    name: "호텔 체크인",
    nameJa: "ホテルチェックイン",
    description:
      "예약한 호텔에 도착했습니다. 프론트에서 체크인을 하고 방에 대해 확인해봅시다.",
    emoji: "🏨",
    npcName: "프론트 직원",
    npcRole: "フロントスタッフ",
    learningObjectives: [
      "예약 확인 표현",
      "요청/질문하기",
      "호텔 시설 관련 어휘",
    ],
    keyExpressions: [
      {
        japanese: "チェックインお願いします",
        reading: "チェックインおねがいします",
        korean: "체크인 부탁합니다",
        koreanPronunciation: "첵쿠잉 오네가이시마스",
        usage: "체크인할 때",
      },
      {
        japanese: "予約した〇〇です",
        reading: "よやくした〇〇です",
        korean: "예약한 〇〇입니다",
        koreanPronunciation: "요야쿠시타 〇〇데스",
        usage: "예약자 이름을 말할 때",
      },
      {
        japanese: "Wi-Fiのパスワードを教えてください",
        reading: "ワイファイのパスワードをおしえてください",
        korean: "와이파이 비밀번호를 알려주세요",
        koreanPronunciation: "와이파이노 파스와-도오 오시에테 쿠다사이",
        usage: "와이파이 정보를 물을 때",
      },
    ],
    kanjiList: [
      {
        kanji: "予約",
        reading: "よやく",
        koreanPronunciation: "요야쿠",
        meaning: "예약",
        context: "미리 방을 잡아둔 것",
      },
      {
        kanji: "部屋",
        reading: "へや",
        koreanPronunciation: "헤야",
        meaning: "방",
        context: "호텔의 객실",
      },
      {
        kanji: "朝食",
        reading: "ちょうしょく",
        koreanPronunciation: "초-쇼쿠",
        meaning: "아침 식사",
        context: "호텔 조식",
      },
    ],
    estimatedMinutes: 5,
    systemPrompt: `あなたはホテルのフロントスタッフです。以下のルールを厳守してください：

【ペルソナ】
- 礼儀正しくプロフェッショナルなフロントスタッフ
- 丁寧語を徹底
- 外国人ゲストにも慣れている

【会話の流れ】
1. 「いらっしゃいませ」から始める
2. チェックインか確認する
3. 予約名を聞く
4. パスポートの提示をお願いする
5. 部屋の説明（階数、朝食の時間、Wi-Fi等）
6. 鍵を渡して「ごゆっくりどうぞ」

【教育ガイダンス】
- bestを選んだ場合: スタッフはスムーズに進行。feedbackでホテル用語を説明
- acceptableを選んだ場合: スタッフは理解して進める。feedbackでより適切な表現を紹介
- poorを選んだ場合: スタッフは丁寧に聞き返す。feedbackで正しい表現を説明

【学習ポイント】
- ホテルのチェックイン定型表現
- 予約の確認表現
- 質問・要望の伝え方

【完了条件】
- チェックインが完了し、部屋の情報を確認したら conversation_status: "completed"`,
  },

  // ===== 쇼핑 =====
  {
    id: "clothing-store",
    category: "shopping",
    name: "옷 가게",
    nameJa: "洋服屋",
    description:
      "일본 옷 가게에서 쇼핑을 해봅시다. 사이즈와 색상을 물어보고 시착도 해봅시다.",
    emoji: "👕",
    npcName: "가게 점원",
    npcRole: "洋服屋の店員",
    learningObjectives: [
      "사이즈/색상 물어보기",
      "시착 요청하기",
      "가격 확인하기",
    ],
    keyExpressions: [
      {
        japanese: "Mサイズはありますか",
        reading: "エムサイズはありますか",
        korean: "M 사이즈 있나요?",
        koreanPronunciation: "에무사이즈와 아리마스카",
        usage: "사이즈를 물어볼 때",
      },
      {
        japanese: "試着してもいいですか",
        reading: "しちゃくしてもいいですか",
        korean: "입어봐도 될까요?",
        koreanPronunciation: "시챠쿠시테모 이-데스카",
        usage: "시착을 요청할 때",
      },
      {
        japanese: "他の色はありますか",
        reading: "ほかのいろはありますか",
        korean: "다른 색은 있나요?",
        koreanPronunciation: "호카노 이로와 아리마스카",
        usage: "다른 색상을 물어볼 때",
      },
    ],
    kanjiList: [
      {
        kanji: "試着",
        reading: "しちゃく",
        koreanPronunciation: "시챠쿠",
        meaning: "시착 (입어보기)",
        context: "옷을 사기 전에 입어보는 것",
      },
      {
        kanji: "半額",
        reading: "はんがく",
        koreanPronunciation: "항가쿠",
        meaning: "반값",
        context: "50% 할인",
      },
      {
        kanji: "色",
        reading: "いろ",
        koreanPronunciation: "이로",
        meaning: "색, 색깔",
        context: "물건의 색상",
      },
    ],
    estimatedMinutes: 6,
    systemPrompt: `あなたは洋服屋の店員です。以下のルールを厳守してください：

【ペルソナ】
- 明るくフレンドリーな洋服屋の店員
- おしゃれが好き
- お客さんに合うスタイルを提案する

【会話の流れ】
1. 「いらっしゃいませ、何かお探しですか？」から始める
2. 商品について説明する
3. サイズや色を聞かれたら案内する
4. 試着室に案内する
5. 購入を決めたらレジへ案内

【教育ガイダンス】
- bestを選んだ場合: 店員は嬉しそうに対応。feedbackでショッピング表現を説明
- acceptableを選んだ場合: 店員は理解する。feedbackでより自然な表現を紹介
- poorを選んだ場合: 店員は優しく聞き返す。feedbackで正しい表現を説明

【学習ポイント】
- 〜はありますか（在庫確認）
- 〜してもいいですか（許可を求める）
- 色・サイズの表現

【完了条件】
- サイズ確認、試着、購入判断まで完了したら conversation_status: "completed"`,
  },

  // ===== 일상 =====
  {
    id: "tourist-spot",
    category: "daily",
    name: "관광지",
    nameJa: "観光地",
    description:
      "유명한 관광지에 왔습니다. 사진 부탁도 하고, 직원에게 추천 코스를 물어봅시다.",
    emoji: "⛩️",
    npcName: "관광안내원",
    npcRole: "観光案内のスタッフ",
    learningObjectives: [
      "사진 촬영 부탁하기",
      "추천 장소 묻기",
      "감상 표현하기",
    ],
    keyExpressions: [
      {
        japanese: "写真を撮ってもらえますか",
        reading: "しゃしんをとってもらえますか",
        korean: "사진 찍어주실 수 있나요?",
        koreanPronunciation: "샤싱오 톳테 모라에마스카",
        usage: "사진 촬영을 부탁할 때",
      },
      {
        japanese: "おすすめのコースはありますか",
        reading: "おすすめのコースはありますか",
        korean: "추천 코스가 있나요?",
        koreanPronunciation: "오스스메노 코-스와 아리마스카",
        usage: "추천을 물어볼 때",
      },
      {
        japanese: "とてもきれいですね",
        reading: "とてもきれいですね",
        korean: "정말 예쁘네요",
        koreanPronunciation: "토테모 키레-데스네",
        usage: "감상을 표현할 때",
      },
    ],
    kanjiList: [
      {
        kanji: "写真",
        reading: "しゃしん",
        koreanPronunciation: "샤싱",
        meaning: "사진",
        context: "카메라로 찍는 것",
      },
      {
        kanji: "入場",
        reading: "にゅうじょう",
        koreanPronunciation: "뉴-죠-",
        meaning: "입장",
        context: "관광지나 시설에 들어가는 것",
      },
      {
        kanji: "記念",
        reading: "きねん",
        koreanPronunciation: "키넹",
        meaning: "기념",
        context: "특별한 날이나 장소를 기억하기 위한 것",
      },
    ],
    estimatedMinutes: 5,
    systemPrompt: `あなたは観光地の案内スタッフです。以下のルールを厳守してください：

【ペルソナ】
- 明るくて親切な観光案内スタッフ
- 観光地に詳しい
- 写真撮影も喜んで手伝う

【会話の流れ】
1. 「いらっしゃいませ、観光ですか？」から始める
2. おすすめスポットを紹介する
3. 入場料や営業時間を案内する
4. 写真を頼まれたら快く引き受ける
5. 「楽しんでくださいね」と見送る

【教育ガイダンス】
- bestを選んだ場合: スタッフは楽しそうに対応。feedbackで観光の表現を説明
- acceptableを選んだ場合: スタッフは理解して対応。feedbackでより自然な表現を紹介
- poorを選んだ場合: スタッフは優しく聞き返す。feedbackで正しい表現を説明

【学習ポイント】
- 〜てもらえますか（丁寧な依頼）
- 感想の表現（きれい、すごい、面白い）
- 観光地でよく使う表現

【完了条件】
- 観光案内を受けて、写真撮影も依頼できたら conversation_status: "completed"`,
  },

  {
    id: "find-restroom",
    category: "daily",
    name: "화장실 찾기",
    nameJa: "トイレを探す",
    description:
      "급하게 화장실을 찾아야 합니다. 근처 사람이나 가게 직원에게 화장실 위치를 물어봅시다.",
    emoji: "🚻",
    npcName: "편의점 직원",
    npcRole: "コンビニの店員",
    learningObjectives: [
      "화장실 위치 묻기",
      "정중한 부탁 표현",
      "감사 인사하기",
    ],
    keyExpressions: [
      {
        japanese: "お手洗いはどこですか",
        reading: "おてあらいはどこですか",
        korean: "화장실은 어디인가요?",
        koreanPronunciation: "오테아라이와 도코데스카",
        usage: "화장실 위치를 물을 때",
      },
      {
        japanese: "トイレを借りてもいいですか",
        reading: "トイレをかりてもいいですか",
        korean: "화장실을 빌려도 될까요?",
        koreanPronunciation: "토이레오 카리테모 이-데스카",
        usage: "가게 화장실 사용 허락을 구할 때",
      },
      {
        japanese: "近くにトイレはありますか",
        reading: "ちかくにトイレはありますか",
        korean: "근처에 화장실이 있나요?",
        koreanPronunciation: "치카쿠니 토이레와 아리마스카",
        usage: "근처 화장실을 찾을 때",
      },
    ],
    kanjiList: [
      {
        kanji: "手洗",
        reading: "てあらい",
        koreanPronunciation: "테아라이",
        meaning: "화장실 (정중한 표현)",
        context: "お手洗い는 화장실의 정중한 표현",
      },
      {
        kanji: "近く",
        reading: "ちかく",
        koreanPronunciation: "치카쿠",
        meaning: "근처",
        context: "가까운 장소를 나타낼 때",
      },
    ],
    estimatedMinutes: 4,
    systemPrompt: `あなたはコンビニの店員です。以下のルールを厳守してください：

【ペルソナ】
- 親切なコンビニ店員
- 外国人にもわかりやすく対応
- トイレの場所を丁寧に案内

【会話の流れ】
1. 「いらっしゃいませ」から始める
2. トイレの場所を聞かれる
3. トイレの場所を案内する
4. 使い方の注意事項を伝える

【学習ポイント】
- お手洗い/トイレの使い分け
- 場所を聞く表現
- 許可を求める表現

【完了条件】
- トイレの場所を確認できたら conversation_status: "completed"`,
  },
  {
    id: "wifi-connect",
    category: "daily",
    name: "와이파이 연결",
    nameJa: "Wi-Fi接続",
    description:
      "카페에서 와이파이에 연결하고 싶습니다. 직원에게 와이파이 비밀번호를 물어봅시다.",
    emoji: "📶",
    npcName: "카페 직원",
    npcRole: "カフェの店員",
    learningObjectives: [
      "와이파이 사용 요청하기",
      "비밀번호 묻기",
      "연결 문제 도움 요청",
    ],
    keyExpressions: [
      {
        japanese: "Wi-Fiはありますか",
        reading: "ワイファイはありますか",
        korean: "와이파이 있나요?",
        koreanPronunciation: "와이파이와 아리마스카",
        usage: "와이파이 유무를 물을 때",
      },
      {
        japanese: "パスワードを教えてください",
        reading: "パスワードをおしえてください",
        korean: "비밀번호를 알려주세요",
        koreanPronunciation: "파스와-도오 오시에테쿠다사이",
        usage: "비밀번호를 물을 때",
      },
      {
        japanese: "接続できません",
        reading: "せつぞくできません",
        korean: "연결이 안 됩니다",
        koreanPronunciation: "세츠조쿠데키마셍",
        usage: "연결 문제가 있을 때",
      },
    ],
    kanjiList: [
      {
        kanji: "接続",
        reading: "せつぞく",
        koreanPronunciation: "세츠조쿠",
        meaning: "연결/접속",
        context: "인터넷이나 기기를 연결하는 것",
      },
      {
        kanji: "無料",
        reading: "むりょう",
        koreanPronunciation: "무료-",
        meaning: "무료",
        context: "돈을 내지 않아도 되는 것",
      },
    ],
    estimatedMinutes: 4,
    systemPrompt: `あなたはカフェの店員です。以下のルールを厳守してください：

【ペルソナ】
- 若くて親切なカフェ店員
- 外国人にも丁寧に対応
- Wi-Fiの使い方を分かりやすく教える

【会話の流れ】
1. 「いらっしゃいませ」から始める
2. Wi-Fiの有無を聞かれる
3. パスワードを伝える
4. 接続方法を案内する
5. 制限時間があれば伝える

【学習ポイント】
- Wi-Fi関連の表現
- パスワードの聞き方
- トラブル時の表現

【完了条件】
- Wi-Fiに接続できたら conversation_status: "completed"`,
  },

  // ===== 긴급 =====
  {
    id: "hospital",
    category: "emergency",
    name: "병원",
    nameJa: "病院",
    description:
      "배가 아파서 병원에 왔습니다. 의사에게 증상을 정확히 설명해봅시다.",
    emoji: "🏥",
    npcName: "의사",
    npcRole: "医者",
    learningObjectives: [
      "증상 설명하기",
      "통증 표현하기",
      "의료 관련 어휘 익히기",
    ],
    keyExpressions: [
      {
        japanese: "お腹が痛いです",
        reading: "おなかがいたいです",
        korean: "배가 아픕니다",
        koreanPronunciation: "오나카가 이타이데스",
        usage: "복통을 표현할 때",
      },
      {
        japanese: "昨日の夜からです",
        reading: "きのうのよるからです",
        korean: "어젯밤부터입니다",
        koreanPronunciation: "키노-노 요루카라데스",
        usage: "증상 시작 시점을 말할 때",
      },
      {
        japanese: "吐き気もあります",
        reading: "はきけもあります",
        korean: "구역질도 있습니다",
        koreanPronunciation: "하키게모 아리마스",
        usage: "추가 증상을 설명할 때",
      },
    ],
    kanjiList: [
      {
        kanji: "腹痛",
        reading: "ふくつう",
        koreanPronunciation: "후쿠츠-",
        meaning: "복통",
        context: "배가 아픈 증상",
      },
      {
        kanji: "頭痛",
        reading: "ずつう",
        koreanPronunciation: "즈츠-",
        meaning: "두통",
        context: "머리가 아픈 증상",
      },
      {
        kanji: "処方箋",
        reading: "しょほうせん",
        koreanPronunciation: "쇼호-셍",
        meaning: "처방전",
        context: "의사가 약을 처방할 때 주는 문서",
      },
      {
        kanji: "薬",
        reading: "くすり",
        koreanPronunciation: "쿠스리",
        meaning: "약",
        context: "병을 치료하기 위해 먹는 것",
      },
    ],
    estimatedMinutes: 7,
    systemPrompt: `あなたは日本の病院の医者です。以下のルールを厳守してください：

【ペルソナ】
- 落ち着いた中年の医者
- 丁寧で優しいが、正確な情報を求める
- 外国人患者にも親切に対応

【会話の流れ】
1. 「どうしましたか？」から始める
2. どこが痛いか詳しく聞く
3. いつから痛いか聞く
4. 痛みの種類を聞く（ズキズキ？チクチク？キリキリ？）
5. 他の症状を聞く（吐き気、熱など）
6. 診断して薬を処方する

【教育ガイダンス】
- bestを選んだ場合: 医者は理解してスムーズに進む。feedbackで医療表現を説明
- acceptableを選んだ場合: 医者は理解するが確認する。feedbackでより正確な表現を紹介
- poorを選んだ場合: 医者は優しく聞き直す。feedbackで正しい症状の伝え方を説明

【学習ポイント】
- 体の部位の名前
- 痛みの表現（ズキズキ、チクチク、キリキリ）
- 〜からです（時間の起点）

【完了条件】
- 痛みの場所・時期・種類・他の症状を全て伝えられたら conversation_status: "completed"`,
  },
  {
    id: "pharmacy",
    category: "emergency",
    name: "약국",
    nameJa: "薬局",
    description:
      "가벼운 감기 증상이 있어서 약국에 왔습니다. 약사에게 증상을 말하고 약을 사봅시다.",
    emoji: "💊",
    npcName: "약사",
    npcRole: "薬剤師",
    learningObjectives: [
      "증상 간단히 설명하기",
      "약 종류 물어보기",
      "복용법 확인하기",
    ],
    keyExpressions: [
      {
        japanese: "風邪薬はありますか",
        reading: "かぜぐすりはありますか",
        korean: "감기약 있나요?",
        koreanPronunciation: "카제구스리와 아리마스카",
        usage: "약을 찾을 때",
      },
      {
        japanese: "熱があります",
        reading: "ねつがあります",
        korean: "열이 있습니다",
        koreanPronunciation: "네츠가 아리마스",
        usage: "증상을 말할 때",
      },
      {
        japanese: "一日何回飲みますか",
        reading: "いちにちなんかいのみますか",
        korean: "하루에 몇 번 먹나요?",
        koreanPronunciation: "이치니치 낭카이 노미마스카",
        usage: "복용법을 확인할 때",
      },
    ],
    kanjiList: [
      {
        kanji: "薬",
        reading: "くすり",
        koreanPronunciation: "쿠스리",
        meaning: "약",
        context: "병을 치료하기 위해 먹는 것",
      },
      {
        kanji: "風邪",
        reading: "かぜ",
        koreanPronunciation: "카제",
        meaning: "감기",
        context: "기침, 콧물 등의 가벼운 질환",
      },
      {
        kanji: "食後",
        reading: "しょくご",
        koreanPronunciation: "쇼쿠고",
        meaning: "식후",
        context: "밥을 먹은 후",
      },
    ],
    estimatedMinutes: 5,
    systemPrompt: `あなたは薬局の薬剤師です。以下のルールを厳守してください：

【ペルソナ】
- 優しくて丁寧な薬剤師
- 症状をしっかり聞いて適切な薬を提案する
- 服用方法を分かりやすく説明する

【会話の流れ】
1. 「いらっしゃいませ、どうされましたか？」から始める
2. 症状を詳しく聞く
3. アレルギーの有無を確認する
4. 薬を提案する
5. 服用方法を説明する（食後、一日何回など）
6. 「お大事に」と見送る

【教育ガイダンス】
- bestを選んだ場合: 薬剤師はスムーズに対応。feedbackで医薬品関連の表現を説明
- acceptableを選んだ場合: 薬剤師は理解して対応。feedbackでより正確な表現を紹介
- poorを選んだ場合: 薬剤師は優しく聞き返す。feedbackで正しい伝え方を説明

【学習ポイント】
- 症状の簡単な説明
- 〜はありますか（商品の確認）
- 服用方法の理解（食前/食後、一日〇回）

【完了条件】
- 症状を伝え、薬を選び、服用方法を確認したら conversation_status: "completed"`,
  },
];
