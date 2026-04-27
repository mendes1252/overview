import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AffiliateDashboard } from "./affiliate-dashboard";

export const metadata = { title: "Afiliados" };

export default async function AffiliatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [storefront, productCount, totalClicks] = await Promise.all([
    prisma.affiliateStorefront.findUnique({ where: { userId: session.user.id } }),
    prisma.affiliateProduct.count({ where: { userId: session.user.id, active: true } }),
    prisma.affiliateLink
      .aggregate({ where: { userId: session.user.id }, _sum: { clickCount: true } })
      .then((r) => r._sum.clickCount ?? 0),
  ]);

  return (
    <AffiliateDashboard
      storefront={storefront}
      productCount={productCount}
      totalClicks={totalClicks}
    />
  );
}
