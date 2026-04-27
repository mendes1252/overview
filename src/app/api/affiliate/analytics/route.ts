import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = Math.min(Number(searchParams.get("days") ?? "30"), 90);

    const since = new Date();
    since.setDate(since.getDate() - days);

    const [topProducts, clicksByDay, totalClicks, devices] = await Promise.all([
      prisma.affiliateLink.findMany({
        where: { userId: session.user.id },
        select: {
          slug: true,
          clickCount: true,
          product: { select: { id: true, name: true, platform: true, imageUrl: true } },
        },
        orderBy: { clickCount: "desc" },
        take: 10,
      }),

      prisma.$queryRaw<{ date: string; count: bigint }[]>`
        SELECT
          DATE("createdAt")::text AS date,
          COUNT(*) AS count
        FROM "LinkClick" lc
        JOIN "AffiliateLink" al ON al.id = lc."linkId"
        WHERE al."userId" = ${session.user.id}
          AND lc."createdAt" >= ${since}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,

      prisma.linkClick.count({
        where: {
          link: { userId: session.user.id },
          createdAt: { gte: since },
        },
      }),

      prisma.$queryRaw<{ device: string; count: bigint }[]>`
        SELECT
          COALESCE(lc.device, 'unknown') AS device,
          COUNT(*) AS count
        FROM "LinkClick" lc
        JOIN "AffiliateLink" al ON al.id = lc."linkId"
        WHERE al."userId" = ${session.user.id}
          AND lc."createdAt" >= ${since}
        GROUP BY lc.device
      `,
    ]);

    return NextResponse.json({
      totalClicks,
      topProducts,
      clicksByDay: clicksByDay.map((r) => ({ date: r.date, count: Number(r.count) })),
      devices: devices.map((r) => ({ device: r.device, count: Number(r.count) })),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Erro ao buscar analytics" }, { status: 500 });
  }
}
