import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, CheckCircle, TrendingUp, Target } from "lucide-react";

interface WeeklySummaryCardProps {
  completedTasks: number;
  totalTasks: number;
  habitsConsistency: number;
  goalsAchieved: number;
  totalGoals: number;
}

export function WeeklySummaryCard({
  completedTasks,
  totalTasks,
  habitsConsistency,
  goalsAchieved,
  totalGoals,
}: WeeklySummaryCardProps) {
  const taskCompletionRate = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <Card className="rounded-2xl border-white/10 shadow-lg shadow-[#4A9FFF]/[0.04] bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-[#1A1A2E] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#4A9FFF]" />
          Resumo Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Task Completion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#4A9FFF]/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-[#4A9FFF]" />
              </div>
              <span className="text-sm text-[#718096] font-light">Tarefas</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-medium text-[#1A1A2E]">
                {taskCompletionRate}%
              </span>
              <span className="text-xs text-[#718096] font-light block">
                {completedTasks}/{totalTasks}
              </span>
            </div>
          </div>

          {/* Habits Consistency */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#4A9FFF]/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#4A9FFF]" />
              </div>
              <span className="text-sm text-[#718096] font-light">Hábitos</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-medium text-[#1A1A2E]">
                {Math.round(habitsConsistency)}%
              </span>
              <span className="text-xs text-[#718096] font-light block">consistência</span>
            </div>
          </div>

          {/* Goals */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#4A9FFF]/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-[#4A9FFF]" />
              </div>
              <span className="text-sm text-[#718096] font-light">Metas</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-medium text-[#1A1A2E]">
                {goalsAchieved}/{totalGoals}
              </span>
              <span className="text-xs text-[#718096] font-light block">alcançadas</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
