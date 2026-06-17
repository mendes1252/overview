import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ACTIVE_STATUSES = ["received", "washing", "drying", "ironing", "ready", "delivered"] as const;

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  // Default: last 7 days + all non-delivered. "all" param shows last 30 days
  const showAll = searchParams.get("all") === "true";
  const daysBack = showAll ? 30 : 14;

  const orders = await prisma.order.findMany({
    where: {
      status: { in: [...ACTIVE_STATUSES] },
      createdAt: { gte: new Date(Date.now() - daysBack * 86400000) },
    },
    include: {
      customer: { select: { id: true, name: true, type: true } },
      items: {
        include: { service: { select: { name: true, unit: true } } },
      },
    },
    orderBy: [{ productionStatus: "asc" }, { estimatedDelivery: "asc" }],
  });

  // Group by status and build summary
  const columns: Record<string, unknown[]> = {};
  for (const status of ACTIVE_STATUSES) {
    columns[status] = orders
      .filter((o) => o.status === status)
      .map((o) => {
        const itemSummary = o.items
          .map((i) => `${Number(i.quantity)} ${i.service.unit === "piece" ? "pç" : i.service.unit}`)
          .join(", ");

        return {
          id: o.id,
          orderNumber: o.orderNumber,
          customer: o.customer,
          total: Number(o.total),
          paymentStatus: o.paymentStatus,
          productionStatus: o.productionStatus,
          estimatedDelivery: o.estimatedDelivery?.toISOString() ?? null,
          itemSummary: itemSummary || "—",
          notes: o.notes,
          createdAt: o.createdAt.toISOString(),
        };
      });
  }

  return NextResponse.json(columns);
}
