import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeekRange } from "@/lib/utils";
import { HabitsClient } from "@/components/habits/habits-client";
import { Loader2 } from "lucide-react";

async function getHabitsData(userId: string) {
  const now = new Date();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { weekStartsOn: true },
  });

  const weekStartsOn = user?.weekStartsOn || 1;
  const { start: weekStart, end: weekEnd } = getWeekRange(now, weekStartsOn);

  // Get last 30 days for heatmap
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [habits, categories] = await Promise.all([
    prisma.habit.findMany({
      where: { userId },
      include: {
        category: true,
        logs: {
          where: {
            date: { gte: thirtyDaysAgo },
          },
          orderBy: { date: "desc" },
        },
      },
      orderBy: [{ isArchived: "asc" }, { createdAt: "asc" }],
    }),
    prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    }),
  ]);

  return { habits, categories, weekStart, weekStartsOn };
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

export default async function HabitsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const data = await getHabitsData(session.user.id);

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      <Suspense fallback={<LoadingState />}>
        <HabitsClient
          initialHabits={data.habits}
          categories={data.categories}
          weekStart={data.weekStart}
          weekStartsOn={data.weekStartsOn}
        />
      </Suspense>
    </div>
  );
}
