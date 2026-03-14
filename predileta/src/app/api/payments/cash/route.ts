import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const cashSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    const { orderId, amount } = cashSchema.parse(body);

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "OS não encontrada" }, { status: 404 });

    // Create confirmed cash payment
    const payment = await prisma.payment.create({
      data: {
        orderId,
        method: "cash",
        amount,
        status: "approved",
        paidAt: new Date(),
      },
    });

    // Recalculate order payment status
    const paidAggregate = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { orderId, status: "approved" },
    });

    const totalPaid = Number(paidAggregate._sum.amount ?? 0);
    const orderTotal = Number(order.total);
    const paymentStatus =
      totalPaid >= orderTotal ? "paid" : totalPaid > 0 ? "partial" : "pending";

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });

    return NextResponse.json({
      payment,
      order: {
        ...updatedOrder,
        subtotal: Number(updatedOrder.subtotal),
        discount: Number(updatedOrder.discount),
        total: Number(updatedOrder.total),
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("[payments/cash/POST]", err);
    return NextResponse.json({ error: "Erro ao registrar pagamento" }, { status: 500 });
  }
}
