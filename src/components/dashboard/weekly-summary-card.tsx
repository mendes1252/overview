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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-pink-600" />
          Resumo Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Task Completion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Tarefas</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">
                {taskCompletionRate}%
              </span>
              <span className="text-xs text-gray-500 block">
                {completedTasks}/{totalTasks}
              </span>
            </div>
          </div>

          {/* Habits Consistency */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Habitos</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">
                {Math.round(habitsConsistency)}%
              </span>
              <span className="text-xs text-gray-500 block">consistencia</span>
            </div>
          </div>

          {/* Goals */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Metas</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">
                {goalsAchieved}/{totalGoals}
              </span>
              <span className="text-xs text-gray-500 block">alcancadas</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
