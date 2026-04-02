"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLearningStore } from "@/store/learningStore";
import { scenarios } from "@/data/scenarios";

type QuizSource = "bookmarks" | "expressions";

interface QuizCard {
  id: string;
  front: string;
  back: string;
  pronunciation: string;
  grammar?: string;
  scenarioName?: string;
}

export default function ReviewQuiz() {
  const { bookmarkedExpressions, goToScenarioList } = useLearningStore();
  const [source, setSource] = useState<QuizSource>("expressions");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());
  const [quizStarted, setQuizStarted] = useState(false);

  const bookmarkCards: QuizCard[] = useMemo(() => {
    return bookmarkedExpressions.map((expr) => ({
      id: expr.id,
      front: expr.korean,
      back: expr.japanese,
      pronunciation: expr.pronunciation,
      grammar: expr.grammarNote,
    }));
  }, [bookmarkedExpressions]);

  const expressionCards: QuizCard[] = useMemo(() => {
    const target = selectedScenarioId
      ? scenarios.filter((s) => s.id === selectedScenarioId)
      : scenarios;

    return target.flatMap((s) =>
      s.keyExpressions.map((expr, i) => ({
        id: `${s.id}-expr-${i}`,
        front: expr.korean,
        back: expr.japanese,
        pronunciation: expr.koreanPronunciation,
        grammar: expr.usage,
        scenarioName: s.name,
      }))
    );
  }, [selectedScenarioId]);

  const cards = source === "bookmarks" ? bookmarkCards : expressionCards;

  const resetQuiz = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownIds(new Set());
    setReviewIds(new Set());
  };

  const startQuiz = () => {
    resetQuiz();
    setQuizStarted(true);
  };

  const handleKnow = () => {
    const card = cards[currentIndex];
    if (!card) return;
    setKnownIds((prev) => new Set(prev).add(card.id));
    setIsFlipped(false);
    setCurrentIndex((i) => i + 1);
  };

  const handleReview = () => {
    const card = cards[currentIndex];
    if (!card) return;
    setReviewIds((prev) => new Set(prev).add(card.id));
    setIsFlipped(false);
    setCurrentIndex((i) => i + 1);
  };

  // 퀴즈 선택 화면
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <button
              onClick={goToScenarioList}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              ← 돌아가기
            </button>
            <h1 className="text-base font-bold text-gray-900">복습 퀴즈</h1>
            <div className="w-16" />
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 mt-6 space-y-6">
          {/* 소스 선택 탭 */}
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => {
                setSource("expressions");
                setSelectedScenarioId(null);
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                source === "expressions"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              핵심 표현 ({scenarios.reduce((sum, s) => sum + s.keyExpressions.length, 0)})
            </button>
            <button
              onClick={() => setSource("bookmarks")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                source === "bookmarks"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              북마크 ({bookmarkCards.length})
            </button>
          </div>

          {/* 핵심 표현 모드: 시나리오 선택 */}
          {source === "expressions" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                퀴즈할 시나리오를 선택하세요
              </p>
              <button
                onClick={() => setSelectedScenarioId(null)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition text-sm ${
                  selectedScenarioId === null
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700 font-medium"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                전체 시나리오 ({scenarios.reduce((sum, s) => sum + s.keyExpressions.length, 0)}개 표현)
              </button>
              <div className="grid grid-cols-2 gap-2">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScenarioId(s.id)}
                    className={`text-left px-3 py-2.5 rounded-xl border transition text-xs ${
                      selectedScenarioId === s.id
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700 font-medium"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-base mr-1">{s.emoji}</span>
                    {s.name}
                    <span className="text-gray-400 ml-1">
                      ({s.keyExpressions.length})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 북마크 모드: 빈 상태 */}
          {source === "bookmarks" && bookmarkCards.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-sm text-gray-500">
                아직 북마크한 표현이 없어요.
                <br />
                대화 중 표현을 북마크해보세요!
              </p>
            </div>
          )}

          {/* 시작 버튼 */}
          {cards.length > 0 && (
            <button
              onClick={startQuiz}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition text-sm"
            >
              퀴즈 시작 ({cards.length}개 표현)
            </button>
          )}
        </div>
      </div>
    );
  }

  const total = cards.length;
  const isComplete = currentIndex >= total;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">복습 완료!</h2>
        <div className="flex gap-4 mb-6">
          <div className="bg-emerald-50 rounded-xl px-4 py-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {knownIds.size}
            </div>
            <div className="text-xs text-emerald-500 mt-1">알겠어요</div>
          </div>
          <div className="bg-amber-50 rounded-xl px-4 py-3 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {reviewIds.size}
            </div>
            <div className="text-xs text-amber-500 mt-1">다시 복습</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={startQuiz}
            className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600 transition"
          >
            다시 풀기
          </button>
          <button
            onClick={() => setQuizStarted(false)}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
          >
            퀴즈 선택
          </button>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];
  if (!card) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => setQuizStarted(false)}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            ← 돌아가기
          </button>
          <h1 className="text-base font-bold text-gray-900">복습 퀴즈</h1>
          <span className="text-sm text-gray-400">
            {currentIndex + 1}/{total}
          </span>
        </div>
      </div>

      {/* 진행 바 */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* 카드 */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 min-h-[240px] flex flex-col items-center justify-center text-center hover:shadow-md transition cursor-pointer"
            >
              {!isFlipped ? (
                <>
                  <p className="text-xs text-gray-400 mb-3">한국어 뜻</p>
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    {card.front}
                  </p>
                  {card.scenarioName && (
                    <p className="text-xs text-gray-400 mb-2">
                      {card.scenarioName}
                    </p>
                  )}
                  <p className="text-xs text-indigo-400">탭하여 정답 확인</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-2">일본어</p>
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    {card.back}
                  </p>
                  <p className="text-base text-indigo-500 mb-2">
                    ({card.pronunciation})
                  </p>
                  {card.grammar && (
                    <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mt-2">
                      💡 {card.grammar}
                    </p>
                  )}
                </>
              )}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* 액션 버튼 */}
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mt-6"
          >
            <button
              onClick={handleReview}
              className="flex-1 py-3 rounded-xl text-sm font-medium bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 transition"
            >
              다시 복습
            </button>
            <button
              onClick={handleKnow}
              className="flex-1 py-3 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition"
            >
              알겠어요
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
