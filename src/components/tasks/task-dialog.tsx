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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import type { TaskWithRelations } from "@/types";
import type { Category } from "@prisma/client";

const taskSchema = z.object({
  title: z.string().min(1, "Titulo obrigatorio"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
  estimatedTime: z.number().optional(),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskWithRelations | null;
  categories: Category[];
  onSubmit: (data: Partial<TaskWithRelations>) => void;
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  categories,
  onSubmit,
}: TaskDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      priority: "medium",
      dueDate: "",
      estimatedTime: undefined,
      isRecurring: false,
      recurrenceRule: "",
    },
  });

  const isRecurring = watch("isRecurring");

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        categoryId: task.categoryId || "",
        priority: task.priority as "low" | "medium" | "high",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        estimatedTime: task.estimatedTime || undefined,
        isRecurring: task.isRecurring,
        recurrenceRule: task.recurrenceRule || "",
      });
    } else {
      reset({
        title: "",
        description: "",
        categoryId: "",
        priority: "medium",
        dueDate: "",
        estimatedTime: undefined,
        isRecurring: false,
        recurrenceRule: "",
      });
    }
  }, [task, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit({
      title: data.title,
      description: data.description || null,
      categoryId: data.categoryId || null,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      estimatedTime: data.estimatedTime || null,
      isRecurring: data.isRecurring,
      recurrenceRule: data.isRecurring ? data.recurrenceRule : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Titulo *</Label>
            <Input
              id="title"
              placeholder="O que precisa ser feito?"
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
              placeholder="Detalhes adicionais..."
              {...register("description")}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label>Prioridade</Label>
              <Select
                value={watch("priority")}
                onValueChange={(value) =>
                  setValue("priority", value as "low" | "medium" | "high")
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                {...register("dueDate")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="estimatedTime">Tempo Estimado (min)</Label>
              <Input
                id="estimatedTime"
                type="number"
                placeholder="30"
                {...register("estimatedTime", { valueAsNumber: true })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={(checked) =>
                  setValue("isRecurring", checked as boolean)
                }
              />
              <Label htmlFor="isRecurring" className="cursor-pointer">
                Tarefa recorrente
              </Label>
            </div>

            {isRecurring && (
              <Select
                value={watch("recurrenceRule") || "daily"}
                onValueChange={(value) => setValue("recurrenceRule", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Frequencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="weekdays">Dias uteis</SelectItem>
                  <SelectItem value="monthly">Mensalmente</SelectItem>
                </SelectContent>
              </Select>
            )}
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
              {task ? "Salvar" : "Criar Tarefa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
