"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Plus, Flame } from "lucide-react";
import { cn, generateWeekDays, isSameDay, getStreakEmoji } from "@/lib/utils";
import type { HabitWithRelations } from "@/types";

interface HabitsCardProps {
  habits: HabitWithRelations[];
  weekStart: Date;
}

export function HabitsCard({ habits, weekStart }: HabitsCardProps) {
  const weekDays = generateWeekDays(weekStart);
  const dayNames = ["D", "S", "T", "Q", "Q", "S", "S"];

  const handleToggleHabit = async (habitId: string, date: Date, completed: boolean) => {
    try {
      await fetch(`/api/habits/${habitId}/log`, {
        method: completed ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: date.toISOString() }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  const isDateCompleted = (habit: HabitWithRelations, date: Date) => {
    return habit.logs.some((log) => isSameDay(new Date(log.date), date) && log.completed);
  };

  const isTargetDay = (habit: HabitWithRelations, date: Date) => {
    return habit.targetDays.includes(date.getDay());
  };

  return (
    <Card className="rounded-2xl border-black/[0.04]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-[#1A1A2E] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#4A9FFF]" />
            Habitos Rastreados
          </CardTitle>
          <Link href="/habitos?new=true">
            <Button size="sm" className="gap-1 bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl">
              <Plus className="w-4 h-4" /> Novo
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-[#4A9FFF]/10 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-[#4A9FFF]" />
            </div>
            <p className="text-[#718096] font-light mb-3">
              Voce ainda nao tem habitos cadastrados
            </p>
            <Link href="/habitos?new=true">
              <Button variant="outline" size="sm" className="rounded-xl">
                Criar primeiro habito
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="border border-black/[0.04] rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="font-medium text-sm text-[#1A1A2E]">{habit.name}</span>
                    {habit.currentStreak > 0 && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {habit.currentStreak} dias
                        {getStreakEmoji(habit.currentStreak)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Week grid */}
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day, index) => {
                    const isTarget = isTargetDay(habit, day);
                    const isCompleted = isDateCompleted(habit, day);
                    const isToday = isSameDay(day, new Date());
                    const isPast = day < new Date() && !isToday;

                    return (
                      <div key={index} className="text-center">
                        <span className="text-xs text-[#718096] font-light block mb-1">
                          {dayNames[day.getDay()]}
                        </span>
                        <button
                          onClick={() =>
                            isTarget && handleToggleHabit(habit.id, day, isCompleted)
                          }
                          disabled={!isTarget}
                          className={cn(
                            "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                            isTarget
                              ? isCompleted
                                ? "bg-[#4A9FFF] text-white"
                                : isToday
                                ? "border-2 border-[#4A9FFF] bg-[#4A9FFF]/10"
                                : isPast
                                ? "bg-red-100 text-red-400 border border-red-200"
                                : "bg-[#F5F7FA] hover:bg-[#4A9FFF]/10"
                              : "bg-[#F5F7FA] text-[#718096]/30 cursor-not-allowed"
                          )}
                        >
                          {day.getDate()}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {habits.length > 0 && (
          <Link
            href="/habitos"
            className="block text-center text-sm text-[#4A9FFF] hover:underline mt-4"
          >
            Ver todos os habitos
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
