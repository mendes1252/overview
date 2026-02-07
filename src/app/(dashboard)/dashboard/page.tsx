import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeekRange, formatDate } from "@/lib/utils";
import { WeeklyOverviewCard } from "@/components/dashboard/weekly-overview-card";
import { TodayTasksCard } from "@/components/dashboard/today-tasks-card";
import { HabitsCard } from "@/components/dashboard/habits-card";
import { WeeklyGoalsCard } from "@/components/dashboard/weekly-goals-card";
import { WeeklySummaryCard } from "@/components/dashboard/weekly-summary-card";
import { NextReportCard } from "@/components/dashboard/next-report-card";

async function getDashboardData(userId: string) {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // Get user settings for week start
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { weekStartsOn: true, name: true },
  });

  const weekStartsOn = user?.weekStartsOn || 1;
  const { start: weekStart, end: weekEnd } = getWeekRange(now, weekStartsOn);

  // Parallel queries for dashboard data
  const [
    todayTasks,
    weekTasks,
    habits,
    weeklyGoals,
    latestReport,
  ] = await Promise.all([
    // Today's tasks
    prisma.task.findMany({
      where: {
        userId,
        OR: [
          { dueDate: { gte: todayStart, lte: todayEnd } },
          { dueDate: null, createdAt: { gte: todayStart } },
        ],
      },
      include: { category: true, subtasks: true },
      orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
      take: 10,
    }),
    // Week tasks for stats
    prisma.task.findMany({
      where: {
        userId,
        OR: [
          { dueDate: { gte: weekStart, lte: weekEnd } },
          { completedAt: { gte: weekStart, lte: weekEnd } },
        ],
      },
      select: { status: true },
    }),
    // Active habits with logs for this week
    prisma.habit.findMany({
      where: { userId, isArchived: false },
      include: {
        category: true,
        logs: {
          where: {
            date: { gte: weekStart, lte: weekEnd },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    // Weekly goals
    prisma.goal.findMany({
      where: {
        userId,
        period: "weekly",
        startDate: { lte: weekEnd },
        endDate: { gte: weekStart },
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // Latest report
    prisma.report.findFirst({
      where: { userId },
      orderBy: { weekStart: "desc" },
    }),
  ]);

  // Calculate week stats
  const completedTasks = weekTasks.filter((t: { status: string }) => t.status === "done").length;
  const totalTasks = weekTasks.length;

  // Calculate habits consistency
  const totalHabitDays = habits.reduce((acc: number, habit) => {
    const targetDays = habit.targetDays.length;
    return acc + targetDays;
  }, 0);
  const completedHabitDays = habits.reduce((acc: number, habit) => {
    return acc + habit.logs.filter((log: { completed: boolean }) => log.completed).length;
  }, 0);
  const habitsConsistency =
    totalHabitDays > 0 ? (completedHabitDays / totalHabitDays) * 100 : 0;

  // Goals achieved
  const goalsAchieved = weeklyGoals.filter((g: { status: string }) => g.status === "achieved").length;

  return {
    user: { name: user?.name },
    todayTasks,
    habits,
    weeklyGoals,
    latestReport,
    weekStats: {
      weekStart,
      weekEnd,
      completedTasks,
      totalTasks,
      habitsConsistency,
      goalsAchieved,
      totalGoals: weeklyGoals.length,
    },
  };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const data = await getDashboardData(session.user.id);

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Ola, {data.user.name?.split(" ")[0] || "Usuario"}!
        </h1>
        <p className="text-gray-600">
          Aqui esta o resumo da sua semana. Continue firme!
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Overview */}
          <WeeklyOverviewCard
            weekStart={data.weekStats.weekStart}
            weekEnd={data.weekStats.weekEnd}
            completedTasks={data.weekStats.completedTasks}
            totalTasks={data.weekStats.totalTasks}
          />

          {/* Today's Tasks */}
          <TodayTasksCard tasks={data.todayTasks} />

          {/* Habits */}
          <HabitsCard habits={data.habits} weekStart={data.weekStats.weekStart} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Weekly Summary */}
          <WeeklySummaryCard
            completedTasks={data.weekStats.completedTasks}
            totalTasks={data.weekStats.totalTasks}
            habitsConsistency={data.weekStats.habitsConsistency}
            goalsAchieved={data.weekStats.goalsAchieved}
            totalGoals={data.weekStats.totalGoals}
          />

          {/* Weekly Goals */}
          <WeeklyGoalsCard goals={data.weeklyGoals} />

          {/* Next Report */}
          <NextReportCard report={data.latestReport} />
        </div>
      </div>
    </div>
  );
}
