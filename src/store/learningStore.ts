import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Correction {
  wasCorrect: boolean;
  explanation: string;
  betterExpression?: string;
  betterExpressionKo?: string;
  betterExpressionPronunciation?: string;
  grammarPoint?: string;
}

export interface KanjiNote {
  kanji: string;
  reading: string;
  pronunciation: string;
  meaning: string;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "npc" | "system";
  content: string;
  contentKo?: string;
  contentPronunciation?: string;
  npcEmotion?: "neutral" | "happy" | "confused" | "encouraging";
  correction?: Correction;
  kanjiNote?: KanjiNote;
  isBookmarked?: boolean;
}

export interface BookmarkedExpression {
  id: string;
  japanese: string;
  korean: string;
  pronunciation: string;
  scenarioId: string;
  grammarNote?: string;
}

export interface ScenarioProgress {
  scenarioId: string;
  completedAt: string;
  expressionsLearned: number;
  conversationLength: number;
}

interface LearningState {
  // 네비게이션
  currentScenarioId: string | null;
  currentView: "scenarios" | "conversation" | "review" | "bookmarks" | "onboarding" | "quiz" | "stats";

  // 온보딩
  hasSeenOnboarding: boolean;

  // 채팅
  messages: ChatMessage[];
  isLoading: boolean;
  isConversationComplete: boolean;

  // 학습 진행 (localStorage 영속화)
  completedScenarios: ScenarioProgress[];
  bookmarkedExpressions: BookmarkedExpression[];
  learnedKanji: string[];
  totalConversations: number;

  // 액션
  selectScenario: (scenarioId: string) => void;
  addMessage: (message: ChatMessage) => void;
  completeConversation: () => void;
  toggleBookmark: (expression: BookmarkedExpression) => void;
  addLearnedKanji: (kanji: string) => void;
  goToScenarioList: () => void;
  goToBookmarks: () => void;
  goToReview: () => void;
  goToQuiz: () => void;
  goToStats: () => void;
  completeOnboarding: () => void;
  resetConversation: () => void;
  setLoading: (loading: boolean) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      currentScenarioId: null,
      currentView: "scenarios" as const,
      hasSeenOnboarding: false,
      messages: [],
      isLoading: false,
      isConversationComplete: false,
      completedScenarios: [],
      bookmarkedExpressions: [],
      learnedKanji: [],
      totalConversations: 0,

      selectScenario: (scenarioId: string) =>
        set({
          currentScenarioId: scenarioId,
          currentView: "conversation",
          messages: [],
          isConversationComplete: false,
        }),

      addMessage: (message: ChatMessage) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      completeConversation: () => {
        const { currentScenarioId, messages, completedScenarios, totalConversations } = get();
        if (!currentScenarioId) return;

        const correctCount = messages.filter(
          (m) => m.correction?.wasCorrect
        ).length;

        const progress: ScenarioProgress = {
          scenarioId: currentScenarioId,
          completedAt: new Date().toISOString(),
          expressionsLearned: correctCount,
          conversationLength: messages.filter((m) => m.role !== "system").length,
        };

        set({
          isConversationComplete: true,
          completedScenarios: [...completedScenarios, progress],
          totalConversations: totalConversations + 1,
        });
      },

      toggleBookmark: (expression: BookmarkedExpression) => {
        const { bookmarkedExpressions } = get();
        const exists = bookmarkedExpressions.find(
          (b) => b.id === expression.id
        );
        if (exists) {
          set({
            bookmarkedExpressions: bookmarkedExpressions.filter(
              (b) => b.id !== expression.id
            ),
          });
        } else {
          set({
            bookmarkedExpressions: [...bookmarkedExpressions, expression],
          });
        }
      },

      addLearnedKanji: (kanji: string) => {
        const { learnedKanji } = get();
        if (!learnedKanji.includes(kanji)) {
          set({ learnedKanji: [...learnedKanji, kanji] });
        }
      },

      goToScenarioList: () =>
        set({
          currentScenarioId: null,
          currentView: "scenarios",
          messages: [],
          isConversationComplete: false,
        }),

      goToBookmarks: () =>
        set({ currentView: "bookmarks" }),

      goToReview: () =>
        set({ currentView: "review" }),

      goToQuiz: () =>
        set({ currentView: "quiz" }),

      goToStats: () =>
        set({ currentView: "stats" }),

      completeOnboarding: () =>
        set({ hasSeenOnboarding: true, currentView: "scenarios" }),

      resetConversation: () =>
        set({
          messages: [],
          isConversationComplete: false,
        }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "nihongo-learning",
      partialize: (state) => ({
        completedScenarios: state.completedScenarios,
        bookmarkedExpressions: state.bookmarkedExpressions,
        learnedKanji: state.learnedKanji,
        totalConversations: state.totalConversations,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
);
