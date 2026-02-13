// 대화 시스템 핵심 인터페이스

export interface VocabularyItem {
  word: string;          // 일본어 단어 (예: "温める")
  reading: string;       // 후리가나 (예: "あたためる")
  pronunciation: string; // 한글 발음 (예: "아타타메루")
  meaning: string;       // 한국어 뜻 (예: "데우다")
}

export interface KeyExpression {
  pattern: string;       // 문법 패턴 (예: "〜をお願いします")
  patternKo: string;     // 한국어 대응 (예: "〜을/를 부탁합니다")
  explanation: string;   // 설명 (한국어)
  formality: "casual" | "polite" | "formal";
}

export interface KanjiChallenge {
  kanji: string;
  correctReading: string;
  wrongReadings: string[];
  meaning: string;
  hint?: string;
}

export interface EducationContent {
  keyExpression: KeyExpression;
  vocabulary: VocabularyItem[];
  kanjiChallenge?: KanjiChallenge;
}

export interface DialogueChoice {
  id: string;
  text: string;              // 일본어
  textKo: string;            // 한국어 번역
  pronunciation: string;     // 한글 발음
  quality: "best" | "ok" | "bad";
  damage: number;
  feedback: string;          // 한국어 피드백
  npcEmotion: "neutral" | "angry" | "happy" | "confused";
  nextStepId: string;
}

export interface DialogueStep {
  id: string;
  npcLine: string;
  npcLineKo: string;
  npcLinePronunciation: string;
  npcEmotion: "neutral" | "angry" | "happy" | "confused";
  choices: DialogueChoice[];
  education: EducationContent;
  isMilestone?: boolean;
  milestoneTag?: string;
}

export interface StageDialogue {
  stageId: number;
  steps: DialogueStep[];
  initialStepId: string;
  requiredMilestones: string[];
  successMessage: string;
  successNpcLine: string;
  successNpcLineKo: string;
  successNpcLinePronunciation: string;
}
