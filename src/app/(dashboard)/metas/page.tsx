import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoalsClient } from "@/components/goals/goals-client";
import { Loader2 } from "lucide-react";

async function getGoalsData(userId: string) {
  const [goals, categories] = await Promise.all([
    prisma.goal.findMany({
      where: { userId },
      include: { category: true },
      orderBy: [{ status: "asc" }, { endDate: "asc" }],
    }),
    prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    }),
  ]);

  return { goals, categories };
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-[#4A9FFF]" />
    </div>
  );
}

export default async function GoalsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { goals, categories } = await getGoalsData(session.user.id);

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      <Suspense fallback={<LoadingState />}>
        <GoalsClient initialGoals={goals} categories={categories} />
      </Suspense>
    </div>
  );
}
