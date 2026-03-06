import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCustomer, createPayment, getPixQrCode } from "@/lib/asaas";
import { getActiveChallenge, CHALLENGE_PRICE } from "@/lib/challenge";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { billingType, cpfCnpj, creditCard, creditCardHolderInfo } = body as {
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

    if (!billingType) {
      return NextResponse.json(
        { error: "Forma de pagamento obrigatoria" },
        { status: 400 }
      );
    }

    const challenge = await getActiveChallenge();
    if (!challenge) {
      return NextResponse.json(
        { error: "Desafio nao encontrado" },
        { status: 404 }
      );
    }

    // Check existing enrollment
    const existingEnrollment = await prisma.challengeEnrollment.findUnique({
      where: {
        userId_challengeId: {
          userId: session.user.id,
          challengeId: challenge.id,
        },
      },
    });

    if (existingEnrollment?.status === "active" || existingEnrollment?.status === "completed") {
      return NextResponse.json(
        { error: "Voce ja esta inscrito neste desafio", redirectTo: "/desafio/area-de-membros" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 });
    }

    // Create or get Asaas customer
    let customerId = user.asaasCustomerId;
    if (!customerId) {
      const customer = await createCustomer({
        name: user.name || user.email || "Cliente Pulse",
        email: user.email || "",
        cpfCnpj,
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { asaasCustomerId: customerId },
      });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    const dueDateStr = dueDate.toISOString().split("T")[0];

    // Create single payment (not subscription)
    const payment = await createPayment({
      customer: customerId,
      billingType,
      value: CHALLENGE_PRICE,
      dueDate: dueDateStr,
      description: `PULSE - ${challenge.title}`,
      creditCard: billingType === "CREDIT_CARD" ? creditCard : undefined,
      creditCardHolderInfo:
        billingType === "CREDIT_CARD" ? creditCardHolderInfo : undefined,
    });

    // Create or update enrollment
    const enrollment = await prisma.challengeEnrollment.upsert({
      where: {
        userId_challengeId: {
          userId: session.user.id,
          challengeId: challenge.id,
        },
      },
      create: {
        userId: session.user.id,
        challengeId: challenge.id,
        status: billingType === "CREDIT_CARD" ? "active" : "pending",
        paymentStatus: billingType === "CREDIT_CARD" ? "CONFIRMED" : "PENDING",
        asaasPaymentId: payment.id,
        currentDay: billingType === "CREDIT_CARD" ? 1 : 0,
        startedAt: billingType === "CREDIT_CARD" ? new Date() : null,
      },
      update: {
        status: billingType === "CREDIT_CARD" ? "active" : "pending",
        paymentStatus: billingType === "CREDIT_CARD" ? "CONFIRMED" : "PENDING",
        asaasPaymentId: payment.id,
        startedAt: billingType === "CREDIT_CARD" ? new Date() : null,
      },
    });

    // Create payment record
    let pixData = null;
    let boletoData = null;

    if (billingType === "PIX") {
      const qrCode = await getPixQrCode(payment.id);
      await prisma.payment.create({
        data: {
          asaasPaymentId: payment.id,
          status: "PENDING",
          billingType: "PIX",
          value: CHALLENGE_PRICE,
          description: challenge.title,
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
    } else if (billingType === "BOLETO") {
      await prisma.payment.create({
        data: {
          asaasPaymentId: payment.id,
          status: "PENDING",
          billingType: "BOLETO",
          value: CHALLENGE_PRICE,
          description: challenge.title,
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
    } else {
      // Credit card — payment confirmed immediately
      await prisma.payment.create({
        data: {
          asaasPaymentId: payment.id,
          status: "CONFIRMED",
          billingType: "CREDIT_CARD",
          value: CHALLENGE_PRICE,
          description: challenge.title,
          dueDate,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      enrollmentId: enrollment.id,
      billingType,
      pixData,
      boletoData,
    });
  } catch (error) {
    console.error("Challenge enroll error:", error);
    return NextResponse.json(
      { error: "Erro ao processar inscricao" },
      { status: 500 }
    );
  }
}
