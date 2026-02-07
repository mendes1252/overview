"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, isSameDay } from "@/lib/utils";
import type { HabitWithRelations } from "@/types";

interface HabitsHeatmapProps {
  habits: HabitWithRelations[];
}

export function HabitsHeatmap({ habits }: HabitsHeatmapProps) {
  // Generate last 12 weeks of dates
  const today = new Date();
  const weeks: Date[][] = [];

  for (let w = 11; w >= 0; w--) {
    const week: Date[] = [];
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (w * 7) - today.getDay());

    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + d);
      week.push(day);
    }
    weeks.push(week);
  }

  const getCompletionRate = (date: Date) => {
    let totalTarget = 0;
    let totalCompleted = 0;

    habits.forEach((habit) => {
      if (habit.targetDays.includes(date.getDay())) {
        totalTarget++;
        if (
          habit.logs.some(
            (log) => isSameDay(new Date(log.date), date) && log.completed
          )
        ) {
          totalCompleted++;
        }
      }
    });

    return totalTarget > 0 ? totalCompleted / totalTarget : null;
  };

  const getColor = (rate: number | null) => {
    if (rate === null) return "bg-gray-100";
    if (rate === 0) return "bg-red-100";
    if (rate < 0.5) return "bg-yellow-200";
    if (rate < 1) return "bg-green-300";
    return "bg-green-500";
  };

  const monthLabels = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Adicione habitos para ver seu historico aqui.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Historico de Consistencia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {/* Day labels */}
          <div className="flex gap-1 mb-2 ml-8">
            <span className="text-xs text-gray-400 w-3">D</span>
            <span className="text-xs text-gray-400 w-3 ml-4">T</span>
            <span className="text-xs text-gray-400 w-3 ml-4">Q</span>
            <span className="text-xs text-gray-400 w-3 ml-3">S</span>
          </div>

          <div className="flex gap-1">
            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {/* Month label */}
                {weekIndex === 0 || week[0].getDate() <= 7 ? (
                  <span className="text-xs text-gray-400 h-4 mb-1">
                    {weekIndex === 0 || week[0].getDate() <= 7
                      ? monthLabels[week[0].getMonth()]
                      : ""}
                  </span>
                ) : (
                  <span className="h-4 mb-1" />
                )}

                {/* Days */}
                {week.map((day, dayIndex) => {
                  const rate = getCompletionRate(day);
                  const isToday = isSameDay(day, today);
                  const isFuture = day > today;

                  return (
                    <div
                      key={dayIndex}
                      title={`${day.toLocaleDateString("pt-BR")}${
                        rate !== null ? ` - ${Math.round(rate * 100)}%` : ""
                      }`}
                      className={cn(
                        "w-3 h-3 rounded-sm",
                        isFuture ? "bg-gray-50" : getColor(rate),
                        isToday && "ring-2 ring-primary ring-offset-1"
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span>Menos</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-100" />
              <div className="w-3 h-3 rounded-sm bg-red-100" />
              <div className="w-3 h-3 rounded-sm bg-yellow-200" />
              <div className="w-3 h-3 rounded-sm bg-green-300" />
              <div className="w-3 h-3 rounded-sm bg-green-500" />
            </div>
            <span>Mais</span>
          </div>
        </div>

        {/* Stats per habit */}
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-gray-900">Por Habito</h4>
          {habits.map((habit) => {
            const totalLogs = habit.logs.filter((l) => l.completed).length;
            return (
              <div
                key={habit.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="text-sm">{habit.name}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {totalLogs} dias no ultimo mes
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
