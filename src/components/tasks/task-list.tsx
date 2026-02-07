"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, Circle, Clock, Calendar, Edit, Trash2, Copy } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { TaskWithRelations } from "@/types";
import type { Category } from "@prisma/client";

interface TaskListProps {
  tasks: TaskWithRelations[];
  categories: Category[];
  onToggle: (taskId: string, completed: boolean) => void;
  onEdit: (task: TaskWithRelations) => void;
  onDelete: (taskId: string) => void;
}

export function TaskList({ tasks, categories, onToggle, onEdit, onDelete }: TaskListProps) {
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

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-gray-500">
          Crie uma nova tarefa ou ajuste os filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border divide-y">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "flex items-start gap-4 p-4 transition-colors",
            task.status === "done" ? "bg-gray-50" : "hover:bg-gray-50"
          )}
        >
          <Checkbox
            checked={task.status === "done"}
            onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {priorityIcon(task.priority)}
                  <span
                    className={cn(
                      "font-medium",
                      task.status === "done" && "line-through text-gray-400"
                    )}
                  >
                    {task.title}
                  </span>
                </div>

                {task.description && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
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

                  {task.dueDate && (
                    <span
                      className={cn(
                        "text-xs flex items-center gap-1",
                        new Date(task.dueDate) < new Date() && task.status !== "done"
                          ? "text-red-500"
                          : "text-gray-400"
                      )}
                    >
                      <Calendar className="w-3 h-3" />
                      {formatDate(task.dueDate)}
                    </span>
                  )}

                  {task.estimatedTime && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.estimatedTime}min
                    </span>
                  )}

                  {task.subtasks.length > 0 && (
                    <span className="text-xs text-gray-400">
                      {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}{" "}
                      subtarefas
                    </span>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
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
                        <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acao nao pode ser desfeita. A tarefa sera
                          permanentemente removida.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(task.id)}
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
          </div>
        </div>
      ))}
    </div>
  );
}
