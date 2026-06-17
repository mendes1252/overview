"use client";
import { cn, formatCurrency, getProductionStatusColor } from "@/lib/utils";
import { Clock, AlertTriangle, CreditCard } from "lucide-react";

export interface KanbanOrderData {
  id: string;
  orderNumber: number;
  customer: { name: string; type: string };
  total: number;
  paymentStatus: string;
  productionStatus: string;
  estimatedDelivery?: string | null;
  itemSummary: string;
  notes?: string | null;
  createdAt: string;
}

interface Props {
  order: KanbanOrderData;
  isDragging: boolean;
}

const paymentStatusColors: Record<string, string> = {
  pending: "text-yellow-600",
  partial: "text-orange-600",
  paid: "text-green-600",
  overdue: "text-red-600",
};

export function OrderCard({ order, isDragging }: Props) {
  const statusStyle = getProductionStatusColor(order.productionStatus);
  const isLate = order.productionStatus === "critical" || order.productionStatus === "delayed";

  return (
    <div
      className={cn(
        "bg-card border rounded-lg p-3 cursor-grab active:cursor-grabbing transition-shadow text-sm select-none",
        isDragging && "shadow-xl ring-2 ring-primary rotate-1",
        order.productionStatus === "critical" && "border-red-300 bg-red-50/30",
        order.productionStatus === "delayed" && "border-yellow-300"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-base">#{order.orderNumber}</span>
        {isLate && (
          <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1", statusStyle)}>
            <AlertTriangle className="w-3 h-3" />
            {order.productionStatus === "critical" ? "Atrasado" : "Atenção"}
          </span>
        )}
      </div>

      {/* Customer */}
      <p className="font-medium text-foreground truncate">{order.customer.name}</p>
      <span className="text-xs text-muted-foreground uppercase">{order.customer.type}</span>

      {/* Items */}
      <p className="text-xs text-muted-foreground mt-1.5 truncate">{order.itemSummary}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t gap-2">
        <span className="font-bold">{formatCurrency(order.total)}</span>
        <div className="flex items-center gap-1">
          {order.paymentStatus !== "paid" && (
            <CreditCard className={cn("w-3.5 h-3.5", paymentStatusColors[order.paymentStatus])} />
          )}
          {order.estimatedDelivery && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(order.estimatedDelivery).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
