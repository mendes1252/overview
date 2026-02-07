import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { habitId } = await params;

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id },
      include: {
        category: true,
        logs: { orderBy: { date: "desc" }, take: 60 },
      },
    });

    if (!habit) {
      return NextResponse.json(
        { error: "Habito nao encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Error fetching habit:", error);
    return NextResponse.json(
      { error: "Erro ao buscar habito" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { habitId } = await params;
    const body = await req.json();

    const existingHabit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id },
    });

    if (!existingHabit) {
      return NextResponse.json(
        { error: "Habito nao encontrado" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.frequency !== undefined) updateData.frequency = body.frequency;
    if (body.targetDays !== undefined) updateData.targetDays = body.targetDays;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.isArchived !== undefined) updateData.isArchived = body.isArchived;

    const habit = await prisma.habit.update({
      where: { id: habitId },
      data: updateData,
      include: {
        category: true,
        logs: { orderBy: { date: "desc" }, take: 60 },
      },
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Error updating habit:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar habito" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { habitId } = await params;

    const existingHabit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id },
    });

    if (!existingHabit) {
      return NextResponse.json(
        { error: "Habito nao encontrado" },
        { status: 404 }
      );
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return NextResponse.json(
      { error: "Erro ao excluir habito" },
      { status: 500 }
    );
  }
}
