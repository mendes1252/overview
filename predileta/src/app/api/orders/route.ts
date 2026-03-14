import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcProductionStatus } from "@/lib/utils";
import { sendWhatsAppMessage, WHATSAPP_TEMPLATES } from "@/lib/whatsapp";
import { z } from "zod";

const itemSchema = z.object({
  serviceId: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  notes: z.string().optional(),
});

const createOrderSchema = z.object({
  customerId: z.string(),
  estimatedDelivery: z.string().optional(), // ISO string
  discount: z.number().min(0).default(0),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const paymentStatus = searchParams.get("paymentStatus");
  const customerId = searchParams.get("customerId");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
  const skip = (page - 1) * limit;

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(paymentStatus ? { paymentStatus: paymentStatus as never } : {}),
    ...(customerId ? { customerId } : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        customer: { select: { id: true, name: true, type: true } },
        createdBy: { select: { name: true } },
        items: {
          include: { service: { select: { name: true, unit: true } } },
        },
        payments: { select: { id: true, amount: true, status: true, method: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({
    orders: orders.map((o) => ({
      ...o,
      subtotal: Number(o.subtotal),
      discount: Number(o.discount),
      total: Number(o.total),
      items: o.items.map((i) => ({
        ...i,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
        total: Number(i.total),
      })),
    })),
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createOrderSchema.parse(body);

    // Calculate totals
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const total = Math.max(0, subtotal - data.discount);

    const estimatedDelivery = data.estimatedDelivery
      ? new Date(data.estimatedDelivery)
      : null;

    const productionStatus = calcProductionStatus(estimatedDelivery, "received");

    // Create order + items in a single transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId: data.customerId,
          createdById: session.userId,
          status: "received",
          productionStatus,
          estimatedDelivery,
          subtotal,
          discount: data.discount,
          total,
          paymentStatus: "pending",
          notes: data.notes || null,
        },
      });

      await tx.orderItem.createMany({
        data: data.items.map((item) => ({
          orderId: newOrder.id,
          serviceId: item.serviceId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          notes: item.notes || null,
        })),
      });

      return newOrder;
    });

    // Fetch full order for response
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        customer: { select: { id: true, name: true, phone: true, type: true } },
        createdBy: { select: { name: true } },
        items: { include: { service: true } },
      },
    });

    // Send WhatsApp notification (stub or real)
    if (fullOrder?.customer.phone) {
      const deliveryStr = estimatedDelivery
        ? estimatedDelivery.toLocaleDateString("pt-BR")
        : "a confirmar";
      await sendWhatsAppMessage(
        fullOrder.customer.phone,
        WHATSAPP_TEMPLATES.orderReceived(
          fullOrder.orderNumber,
          fullOrder.customer.name,
          deliveryStr
        )
      );
    }

    return NextResponse.json(
      {
        ...fullOrder,
        subtotal: Number(fullOrder?.subtotal),
        discount: Number(fullOrder?.discount),
        total: Number(fullOrder?.total),
        items: fullOrder?.items.map((i) => ({
          ...i,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
          total: Number(i.total),
          service: {
            ...i.service,
            priceB2c: Number(i.service.priceB2c),
            priceB2bDefault: Number(i.service.priceB2bDefault),
          },
        })),
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("[orders/POST]", err);
    return NextResponse.json({ error: "Erro ao criar OS" }, { status: 500 });
  }
}
