import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NovaOsForm } from "./nova-os-form";

export default async function NovaOsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nova Ordem de Serviço</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Registre um novo serviço para um cliente
        </p>
      </div>
      <NovaOsForm
        services={services.map((s) => ({
          ...s,
          priceB2c: Number(s.priceB2c),
          priceB2bDefault: Number(s.priceB2bDefault),
          resolvedPrice: Number(s.priceB2c),
          hasCustomPrice: false,
        }))}
        createdById={session.userId}
        createdByName={session.name}
      />
    </div>
  );
}
