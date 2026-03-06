"use client";

import { CheckCircle, Lock, Circle } from "lucide-react";

interface ProgressBarProps {
  totalDays: number;
  completedDayNumbers: number[];
  currentDay: number;
}

export function ChallengeProgressBar({
  totalDays,
  completedDayNumbers,
  currentDay,
}: ProgressBarProps) {
  const percentage = Math.round((completedDayNumbers.length / totalDays) * 100);

  return (
    <div className="w-full">
      {/* Progress percentage */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-white/60 font-light">Seu progresso</span>
        <span className="text-sm font-medium text-[#4A9FFF]">{percentage}%</span>
      </div>

      {/* Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4A9FFF] to-[#6BB5FF] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Day indicators */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const isCompleted = completedDayNumbers.includes(day);
          const isCurrent = day === currentDay;
          const isLocked = !isCompleted && !isCurrent && day !== 1;

          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  isCompleted
                    ? "bg-emerald-500/20 text-emerald-400"
                    : isCurrent
                    ? "bg-[#4A9FFF]/20 text-[#4A9FFF] ring-2 ring-[#4A9FFF]/30 animate-pulse-glow"
                    : isLocked
                    ? "bg-white/5 text-white/30"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : isLocked ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isCompleted
                    ? "text-emerald-400"
                    : isCurrent
                    ? "text-[#4A9FFF]"
                    : "text-white/30"
                }`}
              >
                Dia {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
