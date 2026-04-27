import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildTrackableUrl } from "@/lib/affiliate-links";
import { StorefrontClient } from "./storefront-client";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const storefront = await prisma.affiliateStorefront.findUnique({
    where: { username },
    include: { user: { select: { name: true } } },
  });

  if (!storefront) return { title: "Vitrine não encontrada" };

  const title = storefront.title ?? storefront.user.name ?? username;
  return {
    title,
    description: storefront.bio ?? `Confira as melhores ofertas de ${title}`,
    openGraph: {
      title,
      description: storefront.bio ?? `Confira as melhores ofertas de ${title}`,
      images: storefront.avatarUrl ? [storefront.avatarUrl] : [],
    },
  };
}

export default async function BioPage({ params }: Props) {
  const { username } = await params;

  const storefront = await prisma.affiliateStorefront.findUnique({
    where: { username, active: true },
    include: { user: { select: { name: true, image: true } } },
  });

  if (!storefront) notFound();

  const products = await prisma.affiliateProduct.findMany({
    where: { userId: storefront.userId, active: true },
    include: { links: { select: { slug: true }, take: 1 } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const productsWithUrl = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    imageUrl: p.imageUrl,
    price: p.price,
    category: p.category,
    platform: p.platform,
    trackUrl: p.links[0] ? buildTrackableUrl(p.links[0].slug) : null,
  }));

  const storefrontData = {
    title: storefront.title ?? storefront.user.name ?? username,
    bio: storefront.bio,
    avatarUrl: storefront.avatarUrl ?? storefront.user.image,
    themeColor: storefront.themeColor,
  };

  return (
    <StorefrontClient storefront={storefrontData} products={productsWithUrl} />
  );
}
