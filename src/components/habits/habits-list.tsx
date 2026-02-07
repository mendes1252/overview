"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Flame,
  Trophy,
  Edit,
  Archive,
  ArchiveRestore,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { cn, generateWeekDays, isSameDay, getStreakEmoji } from "@/lib/utils";
import type { HabitWithRelations } from "@/types";
import type { Category } from "@prisma/client";

interface HabitsListProps {
  habits: HabitWithRelations[];
  categories: Category[];
  weekStart: Date;
  weekStartsOn: number;
  onToggleLog: (habitId: string, date: Date, completed: boolean) => void;
  onEdit: (habit: HabitWithRelations) => void;
  onDelete: (habitId: string) => void;
  onArchive: (habitId: string, archive: boolean) => void;
  showArchived: boolean;
}

export function HabitsList({
  habits,
  categories,
  weekStart,
  weekStartsOn,
  onToggleLog,
  onEdit,
  onDelete,
  onArchive,
  showArchived,
}: HabitsListProps) {
  const weekDays = generateWeekDays(weekStart);
  const dayNames = weekStartsOn === 0
    ? ["D", "S", "T", "Q", "Q", "S", "S"]
    : ["S", "T", "Q", "Q", "S", "S", "D"];

  const isDateCompleted = (habit: HabitWithRelations, date: Date) => {
    return habit.logs.some(
      (log) => isSameDay(new Date(log.date), date) && log.completed
    );
  };

  const isTargetDay = (habit: HabitWithRelations, date: Date) => {
    return habit.targetDays.includes(date.getDay());
  };

  const calculateConsistency = (habit: HabitWithRelations) => {
    const targetLogsCount = weekDays.filter((d) => isTargetDay(habit, d)).length;
    const completedCount = weekDays.filter(
      (d) => isTargetDay(habit, d) && isDateCompleted(habit, d)
    ).length;
    return targetLogsCount > 0 ? Math.round((completedCount / targetLogsCount) * 100) : 0;
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-6 h-6 text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {showArchived ? "Nenhum habito arquivado" : "Nenhum habito cadastrado"}
        </h3>
        <p className="text-gray-500">
          {showArchived
            ? "Habitos arquivados aparecerao aqui."
            : "Comece adicionando um habito que deseja construir."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <Card key={habit.id} className={cn(showArchived && "opacity-75")}>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Habit Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                  <h3 className="font-semibold text-gray-900 truncate">
                    {habit.name}
                  </h3>
                  {habit.currentStreak > 0 && (
                    <Badge variant="secondary" className="gap-1 flex-shrink-0">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {habit.currentStreak} dias {getStreakEmoji(habit.currentStreak)}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  {habit.category && (
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: habit.category.color,
                        color: habit.category.color,
                      }}
                    >
                      {habit.category.name}
                    </Badge>
                  )}
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    Melhor: {habit.bestStreak} dias
                  </span>
                  <span>{calculateConsistency(habit)}% esta semana</span>
                </div>
              </div>

              {/* Week Grid */}
              {!showArchived && (
                <div className="flex gap-1.5">
                  {weekDays.map((day, index) => {
                    const isTarget = isTargetDay(habit, day);
                    const isCompleted = isDateCompleted(habit, day);
                    const isToday = isSameDay(day, new Date());
                    const isPast = day < new Date() && !isToday;

                    return (
                      <div key={index} className="text-center">
                        <span className="text-xs text-gray-400 block mb-1">
                          {dayNames[index]}
                        </span>
                        <button
                          onClick={() => isTarget && onToggleLog(habit.id, day, isCompleted)}
                          disabled={!isTarget}
                          className={cn(
                            "w-9 h-9 rounded-lg text-xs font-medium transition-all",
                            isTarget
                              ? isCompleted
                                ? "text-white"
                                : isToday
                                ? "border-2 border-primary bg-primary/10"
                                : isPast
                                ? "bg-red-50 text-red-400 border border-red-200"
                                : "bg-gray-100 hover:bg-gray-200"
                              : "bg-gray-50 text-gray-300 cursor-not-allowed"
                          )}
                          style={{
                            backgroundColor: isTarget && isCompleted ? habit.color : undefined,
                          }}
                        >
                          {day.getDate()}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(habit)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onArchive(habit.id, !habit.isArchived)}>
                    {habit.isArchived ? (
                      <>
                        <ArchiveRestore className="w-4 h-4 mr-2" />
                        Restaurar
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4 mr-2" />
                        Arquivar
                      </>
                    )}
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir habito?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acao nao pode ser desfeita. Todo o historico do habito
                          sera perdido.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(habit.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
