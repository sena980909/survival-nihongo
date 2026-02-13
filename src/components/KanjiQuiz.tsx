"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { KanjiChallenge } from "@/data/dialogue";

interface Props {
  challenge: KanjiChallenge;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function KanjiQuiz({ challenge }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const isCorrect = selected === challenge.correctReading;

  const options = useMemo(
    () => shuffleArray([challenge.correctReading, ...challenge.wrongReadings]),
    [challenge]
  );

  return (
    <div className="bg-gray-800/50 rounded-xl p-3 border border-orange-900/50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-orange-400">🈲 한자 퀴즈</span>
        <span className="text-gray-500 text-[10px]">{challenge.meaning}</span>
      </div>

      <p className="text-2xl font-bold text-white text-center mb-3">
        {challenge.kanji}
      </p>
      <p className="text-xs text-gray-400 text-center mb-2">
        이 한자의 읽는 법은?
      </p>

      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const isThis = selected === option;
          const isAnswer = option === challenge.correctReading;

          let style = "bg-gray-700 border-gray-600 hover:border-gray-400 text-white";
          if (selected) {
            if (isAnswer) {
              style = "bg-green-900/50 border-green-500 text-green-300";
            } else if (isThis && !isAnswer) {
              style = "bg-red-900/50 border-red-500 text-red-300";
            } else {
              style = "bg-gray-800 border-gray-700 text-gray-500";
            }
          }

          return (
            <button
              key={option}
              onClick={() => !selected && setSelected(option)}
              disabled={!!selected}
              className={`px-2 py-2 rounded-lg border text-sm font-medium transition ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2"
        >
          {isCorrect ? (
            <p className="text-xs text-green-400 text-center font-bold">
              🎉 정답! {challenge.kanji} = {challenge.correctReading}
            </p>
          ) : (
            <div className="text-center">
              <p className="text-xs text-red-400 font-bold">
                ❌ 오답! 정답: {challenge.correctReading}
              </p>
              {challenge.hint && (
                <p className="text-xs text-gray-400 mt-1">{challenge.hint}</p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
