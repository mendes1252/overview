import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor, cn } from "@/lib/utils";
import { CaixaPaymentActions } from "./caixa-payment-actions";
import { DollarSign } from "lucide-react";

async function getPendingOrders() {
  const orders = await prisma.order.findMany({
    where: {
      paymentStatus: { in: ["pending", "partial"] },
      status: { notIn: ["cancelled"] },
    },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
    include: {
      customer: { select: { id: true, name: true, type: true, phone: true, email: true, document: true } },
      items: {
        include: { service: { select: { name: true, unit: true } } },
      },
      payments: {
        where: { status: "approved" },
        select: { amount: true },
      },
    },
  });

  return orders.map((o) => ({
    ...o,
    subtotal: Number(o.subtotal),
    discount: Number(o.discount),
    total: Number(o.total),
    amountPaid: o.payments.reduce((s, p) => s + Number(p.amount), 0),
  }));
}

export default async function CaixaPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await getPendingOrders();
  const totalPending = orders.reduce((sum, o) => sum + (o.total - o.amountPaid), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Caixa</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {orders.length} OS aguardando pagamento
          </p>
        </div>
        <div className="text-right border rounded-xl p-4 bg-card">
          <div className="flex items-center gap-2 justify-end text-muted-foreground mb-0.5">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">A receber</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalPending)}</p>
        </div>
      </div>

      {/* Empty state */}
      {orders.length === 0 && (
        <div className="border rounded-xl p-12 text-center bg-card">
          <DollarSign className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground font-medium">Nenhuma OS pendente de pagamento</p>
          <p className="text-sm text-muted-foreground mt-1">
            Todas as OS foram pagas ou não há OS ativas.
          </p>
        </div>
      )}

      {/* Orders list */}
      <div className="space-y-3">
        {orders.map((order) => {
          const remaining = order.total - order.amountPaid;

          return (
            <div key={order.id} className="border rounded-xl bg-card overflow-hidden">
              <div className="flex items-start justify-between p-4 gap-4">
                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">#{order.orderNumber}</span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        getOrderStatusColor(order.status)
                      )}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                    {order.paymentStatus === "partial" && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                        Parcial
                      </span>
                    )}
                  </div>

                  <p className="font-medium">{order.customer.name}</p>
                  {order.customer.phone && (
                    <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                  )}

                  <div className="mt-2 text-sm text-muted-foreground">
                    {order.items
                      .slice(0, 3)
                      .map((i) => `${Number(i.quantity)} ${i.service.name}`)
                      .join(" · ")}
                    {order.items.length > 3 && ` +${order.items.length - 3}`}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    Criado em {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Pricing + action */}
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold">{formatCurrency(remaining)}</p>
                  {order.amountPaid > 0 && (
                    <p className="text-xs text-muted-foreground">
                      de {formatCurrency(order.total)} · pago {formatCurrency(order.amountPaid)}
                    </p>
                  )}
                  {order.discount > 0 && (
                    <p className="text-xs text-green-600">
                      desconto {formatCurrency(order.discount)}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment actions */}
              <div className="border-t px-4 py-3 bg-muted/30">
                <CaixaPaymentActions
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  customerName={order.customer.name}
                  customerPhone={order.customer.phone}
                  customerEmail={order.customer.email}
                  customerDocument={order.customer.document}
                  remaining={remaining}
                  total={order.total}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
