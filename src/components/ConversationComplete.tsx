"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLearningStore, ChatMessage } from "@/store/learningStore";
import { scenarios } from "@/data/scenarios";

interface ConversationCompleteProps {
  messages: ChatMessage[];
}

export default function ConversationComplete({
  messages,
}: ConversationCompleteProps) {
  const {
    currentScenarioId,
    goToScenarioList,
    goToReview,
    resetConversation,
  } = useLearningStore();

  const scenario = scenarios.find((s) => s.id === currentScenarioId);
  const [showBonus, setShowBonus] = useState(false);

  const correctCount = messages.filter(
    (m) => m.correction?.wasCorrect
  ).length;
  const totalFeedback = messages.filter((m) => m.correction).length;
  const kanjiCount = messages.filter((m) => m.kanjiNote).length;

  const bonusExpressions = scenario?.bonusExpressions;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 mx-4 max-w-sm w-full shadow-xl my-auto"
      >
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            대화 완료!
          </h2>
          <p className="text-sm text-gray-500">
            {scenario?.name} 연습을 마쳤습니다
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">정확한 표현</span>
            <span className="font-semibold text-emerald-600">
              {correctCount}/{totalFeedback}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">학습한 한자</span>
            <span className="font-semibold text-indigo-600">
              {kanjiCount}개
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">대화 길이</span>
            <span className="font-semibold text-gray-700">
              {messages.filter((m) => m.role !== "system").length}턴
            </span>
          </div>
        </div>

        {/* 보너스 표현 */}
        {bonusExpressions && bonusExpressions.length > 0 && (
          <div className="mb-5">
            <button
              onClick={() => setShowBonus(!showBonus)}
              className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition text-sm"
            >
              <span className="font-semibold text-amber-700">
                💡 알아두면 좋은 표현 {bonusExpressions.length}개
              </span>
              <span className="text-amber-500 text-xs">
                {showBonus ? "접기 ▲" : "펼치기 ▼"}
              </span>
            </button>
            <AnimatePresence>
              {showBonus && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-1.5 max-h-52 overflow-y-auto">
                    {bonusExpressions.map((expr, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-amber-100 rounded-lg px-3 py-2"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {expr.japanese}
                        </p>
                        <p className="text-xs text-gray-400">
                          {expr.reading} ({expr.pronunciation})
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {expr.korean}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={goToReview}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition text-sm"
          >
            대화 복습하기
          </button>
          <button
            onClick={resetConversation}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition text-sm"
          >
            다시 연습하기
          </button>
          <button
            onClick={goToScenarioList}
            className="w-full py-2.5 text-gray-500 hover:text-gray-700 transition text-sm"
          >
            다른 시나리오 선택
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
