import { prisma } from "./prisma";

const CHALLENGE_SLUG = "desafio-produtividade-7-dias";
export const CHALLENGE_PRICE = 97.0;
export const TOTAL_DAYS = 7;

export async function getActiveChallenge() {
  return prisma.challenge.findFirst({
    where: { active: true, slug: CHALLENGE_SLUG },
    include: {
      days: { orderBy: { dayNumber: "asc" } },
    },
  });
}

export async function getUserEnrollment(userId: string, challengeId: string) {
  return prisma.challengeEnrollment.findUnique({
    where: {
      userId_challengeId: { userId, challengeId },
    },
    include: {
      dayCompletions: { orderBy: { dayNumber: "asc" } },
      challenge: {
        include: { days: { orderBy: { dayNumber: "asc" } } },
      },
    },
  });
}

export function isDayUnlocked(
  dayNumber: number,
  completedDays: number[],
  enrollmentStatus: string
): boolean {
  if (enrollmentStatus !== "active" && enrollmentStatus !== "completed") {
    return false;
  }
  if (dayNumber === 1) return true;
  return completedDays.includes(dayNumber - 1);
}

export function getProgress(completedDays: number): {
  percentage: number;
  label: string;
} {
  const percentage = Math.round((completedDays / TOTAL_DAYS) * 100);
  if (completedDays === 0) return { percentage: 0, label: "Comece agora!" };
  if (completedDays === TOTAL_DAYS)
    return { percentage: 100, label: "Desafio completo!" };
  return { percentage, label: `${completedDays}/${TOTAL_DAYS} dias` };
}
