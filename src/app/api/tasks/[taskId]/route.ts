import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { taskId } = await params;

    const task = await prisma.task.findFirst({
      where: { id: taskId, userId: session.user.id },
      include: { category: true, subtasks: true },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Tarefa nao encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tarefa" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { taskId } = await params;
    const body = await req.json();

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: session.user.id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Tarefa nao encontrada" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    if (body.estimatedTime !== undefined) updateData.estimatedTime = body.estimatedTime;
    if (body.isRecurring !== undefined) updateData.isRecurring = body.isRecurring;
    if (body.recurrenceRule !== undefined) updateData.recurrenceRule = body.recurrenceRule;
    if (body.completedAt !== undefined) {
      updateData.completedAt = body.completedAt ? new Date(body.completedAt) : null;
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: { category: true, subtasks: true },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar tarefa" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { taskId } = await params;

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: session.user.id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Tarefa nao encontrada" },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Erro ao excluir tarefa" },
      { status: 500 }
    );
  }
}
