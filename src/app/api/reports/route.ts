import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOpenAI, getCoachSystemPrompt, generateReportPrompt, CoachTone, WeeklyData } from "@/lib/openai";
import { getWeekRange } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const reports = await prisma.report.findMany({
      where: { userId: session.user.id },
      orderBy: { weekStart: "desc" },
      take: 12,
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Erro ao buscar relatorios" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, weekStartsOn: true, coachTone: true, plan: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 });
    }

    // Check plan - free only gets monthly
    if (user.plan === "free") {
      const lastReport = await prisma.report.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
      if (lastReport) {
        const daysSinceLastReport = Math.floor(
          (Date.now() - new Date(lastReport.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastReport < 25) {
          return NextResponse.json(
            { error: "Plano gratuito permite 1 relatorio por mes. Faca upgrade para relatorios semanais.", code: "PLAN_LIMIT_REACHED" },
            { status: 403 }
          );
        }
      }
    }

    const now = new Date();
    const { start: weekStart, end: weekEnd } = getWeekRange(now, user.weekStartsOn || 1);

    // Check if report already exists for this week
    const existingReport = await prisma.report.findUnique({
      where: { userId_weekStart: { userId: session.user.id, weekStart } },
    });
    if (existingReport) {
      return NextResponse.json(existingReport);
    }

    // Gather weekly data
    const [tasks, habits, goals] = await Promise.all([
      prisma.task.findMany({
        where: {
          userId: session.user.id,
          OR: [
            { dueDate: { gte: weekStart, lte: weekEnd } },
            { completedAt: { gte: weekStart, lte: weekEnd } },
            { createdAt: { gte: weekStart, lte: weekEnd } },
          ],
        },
        select: { status: true, priority: true, completedAt: true },
      }),
      prisma.habit.findMany({
        where: { userId: session.user.id, isArchived: false },
        include: {
          logs: {
            where: { date: { gte: weekStart, lte: weekEnd } },
          },
        },
      }),
      prisma.goal.findMany({
        where: {
          userId: session.user.id,
          startDate: { lte: weekEnd },
          endDate: { gte: weekStart },
        },
        select: { title: true, status: true, targetValue: true, currentValue: true },
      }),
    ]);

    const tasksCompleted = tasks.filter((t) => t.status === "done").length;
    const tasksTotal = tasks.length;

    const weeklyData: WeeklyData = {
      tasksCompleted,
      tasksTotal,
      tasksByPriority: {
        high: tasks.filter((t) => t.priority === "high").length,
        medium: tasks.filter((t) => t.priority === "medium").length,
        low: tasks.filter((t) => t.priority === "low").length,
      },
      habitsConsistency: habits.map((h) => ({
        habitName: h.name,
        daysCompleted: h.logs.filter((l) => l.completed).length,
        totalDays: h.targetDays.length,
      })),
      goalsProgress: goals.map((g) => ({
        title: g.title,
        progress: g.targetValue && g.targetValue > 0
          ? Math.round(((g.currentValue || 0) / g.targetValue) * 100)
          : g.status === "achieved" ? 100 : 0,
        achieved: g.status === "achieved",
      })),
    };

    // Generate report with OpenAI
    const openai = getOpenAI();
    const prompt = generateReportPrompt(weeklyData, user.name || "Usuario");
    const systemPrompt = getCoachSystemPrompt((user.coachTone || "motivational") as CoachTone);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    let reportContent;
    try {
      reportContent = JSON.parse(responseText);
    } catch {
      reportContent = {
        summary: "Nao foi possivel gerar o relatorio automaticamente.",
        insights: "Dados insuficientes para analise",
        recommendations: "Continue registrando suas atividades",
        highlights: "Voce esta no caminho certo!",
      };
    }

    // Calculate habits consistency
    const totalHabitDays = habits.reduce((acc, h) => acc + h.targetDays.length, 0);
    const completedHabitDays = habits.reduce(
      (acc, h) => acc + h.logs.filter((l) => l.completed).length,
      0
    );
    const habitsConsistency = totalHabitDays > 0 ? (completedHabitDays / totalHabitDays) * 100 : 0;
    const goalsAchieved = goals.filter((g) => g.status === "achieved").length;

    // Save report
    const report = await prisma.report.create({
      data: {
        weekStart,
        weekEnd,
        summary: reportContent.summary || "",
        insights: reportContent.insights || "",
        recommendations: reportContent.recommendations || "",
        highlights: reportContent.highlights || "",
        tasksCompleted,
        tasksTotal,
        habitsConsistency,
        goalsAchieved,
        goalsTotal: goals.length,
        userId: session.user.id,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Erro ao gerar relatorio" }, { status: 500 });
  }
}
