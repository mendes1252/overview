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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Habitos Rastreados
          </CardTitle>
          <Link href="/habitos?new=true">
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" /> Novo
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-gray-500 mb-3">
              Voce ainda nao tem habitos cadastrados
            </p>
            <Link href="/habitos?new=true">
              <Button variant="outline" size="sm">
                Criar primeiro habito
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="font-medium text-sm">{habit.name}</span>
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
                        <span className="text-xs text-gray-400 block mb-1">
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
                                ? "bg-green-500 text-white"
                                : isToday
                                ? "border-2 border-primary bg-primary/10"
                                : isPast
                                ? "bg-red-100 text-red-400 border border-red-200"
                                : "bg-gray-100 hover:bg-gray-200"
                              : "bg-gray-50 text-gray-300 cursor-not-allowed"
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
            className="block text-center text-sm text-primary hover:underline mt-4"
          >
            Ver todos os habitos
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
