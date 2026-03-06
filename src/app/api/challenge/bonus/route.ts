import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveChallenge, getUserEnrollment } from "@/lib/challenge";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const challenge = await getActiveChallenge();
    if (!challenge) {
      return NextResponse.json({ error: "Desafio nao encontrado" }, { status: 404 });
    }

    const enrollment = await getUserEnrollment(session.user.id, challenge.id);
    if (!enrollment || enrollment.status !== "completed") {
      return NextResponse.json(
        { error: "Complete todos os 7 dias para acessar o bonus" },
        { status: 403 }
      );
    }

    if (enrollment.bonusClaimed) {
      return NextResponse.json(
        { error: "Bonus ja resgatado" },
        { status: 400 }
      );
    }

    await prisma.challengeEnrollment.update({
      where: { id: enrollment.id },
      data: { bonusClaimed: true },
    });

    // Get upsell campaign for the pro offer
    const campaign = await prisma.upsellCampaign.findUnique({
      where: { slug: "desafio-7dias-pro" },
    });

    return NextResponse.json({
      success: true,
      bonus: {
        claimed: true,
        message: "Parabens! Seu bonus foi liberado.",
      },
      proOffer: campaign
        ? {
            headline: campaign.headline,
            description: campaign.description,
            originalPrice: campaign.originalPrice,
            offerPrice: campaign.offerPrice,
            badgeText: campaign.badgeText,
            checkoutUrl: `/checkout?campaign=desafio-7dias-pro`,
          }
        : null,
    });
  } catch (error) {
    console.error("Bonus claim error:", error);
    return NextResponse.json(
      { error: "Erro ao resgatar bonus" },
      { status: 500 }
    );
  }
}
