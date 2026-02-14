"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLearningStore } from "@/store/learningStore";

const slides = [
  {
    emoji: "🇯🇵",
    title: "일본 여행 회화를 연습해보세요",
    description:
      "입국심사부터 편의점, 택시, 레스토랑까지\n실제 여행에서 만나는 상황을 미리 경험해요.",
    sub: "16개의 실전 시나리오",
  },
  {
    emoji: "💬",
    title: "선택지를 고르며 자연스럽게 배워요",
    description:
      "3개의 선택지 중 하나를 골라보세요.\n맞으면 칭찬, 틀려도 친절한 교정 피드백!",
    sub: "한국어 발음 + 해석 + 문법 포인트",
    example: {
      npc: "パスポートを見せてください。",
      npcKo: "(파스포-토오 미세테쿠다사이)",
      choices: ["はい、こちらです。", "うん、これ。", "はい、どうぞ。"],
    },
  },
  {
    emoji: "🚀",
    title: "시작해볼까요?",
    description:
      "북마크, 복습 퀴즈, 한자 학습까지\n여행 준비를 도와드릴게요.",
    sub: "지금 바로 시작!",
  },
];

export default function Onboarding() {
  const { completeOnboarding } = useLearningStore();
  const [page, setPage] = useState(0);

  const goNext = () => {
    if (page < slides.length - 1) {
      setPage(page + 1);
    } else {
      completeOnboarding();
    }
  };

  const goBack = () => {
    if (page > 0) setPage(page - 1);
  };

  const slide = slides[page];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="max-w-sm w-full text-center"
        >
          <div className="text-6xl mb-6">{slide.emoji}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {slide.title}
          </h2>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed mb-4">
            {slide.description}
          </p>
          <p className="text-xs text-indigo-500 font-medium mb-6">
            {slide.sub}
          </p>

          {slide.example && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 text-left">
              <div className="bg-gray-100 rounded-xl px-3 py-2 mb-3">
                <p className="text-sm font-medium text-gray-800">
                  {slide.example.npc}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {slide.example.npcKo}
                </p>
              </div>
              <div className="space-y-1.5">
                {slide.example.choices.map((c, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 rounded-lg text-sm border ${
                      i === 0
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 도트 네비게이션 */}
      <div className="flex gap-2 mb-6">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === page ? "bg-indigo-500 w-6" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 w-full max-w-sm">
        {page > 0 && (
          <button
            onClick={goBack}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
          >
            이전
          </button>
        )}
        <button
          onClick={goNext}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-indigo-500 hover:bg-indigo-600 transition"
        >
          {page === slides.length - 1 ? "시작하기" : "다음"}
        </button>
      </div>

      {page < slides.length - 1 && (
        <button
          onClick={completeOnboarding}
          className="mt-3 text-xs text-gray-400 hover:text-gray-500 transition"
        >
          건너뛰기
        </button>
      )}
    </div>
  );
}
