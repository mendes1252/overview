import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { goalId } = await params;

    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId: session.user.id },
      include: { category: true },
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Meta nao encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    return NextResponse.json(
      { error: "Erro ao buscar meta" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { goalId } = await params;
    const body = await req.json();

    const existingGoal = await prisma.goal.findFirst({
      where: { id: goalId, userId: session.user.id },
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: "Meta nao encontrada" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.period !== undefined) updateData.period = body.period;
    if (body.targetValue !== undefined) updateData.targetValue = body.targetValue;
    if (body.currentValue !== undefined) updateData.currentValue = body.currentValue;
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate);
    if (body.completedAt !== undefined) {
      updateData.completedAt = body.completedAt ? new Date(body.completedAt) : null;
    }
    if (body.notes !== undefined) updateData.notes = body.notes;

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar meta" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { goalId } = await params;

    const existingGoal = await prisma.goal.findFirst({
      where: { id: goalId, userId: session.user.id },
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: "Meta nao encontrada" },
        { status: 404 }
      );
    }

    await prisma.goal.delete({
      where: { id: goalId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json(
      { error: "Erro ao excluir meta" },
      { status: 500 }
    );
  }
}
