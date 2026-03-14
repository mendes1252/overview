import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatsCard } from "@/components/dashboard/stats-card";
import { formatCurrency, getOrderStatusColor, getPaymentStatusColor } from "@/lib/utils";
import { ShoppingBag, AlertTriangle, CheckCircle2, DollarSign } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

async function getDashboardData() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [openOrders, delayed, ready, todayRevenue, recentOrders] = await Promise.all([
    prisma.order.count({
      where: { status: { notIn: ["delivered", "cancelled"] } },
    }),
    prisma.order.count({
      where: { productionStatus: { in: ["delayed", "critical"] } },
    }),
    prisma.order.count({ where: { status: "ready" } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "approved",
        paidAt: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.order.findMany({
      where: { status: { notIn: ["cancelled"] } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        customer: { select: { name: true, type: true } },
        items: { select: { service: { select: { name: true } } } },
      },
    }),
  ]);

  return {
    openOrders,
    delayed,
    ready,
    todayRevenue: Number(todayRevenue._sum.amount ?? 0),
    recentOrders: recentOrders.map((o) => ({
      ...o,
      subtotal: Number(o.subtotal),
      discount: Number(o.discount),
      total: Number(o.total),
    })),
  };
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await getDashboardData();
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Olá, {session.name.split(" ")[0]}!</h1>
        <p className="text-muted-foreground text-sm capitalize">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="OS Abertas"
          value={data.openOrders}
          subtitle="em produção"
          icon={ShoppingBag}
        />
        <StatsCard
          title="Com Atraso"
          value={data.delayed}
          subtitle="atenção necessária"
          icon={AlertTriangle}
          variant={data.delayed > 0 ? "warning" : "default"}
        />
        <StatsCard
          title="Prontas"
          value={data.ready}
          subtitle="aguardando retirada"
          icon={CheckCircle2}
          variant={data.ready > 0 ? "success" : "default"}
        />
        <StatsCard
          title="Receita Hoje"
          value={formatCurrency(data.todayRevenue)}
          subtitle="pagamentos confirmados"
          icon={DollarSign}
        />
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">OS Recentes</h2>
          <Link href="/pdv/producao" className="text-sm text-primary hover:underline">
            Ver kanban →
          </Link>
        </div>
        <div className="border rounded-xl overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">OS</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Cliente</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Serviços</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-muted-foreground">
                    Nenhuma OS ainda. <Link href="/pdv/nova-os" className="text-primary hover:underline">Criar primeira OS</Link>
                  </td>
                </tr>
              )}
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">#{order.orderNumber}</td>
                  <td className="p-3">
                    <p className="font-medium">{order.customer.name}</p>
                    <span className="text-xs text-muted-foreground uppercase">{order.customer.type}</span>
                  </td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">
                    {order.items.slice(0, 2).map((i) => i.service.name).join(", ")}
                    {order.items.length > 2 && ` +${order.items.length - 2}`}
                  </td>
                  <td className="p-3">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", getOrderStatusColor(order.status))}>
                      {order.status === "received" ? "Recebido"
                        : order.status === "washing" ? "Lavando"
                        : order.status === "drying" ? "Secando"
                        : order.status === "ironing" ? "Passando"
                        : order.status === "ready" ? "Pronto"
                        : order.status === "delivered" ? "Entregue"
                        : "Cancelado"}
                    </span>
                  </td>
                  <td className="p-3 text-right font-medium">{formatCurrency(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
