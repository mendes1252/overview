"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DayCard } from "@/components/challenge/day-card";
import { ChallengeProgressBar } from "@/components/challenge/progress-bar";
import { Trophy, Flame } from "lucide-react";

interface EnrollmentData {
  enrolled: boolean;
  enrollment?: {
    status: string;
    currentDay: number;
    completedDays: number;
    completedDayNumbers: number[];
  };
  challenge?: {
    totalDays: number;
    days: Array<{
      dayNumber: number;
      title: string;
      description: string;
      isCompleted: boolean;
      isUnlocked: boolean;
    }>;
  };
  progress?: { percentage: number; label: string };
}

export default function MemberDashboard() {
  const router = useRouter();
  const [data, setData] = useState<EnrollmentData | null>(null);

  useEffect(() => {
    fetch("/api/challenge/enrollment")
      .then((r) => r.json())
      .then((d: EnrollmentData) => setData(d))
      .catch(() => {});
  }, []);

  if (!data?.enrollment || !data.challenge) return null;

  const { enrollment, challenge } = data;

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-white mb-1">
          Desafio de Produtividade
        </h1>
        <p className="text-white/50 font-light">
          {enrollment.status === "completed"
            ? "Parabens! Voce completou o desafio."
            : `Dia ${enrollment.currentDay} de ${challenge.totalDays}`}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/[0.05] border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-white/50 uppercase tracking-wider">
              Dias Completos
            </span>
          </div>
          <span className="text-2xl font-medium text-white">
            {enrollment.completedDays}
            <span className="text-sm text-white/30 font-light">
              /{challenge.totalDays}
            </span>
          </span>
        </div>
        <div className="bg-white/[0.05] border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-[#4A9FFF]" />
            <span className="text-xs text-white/50 uppercase tracking-wider">
              Status
            </span>
          </div>
          <span className="text-sm font-medium text-white">
            {enrollment.status === "completed"
              ? "Desafio Completo!"
              : "Em Progresso"}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 mb-8">
        <ChallengeProgressBar
          totalDays={challenge.totalDays}
          completedDayNumbers={enrollment.completedDayNumbers}
          currentDay={enrollment.currentDay}
        />
      </div>

      {/* Day cards */}
      <div className="space-y-3">
        {challenge.days.map((day) => (
          <DayCard
            key={day.dayNumber}
            dayNumber={day.dayNumber}
            title={day.title}
            description={day.description}
            isCompleted={day.isCompleted}
            isUnlocked={day.isUnlocked}
            isCurrent={
              day.dayNumber === enrollment.currentDay && !day.isCompleted
            }
          />
        ))}
      </div>
    </div>
  );
}
