"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckCircle, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLAN_CONFIG = {
  pro: {
    name: "Pro",
    price: 29.9,
    features: [
      "Tarefas ilimitadas",
      "Habitos ilimitados",
      "Metas ilimitadas",
      "Relatorios semanais com IA",
      "Coach de IA personalizado",
      "Exportacao de dados",
      "Suporte prioritario",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 99.9,
    features: [
      "Tudo do plano Pro",
      "Dashboard de time",
      "Relatorios consolidados",
      "API access",
      "SSO",
      "Suporte dedicado",
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

  const planKey = (searchParams.get("plan") || "pro") as "pro" | "enterprise";
  const campaignSlug = searchParams.get("campaign");
  const planConfig = PLAN_CONFIG[planKey] || PLAN_CONFIG.pro;

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PULSO</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Campaign Banner */}
        {campaign && (
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl p-6 mb-8 text-center">
            {campaign.badgeText && (
              <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                {campaign.badgeText}
              </span>
            )}
            <h2 className="text-2xl font-bold">{campaign.headline}</h2>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Plan details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Assinar Plano {planConfig.name}
            </h1>
            <p className="text-gray-600 mb-8">
              Desbloqueie todo o potencial do PULSO para sua produtividade.
            </p>

            <div className="bg-white rounded-2xl border p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">
                O que esta incluso:
              </h3>
              {planConfig.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Guarantee */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 text-sm font-medium">
                Garantia de 7 dias
              </p>
              <p className="text-green-700 text-xs mt-1">
                Se nao gostar, devolvemos 100% do seu dinheiro. Sem perguntas.
              </p>
            </div>
          </div>

          {/* Right: Checkout form */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
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
