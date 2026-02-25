"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckCircle, Zap, ArrowLeft, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLAN_CONFIG = {
  pro: {
    name: "Pro",
    price: 297,
    features: [
      "Tarefas ilimitadas",
      "Hábitos ilimitados",
      "Metas ilimitadas",
      "Relatórios semanais com IA",
      "Coach de IA personalizado",
      "Exportação de dados",
      "Suporte prioritário",
    ],
  },
};

interface Campaign {
  offerPrice: number;
  badgeText?: string;
  headline: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const planKey = "pro" as const;
  const campaignSlug = searchParams.get("campaign");
  const planConfig = PLAN_CONFIG.pro;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/checkout?plan=${planKey}`);
    }
  }, [status, router, planKey]);

  useEffect(() => {
    if (campaignSlug) {
      fetch(`/api/upsell?slug=${campaignSlug}`)
        .then((r) => r.json())
        .then((data: Campaign) => {
          if (data.offerPrice) setCampaign(data);
        })
        .catch(() => {});
    }
  }, [campaignSlug]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="animate-pulse text-[#718096]">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-[#1A1A2E] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4A9FFF]/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#4A9FFF]" />
            </div>
            <span className="text-xl font-medium text-white">Pulse</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 text-white/60 hover:text-white hover:bg-white/5">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Campaign Banner */}
        {campaign && (
          <div className="bg-[#1A1A2E] text-white rounded-2xl p-6 mb-8 text-center border border-[#4A9FFF]/20">
            {campaign.badgeText && (
              <span className="inline-block bg-[#4A9FFF] text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                {campaign.badgeText}
              </span>
            )}
            <h2 className="text-2xl font-medium">{campaign.headline}</h2>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Plan details */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#4A9FFF]/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#4A9FFF]" />
              </div>
              <h1 className="text-2xl font-medium text-[#1A1A2E]">
                Plano {planConfig.name}
              </h1>
            </div>
            <p className="text-[#718096] font-light mb-8 ml-[52px]">
              Acesso completo por 1 ano — compra única
            </p>

            <div className="bg-white rounded-2xl border border-black/[0.04] shadow-sm p-6 space-y-4">
              <h3 className="font-medium text-[#1A1A2E]">
                O que está incluso:
              </h3>
              {planConfig.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#4A9FFF] flex-shrink-0" />
                  <span className="text-[#718096]">{feature}</span>
                </div>
              ))}
            </div>

            {/* Guarantee */}
            <div className="mt-6 bg-[#4A9FFF]/5 border border-[#4A9FFF]/15 rounded-2xl p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#4A9FFF] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#1A1A2E] text-sm font-medium">
                  Garantia de 7 dias
                </p>
                <p className="text-[#718096] text-xs font-light mt-1">
                  Se não gostar, devolvemos 100% do seu dinheiro. Sem perguntas.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Checkout form */}
          <div className="bg-white rounded-2xl border border-black/[0.04] shadow-sm p-6">
            <h2 className="text-xl font-medium text-[#1A1A2E] mb-6">
              Pagamento
            </h2>
            <CheckoutForm
              plan={planKey}
              planName={planConfig.name}
              price={planConfig.price}
              offerPrice={campaign?.offerPrice}
              campaignSlug={campaignSlug || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
