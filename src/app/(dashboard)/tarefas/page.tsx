import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TasksClient } from "@/components/tasks/tasks-client";
import { Loader2 } from "lucide-react";

async function getTasksData(userId: string) {
  const [tasks, categories] = await Promise.all([
    prisma.task.findMany({
      where: { userId },
      include: { category: true, subtasks: true },
      orderBy: [{ status: "asc" }, { priority: "desc" }, { dueDate: "asc" }],
    }),
    prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    }),
  ]);

  return { tasks, categories };
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { tasks, categories } = await getTasksData(session.user.id);

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      <Suspense fallback={<LoadingState />}>
        <TasksClient initialTasks={tasks} categories={categories} />
      </Suspense>
    </div>
  );
}
