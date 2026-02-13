"use client";

import { motion, AnimatePresence } from "framer-motion";
import { EducationContent } from "@/data/dialogue";
import KanjiQuiz from "./KanjiQuiz";

interface Props {
  education: EducationContent;
  show: boolean;
  onToggle: () => void;
}

export default function EducationPanel({ education, show, onToggle }: Props) {
  return (
    <div className="shrink-0">
      <button
        onClick={onToggle}
        className="w-full py-2 text-xs font-bold text-indigo-400 bg-gray-900 border-t border-gray-800 hover:bg-gray-800 transition flex items-center justify-center gap-1"
      >
        {show ? "📚 학습 패널 닫기 ▲" : "📚 학습 패널 열기 ▼"}
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900/95 border-t border-indigo-900 px-4 py-3 overflow-hidden"
          >
            {/* 핵심 표현 */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-indigo-400">
                  📝 핵심 표현
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/50 text-indigo-300">
                  {education.keyExpression.formality === "casual"
                    ? "반말"
                    : education.keyExpression.formality === "polite"
                    ? "존댓말"
                    : "격식체"}
                </span>
              </div>
              <p className="text-sm text-white font-medium">
                {education.keyExpression.pattern}
                <span className="text-gray-400 ml-2">
                  = {education.keyExpression.patternKo}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {education.keyExpression.explanation}
              </p>
            </div>

            {/* 어휘 */}
            <div className="mb-3">
              <span className="text-xs font-bold text-green-400">📖 어휘</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {education.vocabulary.map((v, i) => (
                  <div
                    key={i}
                    className="bg-gray-800 rounded-lg px-2.5 py-1.5 text-xs border border-gray-700"
                  >
                    <span className="text-white font-medium">{v.word}</span>
                    <span className="text-gray-400 ml-1">({v.reading})</span>
                    <span className="text-purple-400 ml-1">[{v.pronunciation}]</span>
                    <span className="text-yellow-400 ml-1">{v.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 한자 퀴즈 */}
            {education.kanjiChallenge && (
              <KanjiQuiz challenge={education.kanjiChallenge} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
