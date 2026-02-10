import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkLimit } from "@/lib/plan-limits";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const habits = await prisma.habit.findMany({
      where: { userId: session.user.id },
      include: {
        category: true,
        logs: {
          orderBy: { date: "desc" },
          take: 60,
        },
      },
      orderBy: [{ isArchived: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "Erro ao buscar habitos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, categoryId, frequency, targetDays, color } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nome obrigatorio" },
        { status: 400 }
      );
    }

    // Check plan limits
    const { allowed, current, limit, plan } = await checkLimit(session.user.id, "habits");
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Limite de habitos atingido (${current}/${limit}). Faca upgrade para o plano Pro para habitos ilimitados.`,
          code: "PLAN_LIMIT_REACHED",
          current,
          limit,
          plan,
        },
        { status: 403 }
      );
    }

    const habit = await prisma.habit.create({
      data: {
        name,
        categoryId: categoryId || null,
        frequency: frequency || "daily",
        targetDays: targetDays || [0, 1, 2, 3, 4, 5, 6],
        color: color || "#10B981",
        userId: session.user.id,
      },
      include: { category: true, logs: true },
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { error: "Erro ao criar habito" },
      { status: 500 }
    );
  }
}
