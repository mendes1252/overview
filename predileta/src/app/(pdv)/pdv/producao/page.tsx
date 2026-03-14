import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import type { KanbanOrder } from "@/types";

const KANBAN_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

async function getKanbanData(): Promise<Record<string, KanbanOrder[]>> {
  // In production, this would call the API. In SSR context, we call prisma directly.
  // Using dynamic import to keep it server-side only.
  const { prisma } = await import("@/lib/prisma");

  const ACTIVE_STATUSES = ["received", "washing", "drying", "ironing", "ready", "delivered"] as const;

  const orders = await prisma.order.findMany({
    where: {
      status: { in: [...ACTIVE_STATUSES] },
      createdAt: { gte: new Date(Date.now() - 14 * 86400000) },
    },
    include: {
      customer: { select: { id: true, name: true, type: true } },
      items: { include: { service: { select: { name: true, unit: true } } } },
    },
    orderBy: [{ productionStatus: "asc" }, { estimatedDelivery: "asc" }],
  });

  const columns: Record<string, KanbanOrder[]> = {};
  for (const status of ACTIVE_STATUSES) {
    columns[status] = orders
      .filter((o) => o.status === status)
      .map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.customer,
        total: Number(o.total),
        paymentStatus: o.paymentStatus,
        productionStatus: o.productionStatus,
        estimatedDelivery: o.estimatedDelivery?.toISOString() ?? null,
        itemSummary:
          o.items
            .map((i) => `${Number(i.quantity)} ${i.service.unit === "piece" ? "pç" : i.service.unit}`)
            .join(", ") || "—",
        notes: o.notes,
        createdAt: o.createdAt.toISOString(),
      }));
  }

  return columns;
}

export default async function ProducaoPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const kanbanData = await getKanbanData();
  const totalActive = Object.entries(kanbanData)
    .filter(([k]) => k !== "delivered")
    .reduce((sum, [, v]) => sum + v.length, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Produção</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Arraste as OS entre as colunas para atualizar o status
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{totalActive}</p>
          <p className="text-xs text-muted-foreground">em produção</p>
        </div>
      </div>

      <KanbanBoard initialData={kanbanData} />
    </div>
  );
}
