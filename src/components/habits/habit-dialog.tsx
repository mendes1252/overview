"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import type { HabitWithRelations } from "@/types";
import type { Category } from "@prisma/client";

const COLORS = [
  "#10B981", "#3B82F6", "#8B5CF6", "#F59E0B",
  "#EF4444", "#EC4899", "#06B6D4", "#84CC16",
];

const habitSchema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  categoryId: z.string().optional(),
  frequency: z.enum(["daily", "weekdays", "weekends", "custom"]),
  targetDays: z.array(z.number()).min(1, "Selecione ao menos um dia"),
  color: z.string(),
});

type HabitFormData = z.infer<typeof habitSchema>;

interface HabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: HabitWithRelations | null;
  categories: Category[];
  onSubmit: (data: Partial<HabitWithRelations>) => void;
}

const DAYS = [
  { value: 0, label: "Domingo", short: "D" },
  { value: 1, label: "Segunda", short: "S" },
  { value: 2, label: "Terca", short: "T" },
  { value: 3, label: "Quarta", short: "Q" },
  { value: 4, label: "Quinta", short: "Q" },
  { value: 5, label: "Sexta", short: "S" },
  { value: 6, label: "Sabado", short: "S" },
];

export function HabitDialog({
  open,
  onOpenChange,
  habit,
  categories,
  onSubmit,
}: HabitDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      frequency: "daily",
      targetDays: [0, 1, 2, 3, 4, 5, 6],
      color: COLORS[0],
    },
  });

  const frequency = watch("frequency");
  const targetDays = watch("targetDays");
  const color = watch("color");

  useEffect(() => {
    if (habit) {
      reset({
        name: habit.name,
        categoryId: habit.categoryId || "",
        frequency: habit.frequency as HabitFormData["frequency"],
        targetDays: habit.targetDays,
        color: habit.color,
      });
    } else {
      reset({
        name: "",
        categoryId: "",
        frequency: "daily",
        targetDays: [0, 1, 2, 3, 4, 5, 6],
        color: COLORS[0],
      });
    }
  }, [habit, reset]);

  useEffect(() => {
    switch (frequency) {
      case "daily":
        setValue("targetDays", [0, 1, 2, 3, 4, 5, 6]);
        break;
      case "weekdays":
        setValue("targetDays", [1, 2, 3, 4, 5]);
        break;
      case "weekends":
        setValue("targetDays", [0, 6]);
        break;
    }
  }, [frequency, setValue]);

  const handleFormSubmit = (data: HabitFormData) => {
    onSubmit({
      name: data.name,
      categoryId: data.categoryId || null,
      frequency: data.frequency,
      targetDays: data.targetDays,
      color: data.color,
    });
  };

  const toggleDay = (dayValue: number) => {
    if (frequency !== "custom") {
      setValue("frequency", "custom");
    }
    const newDays = targetDays.includes(dayValue)
      ? targetDays.filter((d) => d !== dayValue)
      : [...targetDays, dayValue].sort();
    setValue("targetDays", newDays);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{habit ? "Editar Habito" : "Novo Habito"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Habito *</Label>
            <Input
              id="name"
              placeholder="Ex: Meditar 10 minutos"
              {...register("name")}
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Categoria</Label>
            <Select
              value={watch("categoryId") || "none"}
              onValueChange={(value) =>
                setValue("categoryId", value === "none" ? "" : value)
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem categoria</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Frequencia</Label>
            <Select
              value={frequency}
              onValueChange={(value) =>
                setValue("frequency", value as HabitFormData["frequency"])
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Todos os dias</SelectItem>
                <SelectItem value="weekdays">Dias uteis</SelectItem>
                <SelectItem value="weekends">Fins de semana</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Dias da Semana</Label>
            <div className="flex gap-2 mt-2">
              {DAYS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    targetDays.includes(day.value)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
            {errors.targetDays && (
              <p className="text-sm text-red-500 mt-1">
                {errors.targetDays.message}
              </p>
            )}
          </div>

          <div>
            <Label>Cor</Label>
            <div className="flex gap-2 mt-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue("color", c)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {habit ? "Salvar" : "Criar Habito"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
