"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Circle, Calendar, Edit, Trash2 } from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";
import type { TaskWithRelations } from "@/types";
import type { Category } from "@prisma/client";

interface TaskKanbanProps {
  tasks: TaskWithRelations[];
  categories: Category[];
  onStatusChange: (taskId: string, status: string) => void;
  onEdit: (task: TaskWithRelations) => void;
  onDelete: (taskId: string) => void;
}

const columns = [
  { id: "todo", title: "A Fazer", color: "bg-[#718096]/10" },
  { id: "in_progress", title: "Em Progresso", color: "bg-[#4A9FFF]/10" },
  { id: "done", title: "Concluído", color: "bg-green-500/10" },
];

export function TaskKanban({
  tasks,
  categories,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskKanbanProps) {
  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  const priorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Circle className="w-2.5 h-2.5 fill-red-500 text-red-500" />;
      case "medium":
        return <Circle className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />;
      case "low":
        return <Circle className="w-2.5 h-2.5 fill-green-500 text-green-500" />;
      default:
        return null;
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);

        return (
          <div
            key={column.id}
            className="rounded-2xl border border-white/10 bg-white shadow-lg shadow-[#4A9FFF]/[0.04] overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={cn("px-4 py-3", column.color)}>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-[#1A1A2E]">{column.title}</h3>
                <span className="text-sm text-[#718096] bg-white/50 px-2 py-0.5 rounded-lg">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Column Tasks */}
            <div className="p-2 space-y-2 min-h-[200px]">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="bg-[#F5F7FA]/50 rounded-xl border border-black/[0.04] p-3 cursor-move hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      {priorityIcon(task.priority)}
                      <span className="font-medium text-sm text-[#1A1A2E] truncate">
                        {task.title}
                      </span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(task.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {task.category && (
                      <Badge
                        variant="secondary"
                        className="text-xs h-5"
                        style={{
                          backgroundColor: `${task.category.color}20`,
                          color: task.category.color,
                        }}
                      >
                        {task.category.name}
                      </Badge>
                    )}

                    {task.dueDate && (
                      <span
                        className={cn(
                          "text-xs flex items-center gap-1",
                          new Date(task.dueDate) < new Date() && task.status !== "done"
                            ? "text-red-500"
                            : "text-[#718096]"
                        )}
                      >
                        <Calendar className="w-3 h-3" />
                        {formatDateShort(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-sm text-[#718096]">
                  Arraste tarefas aqui
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
