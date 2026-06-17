import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");

  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  // Resolve custom pricing if customerId is provided
  if (customerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { type: true, customPriceTables: true },
    });

    if (customer) {
      const customPrices = new Map(
        customer.customPriceTables.map((cp) => [cp.serviceId, cp])
      );

      const now = new Date();
      const withPricing = services.map((s) => {
        const cp = customPrices.get(s.id);
        let price: number;

        if (cp && (!cp.validUntil || cp.validUntil > now)) {
          price = Number(cp.customPrice);
        } else if (customer.type === "b2b") {
          price = Number(s.priceB2bDefault);
        } else {
          price = Number(s.priceB2c);
        }

        return {
          ...s,
          priceB2c: Number(s.priceB2c),
          priceB2bDefault: Number(s.priceB2bDefault),
          resolvedPrice: price,
          hasCustomPrice: !!(cp && (!cp.validUntil || cp.validUntil > now)),
        };
      });

      return NextResponse.json(withPricing);
    }
  }

  return NextResponse.json(
    services.map((s) => ({
      ...s,
      priceB2c: Number(s.priceB2c),
      priceB2bDefault: Number(s.priceB2bDefault),
      resolvedPrice: Number(s.priceB2c),
      hasCustomPrice: false,
    }))
  );
}

const createServiceSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  priceB2c: z.number().positive(),
  priceB2bDefault: z.number().positive(),
  unit: z.enum(["piece", "kg", "m2"]).default("piece"),
  estimatedHours: z.number().int().positive().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (session.role !== "admin" && session.role !== "manager") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = createServiceSchema.parse(body);
    const service = await prisma.service.create({ data });
    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar serviço" }, { status: 500 });
  }
}
