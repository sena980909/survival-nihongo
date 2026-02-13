"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

export default function HpBar() {
  const { hp, maxHp } = useGameStore();
  const hpPercent = (hp / maxHp) * 100;

  const getColor = () => {
    if (hpPercent > 60) return "bg-green-500";
    if (hpPercent > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getGlow = () => {
    if (hpPercent > 60) return "shadow-green-500/50";
    if (hpPercent > 30) return "shadow-yellow-500/50";
    return "shadow-red-500/50";
  };

  return (
    <div className="flex items-center gap-2 flex-1">
      <span className="text-sm font-bold text-white">❤️</span>
      <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()} shadow-lg ${getGlow()} rounded-full`}
          initial={{ width: "100%" }}
          animate={{ width: `${hpPercent}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
      </div>
      <span className="text-sm font-mono text-white min-w-[3rem] text-right">
        {hp}/{maxHp}
      </span>
    </div>
  );
}
