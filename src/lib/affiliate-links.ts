import "server-only";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";

export function generateSlug(length = 8): string {
  return nanoid(length);
}

export function buildTrackableUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/r/${slug}`;
}

export async function getOrCreateLink(
  userId: string,
  productId: string,
  prisma: PrismaClient
) {
  const existing = await prisma.affiliateLink.findFirst({
    where: { userId, productId },
  });
  if (existing) return existing;

  let slug = generateSlug();
  let attempts = 0;
  while (attempts < 5) {
    const conflict = await prisma.affiliateLink.findUnique({ where: { slug } });
    if (!conflict) break;
    slug = generateSlug();
    attempts++;
  }

  return prisma.affiliateLink.create({
    data: { userId, productId, slug },
  });
}

export function detectDevice(userAgent: string | null): string {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod/.test(ua)) return "mobile";
  if (/tablet/.test(ua)) return "tablet";
  return "desktop";
}
