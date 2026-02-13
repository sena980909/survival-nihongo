import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "npc" | "system";
  content: string;
  npcEmotion?: "neutral" | "angry" | "happy" | "confused";
  damage?: number;
  feedback?: string;
  isNatural?: boolean;
  grammarError?: boolean;
  politenessLevel?: string;
  missionStatus?: "ongoing" | "success" | "fail";
}

interface GameState {
  // 게임 상태
  currentStageId: number | null;
  unlockedStages: number[];
  hp: number;
  maxHp: number;
  hintCount: number;
  maxHints: number;
  isGameOver: boolean;
  isStageCleared: boolean;

  // 채팅
  messages: ChatMessage[];
  isLoading: boolean;

  // 액션
  selectStage: (stageId: number) => void;
  addMessage: (message: ChatMessage) => void;
  takeDamage: (amount: number) => void;
  useHint: () => boolean;
  clearStage: () => void;
  gameOver: () => void;
  resetStage: () => void;
  resetGame: () => void;
  setLoading: (loading: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentStageId: null,
  unlockedStages: [1],
  hp: 100,
  maxHp: 100,
  hintCount: 3,
  maxHints: 3,
  isGameOver: false,
  isStageCleared: false,
  messages: [],
  isLoading: false,

  selectStage: (stageId: number) =>
    set({
      currentStageId: stageId,
      hp: 100,
      messages: [],
      isGameOver: false,
      isStageCleared: false,
    }),

  addMessage: (message: ChatMessage) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  takeDamage: (amount: number) => {
    const newHp = Math.max(0, get().hp - amount);
    set({ hp: newHp });
    if (newHp <= 0) {
      get().gameOver();
    }
  },

  useHint: () => {
    const { hintCount } = get();
    if (hintCount > 0) {
      set({ hintCount: hintCount - 1 });
      return true;
    }
    return false;
  },

  clearStage: () => {
    const { currentStageId, unlockedStages } = get();
    const nextStageId = (currentStageId || 0) + 1;
    const newUnlocked = unlockedStages.includes(nextStageId)
      ? unlockedStages
      : [...unlockedStages, nextStageId];
    set({
      isStageCleared: true,
      unlockedStages: newUnlocked,
    });
  },

  gameOver: () => set({ isGameOver: true }),

  resetStage: () =>
    set({
      hp: 100,
      messages: [],
      isGameOver: false,
      isStageCleared: false,
    }),

  resetGame: () =>
    set({
      currentStageId: null,
      unlockedStages: [1],
      hp: 100,
      hintCount: 3,
      messages: [],
      isGameOver: false,
      isStageCleared: false,
    }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
