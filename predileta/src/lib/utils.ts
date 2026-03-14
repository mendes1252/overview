import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string | { toString(): string }): string {
  const n = typeof value === "number" ? value : parseFloat(value.toString());
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getOrderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    received: "Recebido",
    washing: "Lavando",
    drying: "Secando",
    ironing: "Passando",
    ready: "Pronto",
    delivered: "Entregue",
    cancelled: "Cancelado",
  };
  return map[status] ?? status;
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    received: "bg-blue-100 text-blue-700",
    washing: "bg-cyan-100 text-cyan-700",
    drying: "bg-orange-100 text-orange-700",
    ironing: "bg-yellow-100 text-yellow-700",
    ready: "bg-green-100 text-green-700",
    delivered: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

export function getProductionStatusColor(status: string): string {
  switch (status) {
    case "on_time":
      return "text-green-600 bg-green-50";
    case "delayed":
      return "text-yellow-600 bg-yellow-50";
    case "critical":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

export function getPaymentStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Pendente",
    partial: "Parcial",
    paid: "Pago",
    overdue: "Vencido",
    refunded: "Estornado",
  };
  return map[status] ?? status;
}

export function getPaymentStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    partial: "bg-orange-100 text-orange-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-600",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

export function calcProductionStatus(
  estimatedDelivery: Date | null | undefined,
  status: string
): "on_time" | "delayed" | "critical" {
  if (
    !estimatedDelivery ||
    status === "delivered" ||
    status === "cancelled"
  ) {
    return "on_time";
  }
  const hoursUntil =
    (estimatedDelivery.getTime() - Date.now()) / (1000 * 3600);
  if (hoursUntil < 0) return "critical";
  if (hoursUntil < 4) return "delayed";
  return "on_time";
}
