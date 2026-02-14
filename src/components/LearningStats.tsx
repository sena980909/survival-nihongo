"use client";

import { useLearningStore } from "@/store/learningStore";
import { scenarios, categoryInfo, type ScenarioCategory } from "@/data/scenarios";

export default function LearningStats() {
  const {
    completedScenarios,
    bookmarkedExpressions,
    learnedKanji,
    totalConversations,
    goToScenarioList,
  } = useLearningStore();

  const uniqueCompleted = new Set(completedScenarios.map((p) => p.scenarioId));

  // 카테고리별 진행률
  const categories: ScenarioCategory[] = [
    "airport",
    "transport",
    "food",
    "accommodation",
    "shopping",
    "daily",
    "emergency",
  ];

  const categoryProgress = categories.map((cat) => {
    const total = scenarios.filter((s) => s.category === cat).length;
    const done = scenarios.filter(
      (s) => s.category === cat && uniqueCompleted.has(s.id)
    ).length;
    return { category: cat, total, done, info: categoryInfo[cat] };
  });

  // 최근 학습 기록 (최근 10개)
  const recentHistory = [...completedScenarios]
    .reverse()
    .slice(0, 10)
    .map((p) => {
      const scenario = scenarios.find((s) => s.id === p.scenarioId);
      return {
        ...p,
        scenarioName: scenario?.name || p.scenarioId,
        emoji: scenario?.emoji || "📝",
      };
    });

  const categoryBarColors: Record<ScenarioCategory, string> = {
    airport: "bg-blue-500",
    transport: "bg-green-500",
    food: "bg-orange-500",
    accommodation: "bg-purple-500",
    shopping: "bg-pink-500",
    daily: "bg-teal-500",
    emergency: "bg-red-500",
  };

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
          <h1 className="text-base font-bold text-gray-900">학습 통계</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {/* 전체 통계 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {totalConversations}
            </div>
            <div className="text-xs text-gray-500 mt-1">총 연습 횟수</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-emerald-600">
              {uniqueCompleted.size}
              <span className="text-lg text-gray-400">
                /{scenarios.length}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">완료 시나리오</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">
              {bookmarkedExpressions.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">북마크 표현</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {learnedKanji.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">학습 한자</div>
          </div>
        </div>

        {/* 카테고리별 진행률 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            카테고리별 진행률
          </h3>
          <div className="space-y-3">
            {categoryProgress.map(({ category, total, done, info }) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">
                    {info.emoji} {info.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {done}/{total}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${categoryBarColors[category]} h-2 rounded-full transition-all duration-500`}
                    style={{
                      width: total > 0 ? `${(done / total) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 학습 기록 */}
        {recentHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              최근 학습 기록
            </h3>
            <div className="space-y-2">
              {recentHistory.map((record, i) => {
                const date = new Date(record.completedAt);
                const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
                const timeStr = `${date.getHours()}:${String(
                  date.getMinutes()
                ).padStart(2, "0")}`;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{record.emoji}</span>
                      <span className="text-sm text-gray-700">
                        {record.scenarioName}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {dateStr} {timeStr}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {totalConversations === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-sm text-gray-500">
              아직 학습 기록이 없어요.
              <br />
              시나리오를 시작해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
