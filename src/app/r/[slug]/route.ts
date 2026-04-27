import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { detectDevice } from "@/lib/affiliate-links";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await prisma.affiliateLink.findUnique({
    where: { slug },
    include: { product: { select: { affiliateUrl: true, active: true } } },
  });

  if (!link || !link.product.active) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const userAgent = request.headers.get("user-agent");
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null;

  await Promise.all([
    prisma.linkClick.create({
      data: {
        linkId: link.id,
        ip,
        userAgent,
        referrer: request.headers.get("referer"),
        device: detectDevice(userAgent),
      },
    }),
    prisma.affiliateLink.update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } },
    }),
  ]);

  return NextResponse.redirect(link.product.affiliateUrl, { status: 302 });
}
