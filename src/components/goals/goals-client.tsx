"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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
import { GoalDialog } from "./goal-dialog";
import {
  Plus,
  Target,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Trophy,
  CheckCircle,
} from "lucide-react";
import { cn, formatDate, calculateProgress } from "@/lib/utils";
import type { GoalWithRelations } from "@/types";
import type { Category } from "@prisma/client";

interface GoalsClientProps {
  initialGoals: GoalWithRelations[];
  categories: Category[];
}

export function GoalsClient({ initialGoals, categories }: GoalsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [goals, setGoals] = useState(initialGoals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalWithRelations | null>(null);
  const [period, setPeriod] = useState<"weekly" | "monthly" | "quarterly">("weekly");

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsDialogOpen(true);
      router.replace("/metas");
    }
  }, [searchParams, router]);

  const filteredGoals = goals.filter((g) => g.period === period);

  const handleCreateGoal = async (data: Partial<GoalWithRelations>) => {
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create goal");

      const newGoal = await response.json();
      setGoals([newGoal, ...goals]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const handleUpdateGoal = async (goalId: string, data: Partial<GoalWithRelations>) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update goal");

      const updatedGoal = await response.json();
      setGoals(goals.map((g) => (g.id === goalId ? updatedGoal : g)));
      setEditingGoal(null);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete goal");

      setGoals(goals.filter((g) => g.id !== goalId));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const handleToggleGoal = async (goalId: string, achieved: boolean) => {
    await handleUpdateGoal(goalId, {
      status: achieved ? "achieved" : "in_progress",
      completedAt: achieved ? new Date() : null,
    });
  };

  const handleEditGoal = (goal: GoalWithRelations) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingGoal(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "achieved":
        return <Badge variant="success">Alcancada</Badge>;
      case "not_achieved":
        return <Badge variant="danger">Nao alcancada</Badge>;
      default:
        return <Badge variant="secondary">Em andamento</Badge>;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium text-[#1A1A2E]">Metas</h1>
          <p className="text-[#718096] font-light">
            {filteredGoals.length} meta{filteredGoals.length !== 1 ? "s" : ""}{" "}
            {period === "weekly" ? "semanais" : period === "monthly" ? "mensais" : "trimestrais"}
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl">
          <Plus className="w-4 h-4" /> Nova Meta
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <TabsList className="mb-6">
          <TabsTrigger value="weekly">Semanais</TabsTrigger>
          <TabsTrigger value="monthly">Mensais</TabsTrigger>
          <TabsTrigger value="quarterly">Trimestrais</TabsTrigger>
        </TabsList>

        <TabsContent value={period}>
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-black/[0.04]">
              <div className="w-12 h-12 rounded-2xl bg-[#4A9FFF]/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-[#4A9FFF]" />
              </div>
              <h3 className="text-lg font-medium text-[#1A1A2E] mb-1">
                Nenhuma meta{" "}
                {period === "weekly" ? "semanal" : period === "monthly" ? "mensal" : "trimestral"}
              </h3>
              <p className="text-[#718096] font-light mb-4">
                Defina metas para acompanhar seu progresso.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="rounded-xl">
                Criar Meta
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredGoals.map((goal) => (
                <Card
                  key={goal.id}
                  className={cn(
                    "transition-colors rounded-2xl",
                    goal.status === "achieved" ? "bg-green-50 border-green-200" : "border-black/[0.04]"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {goal.type === "binary" ? (
                          <Checkbox
                            checked={goal.status === "achieved"}
                            onCheckedChange={(checked) =>
                              handleToggleGoal(goal.id, checked as boolean)
                            }
                            className="mt-1"
                          />
                        ) : (
                          <Trophy
                            className={cn(
                              "w-5 h-5 mt-0.5 flex-shrink-0",
                              goal.status === "achieved"
                                ? "text-green-500"
                                : "text-[#718096]"
                            )}
                          />
                        )}
                        <div className="min-w-0">
                          <h3
                            className={cn(
                              "font-medium text-[#1A1A2E]",
                              goal.status === "achieved" && "line-through text-[#718096]"
                            )}
                          >
                            {goal.title}
                          </h3>
                          {goal.description && (
                            <p className="text-sm text-[#718096] font-light mt-1 line-clamp-2">
                              {goal.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditGoal(goal)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
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
                                <AlertDialogTitle>Excluir meta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acao nao pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteGoal(goal.id)}
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

                    {/* Progress for quantifiable goals */}
                    {goal.type === "quantifiable" && goal.targetValue && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-[#718096] font-light">
                            {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                          </span>
                          <span className="font-medium text-[#1A1A2E]">
                            {calculateProgress(goal.currentValue || 0, goal.targetValue)}%
                          </span>
                        </div>
                        <Progress
                          value={calculateProgress(goal.currentValue || 0, goal.targetValue)}
                          className="h-2"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[#718096] font-light">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                        </span>
                      </div>
                      {getStatusBadge(goal.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog */}
      <GoalDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        goal={editingGoal}
        categories={categories}
        defaultPeriod={period}
        onSubmit={
          editingGoal
            ? (data) => handleUpdateGoal(editingGoal.id, data)
            : handleCreateGoal
        }
      />
    </div>
  );
}
