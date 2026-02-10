import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        timezone: true,
        weekStartsOn: true,
        reportTime: true,
        coachTone: true,
        primaryGoal: true,
        plan: true,
        planCurrentPeriodEnd: true,
        asaasSubscriptionId: true,
        createdAt: true,
        _count: {
          select: {
            tasks: true,
            habits: true,
            goals: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, timezone, weekStartsOn, reportTime, coachTone, primaryGoal } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (weekStartsOn !== undefined) updateData.weekStartsOn = weekStartsOn;
    if (reportTime !== undefined) updateData.reportTime = reportTime;
    if (coachTone !== undefined) updateData.coachTone = coachTone;
    if (primaryGoal !== undefined) updateData.primaryGoal = primaryGoal;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        timezone: true,
        weekStartsOn: true,
        reportTime: true,
        coachTone: true,
        primaryGoal: true,
        plan: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
