"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  scenarios,
  categoryInfo,
  type ScenarioCategory,
} from "@/data/scenarios";
import { useLearningStore } from "@/store/learningStore";

const ALL_CATEGORIES: ("all" | ScenarioCategory)[] = [
  "all",
  "airport",
  "food",
  "transport",
  "accommodation",
  "shopping",
  "daily",
  "emergency",
];

export default function ScenarioSelect() {
  const { selectScenario, completedScenarios, goToBookmarks, totalConversations } =
    useLearningStore();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | ScenarioCategory
  >("all");

  const filteredScenarios =
    selectedCategory === "all"
      ? scenarios
      : scenarios.filter((s) => s.category === selectedCategory);

  const getCompletionCount = (scenarioId: string) =>
    completedScenarios.filter((p) => p.scenarioId === scenarioId).length;

  const categoryColorMap: Record<ScenarioCategory, string> = {
    airport: "bg-blue-100 border-blue-200",
    food: "bg-orange-50 border-orange-200",
    transport: "bg-green-50 border-green-200",
    accommodation: "bg-purple-50 border-purple-200",
    shopping: "bg-pink-50 border-pink-200",
    daily: "bg-teal-50 border-teal-200",
    emergency: "bg-red-50 border-red-200",
  };

  const categoryAccent: Record<ScenarioCategory, string> = {
    airport: "text-blue-600",
    food: "text-orange-600",
    transport: "text-green-600",
    accommodation: "text-purple-600",
    shopping: "text-pink-600",
    daily: "text-teal-600",
    emergency: "text-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold text-gray-900">
              일본어 회화 연습
            </h1>
            <button
              onClick={goToBookmarks}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition"
            >
              ⭐ 북마크
            </button>
          </div>
          <p className="text-sm text-gray-500">
            실전 상황별 일본어 회화를 연습해보세요
          </p>
          {totalConversations > 0 && (
            <div className="mt-3 flex gap-3">
              <div className="bg-indigo-50 rounded-lg px-3 py-1.5 text-xs text-indigo-600 font-medium">
                총 {totalConversations}회 연습
              </div>
              <div className="bg-emerald-50 rounded-lg px-3 py-1.5 text-xs text-emerald-600 font-medium">
                {new Set(completedScenarios.map((p) => p.scenarioId)).size}/{scenarios.length} 시나리오 완료
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto">
        <div className="max-w-md mx-auto flex gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat === "all"
                ? "전체"
                : `${categoryInfo[cat].emoji} ${categoryInfo[cat].name}`}
            </button>
          ))}
        </div>
      </div>

      {/* 시나리오 카드 */}
      <div className="max-w-md mx-auto px-4 mt-4 space-y-3">
        {filteredScenarios.map((scenario, index) => {
          const count = getCompletionCount(scenario.id);
          const catInfo = categoryInfo[scenario.category];

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => selectScenario(scenario.id)}
                className={`w-full text-left rounded-2xl p-4 transition-all duration-200 border hover:shadow-md hover:scale-[1.01] active:scale-[0.99] ${
                  categoryColorMap[scenario.category]
                } bg-white`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl mt-0.5">{scenario.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium ${
                          categoryAccent[scenario.category]
                        }`}
                      >
                        {catInfo.emoji} {catInfo.name}
                      </span>
                      {count > 0 && (
                        <span className="text-xs bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-medium">
                          ✅ {count}회
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">
                      {scenario.name}
                      <span className="text-sm text-gray-400 font-normal ml-2">
                        {scenario.nameJa}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {scenario.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">
                        ⏱ {scenario.estimatedMinutes}분
                      </span>
                      {scenario.kanjiList.length > 0 && (
                        <span className="text-xs text-gray-400">
                          🈲 한자 {scenario.kanjiList.length}개
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        📝 {scenario.keyExpressions.length}표현
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
