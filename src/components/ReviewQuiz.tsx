"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLearningStore } from "@/store/learningStore";

export default function ReviewQuiz() {
  const { bookmarkedExpressions, goToScenarioList } = useLearningStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());

  const cards = useMemo(() => {
    return bookmarkedExpressions.map((expr) => ({
      id: expr.id,
      front: expr.korean,
      back: expr.japanese,
      pronunciation: expr.pronunciation,
      grammar: expr.grammarNote,
    }));
  }, [bookmarkedExpressions]);

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          아직 북마크한 표현이 없어요
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          대화 중 배운 표현을 북마크하면
          <br />
          여기서 복습 퀴즈를 풀 수 있어요!
        </p>
        <button
          onClick={goToScenarioList}
          className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600 transition"
        >
          시나리오 선택하러 가기
        </button>
      </div>
    );
  }

  const card = cards[currentIndex];
  const total = cards.length;
  const isComplete = currentIndex >= total;

  const handleKnow = () => {
    setKnownIds((prev) => new Set(prev).add(card.id));
    setIsFlipped(false);
    setCurrentIndex((i) => i + 1);
  };

  const handleReview = () => {
    setReviewIds((prev) => new Set(prev).add(card.id));
    setIsFlipped(false);
    setCurrentIndex((i) => i + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownIds(new Set());
    setReviewIds(new Set());
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          복습 완료!
        </h2>
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
            onClick={handleRestart}
            className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600 transition"
          >
            다시 풀기
          </button>
          <button
            onClick={goToScenarioList}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={goToScenarioList}
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
      <div className="max-w-md mx-auto px-4 mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* 카드 */}
      <div className="max-w-md mx-auto px-4 mt-8">
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
                  <p className="text-xs text-indigo-400">
                    탭하여 정답 확인
                  </p>
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
