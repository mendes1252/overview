"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Plus, Trophy } from "lucide-react";
import { cn, calculateProgress } from "@/lib/utils";
import type { GoalWithRelations } from "@/types";

interface WeeklyGoalsCardProps {
  goals: GoalWithRelations[];
}

export function WeeklyGoalsCard({ goals }: WeeklyGoalsCardProps) {
  const router = useRouter();
  const handleToggleGoal = async (goalId: string, achieved: boolean) => {
    try {
      await fetch(`/api/goals/${goalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: achieved ? "achieved" : "in_progress",
          completedAt: achieved ? new Date().toISOString() : null,
        }),
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  return (
    <Card className="rounded-2xl border-white/10 shadow-lg shadow-[#4A9FFF]/[0.04] bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-[#1A1A2E] flex items-center gap-2">
            <Target className="w-5 h-5 text-[#4A9FFF]" />
            Metas da Semana
          </CardTitle>
          <Link href="/metas?new=true">
            <Button variant="ghost" size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 rounded-2xl bg-[#4A9FFF]/10 flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-[#4A9FFF]" />
            </div>
            <p className="text-sm text-[#718096] font-light mb-2">
              Defina metas para a semana
            </p>
            <Link href="/metas?new=true">
              <Button variant="outline" size="sm" className="rounded-xl">
                Definir Metas
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={cn(
                  "p-3 rounded-xl border transition-colors",
                  goal.status === "achieved"
                    ? "bg-green-50 border-green-100"
                    : "bg-white border-black/[0.04]"
                )}
              >
                <div className="flex items-start gap-3">
                  {goal.type === "binary" ? (
                    <Checkbox
                      checked={goal.status === "achieved"}
                      onCheckedChange={(checked) =>
                        handleToggleGoal(goal.id, checked as boolean)
                      }
                      className="mt-0.5"
                    />
                  ) : (
                    <Trophy
                      className={cn(
                        "w-4 h-4 mt-0.5",
                        goal.status === "achieved"
                          ? "text-green-500"
                          : "text-[#718096]"
                      )}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span
                      className={cn(
                        "text-sm font-medium block text-[#1A1A2E]",
                        goal.status === "achieved" && "line-through text-[#718096]"
                      )}
                    >
                      {goal.title}
                    </span>
                    {goal.type === "quantifiable" && goal.targetValue && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-[#718096] font-light mb-1">
                          <span>
                            {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                          </span>
                          <span>
                            {calculateProgress(goal.currentValue || 0, goal.targetValue)}%
                          </span>
                        </div>
                        <Progress
                          value={calculateProgress(
                            goal.currentValue || 0,
                            goal.targetValue
                          )}
                          className="h-1.5"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {goals.length > 0 && (
          <Link
            href="/metas"
            className="block text-center text-sm text-[#4A9FFF] hover:underline mt-3"
          >
            Ver todas as metas
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
