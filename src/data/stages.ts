export interface Stage {
  id: number;
  name: string;
  nameJa: string;
  description: string;
  mission: string;
  emoji: string;
  npcName: string;
  npcRole: string;
  difficulty: "easy" | "normal" | "hard" | "boss";
  kanjiLevel: number; // 0: 없음, 1: 기초, 2: 중급, 3: 고급
}

export const stages: Stage[] = [
  {
    id: 1,
    name: "입국심사",
    nameJa: "入国審査",
    description: "나리타 공항에 도착했다. 입국심사대 앞에 섰다. 심사관이 날카로운 눈으로 당신을 바라본다.",
    mission: "체류 목적, 장소, 기간을 정확히 말하기",
    emoji: "🛂",
    npcName: "심사관",
    npcRole: "入国審査官",
    difficulty: "easy",
    kanjiLevel: 0,
  },
  {
    id: 2,
    name: "편의점",
    nameJa: "コンビニ",
    description: "배가 고파서 편의점에 들어왔다. 도시락을 골랐는데... 계산대 앞에서 점원이 뭔가를 물어본다!",
    mission: "도시락 데우기 요청, 봉투 유무, 결제 수단 말하기",
    emoji: "🏪",
    npcName: "편의점 알바생",
    npcRole: "コンビニ店員",
    difficulty: "easy",
    kanjiLevel: 1,
  },
  {
    id: 3,
    name: "이자카야",
    nameJa: "居酒屋",
    description: "현지인이 추천해준 이자카야에 왔다. 메뉴판이... 전부 한자다. 점원이 다가온다.",
    mission: "추천 메뉴 묻기, 생맥주 2잔 주문하기",
    emoji: "🍺",
    npcName: "이자카야 점원",
    npcRole: "居酒屋の店員",
    difficulty: "normal",
    kanjiLevel: 2,
  },
  {
    id: 4,
    name: "길 묻기",
    nameJa: "道を聞く",
    description: "구글맵이 죽었다. 스카이트리까지 가야 하는데 길을 잃었다. 지나가는 사람에게 물어봐야 한다.",
    mission: "목적지까지의 길을 물어보고 올바른 방향 이해하기",
    emoji: "🗺️",
    npcName: "바쁜 행인",
    npcRole: "通行人",
    difficulty: "hard",
    kanjiLevel: 2,
  },
  {
    id: 5,
    name: "응급실",
    nameJa: "救急病院",
    description: "어제 이자카야에서 너무 먹었나... 배가 너무 아프다. 병원에 왔는데 의사가 일본어로 물어본다.",
    mission: "증상을 정확히 묘사하기 (복통, 메스꺼움 등)",
    emoji: "🏥",
    npcName: "의사",
    npcRole: "医者",
    difficulty: "boss",
    kanjiLevel: 3,
  },
];
