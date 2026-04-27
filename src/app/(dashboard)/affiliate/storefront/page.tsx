import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StorefrontSettings } from "./storefront-settings";

export const metadata = { title: "Configurar Vitrine" };

export default async function StorefrontPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const storefront = await prisma.affiliateStorefront.findUnique({
    where: { userId: session.user.id },
  });

  return <StorefrontSettings initial={storefront} />;
}
