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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { getWeekRange, getMonthRange, getQuarterRange } from "@/lib/utils";
import type { GoalWithRelations } from "@/types";
import type { Category } from "@prisma/client";

const goalSchema = z.object({
  title: z.string().min(1, "Titulo obrigatorio"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.enum(["binary", "quantifiable"]),
  period: z.enum(["weekly", "monthly", "quarterly"]),
  targetValue: z.number().optional(),
  currentValue: z.number().optional(),
  unit: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: GoalWithRelations | null;
  categories: Category[];
  defaultPeriod: "weekly" | "monthly" | "quarterly";
  onSubmit: (data: Partial<GoalWithRelations>) => void;
}

export function GoalDialog({
  open,
  onOpenChange,
  goal,
  categories,
  defaultPeriod,
  onSubmit,
}: GoalDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
  });

  const type = watch("type");
  const period = watch("period");

  // Set default dates based on period
  useEffect(() => {
    const now = new Date();
    let range;

    switch (period) {
      case "weekly":
        range = getWeekRange(now, 1);
        break;
      case "monthly":
        range = getMonthRange(now);
        break;
      case "quarterly":
        range = getQuarterRange(now);
        break;
      default:
        range = getWeekRange(now, 1);
    }

    setValue("startDate", range.start.toISOString().split("T")[0]);
    setValue("endDate", range.end.toISOString().split("T")[0]);
  }, [period, setValue]);

  useEffect(() => {
    if (goal) {
      reset({
        title: goal.title,
        description: goal.description || "",
        categoryId: goal.categoryId || "",
        type: goal.type as "binary" | "quantifiable",
        period: goal.period as "weekly" | "monthly" | "quarterly",
        targetValue: goal.targetValue || undefined,
        currentValue: goal.currentValue || undefined,
        unit: goal.unit || "",
        startDate: new Date(goal.startDate).toISOString().split("T")[0],
        endDate: new Date(goal.endDate).toISOString().split("T")[0],
      });
    } else {
      const now = new Date();
      const range = getWeekRange(now, 1);

      reset({
        title: "",
        description: "",
        categoryId: "",
        type: "binary",
        period: defaultPeriod,
        targetValue: undefined,
        currentValue: 0,
        unit: "",
        startDate: range.start.toISOString().split("T")[0],
        endDate: range.end.toISOString().split("T")[0],
      });
    }
  }, [goal, defaultPeriod, reset]);

  const handleFormSubmit = (data: GoalFormData) => {
    onSubmit({
      title: data.title,
      description: data.description || null,
      categoryId: data.categoryId || null,
      type: data.type,
      period: data.period,
      targetValue: data.type === "quantifiable" ? data.targetValue : null,
      currentValue: data.type === "quantifiable" ? (data.currentValue || 0) : null,
      unit: data.type === "quantifiable" ? data.unit : null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{goal ? "Editar Meta" : "Nova Meta"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Titulo da Meta *</Label>
            <Input
              id="title"
              placeholder="Ex: Lancar MVP do produto"
              {...register("title")}
              className="mt-1"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descricao</Label>
            <Textarea
              id="description"
              placeholder="Detalhes sobre a meta..."
              {...register("description")}
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={type}
                onValueChange={(value) =>
                  setValue("type", value as "binary" | "quantifiable")
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="binary">Sim/Nao</SelectItem>
                  <SelectItem value="quantifiable">Quantificavel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Periodo</Label>
              <Select
                value={period}
                onValueChange={(value) =>
                  setValue("period", value as "weekly" | "monthly" | "quarterly")
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {type === "quantifiable" && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="targetValue">Valor Alvo</Label>
                <Input
                  id="targetValue"
                  type="number"
                  placeholder="20"
                  {...register("targetValue", { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="currentValue">Valor Atual</Label>
                <Input
                  id="currentValue"
                  type="number"
                  placeholder="0"
                  {...register("currentValue", { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="unit">Unidade</Label>
                <Input
                  id="unit"
                  placeholder="km, horas..."
                  {...register("unit")}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Data Inicio</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="endDate">Data Fim</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
                className="mt-1"
              />
            </div>
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
              {goal ? "Salvar" : "Criar Meta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
