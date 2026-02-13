import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookToken } from "@/lib/asaas";
import { sendEmail, generatePaymentConfirmedEmail } from "@/lib/email";

interface AsaasWebhookPayload {
  event: string;
  payment?: {
    id: string;
    customer: string;
    subscription?: string;
    billingType: string;
    value: number;
    status: string;
    dueDate: string;
    invoiceUrl?: string;
  };
  subscription?: {
    id: string;
    customer: string;
    status: string;
    nextDueDate: string;
  };
}

export async function POST(req: Request) {
  try {
    const webhookToken = req.headers.get("asaas-access-token") || "";
    if (!verifyWebhookToken(webhookToken)) {
      return NextResponse.json({ error: "Token invalido" }, { status: 401 });
    }

    const payload: AsaasWebhookPayload = await req.json();
    const { event } = payload;

    switch (event) {
      // Payment confirmed (PIX, credit card, boleto)
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED": {
        const payment = payload.payment;
        if (!payment) break;

        // Update payment record
        await prisma.payment.updateMany({
          where: { asaasPaymentId: payment.id },
          data: { status: "CONFIRMED" },
        });

        // Activate user plan
        const user = await prisma.user.findFirst({
          where: { asaasCustomerId: payment.customer },
        });

        if (user && user.plan === "free") {
          const periodEnd = new Date();
          periodEnd.setMonth(periodEnd.getMonth() + 1);
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "pro",
              planCurrentPeriodEnd: periodEnd,
            },
          });
        }

        // Send payment confirmation email
        if (user?.email) {
          const billingLabel = payment.billingType === "PIX" ? "PIX" : payment.billingType === "BOLETO" ? "Boleto" : "Cartao de Credito";
          sendEmail({
            to: user.email,
            subject: "Pagamento confirmado - pulse",
            html: generatePaymentConfirmedEmail(
              user.name || "Usuario",
              "Pro",
              payment.value.toFixed(2),
              billingLabel
            ),
          }).catch((err) => console.error("Failed to send payment email:", err));
        }
        break;
      }

      // Payment overdue
      case "PAYMENT_OVERDUE": {
        const payment = payload.payment;
        if (!payment) break;

        await prisma.payment.updateMany({
          where: { asaasPaymentId: payment.id },
          data: { status: "OVERDUE" },
        });
        break;
      }

      // Payment refunded
      case "PAYMENT_REFUNDED": {
        const payment = payload.payment;
        if (!payment) break;

        await prisma.payment.updateMany({
          where: { asaasPaymentId: payment.id },
          data: { status: "REFUNDED" },
        });

        // Downgrade user
        const user = await prisma.user.findFirst({
          where: { asaasCustomerId: payment.customer },
        });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: "free" },
          });
        }
        break;
      }

      // Subscription cancelled
      case "SUBSCRIPTION_DELETED":
      case "SUBSCRIPTION_INACTIVATED": {
        const sub = payload.subscription;
        if (!sub) break;

        const user = await prisma.user.findFirst({
          where: { asaasSubscriptionId: sub.id },
        });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "free",
              asaasSubscriptionId: null,
              planCurrentPeriodEnd: null,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Erro no webhook" },
      { status: 500 }
    );
  }
}
