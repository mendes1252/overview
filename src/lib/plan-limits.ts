import { prisma } from "@/lib/prisma";
import { PLANS, PlanType } from "@/lib/asaas";

export async function getUserPlan(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planCurrentPeriodEnd: true },
  });

  if (!user) return { plan: "free" as PlanType, active: false };

  const plan = (user.plan || "free") as PlanType;

  // Free plan is always active
  if (plan === "free") return { plan, active: true };

  // Paid plans: check if subscription is still active
  const active = user.planCurrentPeriodEnd
    ? new Date(user.planCurrentPeriodEnd) > new Date()
    : false;

  return { plan: active ? plan : ("free" as PlanType), active };
}

export async function checkLimit(
  userId: string,
  resource: "tasks" | "habits" | "goals"
): Promise<{ allowed: boolean; current: number; limit: number; plan: PlanType }> {
  const { plan } = await getUserPlan(userId);
  const limits = PLANS[plan].limits;
  const limit = limits[resource];

  if (limit === Infinity) {
    return { allowed: true, current: 0, limit, plan };
  }

  let current = 0;

  switch (resource) {
    case "tasks":
      current = await prisma.task.count({
        where: { userId, status: { not: "done" } },
      });
      break;
    case "habits":
      current = await prisma.habit.count({
        where: { userId, isArchived: false },
      });
      break;
    case "goals":
      current = await prisma.goal.count({
        where: { userId, status: "in_progress" },
      });
      break;
  }

  return { allowed: current < limit, current, limit, plan };
}
