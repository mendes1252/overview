"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "./task-list";
import { TaskKanban } from "./task-kanban";
import { TaskDialog } from "./task-dialog";
import { Plus, List, Columns, Search, Filter } from "lucide-react";
import type { TaskWithRelations } from "@/types";
import type { Category } from "@prisma/client";

interface TasksClientProps {
  initialTasks: TaskWithRelations[];
  categories: Category[];
}

export function TasksClient({ initialTasks, categories }: TasksClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
    search: "",
    dateRange: "all",
  });

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsDialogOpen(true);
      router.replace("/tarefas");
    }
  }, [searchParams, router]);

  const filteredTasks = tasks.filter((task) => {
    if (filters.status !== "all" && task.status !== filters.status) return false;
    if (filters.priority !== "all" && task.priority !== filters.priority) return false;
    if (filters.category !== "all" && task.categoryId !== filters.category) return false;
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()))
      return false;

    if (filters.dateRange !== "all" && task.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);

      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + (7 - today.getDay()));

      switch (filters.dateRange) {
        case "today":
          if (taskDate.getTime() !== today.getTime()) return false;
          break;
        case "week":
          if (taskDate < today || taskDate > weekEnd) return false;
          break;
        case "overdue":
          if (taskDate >= today || task.status === "done") return false;
          break;
      }
    }

    return true;
  });

  const handleCreateTask = async (data: Partial<TaskWithRelations>) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create task");

      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (taskId: string, data: Partial<TaskWithRelations>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    await handleUpdateTask(taskId, {
      status: completed ? "done" : "todo",
      completedAt: completed ? new Date() : null,
    });
  };

  const handleEditTask = (task: TaskWithRelations) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium text-white">Tarefas</h1>
          <p className="text-white/50 font-light">
            {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl">
          <Plus className="w-4 h-4" /> Nova Tarefa
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
          <Input
            placeholder="Buscar tarefas..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Filter Selects */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.dateRange}
            onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="overdue">Atrasadas</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="todo">A Fazer</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="done">Concluidas</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) => setFilters({ ...filters, priority: value })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <Tabs value={view} onValueChange={(v) => setView(v as "list" | "kanban")}>
            <TabsList>
              <TabsTrigger value="list" className="gap-1">
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
              <TabsTrigger value="kanban" className="gap-1">
                <Columns className="w-4 h-4" />
                <span className="hidden sm:inline">Kanban</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Task Views */}
      {view === "list" ? (
        <TaskList
          tasks={filteredTasks}
          categories={categories}
          onToggle={handleToggleTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      ) : (
        <TaskKanban
          tasks={filteredTasks}
          categories={categories}
          onStatusChange={(taskId, status) =>
            handleUpdateTask(taskId, {
              status,
              completedAt: status === "done" ? new Date() : null,
            })
          }
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        task={editingTask}
        categories={categories}
        onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
      />
    </div>
  );
}
