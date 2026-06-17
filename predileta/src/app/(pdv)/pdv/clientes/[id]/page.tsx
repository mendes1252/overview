import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDate, formatDateTime, getOrderStatusLabel, getOrderStatusColor, getPaymentStatusLabel, getPaymentStatusColor, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, User, Phone, Mail, FileText, ShoppingBag, PlusCircle } from "lucide-react";

async function getCustomer(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          items: {
            include: { service: { select: { name: true, unit: true } } },
          },
          payments: { where: { status: "approved" }, select: { amount: true } },
        },
      },
      customPriceTables: {
        include: { service: { select: { name: true, unit: true } } },
        orderBy: { service: { name: "asc" } },
      },
    },
  });
  return customer;
}

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  const totalSpent = customer.orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const openOrders = customer.orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  );

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/pdv/clientes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Clientes
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {customer.type === "b2b" ? (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs uppercase font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {customer.type === "b2b" ? "Empresa B2B" : "Pessoa Física B2C"}
              </span>
              {customer.document && (
                <span className="text-sm text-muted-foreground">{customer.document}</span>
              )}
            </div>
          </div>
        </div>

        <Link href={`/pdv/nova-os`}>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova OS
          </Button>
        </Link>
      </div>

      {/* Contact + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4 bg-card space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">Contato</p>
          {customer.phone ? (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              {customer.phone}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
          {customer.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {customer.email}
            </div>
          )}
          {customer.address && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4 mt-0.5 shrink-0" />
              {customer.address}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Cliente desde {formatDate(customer.createdAt)}
          </p>
        </div>

        <div className="border rounded-xl p-4 bg-card">
          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">OS em aberto</p>
          <p className="text-3xl font-bold">{openOrders.length}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {customer.orders.length} total histórico
          </p>
        </div>

        <div className="border rounded-xl p-4 bg-card">
          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Total gasto</p>
          <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
          <p className="text-sm text-muted-foreground mt-1">apenas pagamentos confirmados</p>
        </div>
      </div>

      {/* Custom pricing table */}
      {customer.customPriceTables.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-3">Tabela de Preços Especiais</h2>
          <div className="border rounded-xl overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Serviço</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Preço especial</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Válido até</th>
                </tr>
              </thead>
              <tbody>
                {customer.customPriceTables.map((pt) => (
                  <tr key={pt.id} className="border-t">
                    <td className="p-3">
                      {pt.service.name}
                      <span className="text-xs text-muted-foreground ml-1">/{pt.service.unit}</span>
                    </td>
                    <td className="p-3 text-right font-medium">{formatCurrency(Number(pt.price))}</td>
                    <td className="p-3 text-right text-muted-foreground">
                      {pt.validUntil ? formatDate(pt.validUntil) : "Sem vencimento"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders history */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Histórico de OS</h2>
        <div className="border rounded-xl overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">OS</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Serviços</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Pagamento</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
                <th className="text-right p-3 font-medium text-muted-foreground hidden lg:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-muted-foreground">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Nenhuma OS ainda
                  </td>
                </tr>
              )}
              {customer.orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">#{order.orderNumber}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">
                    {order.items
                      .slice(0, 2)
                      .map((i) => i.service.name)
                      .join(", ")}
                    {order.items.length > 2 && ` +${order.items.length - 2}`}
                  </td>
                  <td className="p-3">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        getOrderStatusColor(order.status)
                      )}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        getPaymentStatusColor(order.paymentStatus)
                      )}
                    >
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="p-3 text-right font-medium">{formatCurrency(Number(order.total))}</td>
                  <td className="p-3 text-right text-muted-foreground hidden lg:table-cell">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
