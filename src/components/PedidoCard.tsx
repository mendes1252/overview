"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Pedido } from "@/types";

interface PedidoCardProps {
  pedido: Pedido;
  onStatusChange?: (pedidoId: string, newStatus: string) => void;
}

const STATUS_OPTIONS = [
  { value: "recebido", label: "Recebido" },
  { value: "em_lavagem", label: "Em Lavagem" },
  { value: "pronto", label: "Pronto" },
  { value: "entregue", label: "Entregue" },
];

export function PedidoCard({ pedido, onStatusChange }: PedidoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <Link
            href={`/pedidos/${pedido.id}`}
            className="font-mono font-bold text-blue-600 hover:underline"
          >
            {pedido.protocolo}
          </Link>
          <p className="text-sm text-gray-600 mt-0.5">
            {pedido.cliente?.nome || "Cliente"}
          </p>
        </div>
        <StatusBadge status={pedido.status} />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span>{formatDate(pedido.createdAt)}</span>
        <span className="font-semibold text-gray-900">
          {formatCurrency(Number(pedido.valorFinal))}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        {pedido.pago ? (
          <span className="text-xs text-green-600 font-medium">Pago</span>
        ) : (
          <span className="text-xs text-red-600 font-medium">Pendente</span>
        )}

        {onStatusChange && pedido.status !== "cancelado" && pedido.status !== "entregue" && (
          <select
            className="text-xs border rounded px-2 py-1"
            value={pedido.status}
            onChange={(e) => onStatusChange(pedido.id, e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
