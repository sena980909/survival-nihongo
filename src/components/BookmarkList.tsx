"use client";

import { motion } from "framer-motion";
import { useLearningStore } from "@/store/learningStore";
import { scenarios } from "@/data/scenarios";

export default function BookmarkList() {
  const { bookmarkedExpressions, toggleBookmark, goToScenarioList } =
    useLearningStore();

  // 시나리오별로 그룹핑
  const grouped = bookmarkedExpressions.reduce<
    Record<string, typeof bookmarkedExpressions>
  >((acc, expr) => {
    if (!acc[expr.scenarioId]) acc[expr.scenarioId] = [];
    acc[expr.scenarioId].push(expr);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={goToScenarioList}
            className="text-gray-400 hover:text-gray-700 transition text-sm"
          >
            ← 돌아가기
          </button>
          <div className="flex-1 text-center">
            <span className="font-bold text-gray-900">⭐ 북마크 표현</span>
          </div>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4">
        {bookmarkedExpressions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              아직 북마크한 표현이 없습니다
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              대화 중 유용한 표현을 ☆ 버튼으로 저장해보세요
            </p>
            <button
              onClick={goToScenarioList}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition"
            >
              연습 시작하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              총 {bookmarkedExpressions.length}개의 표현을 저장했습니다
            </p>

            {Object.entries(grouped).map(([scenarioId, expressions]) => {
              const scenario = scenarios.find((s) => s.id === scenarioId);
              return (
                <div key={scenarioId}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    {scenario?.emoji} {scenario?.name || scenarioId}
                  </h3>
                  <div className="space-y-2">
                    {expressions.map((expr, idx) => (
                      <motion.div
                        key={expr.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {expr.japanese}
                            </p>
                            {expr.pronunciation && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                ({expr.pronunciation})
                              </p>
                            )}
                            <p className="text-xs text-gray-600 mt-0.5">
                              {expr.korean}
                            </p>
                            {expr.grammarNote && (
                              <p className="text-xs text-indigo-600 mt-1.5 flex items-start gap-1">
                                <span>📝</span> {expr.grammarNote}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => toggleBookmark(expr)}
                            className="text-lg hover:scale-110 transition shrink-0 ml-2"
                            title="북마크 해제"
                          >
                            ⭐
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
