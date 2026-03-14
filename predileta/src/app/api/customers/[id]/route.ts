import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  type: z.enum(["b2b", "b2c"]).optional(),
  name: z.string().min(2).optional(),
  document: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.record(z.unknown()).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          total: true,
          createdAt: true,
          estimatedDelivery: true,
          items: {
            select: {
              quantity: true,
              service: { select: { name: true, unit: true } },
            },
          },
        },
      },
      customPriceTables: {
        include: { service: { select: { id: true, name: true } } },
      },
      _count: { select: { orders: true } },
    },
  });

  if (!customer) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.name && { name: data.name }),
        document: data.document ?? undefined,
        email: data.email || null,
        phone: data.phone ?? undefined,
        address: data.address ?? undefined,
        notes: data.notes ?? undefined,
        tags: data.tags ?? undefined,
      },
    });

    return NextResponse.json(customer);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("[customers/PUT]", err);
    return NextResponse.json({ error: "Erro ao atualizar cliente" }, { status: 500 });
  }
}
