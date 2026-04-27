import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateLink } from "@/lib/affiliate-links";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const products = await prisma.affiliateProduct.findMany({
      where: { userId: session.user.id },
      include: {
        links: { select: { slug: true, clickCount: true } },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching affiliate products:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, imageUrl, affiliateUrl, price, category, platform } = body;

    if (!name || !affiliateUrl) {
      return NextResponse.json({ error: "Nome e URL de afiliado são obrigatórios" }, { status: 400 });
    }

    const count = await prisma.affiliateProduct.count({ where: { userId: session.user.id } });

    const product = await prisma.affiliateProduct.create({
      data: {
        userId: session.user.id,
        name,
        description,
        imageUrl,
        affiliateUrl,
        price: price ? Number(price) : null,
        category,
        platform: platform ?? "OTHER",
        order: count,
      },
    });

    await getOrCreateLink(session.user.id, product.id, prisma);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating affiliate product:", error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}
