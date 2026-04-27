import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ username: null });
  }

  const storefront = await prisma.affiliateStorefront.findUnique({
    where: { customDomain: domain },
    select: { username: true, active: true },
  });

  if (!storefront || !storefront.active) {
    return NextResponse.json({ username: null });
  }

  return NextResponse.json({ username: storefront.username });
}
