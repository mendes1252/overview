import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Nao autorizado" },
        { status: 401 }
      );
    }

    const { name, timezone, primaryGoal, weekStartsOn, reportTime, coachTone } =
      await req.json();

    // Update user with onboarding data
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        timezone,
        primaryGoal,
        weekStartsOn,
        reportTime,
        coachTone,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
