"use client";

interface ProgressDotsProps {
  current: number;
  total: number;
}

export default function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            i < current ? "bg-indigo-500" : "bg-gray-300"
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1.5">
        {current}/{total}
      </span>
    </div>
  );
}
