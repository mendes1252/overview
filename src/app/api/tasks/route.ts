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

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      include: { category: true, subtasks: true },
      orderBy: [{ status: "asc" }, { priority: "desc" }, { dueDate: "asc" }],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tarefas" },
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
      priority,
      dueDate,
      estimatedTime,
      isRecurring,
      recurrenceRule,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Titulo obrigatorio" },
        { status: 400 }
      );
    }

    // Check plan limits
    const { allowed, current, limit, plan } = await checkLimit(session.user.id, "tasks");
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Limite de tarefas ativas atingido (${current}/${limit}). Faca upgrade para o plano Pro para tarefas ilimitadas.`,
          code: "PLAN_LIMIT_REACHED",
          current,
          limit,
          plan,
        },
        { status: 403 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        categoryId: categoryId || null,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedTime,
        isRecurring: isRecurring || false,
        recurrenceRule,
        userId: session.user.id,
      },
      include: { category: true, subtasks: true },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Erro ao criar tarefa" },
      { status: 500 }
    );
  }
}
