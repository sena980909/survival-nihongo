"use client";

import { motion } from "framer-motion";
import { useLearningStore } from "@/store/learningStore";
import { scenarios } from "@/data/scenarios";
import CorrectionCard from "./CorrectionCard";
import KanjiCard from "./KanjiCard";

const NPC_EMOTIONS: Record<string, string> = {
  neutral: "😐",
  happy: "😊",
  confused: "😕",
  encouraging: "😄",
};

export default function ConversationReview() {
  const { messages, currentScenarioId, goToScenarioList } = useLearningStore();

  const scenario = scenarios.find((s) => s.id === currentScenarioId);

  const kanjiNotes = messages.filter((m) => m.kanjiNote);
  const corrections = messages.filter((m) => m.correction);

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
            <span className="font-bold text-gray-900">
              {scenario?.emoji} 대화 복습
            </span>
          </div>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-6">
        {/* 요약 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-3">학습 요약</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {corrections.filter((m) => m.correction?.wasCorrect).length}
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">정확한 표현</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {kanjiNotes.length}
              </p>
              <p className="text-xs text-indigo-700 mt-0.5">학습한 한자</p>
            </div>
          </div>
        </div>

        {/* 한자 복습 */}
        {kanjiNotes.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <h2 className="font-bold text-gray-900 mb-3">🈲 한자 복습</h2>
            <div className="space-y-2">
              {kanjiNotes.map((msg) =>
                msg.kanjiNote ? (
                  <KanjiCard key={msg.id} kanjiNote={msg.kanjiNote} />
                ) : null
              )}
            </div>
          </div>
        )}

        {/* 대화 전체 기록 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-3">💬 대화 기록</h2>
          <div className="space-y-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${
                  msg.role === "user"
                    ? "ml-8"
                    : msg.role === "system"
                    ? ""
                    : "mr-8"
                }`}
              >
                {msg.role === "system" ? (
                  <div className="bg-gray-50 rounded-xl px-3 py-2 text-center">
                    <p className="text-xs text-gray-500">{msg.content}</p>
                  </div>
                ) : msg.role === "npc" ? (
                  <div>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {NPC_EMOTIONS[msg.npcEmotion || "neutral"]}
                      </span>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-xl px-3 py-2">
                          <p className="text-sm text-gray-900">{msg.content}</p>
                          {msg.contentPronunciation && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              ({msg.contentPronunciation})
                            </p>
                          )}
                          {msg.contentKo && (
                            <p className="text-xs text-gray-500 mt-1 pt-1 border-t border-gray-100">
                              🇰🇷 {msg.contentKo}
                            </p>
                          )}
                        </div>
                        {msg.correction && (
                          <CorrectionCard correction={msg.correction} />
                        )}
                        {msg.kanjiNote && (
                          <KanjiCard kanjiNote={msg.kanjiNote} />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="bg-indigo-500 rounded-xl px-3 py-2">
                      <p className="text-sm text-white">{msg.content}</p>
                      {msg.contentPronunciation && (
                        <p className="text-xs text-indigo-200 mt-0.5">
                          ({msg.contentPronunciation})
                        </p>
                      )}
                      {msg.contentKo && (
                        <p className="text-xs text-indigo-200 mt-0.5">
                          {msg.contentKo}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <button
          onClick={goToScenarioList}
          className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition text-sm"
        >
          다른 시나리오 연습하기
        </button>
      </div>
    </div>
  );
}
