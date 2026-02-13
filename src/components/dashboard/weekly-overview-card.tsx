"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

interface WeeklyOverviewCardProps {
  weekStart: Date;
  weekEnd: Date;
  completedTasks: number;
  totalTasks: number;
}

export function WeeklyOverviewCard({
  weekStart,
  weekEnd,
  completedTasks,
  totalTasks,
}: WeeklyOverviewCardProps) {
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="rounded-2xl border-black/[0.04]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-[#1A1A2E] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#4A9FFF]" />
            Visao Semanal
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-[#718096]">
              {formatDateShort(weekStart)} - {formatDateShort(weekEnd)}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#718096] font-light">Progresso da Semana</span>
            <span className="font-medium text-[#1A1A2E]">
              {completedTasks}/{totalTasks} tarefas
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-[#718096] font-light">
            {progress === 100
              ? "Parabens! Todas as tarefas concluidas!"
              : progress >= 70
              ? "Otimo progresso! Continue assim!"
              : progress >= 40
              ? "Bom trabalho, voce esta no caminho certo."
              : totalTasks === 0
              ? "Adicione tarefas para comecar a acompanhar seu progresso."
              : "Vamos la! Cada tarefa conta."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
