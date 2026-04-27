import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const storefront = await prisma.affiliateStorefront.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json(storefront);
  } catch (error) {
    console.error("Error fetching storefront:", error);
    return NextResponse.json({ error: "Erro ao buscar vitrine" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { username, customDomain, title, bio, avatarUrl, themeColor, active } = body;

    if (username) {
      const conflict = await prisma.affiliateStorefront.findFirst({
        where: { username, userId: { not: session.user.id } },
      });
      if (conflict) {
        return NextResponse.json({ error: "Username já está em uso" }, { status: 409 });
      }
    }

    if (customDomain) {
      const conflict = await prisma.affiliateStorefront.findFirst({
        where: { customDomain, userId: { not: session.user.id } },
      });
      if (conflict) {
        return NextResponse.json({ error: "Domínio já está em uso" }, { status: 409 });
      }
    }

    const storefront = await prisma.affiliateStorefront.upsert({
      where: { userId: session.user.id },
      update: {
        ...(username !== undefined && { username }),
        ...(customDomain !== undefined && { customDomain: customDomain || null }),
        ...(title !== undefined && { title }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(themeColor !== undefined && { themeColor }),
        ...(active !== undefined && { active }),
      },
      create: {
        userId: session.user.id,
        username: username ?? session.user.id.slice(0, 12),
        customDomain: customDomain || null,
        title,
        bio,
        avatarUrl,
        themeColor: themeColor ?? "#6366f1",
        active: active ?? true,
      },
    });

    return NextResponse.json(storefront);
  } catch (error) {
    console.error("Error updating storefront:", error);
    return NextResponse.json({ error: "Erro ao atualizar vitrine" }, { status: 500 });
  }
}
