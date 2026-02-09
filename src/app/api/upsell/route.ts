import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get active upsell campaigns
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const campaign = await prisma.upsellCampaign.findUnique({
        where: { slug, active: true },
      });

      if (!campaign) {
        return NextResponse.json(
          { error: "Campanha nao encontrada" },
          { status: 404 }
        );
      }

      // Check expiration
      if (campaign.expiresAt && new Date() > campaign.expiresAt) {
        return NextResponse.json(
          { error: "Campanha expirada" },
          { status: 410 }
        );
      }

      // Check slots
      if (
        campaign.limitedSlots &&
        campaign.slotsUsed >= campaign.limitedSlots
      ) {
        return NextResponse.json(
          { error: "Vagas esgotadas" },
          { status: 410 }
        );
      }

      // Increment views
      await prisma.upsellCampaign.update({
        where: { id: campaign.id },
        data: { views: { increment: 1 } },
      });

      return NextResponse.json(campaign);
    }

    // List active campaigns
    const campaigns = await prisma.upsellCampaign.findMany({
      where: {
        active: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Upsell error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar campanhas" },
      { status: 500 }
    );
  }
}

// POST - Create upsell campaign (admin only, check in middleware later)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      headline,
      description,
      badgeText,
      imageUrl,
      originalPrice,
      offerPrice,
      targetPlan,
      expiresAt,
      limitedSlots,
    } = body;

    if (!name || !slug || !headline || !description || !originalPrice || !offerPrice || !targetPlan) {
      return NextResponse.json(
        { error: "Campos obrigatorios ausentes" },
        { status: 400 }
      );
    }

    const campaign = await prisma.upsellCampaign.create({
      data: {
        name,
        slug,
        headline,
        description,
        badgeText,
        imageUrl,
        originalPrice,
        offerPrice,
        targetPlan,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        limitedSlots,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Create upsell error:", error);
    return NextResponse.json(
      { error: "Erro ao criar campanha" },
      { status: 500 }
    );
  }
}
