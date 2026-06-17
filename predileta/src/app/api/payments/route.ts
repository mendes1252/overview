import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPixPayment, createBoletoPayment } from "@/lib/mercadopago";
import { z } from "zod";

const paymentSchema = z.object({
  orderId: z.string(),
  method: z.enum(["pix", "boleto", "credit_card"]),
  amount: z.number().positive(),
  dueDate: z.string().optional(), // YYYY-MM-DD for boleto
  payerEmail: z.string().email(),
  payerName: z.string(),
  payerDocument: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    const data = paymentSchema.parse(body);

    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: { customer: true },
    });
    if (!order) return NextResponse.json({ error: "OS não encontrada" }, { status: 404 });

    const description = `Predileta Lavanderia - OS #${order.orderNumber}`;
    let mpResult: { paymentId: string; status: string; qrCode?: string; qrCodeBase64?: string; boletoUrl?: string; barcode?: string };

    if (data.method === "pix") {
      const result = await createPixPayment({
        orderId: data.orderId,
        amount: data.amount,
        description,
        payerEmail: data.payerEmail,
        payerName: data.payerName,
        payerDocument: data.payerDocument,
      });
      mpResult = result;
    } else if (data.method === "boleto") {
      if (!data.payerDocument) {
        return NextResponse.json({ error: "CPF obrigatório para boleto" }, { status: 400 });
      }
      const dueDate = data.dueDate ?? new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];
      const result = await createBoletoPayment({
        orderId: data.orderId,
        amount: data.amount,
        description,
        payerEmail: data.payerEmail,
        payerName: data.payerName,
        payerDocument: data.payerDocument,
        dueDate,
      });
      mpResult = result;
    } else {
      return NextResponse.json({ error: "Cartão de crédito via MP Bricks — use o frontend" }, { status: 400 });
    }

    // Save payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: data.orderId,
        mpPaymentId: mpResult.paymentId,
        method: data.method === "pix" ? "pix" : "boleto",
        amount: data.amount,
        status: "pending",
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        metadata: mpResult,
      },
    });

    // Update order payment status to partial if partial payment
    const paidAmount = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { orderId: data.orderId, status: "approved" },
    });

    const paid = Number(paidAmount._sum.amount ?? 0);
    const orderTotal = Number(order.total);
    const newPaymentStatus =
      paid >= orderTotal ? "paid" : paid > 0 ? "partial" : "pending";

    await prisma.order.update({
      where: { id: data.orderId },
      data: { paymentStatus: newPaymentStatus },
    });

    return NextResponse.json({ payment, mpResult }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("[payments/POST]", err);
    return NextResponse.json({ error: "Erro ao criar cobrança" }, { status: 500 });
  }
}
