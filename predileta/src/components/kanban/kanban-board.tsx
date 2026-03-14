"use client";
import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { OrderCard, type KanbanOrderData } from "./order-card";
import { getOrderStatusLabel, getOrderStatusColor, cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const COLUMNS = [
  "received",
  "washing",
  "drying",
  "ironing",
  "ready",
  "delivered",
] as const;

type ColumnKey = (typeof COLUMNS)[number];

interface Props {
  initialData: Record<string, KanbanOrderData[]>;
}

export function KanbanBoard({ initialData }: Props) {
  const [columns, setColumns] = useState<Record<string, KanbanOrderData[]>>(initialData);

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination || source.droppableId === destination.droppableId) return;

      const newStatus = destination.droppableId;

      // Optimistic update
      const prev = { ...columns };
      setColumns((cols) => {
        const updated = { ...cols };
        const sourceList = [...(updated[source.droppableId] ?? [])];
        const [moved] = sourceList.splice(source.index, 1);
        updated[source.droppableId] = sourceList;

        const destList = [...(updated[newStatus] ?? [])];
        destList.splice(destination.index, 0, moved);
        updated[newStatus] = destList;
        return updated;
      });

      // Persist
      try {
        const res = await fetch(`/api/orders/${draggableId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error("Falha ao atualizar status");
      } catch {
        // Revert on failure
        setColumns(prev);
        toast({ title: "Erro ao mover OS", variant: "destructive" });
      }
    },
    [columns]
  );

  const totalActive = COLUMNS.filter(
    (c) => c !== "delivered"
  ).reduce((sum, c) => sum + (columns[c]?.length ?? 0), 0);

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-3">
        {totalActive} OS em produção
      </p>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-6">
          {COLUMNS.map((col) => {
            const colOrders = columns[col] ?? [];
            return (
              <div key={col} className="flex-shrink-0 w-64">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                        getOrderStatusColor(col)
                      )}
                    >
                      {getOrderStatusLabel(col)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {colOrders.length}
                  </span>
                </div>
                <Droppable droppableId={col}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "kanban-column rounded-xl p-2 space-y-2 transition-colors min-h-[120px]",
                        snapshot.isDraggingOver
                          ? "bg-teal-50 ring-2 ring-teal-300"
                          : "bg-muted/40"
                      )}
                    >
                      {colOrders.map((order, index) => (
                        <Draggable
                          key={order.id}
                          draggableId={order.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <OrderCard
                                order={order}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {colOrders.length === 0 && !snapshot.isDraggingOver && (
                        <div className="text-center py-4 text-xs text-muted-foreground/50">
                          Vazio
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
