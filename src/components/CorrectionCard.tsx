"use client";

import { motion } from "framer-motion";
import type { Correction } from "@/store/learningStore";

interface CorrectionCardProps {
  correction: Correction;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export default function CorrectionCard({
  correction,
  onBookmark,
  isBookmarked,
}: CorrectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl px-4 py-3 mt-2 text-sm ${
        correction.wasCorrect
          ? "bg-emerald-50 border border-emerald-200"
          : "bg-amber-50 border border-amber-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-base">
            {correction.wasCorrect ? "✅" : "💡"}
          </span>
          <span
            className={`font-semibold text-xs ${
              correction.wasCorrect ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {correction.wasCorrect ? "좋은 표현이에요!" : "더 자연스러운 표현이 있어요"}
          </span>
        </div>
        {onBookmark && (
          <button
            onClick={onBookmark}
            className="text-base hover:scale-110 transition shrink-0"
            title="북마크"
          >
            {isBookmarked ? "⭐" : "☆"}
          </button>
        )}
      </div>

      <p className="text-gray-700 text-xs leading-relaxed mb-1">
        {correction.explanation}
      </p>

      {correction.betterExpression && (
        <div className="mt-2 bg-white/70 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-500 mb-0.5">더 나은 표현:</p>
          <p className="text-sm font-medium text-gray-900">
            {correction.betterExpression}
          </p>
          {correction.betterExpressionPronunciation && (
            <p className="text-xs text-gray-500">
              ({correction.betterExpressionPronunciation})
            </p>
          )}
          {correction.betterExpressionKo && (
            <p className="text-xs text-gray-600 mt-0.5">
              {correction.betterExpressionKo}
            </p>
          )}
        </div>
      )}

      {correction.grammarPoint && (
        <div className="mt-2 flex items-start gap-1.5">
          <span className="text-xs">📝</span>
          <p className="text-xs text-gray-600 leading-relaxed">
            {correction.grammarPoint}
          </p>
        </div>
      )}
    </motion.div>
  );
}
