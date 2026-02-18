import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpenAI, getCoachSystemPrompt, generateReportPrompt, CoachTone, WeeklyData } from "@/lib/openai";
import { sendEmail, generateWeeklyReportEmail } from "@/lib/email";
import { getWeekRange } from "@/lib/utils";

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sends this header for cron jobs)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[CRON] Weekly reports job started");

  try {
    // Find Pro users eligible for weekly reports
    const proUsers = await prisma.user.findMany({
      where: { plan: "pro" },
      select: {
        id: true,
        name: true,
        email: true,
        weekStartsOn: true,
        coachTone: true,
      },
    });

    console.log(`[CRON] Found ${proUsers.length} Pro users`);

    let generated = 0;
    let emailed = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of proUsers) {
      try {
        const now = new Date();
        const { start: weekStart, end: weekEnd } = getWeekRange(now, user.weekStartsOn || 1);

        // Skip if report already exists for this week
        const existing = await prisma.report.findUnique({
          where: { userId_weekStart: { userId: user.id, weekStart } },
        });
        if (existing) {
          skipped++;
          continue;
        }

        // Gather weekly data
        const [tasks, habits, goals] = await Promise.all([
          prisma.task.findMany({
            where: {
              userId: user.id,
              OR: [
                { dueDate: { gte: weekStart, lte: weekEnd } },
                { completedAt: { gte: weekStart, lte: weekEnd } },
                { createdAt: { gte: weekStart, lte: weekEnd } },
              ],
            },
            select: { status: true, priority: true, completedAt: true },
          }),
          prisma.habit.findMany({
            where: { userId: user.id, isArchived: false },
            include: {
              logs: {
                where: { date: { gte: weekStart, lte: weekEnd } },
              },
            },
          }),
          prisma.goal.findMany({
            where: {
              userId: user.id,
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
            progress:
              g.targetValue && g.targetValue > 0
                ? Math.round(((g.currentValue || 0) / g.targetValue) * 100)
                : g.status === "achieved"
                  ? 100
                  : 0,
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
            userId: user.id,
          },
        });

        generated++;
        console.log(`[CRON] Report generated for user ${user.id}`);

        // Send email
        if (user.email) {
          const emailResult = await sendEmail({
            to: user.email,
            subject: "Seu Relatorio Semanal - pulse",
            html: generateWeeklyReportEmail(user.name || "Usuario", {
              summary: report.summary,
              insights: report.insights,
              recommendations: report.recommendations,
              highlights: report.highlights,
              tasksCompleted: report.tasksCompleted,
              tasksTotal: report.tasksTotal,
              habitsConsistency: report.habitsConsistency,
              goalsAchieved: report.goalsAchieved,
              goalsTotal: report.goalsTotal,
            }),
          });

          if (emailResult.success) {
            emailed++;
          } else {
            console.error(`[CRON] Failed to email user ${user.id}`);
          }
        }
      } catch (userError) {
        errors++;
        console.error(`[CRON] Error processing user ${user.id}:`, userError);
      }
    }

    const summary = { generated, emailed, skipped, errors, total: proUsers.length };
    console.log("[CRON] Weekly reports job completed:", summary);

    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    console.error("[CRON] Weekly reports job failed:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
