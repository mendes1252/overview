import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaymentStatus } from "@/lib/asaas";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId e obrigatorio" },
        { status: 400 }
      );
    }

    const payment = await getPaymentStatus(paymentId);

    // Update local record if exists
    await prisma.payment.updateMany({
      where: { asaasPaymentId: paymentId, userId: session.user.id },
      data: { status: payment.status },
    });

    // If confirmed, activate plan
    if (
      payment.status === "CONFIRMED" ||
      payment.status === "RECEIVED"
    ) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });
      if (user && user.plan === "free") {
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        await prisma.user.update({
          where: { id: user.id },
          data: { plan: "pro", planCurrentPeriodEnd: periodEnd },
        });
      }
    }

    return NextResponse.json({
      status: payment.status,
      confirmed:
        payment.status === "CONFIRMED" || payment.status === "RECEIVED",
    });
  } catch (error) {
    console.error("Payment status error:", error);
    return NextResponse.json(
      { error: "Erro ao verificar pagamento" },
      { status: 500 }
    );
  }
}
