import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildTrackableUrl } from "@/lib/affiliate-links";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const storefront = await prisma.affiliateStorefront.findUnique({
      where: { username },
      include: { user: { select: { name: true, image: true } } },
    });

    if (!storefront || !storefront.active) {
      return NextResponse.json({ error: "Vitrine não encontrada" }, { status: 404 });
    }

    const products = await prisma.affiliateProduct.findMany({
      where: { userId: storefront.userId, active: true },
      include: {
        links: { select: { slug: true }, take: 1 },
      },
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

    return NextResponse.json({
      storefront: {
        username: storefront.username,
        title: storefront.title ?? storefront.user.name,
        bio: storefront.bio,
        avatarUrl: storefront.avatarUrl ?? storefront.user.image,
        themeColor: storefront.themeColor,
      },
      products: productsWithUrl,
    });
  } catch (error) {
    console.error("Error fetching bio page:", error);
    return NextResponse.json({ error: "Erro ao buscar vitrine" }, { status: 500 });
  }
}
