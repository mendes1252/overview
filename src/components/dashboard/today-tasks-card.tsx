"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Plus, Circle, Clock } from "lucide-react";
import { cn, getPriorityColor } from "@/lib/utils";
import type { TaskWithRelations } from "@/types";

interface TodayTasksCardProps {
  tasks: TaskWithRelations[];
}

export function TodayTasksCard({ tasks }: TodayTasksCardProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return task.status !== "done";
    if (filter === "done") return task.status === "done";
    return true;
  });

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: completed ? "done" : "todo",
          completedAt: completed ? new Date().toISOString() : null,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const priorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Circle className="w-3 h-3 fill-red-500 text-red-500" />;
      case "medium":
        return <Circle className="w-3 h-3 fill-yellow-500 text-yellow-500" />;
      case "low":
        return <Circle className="w-3 h-3 fill-green-500 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="rounded-2xl border-black/[0.04]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-[#1A1A2E] flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#4A9FFF]" />
            Tarefas de Hoje
          </CardTitle>
          <Link href="/tarefas?new=true">
            <Button size="sm" className="gap-1 bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl">
              <Plus className="w-4 h-4" /> Nova
            </Button>
          </Link>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl" : "rounded-xl"}
          >
            Todas
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("pending")}
            className={filter === "pending" ? "bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl" : "rounded-xl"}
          >
            Pendentes
          </Button>
          <Button
            variant={filter === "done" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("done")}
            className={filter === "done" ? "bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl" : "rounded-xl"}
          >
            Concluidas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-[#4A9FFF]/10 flex items-center justify-center mx-auto mb-3">
              <CheckSquare className="w-6 h-6 text-[#4A9FFF]" />
            </div>
            <p className="text-[#718096] font-light mb-3">
              {filter === "done"
                ? "Nenhuma tarefa concluida ainda hoje"
                : "Nenhuma tarefa para hoje"}
            </p>
            <Link href="/tarefas?new=true">
              <Button variant="outline" size="sm" className="rounded-xl">
                Adicionar primeira tarefa
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border transition-colors",
                  task.status === "done"
                    ? "bg-[#F5F7FA] border-black/[0.04]"
                    : "bg-white hover:bg-[#F5F7FA] border-black/[0.04]"
                )}
              >
                <Checkbox
                  checked={task.status === "done"}
                  onCheckedChange={(checked) =>
                    handleToggleTask(task.id, checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {priorityIcon(task.priority)}
                    <span
                      className={cn(
                        "text-sm font-medium truncate text-[#1A1A2E]",
                        task.status === "done" && "line-through text-[#718096]"
                      )}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {task.category && (
                      <Badge
                        variant="secondary"
                        className="text-xs rounded-lg"
                        style={{
                          backgroundColor: `${task.category.color}20`,
                          color: task.category.color,
                        }}
                      >
                        {task.category.name}
                      </Badge>
                    )}
                    {task.estimatedTime && (
                      <span className="text-xs text-[#718096] font-light flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.estimatedTime}min
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tasks.length > 0 && (
          <Link
            href="/tarefas"
            className="block text-center text-sm text-[#4A9FFF] hover:underline mt-4"
          >
            Ver todas as tarefas
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
