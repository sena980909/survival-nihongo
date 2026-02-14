"use client";

import { motion } from "framer-motion";
import type { KanjiNote } from "@/store/learningStore";

interface KanjiCardProps {
  kanjiNote: KanjiNote;
}

export default function KanjiCard({ kanjiNote }: KanjiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl px-4 py-3 mt-2 bg-indigo-50 border border-indigo-200"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-base">🈲</span>
        <span className="font-semibold text-xs text-indigo-700">
          한자 학습
        </span>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <div className="text-3xl font-bold text-indigo-900">
          {kanjiNote.kanji}
        </div>
        <div>
          <p className="text-sm text-gray-700">
            {kanjiNote.reading}{" "}
            <span className="text-gray-500">
              ({kanjiNote.pronunciation})
            </span>
          </p>
          <p className="text-sm font-medium text-gray-900">
            {kanjiNote.meaning}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed">
        {kanjiNote.explanation}
      </p>
    </motion.div>
  );
}
