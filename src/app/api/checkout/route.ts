import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createCustomer,
  createSubscription,
  createPayment,
  getPixQrCode,
  PLANS,
  type PlanType,
} from "@/lib/asaas";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      plan,
      billingType,
      creditCard,
      creditCardHolderInfo,
      cpfCnpj,
    } = body as {
      plan: PlanType;
      billingType: "PIX" | "CREDIT_CARD" | "BOLETO";
      cpfCnpj?: string;
      creditCard?: {
        holderName: string;
        number: string;
        expiryMonth: string;
        expiryYear: string;
        ccv: string;
      };
      creditCardHolderInfo?: {
        name: string;
        email: string;
        cpfCnpj: string;
        postalCode: string;
        addressNumber: string;
        phone: string;
      };
    };

    if (!plan || !billingType) {
      return NextResponse.json(
        { error: "Plano e forma de pagamento sao obrigatorios" },
        { status: 400 }
      );
    }

    const planConfig = PLANS[plan];
    if (!planConfig || planConfig.price === 0) {
      return NextResponse.json(
        { error: "Plano invalido para checkout" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario nao encontrado" },
        { status: 404 }
      );
    }

    // Create or get Asaas customer
    let customerId = user.asaasCustomerId;
    if (!customerId) {
      const customer = await createCustomer({
        name: user.name || user.email || "Cliente PULSO",
        email: user.email || "",
        cpfCnpj,
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { asaasCustomerId: customerId },
      });
    }

    // Calculate next due date (today for immediate charge)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    const dueDateStr = dueDate.toISOString().split("T")[0];

    // Create subscription
    const subscription = await createSubscription({
      customer: customerId,
      billingType,
      value: planConfig.price,
      cycle: "MONTHLY",
      description: `PULSO - Plano ${planConfig.name}`,
      nextDueDate: dueDateStr,
      creditCard: billingType === "CREDIT_CARD" ? creditCard : undefined,
      creditCardHolderInfo:
        billingType === "CREDIT_CARD" ? creditCardHolderInfo : undefined,
    });

    // Update user with subscription info
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        asaasSubscriptionId: subscription.id,
        plan,
        planCurrentPeriodEnd: periodEnd,
      },
    });

    // For PIX, get QR code
    let pixData = null;
    if (billingType === "PIX") {
      // Create a single payment to get PIX QR code
      const payment = await createPayment({
        customer: customerId,
        billingType: "PIX",
        value: planConfig.price,
        dueDate: dueDateStr,
        description: `PULSO - Plano ${planConfig.name} (primeiro mes)`,
      });

      const qrCode = await getPixQrCode(payment.id);

      await prisma.payment.create({
        data: {
          asaasPaymentId: payment.id,
          status: "PENDING",
          billingType: "PIX",
          value: planConfig.price,
          description: `Plano ${planConfig.name}`,
          pixQrCode: qrCode.encodedImage,
          pixCopyPaste: qrCode.payload,
          dueDate,
          userId: user.id,
        },
      });

      pixData = {
        qrCodeImage: qrCode.encodedImage,
        copyPaste: qrCode.payload,
        paymentId: payment.id,
        expiresAt: qrCode.expirationDate,
      };
    }

    // For Boleto, return the boleto URL
    let boletoData = null;
    if (billingType === "BOLETO") {
      const payment = await createPayment({
        customer: customerId,
        billingType: "BOLETO",
        value: planConfig.price,
        dueDate: dueDateStr,
        description: `PULSO - Plano ${planConfig.name} (primeiro mes)`,
      });

      await prisma.payment.create({
        data: {
          asaasPaymentId: payment.id,
          status: "PENDING",
          billingType: "BOLETO",
          value: planConfig.price,
          description: `Plano ${planConfig.name}`,
          boletoUrl: payment.bankSlipUrl,
          invoiceUrl: payment.invoiceUrl,
          dueDate,
          userId: user.id,
        },
      });

      boletoData = {
        boletoUrl: payment.bankSlipUrl,
        invoiceUrl: payment.invoiceUrl,
        paymentId: payment.id,
      };
    }

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      plan,
      billingType,
      pixData,
      boletoData,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
