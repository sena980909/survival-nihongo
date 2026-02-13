"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface DamageEffectProps {
  damage: number;
  feedback: string;
  isNatural: boolean;
  onComplete: () => void;
}

export default function DamageEffect({
  damage,
  feedback,
  isNatural,
  onComplete,
}: DamageEffectProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const isGood = damage === 0 && isNatural;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* 화면 흔들림 + 빨간 번쩍임 (데미지) */}
          {damage > 0 && (
            <motion.div
              className="absolute inset-0 bg-red-600/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0, 0.3, 0] }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* 칭찬 이펙트 (노 데미지) */}
          {isGood && (
            <motion.div
              className="absolute inset-0 bg-green-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0.1] }}
              transition={{ duration: 0.8 }}
            />
          )}

          {/* 중앙 카드 */}
          <motion.div
            initial={{ scale: 0.5, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`mx-4 p-5 rounded-2xl max-w-sm w-full border backdrop-blur-sm ${
              isGood
                ? "bg-green-950/90 border-green-700"
                : damage >= 20
                ? "bg-red-950/90 border-red-700"
                : "bg-yellow-950/90 border-yellow-700"
            }`}
          >
            {/* 데미지 숫자 */}
            <motion.div
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-center mb-3"
            >
              {isGood ? (
                <span className="text-4xl font-black text-green-400">
                  PERFECT!
                </span>
              ) : (
                <span className="text-4xl font-black text-red-400">
                  -{damage} HP
                </span>
              )}
            </motion.div>

            {/* 피드백 */}
            {feedback && (
              <p className="text-sm text-gray-200 text-center leading-relaxed">
                {feedback}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
