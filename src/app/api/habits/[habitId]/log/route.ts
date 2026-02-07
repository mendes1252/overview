import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function updateStreak(habitId: string) {
  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
    include: {
      logs: {
        where: { completed: true },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!habit) return;

  let currentStreak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  // Check consecutive days
  while (true) {
    const dayOfWeek = checkDate.getDay();

    // Skip days that aren't target days
    if (!habit.targetDays.includes(dayOfWeek)) {
      checkDate.setDate(checkDate.getDate() - 1);
      continue;
    }

    const log = habit.logs.find((l) => {
      const logDate = new Date(l.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === checkDate.getTime();
    });

    if (log) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Update habit with new streak
  await prisma.habit.update({
    where: { id: habitId },
    data: {
      currentStreak,
      bestStreak: Math.max(currentStreak, habit.bestStreak),
    },
  });
}

export async function POST(
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
    const { date, notes } = body;

    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id },
    });

    if (!habit) {
      return NextResponse.json(
        { error: "Habito nao encontrado" },
        { status: 404 }
      );
    }

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    // Create or update log
    const log = await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId,
          date: logDate,
        },
      },
      create: {
        habitId,
        userId: session.user.id,
        date: logDate,
        completed: true,
        notes,
      },
      update: {
        completed: true,
        notes,
      },
    });

    // Update streak
    await updateStreak(habitId);

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Error creating habit log:", error);
    return NextResponse.json(
      { error: "Erro ao registrar habito" },
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
    const body = await req.json();
    const { date } = body;

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id },
    });

    if (!habit) {
      return NextResponse.json(
        { error: "Habito nao encontrado" },
        { status: 404 }
      );
    }

    // Delete log
    await prisma.habitLog.deleteMany({
      where: {
        habitId,
        date: logDate,
      },
    });

    // Update streak
    await updateStreak(habitId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting habit log:", error);
    return NextResponse.json(
      { error: "Erro ao remover registro" },
      { status: 500 }
    );
  }
}
