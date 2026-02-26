"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitsList } from "./habits-list";
import { HabitsHeatmap } from "./habits-heatmap";
import { HabitDialog } from "./habit-dialog";
import { Plus, TrendingUp, Calendar, Archive } from "lucide-react";
import type { HabitWithRelations } from "@/types";
import type { Category } from "@prisma/client";

interface HabitsClientProps {
  initialHabits: HabitWithRelations[];
  categories: Category[];
  weekStart: Date;
  weekStartsOn: number;
}

export function HabitsClient({
  initialHabits,
  categories,
  weekStart,
  weekStartsOn,
}: HabitsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [habits, setHabits] = useState(initialHabits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithRelations | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsDialogOpen(true);
      router.replace("/habitos");
    }
  }, [searchParams, router]);

  const activeHabits = habits.filter((h) => !h.isArchived);
  const archivedHabits = habits.filter((h) => h.isArchived);
  const displayedHabits = showArchived ? archivedHabits : activeHabits;

  const handleCreateHabit = async (data: Partial<HabitWithRelations>) => {
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create habit");

      const newHabit = await response.json();
      setHabits([newHabit, ...habits]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  const handleUpdateHabit = async (habitId: string, data: Partial<HabitWithRelations>) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update habit");

      const updatedHabit = await response.json();
      setHabits(habits.map((h) => (h.id === habitId ? updatedHabit : h)));
      setEditingHabit(null);
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete habit");

      setHabits(habits.filter((h) => h.id !== habitId));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const handleToggleLog = async (habitId: string, date: Date, completed: boolean) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/log`, {
        method: completed ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: date.toISOString() }),
      });

      if (!response.ok) throw new Error("Failed to toggle habit log");

      // Refresh the page to get updated streak data
      window.location.reload();
    } catch (error) {
      console.error("Error toggling habit log:", error);
    }
  };

  const handleArchiveHabit = async (habitId: string, archive: boolean) => {
    await handleUpdateHabit(habitId, { isArchived: archive });
  };

  const handleEditHabit = (habit: HabitWithRelations) => {
    setEditingHabit(habit);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingHabit(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium text-white">Hábitos</h1>
          <p className="text-white/50 font-light">
            {activeHabits.length} hábito{activeHabits.length !== 1 ? "s" : ""} ativo
            {activeHabits.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showArchived ? "default" : "outline"}
            onClick={() => setShowArchived(!showArchived)}
            className={`gap-2 rounded-xl ${showArchived ? "bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"}`}
          >
            <Archive className="w-4 h-4" />
            {showArchived ? "Ver Ativos" : `Arquivados (${archivedHabits.length})`}
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl">
            <Plus className="w-4 h-4" /> Novo Hábito
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="tracking" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="tracking" className="gap-2 data-[state=active]:bg-[#4A9FFF] data-[state=active]:text-white text-white/50">
            <TrendingUp className="w-4 h-4" />
            Rastreamento
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-[#4A9FFF] data-[state=active]:text-white text-white/50">
            <Calendar className="w-4 h-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracking">
          <HabitsList
            habits={displayedHabits}
            categories={categories}
            weekStart={new Date(weekStart)}
            weekStartsOn={weekStartsOn}
            onToggleLog={handleToggleLog}
            onEdit={handleEditHabit}
            onDelete={handleDeleteHabit}
            onArchive={handleArchiveHabit}
            showArchived={showArchived}
          />
        </TabsContent>

        <TabsContent value="history">
          <HabitsHeatmap habits={activeHabits} />
        </TabsContent>
      </Tabs>

      {/* Dialog */}
      <HabitDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        habit={editingHabit}
        categories={categories}
        onSubmit={
          editingHabit
            ? (data) => handleUpdateHabit(editingHabit.id, data)
            : handleCreateHabit
        }
      />
    </div>
  );
}
