"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  CheckCircle,
  Lock,
  Circle,
  Gift,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnrollmentData {
  enrolled: boolean;
  enrollment?: {
    status: string;
    currentDay: number;
    completedDays: number;
    completedDayNumbers: number[];
    bonusClaimed: boolean;
  };
  challenge?: {
    title: string;
    totalDays: number;
    days: Array<{
      dayNumber: number;
      title: string;
      isCompleted: boolean;
      isUnlocked: boolean;
    }>;
  };
  progress?: { percentage: number; label: string };
}

export default function MemberAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<EnrollmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/desafio/area-de-membros");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/challenge/enrollment")
        .then((r) => r.json())
        .then((d: EnrollmentData) => {
          if (!d.enrolled || (d.enrollment?.status !== "active" && d.enrollment?.status !== "completed")) {
            router.push("/desafio/checkout");
            return;
          }
          setData(d);
        })
        .catch(() => router.push("/desafio"))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E]">
        <div className="animate-pulse text-white/50">Carregando...</div>
      </div>
    );
  }

  if (!data?.enrollment || !data.challenge) return null;

  const { enrollment, challenge, progress } = data;
  const isChallengeDone = enrollment.status === "completed";

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-[#0F1419] fixed inset-y-0 left-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link href="/desafio" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4A9FFF]/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#4A9FFF]" />
            </div>
            <span className="text-lg font-medium text-white">Pulse</span>
          </Link>
          <p className="text-xs text-white/40 font-light mt-2">
            Desafio de 7 Dias
          </p>
        </div>

        {/* Progress */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-white/50">{progress?.label}</span>
            <span className="text-[#4A9FFF] font-medium">
              {progress?.percentage}%
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4A9FFF] to-[#6BB5FF] rounded-full transition-all duration-700"
              style={{ width: `${progress?.percentage || 0}%` }}
            />
          </div>
        </div>

        {/* Days navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {challenge.days.map((day) => {
            const isActive = pathname.includes(`/dia/${day.dayNumber}`);
            return (
              <Link
                key={day.dayNumber}
                href={
                  day.isUnlocked || day.isCompleted
                    ? `/desafio/area-de-membros/dia/${day.dayNumber}`
                    : "#"
                }
                className={`flex items-center gap-3 px-5 py-3 text-sm transition-all ${
                  isActive
                    ? "bg-[#4A9FFF]/10 text-white border-r-2 border-[#4A9FFF]"
                    : day.isCompleted
                    ? "text-white/60 hover:bg-white/5"
                    : day.isUnlocked
                    ? "text-white/70 hover:bg-white/5"
                    : "text-white/25 cursor-not-allowed"
                }`}
                onClick={(e) => {
                  if (!day.isUnlocked && !day.isCompleted) e.preventDefault();
                }}
              >
                {day.isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : day.isUnlocked ? (
                  <Circle className="w-4 h-4 text-[#4A9FFF] shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-white/20 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="block truncate font-light">
                    Dia {day.dayNumber}: {day.title}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Bonus link */}
          <Link
            href={
              isChallengeDone ? "/desafio/area-de-membros/bonus" : "#"
            }
            className={`flex items-center gap-3 px-5 py-3 text-sm transition-all mt-2 border-t border-white/5 pt-4 ${
              isChallengeDone
                ? pathname.includes("/bonus")
                  ? "bg-[#4A9FFF]/10 text-white border-r-2 border-[#4A9FFF]"
                  : "text-[#4A9FFF] hover:bg-white/5"
                : "text-white/25 cursor-not-allowed"
            }`}
            onClick={(e) => {
              if (!isChallengeDone) e.preventDefault();
            }}
          >
            <Gift
              className={`w-4 h-4 shrink-0 ${
                isChallengeDone ? "text-[#4A9FFF]" : "text-white/20"
              }`}
            />
            <span className="font-light">Bonus</span>
            {!isChallengeDone && (
              <Lock className="w-3 h-3 text-white/20 ml-auto" />
            )}
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-white/5">
          <Link href="/desafio">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white/40 hover:text-white hover:bg-white/5 gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar ao site
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0F1419] border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/desafio/area-de-membros" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#4A9FFF]" />
            <span className="text-sm font-medium text-white">Desafio 7 Dias</span>
          </Link>
          <span className="text-xs text-[#4A9FFF] font-medium">
            {progress?.percentage}%
          </span>
        </div>
        <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4A9FFF] rounded-full"
            style={{ width: `${progress?.percentage || 0}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-72 pt-20 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
