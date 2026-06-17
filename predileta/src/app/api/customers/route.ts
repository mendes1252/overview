import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  type: z.enum(["b2b", "b2c"]).default("b2c"),
  name: z.string().min(2),
  document: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.record(z.unknown()).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
  const skip = (page - 1) * limit;

  const where = {
    ...(type ? { type: type as "b2b" | "b2c" } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { document: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q } },
            { email: { contains: q, mode: "insensitive" as const } },
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
      select: {
        id: true,
        type: true,
        name: true,
        document: true,
        email: true,
        phone: true,
        tags: true,
        loyaltyPoints: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return NextResponse.json({
    customers,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const customer = await prisma.customer.create({
      data: {
        type: data.type,
        name: data.name,
        document: data.document || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address ?? undefined,
        notes: data.notes || null,
        tags: data.tags,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("[customers/POST]", err);
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 });
  }
}
