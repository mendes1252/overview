import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Users, Building2, User, PlusCircle } from "lucide-react";
import { ClienteSearchWrapper } from "./cliente-search-wrapper";

interface SearchParams {
  q?: string;
  type?: string;
  page?: string;
}

async function getCustomers(searchParams: SearchParams) {
  const q = searchParams.q ?? "";
  const type = searchParams.type;
  const page = parseInt(searchParams.page ?? "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = {
    ...(type ? { type: type as "b2b" | "b2c" } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { document: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q } },
          ],
        }
      : {}),
  };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
      include: {
        _count: { select: { orders: true } },
        orders: {
          where: { paymentStatus: "paid" },
          select: { total: true },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    customers: customers.map((c) => ({
      ...c,
      totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
      orderCount: c._count.orders,
    })),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const sp = await searchParams;
  const data = await getCustomers(sp);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground text-sm mt-1">{data.total} clientes cadastrados</p>
        </div>
        <Link href="/pdv/nova-os">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova OS
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <ClienteSearchWrapper currentQ={sp.q} currentType={sp.type} />

      {/* Table */}
      <div className="border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-muted-foreground">Cliente</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Contato</th>
              <th className="text-center p-3 font-medium text-muted-foreground">OS</th>
              <th className="text-right p-3 font-medium text-muted-foreground hidden lg:table-cell">Total gasto</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.customers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-8 text-muted-foreground">
                  {sp.q ? `Nenhum cliente encontrado para "${sp.q}"` : "Nenhum cliente cadastrado ainda."}
                </td>
              </tr>
            )}
            {data.customers.map((c) => (
              <tr key={c.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {c.type === "b2b" ? (
                      <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                    ) : (
                      <User className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{c.name}</p>
                      {c.document && <p className="text-xs text-muted-foreground">{c.document}</p>}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">
                  {c.phone && <p>{c.phone}</p>}
                  {c.email && <p className="text-xs">{c.email}</p>}
                </td>
                <td className="p-3 text-center">
                  <span className="font-medium">{c.orderCount}</span>
                </td>
                <td className="p-3 text-right font-medium hidden lg:table-cell">
                  {formatCurrency(c.totalSpent)}
                </td>
                <td className="p-3 text-right">
                  <Link href={`/pdv/clientes/${c.id}`}>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/pdv/clientes?page=${p}${sp.q ? `&q=${sp.q}` : ""}${sp.type ? `&type=${sp.type}` : ""}`}
            >
              <Button
                variant={p === data.page ? "default" : "outline"}
                size="sm"
              >
                {p}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
