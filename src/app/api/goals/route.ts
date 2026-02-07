import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: [{ status: "asc" }, { endDate: "asc" }],
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Erro ao buscar metas" },
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
    const {
      title,
      description,
      categoryId,
      type,
      period,
      targetValue,
      currentValue,
      unit,
      startDate,
      endDate,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Titulo obrigatorio" },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        categoryId: categoryId || null,
        type: type || "binary",
        period: period || "weekly",
        targetValue,
        currentValue: currentValue || 0,
        unit,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: session.user.id,
      },
      include: { category: true },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Erro ao criar meta" },
      { status: 500 }
    );
  }
}
