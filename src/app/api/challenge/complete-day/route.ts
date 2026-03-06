import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveChallenge, getUserEnrollment, isDayUnlocked, TOTAL_DAYS } from "@/lib/challenge";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { dayNumber, notes } = body as { dayNumber: number; notes?: string };

    if (!dayNumber || dayNumber < 1 || dayNumber > TOTAL_DAYS) {
      return NextResponse.json({ error: "Dia invalido" }, { status: 400 });
    }

    const challenge = await getActiveChallenge();
    if (!challenge) {
      return NextResponse.json({ error: "Desafio nao encontrado" }, { status: 404 });
    }

    const enrollment = await getUserEnrollment(session.user.id, challenge.id);
    if (!enrollment || (enrollment.status !== "active" && enrollment.status !== "completed")) {
      return NextResponse.json({ error: "Inscricao nao encontrada ou inativa" }, { status: 403 });
    }

    const completedDayNumbers = enrollment.dayCompletions.map((dc) => dc.dayNumber);

    // Check if already completed
    if (completedDayNumbers.includes(dayNumber)) {
      return NextResponse.json({ error: "Dia ja concluido" }, { status: 400 });
    }

    // Check if day is unlocked
    if (!isDayUnlocked(dayNumber, completedDayNumbers, enrollment.status)) {
      return NextResponse.json({ error: "Dia bloqueado" }, { status: 403 });
    }

    // Find the challenge day
    const challengeDay = challenge.days.find((d) => d.dayNumber === dayNumber);
    if (!challengeDay) {
      return NextResponse.json({ error: "Conteudo do dia nao encontrado" }, { status: 404 });
    }

    const newCompletedDays = enrollment.completedDays + 1;
    const isLastDay = newCompletedDays === TOTAL_DAYS;

    // Create completion and update enrollment in transaction
    await prisma.$transaction([
      prisma.challengeDayCompletion.create({
        data: {
          dayNumber,
          notes,
          enrollmentId: enrollment.id,
          challengeDayId: challengeDay.id,
        },
      }),
      prisma.challengeEnrollment.update({
        where: { id: enrollment.id },
        data: {
          completedDays: newCompletedDays,
          currentDay: isLastDay ? TOTAL_DAYS : dayNumber + 1,
          status: isLastDay ? "completed" : "active",
          completedAt: isLastDay ? new Date() : null,
        },
      }),
    ]);

    // Create notification
    await prisma.notification.create({
      data: {
        type: "achievement",
        title: isLastDay
          ? "Desafio Completo!"
          : `Dia ${dayNumber} concluido!`,
        body: isLastDay
          ? "Parabens! Voce completou o Desafio de 7 Dias! Seu bonus esta disponivel."
          : `Voce completou o Dia ${dayNumber}. O Dia ${dayNumber + 1} ja esta desbloqueado!`,
        userId: session.user.id,
        data: JSON.stringify({
          type: "challenge",
          dayNumber,
          isLastDay,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      dayNumber,
      completedDays: newCompletedDays,
      isLastDay,
      nextDay: isLastDay ? null : dayNumber + 1,
    });
  } catch (error) {
    console.error("Complete day error:", error);
    return NextResponse.json(
      { error: "Erro ao concluir dia" },
      { status: 500 }
    );
  }
}
