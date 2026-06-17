import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature, getMpPayment } from "@/lib/mercadopago";

export async function POST(req: Request) {
  try {
    const xSignature = req.headers.get("x-signature") ?? "";
    const xRequestId = req.headers.get("x-request-id") ?? "";

    const body = await req.json();
    const dataId = body?.data?.id?.toString() ?? "";

    // Verify webhook signature
    if (!verifyWebhookSignature(xSignature, xRequestId, dataId)) {
      console.warn("[webhook/mp] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Only handle payment events
    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const mpPaymentId = dataId;
    if (!mpPaymentId) return NextResponse.json({ ok: true });

    // Fetch current payment status from MP
    const mpPayment = await getMpPayment(mpPaymentId);
    const mpStatus = mpPayment.status as string;

    // Map MP status to our enum
    const statusMap: Record<string, string> = {
      approved: "approved",
      authorized: "authorized",
      in_process: "in_process",
      in_mediation: "in_mediation",
      rejected: "rejected",
      cancelled: "cancelled",
      refunded: "refunded",
      charged_back: "charged_back",
      pending: "pending",
    };

    const newStatus = statusMap[mpStatus] ?? "pending";

    // Find and update our payment record
    const payment = await prisma.payment.findUnique({
      where: { mpPaymentId },
      include: { order: { include: { payments: true } } },
    });

    if (!payment) {
      console.warn(`[webhook/mp] Payment ${mpPaymentId} not found in DB`);
      return NextResponse.json({ ok: true });
    }

    await prisma.payment.update({
      where: { mpPaymentId },
      data: {
        status: newStatus as never,
        paidAt: newStatus === "approved" ? new Date() : payment.paidAt,
      },
    });

    // Recalculate order payment status
    const allPayments = await prisma.payment.findMany({
      where: { orderId: payment.orderId },
    });

    const totalPaid = allPayments
      .filter((p) => p.status === "approved")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const orderTotal = Number(payment.order.total);
    const orderPaymentStatus =
      totalPaid >= orderTotal
        ? "paid"
        : totalPaid > 0
        ? "partial"
        : newStatus === "pending" || newStatus === "in_process"
        ? "pending"
        : "overdue";

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: orderPaymentStatus as never },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook/mp]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
