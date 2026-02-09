import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelSubscription, getSubscription, PLANS } from "@/lib/asaas";

// GET - Get current subscription status
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        plan: true,
        planCurrentPeriodEnd: true,
        asaasSubscriptionId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario nao encontrado" },
        { status: 404 }
      );
    }

    let subscriptionStatus = null;
    if (user.asaasSubscriptionId) {
      try {
        const sub = await getSubscription(user.asaasSubscriptionId);
        subscriptionStatus = {
          status: sub.status,
          nextDueDate: sub.nextDueDate,
        };
      } catch {
        // Subscription may have been deleted externally
      }
    }

    const planConfig = PLANS[user.plan as keyof typeof PLANS] || PLANS.free;

    return NextResponse.json({
      plan: user.plan,
      planName: planConfig.name,
      features: planConfig.features,
      limits: planConfig.limits,
      periodEnd: user.planCurrentPeriodEnd,
      subscription: subscriptionStatus,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar assinatura" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel subscription
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.asaasSubscriptionId) {
      return NextResponse.json(
        { error: "Nenhuma assinatura ativa" },
        { status: 400 }
      );
    }

    await cancelSubscription(user.asaasSubscriptionId);

    // Keep plan active until period end, but remove subscription ID
    await prisma.user.update({
      where: { id: user.id },
      data: { asaasSubscriptionId: null },
    });

    return NextResponse.json({
      success: true,
      message: "Assinatura cancelada. Acesso mantido ate o fim do periodo.",
      periodEnd: user.planCurrentPeriodEnd,
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json(
      { error: "Erro ao cancelar assinatura" },
      { status: 500 }
    );
  }
}
