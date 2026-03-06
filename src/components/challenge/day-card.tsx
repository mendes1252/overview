"use client";

import Link from "next/link";
import { CheckCircle, Lock, Play, ChevronRight } from "lucide-react";

interface DayCardProps {
  dayNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
}

export function DayCard({
  dayNumber,
  title,
  description,
  isCompleted,
  isUnlocked,
  isCurrent,
}: DayCardProps) {
  const isAccessible = isCompleted || isUnlocked;

  const card = (
    <div
      className={`group relative rounded-2xl border p-5 transition-all duration-300 ${
        isCompleted
          ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
          : isCurrent
          ? "bg-[#4A9FFF]/5 border-[#4A9FFF]/30 hover:border-[#4A9FFF]/50 animate-pulse-glow"
          : isUnlocked
          ? "bg-white/[0.03] border-white/10 hover:border-white/20"
          : "bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Day number badge */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isCompleted
              ? "bg-emerald-500/15"
              : isCurrent
              ? "bg-[#4A9FFF]/15"
              : "bg-white/5"
          }`}
        >
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          ) : !isAccessible ? (
            <Lock className="w-5 h-5 text-white/30" />
          ) : (
            <span
              className={`text-lg font-medium ${
                isCurrent ? "text-[#4A9FFF]" : "text-white/50"
              }`}
            >
              {dayNumber}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-medium uppercase tracking-wider ${
                isCompleted
                  ? "text-emerald-400"
                  : isCurrent
                  ? "text-[#4A9FFF]"
                  : "text-white/30"
              }`}
            >
              Dia {dayNumber}
            </span>
            {isCompleted && (
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                Concluido
              </span>
            )}
            {isCurrent && (
              <span className="text-[10px] bg-[#4A9FFF]/15 text-[#4A9FFF] px-2 py-0.5 rounded-full font-medium">
                Atual
              </span>
            )}
          </div>
          <h3
            className={`font-medium mb-1 ${
              isAccessible ? "text-white" : "text-white/40"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm font-light line-clamp-2 ${
              isAccessible ? "text-white/50" : "text-white/20"
            }`}
          >
            {description}
          </p>
        </div>

        {/* Action indicator */}
        {isAccessible && (
          <div className="shrink-0 self-center">
            {isCurrent ? (
              <div className="w-10 h-10 rounded-full bg-[#4A9FFF] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 text-white ml-0.5" />
              </div>
            ) : (
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
            )}
          </div>
        )}
      </div>

      {/* Locked overlay tooltip */}
      {!isAccessible && (
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
          <span className="text-sm text-white/70 bg-black/60 px-3 py-1.5 rounded-full">
            Complete o Dia {dayNumber - 1} para desbloquear
          </span>
        </div>
      )}
    </div>
  );

  if (isAccessible) {
    return (
      <Link href={`/desafio/area-de-membros/dia/${dayNumber}`}>{card}</Link>
    );
  }

  return card;
}
