"use client";

import { motion } from "framer-motion";
import { stages } from "@/data/stages";
import { useGameStore } from "@/store/gameStore";

export default function StageSelect() {
  const { unlockedStages, selectStage } = useGameStore();

  const difficultyColor = {
    easy: "from-green-500 to-emerald-600",
    normal: "from-yellow-500 to-orange-500",
    hard: "from-red-500 to-rose-600",
    boss: "from-purple-600 to-fuchsia-700",
  };

  const difficultyLabel = {
    easy: "쉬움",
    normal: "보통",
    hard: "어려움",
    boss: "BOSS",
  };

  const kanjiStars = (level: number) => "🈲".repeat(level) || "✨";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 pt-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          🇯🇵 서바이벌 니혼고
        </h1>
        <p className="text-gray-400 text-sm">
          공부가 아니라 <span className="text-red-400 font-bold">생존</span>
          이다.
        </p>
      </motion.div>

      <div className="max-w-md mx-auto space-y-4">
        {stages.map((stage, index) => {
          const isUnlocked = unlockedStages.includes(stage.id);
          const isLocked = !isUnlocked;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => isUnlocked && selectStage(stage.id)}
                disabled={isLocked}
                className={`w-full text-left rounded-2xl p-5 transition-all duration-200 border ${
                  isLocked
                    ? "bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed"
                    : "bg-gray-800/80 border-gray-600 hover:border-gray-400 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`text-4xl w-14 h-14 flex items-center justify-center rounded-xl ${
                      isLocked ? "grayscale" : ""
                    } bg-gradient-to-br ${
                      isLocked
                        ? "from-gray-700 to-gray-800"
                        : difficultyColor[stage.difficulty]
                    }`}
                  >
                    {isLocked ? "🔒" : stage.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">
                        Lv.{stage.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isLocked
                            ? "bg-gray-700 text-gray-500"
                            : `bg-gradient-to-r ${
                                difficultyColor[stage.difficulty]
                              } text-white`
                        }`}
                      >
                        {difficultyLabel[stage.difficulty]}
                      </span>
                      {stage.kanjiLevel > 0 && (
                        <span className="text-xs text-gray-500">
                          漢字 {kanjiStars(stage.kanjiLevel)}
                        </span>
                      )}
                    </div>
                    <h3
                      className={`font-bold text-lg ${
                        isLocked ? "text-gray-500" : "text-white"
                      }`}
                    >
                      {stage.name}
                      <span className="text-sm text-gray-400 ml-2">
                        {stage.nameJa}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      🎯 {stage.mission}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-gray-600 text-xs mt-8"
      >
        스테이지를 클리어하면 다음 스테이지가 해금됩니다
      </motion.p>
    </div>
  );
}
