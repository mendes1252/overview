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
      // Refresh the page to get updated data
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            Tarefas de Hoje
          </CardTitle>
          <Link href="/tarefas?new=true">
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" /> Nova
            </Button>
          </Link>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todas
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pendentes
          </Button>
          <Button
            variant={filter === "done" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("done")}
          >
            Concluidas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <CheckSquare className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-gray-500 mb-3">
              {filter === "done"
                ? "Nenhuma tarefa concluida ainda hoje"
                : "Nenhuma tarefa para hoje"}
            </p>
            <Link href="/tarefas?new=true">
              <Button variant="outline" size="sm">
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
                  "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                  task.status === "done"
                    ? "bg-gray-50 border-gray-100"
                    : "bg-white hover:bg-gray-50"
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
                        "text-sm font-medium truncate",
                        task.status === "done" && "line-through text-gray-400"
                      )}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {task.category && (
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${task.category.color}20`,
                          color: task.category.color,
                        }}
                      >
                        {task.category.name}
                      </Badge>
                    )}
                    {task.estimatedTime && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
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
            className="block text-center text-sm text-primary hover:underline mt-4"
          >
            Ver todas as tarefas
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
