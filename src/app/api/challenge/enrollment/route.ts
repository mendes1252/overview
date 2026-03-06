import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getActiveChallenge, getUserEnrollment, getProgress } from "@/lib/challenge";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const challenge = await getActiveChallenge();
    if (!challenge) {
      return NextResponse.json({ error: "Desafio nao encontrado" }, { status: 404 });
    }

    const enrollment = await getUserEnrollment(session.user.id, challenge.id);

    if (!enrollment) {
      return NextResponse.json({
        enrolled: false,
        challenge: {
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          price: challenge.price,
          totalDays: challenge.days.length,
        },
      });
    }

    const completedDayNumbers = enrollment.dayCompletions.map((dc) => dc.dayNumber);
    const progress = getProgress(enrollment.completedDays);

    return NextResponse.json({
      enrolled: true,
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        paymentStatus: enrollment.paymentStatus,
        currentDay: enrollment.currentDay,
        completedDays: enrollment.completedDays,
        completedDayNumbers,
        completedAt: enrollment.completedAt,
        bonusClaimed: enrollment.bonusClaimed,
        startedAt: enrollment.startedAt,
      },
      progress,
      challenge: {
        id: challenge.id,
        title: challenge.title,
        totalDays: challenge.days.length,
        days: challenge.days.map((day) => ({
          id: day.id,
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description,
          isCompleted: completedDayNumbers.includes(day.dayNumber),
          isUnlocked:
            enrollment.status === "active" || enrollment.status === "completed"
              ? day.dayNumber === 1 || completedDayNumbers.includes(day.dayNumber - 1)
              : false,
        })),
      },
    });
  } catch (error) {
    console.error("Enrollment fetch error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar inscricao" },
      { status: 500 }
    );
  }
}
