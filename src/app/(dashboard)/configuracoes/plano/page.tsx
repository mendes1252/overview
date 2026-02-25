"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Crown,
  Check,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  Target,
  Brain,
  Download,
  Headphones,
} from "lucide-react";

const PLANS = {
  free: {
    name: "Gratuito",
    price: "R$ 0",
    period: "",
    description: "Para começar sua jornada de produtividade",
    features: [
      { icon: Target, text: "Até 10 tarefas ativas" },
      { icon: Zap, text: "Até 3 hábitos" },
      { icon: Sparkles, text: "1 meta por período" },
      { icon: BarChart3, text: "Relatórios básicos mensais" },
    ],
  },
  pro: {
    name: "Pro",
    price: "R$ 297",
    period: "compra única",
    description: "Acesso completo por 1 ano",
    features: [
      { icon: Target, text: "Tarefas ilimitadas" },
      { icon: Zap, text: "Hábitos ilimitados" },
      { icon: Sparkles, text: "Metas ilimitadas" },
      { icon: Brain, text: "Relatórios semanais com IA" },
      { icon: Shield, text: "Coach de IA personalizado" },
      { icon: Download, text: "Exportação de dados" },
      { icon: Headphones, text: "Suporte prioritário" },
    ],
  },
};

type PlanKey = keyof typeof PLANS;

interface UserPlan {
  plan: string;
  planCurrentPeriodEnd: string | null;
  asaasSubscriptionId: string | null;
}

export default function PlanoPage() {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlan>({
    plan: "free",
    planCurrentPeriodEnd: null,
    asaasSubscriptionId: null,
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          setUserPlan({
            plan: data.plan || "free",
            planCurrentPeriodEnd: data.planCurrentPeriodEnd,
            asaasSubscriptionId: data.asaasSubscriptionId,
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  const handleUpgrade = (plan: string) => {
    router.push(`/checkout?plan=${plan}`);
  };

  const handleCancel = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium ao final do período atual.")) {
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch("/api/subscription", { method: "DELETE" });
      if (!res.ok) throw new Error();

      toast({
        title: "Assinatura cancelada",
        description: "Você ainda terá acesso até o final do período atual.",
      });
      setUserPlan((prev) => ({ ...prev, plan: "free", asaasSubscriptionId: null }));
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a assinatura.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A9FFF]" />
      </div>
    );
  }

  const currentPlan = userPlan.plan as PlanKey;
  const periodEnd = userPlan.planCurrentPeriodEnd
    ? new Date(userPlan.planCurrentPeriodEnd).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen -m-4 sm:-m-6 lg:-m-8">
      {/* Hero section with dark background */}
      <div className="bg-[#1A1A2E] relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#4A9FFF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[#4A9FFF]/10 border border-[#4A9FFF]/20 rounded-full px-4 py-1.5 mb-6">
            <Crown className="w-4 h-4 text-[#4A9FFF]" />
            <span className="text-sm text-[#4A9FFF] font-medium">Meu Plano</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-medium text-white mb-3">
            Desbloqueie todo o potencial
          </h1>
          <p className="text-white/50 font-light max-w-md mx-auto">
            Escolha o plano ideal para turbinar sua produtividade com inteligência artificial
          </p>
        </div>
      </div>

      {/* Current plan badge */}
      {currentPlan !== "free" && periodEnd && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-[#4A9FFF]/10 border border-[#4A9FFF]/20 rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm">
            <div>
              <p className="font-medium text-[#4A9FFF]">
                Plano {PLANS[currentPlan].name} ativo
              </p>
              <p className="text-sm text-[#718096]">Válido até {periodEnd}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isCancelling}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 rounded-xl"
            >
              {isCancelling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Cancelar plano"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className={`relative bg-white rounded-2xl border-2 p-6 transition-all ${
            currentPlan === "free"
              ? "border-[#4A9FFF] shadow-lg shadow-[#4A9FFF]/5"
              : "border-black/[0.04]"
          }`}>
            {currentPlan === "free" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4A9FFF] text-white text-xs font-medium px-3 py-1 rounded-full">
                PLANO ATUAL
              </div>
            )}

            <div className="pt-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#F5F7FA] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#718096]" />
              </div>
              <h3 className="text-lg font-medium text-[#1A1A2E]">Gratuito</h3>
              <p className="text-sm text-[#718096] font-light mt-1">
                {PLANS.free.description}
              </p>
              <div className="mt-4">
                <span className="text-4xl font-medium text-[#1A1A2E]">R$ 0</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {PLANS.free.features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F7FA] flex items-center justify-center shrink-0">
                    <feature.icon className="w-4 h-4 text-[#718096]" />
                  </div>
                  <span className="text-sm text-[#718096]">{feature.text}</span>
                </div>
              ))}
            </div>

            {currentPlan === "free" ? (
              <Button disabled className="w-full rounded-xl h-11" variant="outline">
                Plano atual
              </Button>
            ) : (
              <div />
            )}
          </div>

          {/* Pro Plan - Highlighted */}
          <div className={`relative rounded-2xl p-6 transition-all ${
            currentPlan === "pro"
              ? "bg-[#1A1A2E] border-2 border-[#4A9FFF] shadow-2xl shadow-[#4A9FFF]/20"
              : "bg-[#1A1A2E] border-2 border-[#4A9FFF]/30 shadow-2xl shadow-[#4A9FFF]/10"
          }`}>
            {currentPlan === "pro" ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4A9FFF] text-white text-xs font-medium px-3 py-1 rounded-full">
                PLANO ATUAL
              </div>
            ) : (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#4A9FFF] to-[#6BB5FF] text-white text-xs font-medium px-4 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                RECOMENDADO
              </div>
            )}

            <div className="pt-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#4A9FFF]/15 flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-[#4A9FFF]" />
              </div>
              <h3 className="text-lg font-medium text-white">Pro</h3>
              <p className="text-sm text-white/50 font-light mt-1">
                {PLANS.pro.description}
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-medium text-white">R$ 297</span>
                <div className="flex flex-col">
                  <span className="text-sm text-white/40 font-light">compra única</span>
                  <span className="text-xs text-[#4A9FFF] font-medium">Validade de 1 ano</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {PLANS.pro.features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#4A9FFF]/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-4 h-4 text-[#4A9FFF]" />
                  </div>
                  <span className="text-sm text-white/70">{feature.text}</span>
                </div>
              ))}
            </div>

            {currentPlan === "pro" ? (
              <Button disabled className="w-full rounded-xl h-11 bg-white/10 text-white/50 border-0">
                Plano atual
              </Button>
            ) : (
              <Button
                className="w-full rounded-xl h-11 bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white font-medium transition-all hover:shadow-lg hover:shadow-[#4A9FFF]/25"
                onClick={() => handleUpgrade("pro")}
              >
                <Zap className="w-4 h-4 mr-2" />
                Garantir acesso Pro
              </Button>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[#718096] font-light">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#4A9FFF]" />
            <span>Pagamento seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#4A9FFF]" />
            <span>Acesso imediato</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#4A9FFF]" />
            <span>Pix, cartão ou boleto</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white rounded-2xl border border-black/[0.04] shadow-sm p-6">
          <h2 className="text-lg font-medium text-[#1A1A2E] mb-6">Perguntas frequentes</h2>
          <div className="space-y-5">
            <div>
              <h3 className="font-medium text-[#1A1A2E]">Como funciona a compra única?</h3>
              <p className="text-sm text-[#718096] font-light mt-1">
                Você paga uma única vez e tem acesso completo a todos os recursos Pro por 1 ano. Sem cobranças recorrentes.
              </p>
            </div>
            <div className="border-t border-black/[0.04] pt-5">
              <h3 className="font-medium text-[#1A1A2E]">Quais formas de pagamento são aceitas?</h3>
              <p className="text-sm text-[#718096] font-light mt-1">
                Aceitamos Pix, cartão de crédito e boleto bancário.
              </p>
            </div>
            <div className="border-t border-black/[0.04] pt-5">
              <h3 className="font-medium text-[#1A1A2E]">O que acontece após 1 ano?</h3>
              <p className="text-sm text-[#718096] font-light mt-1">
                Você poderá renovar seu acesso. Seus dados nunca são perdidos — apenas os recursos premium ficam indisponíveis até a renovação.
              </p>
            </div>
            <div className="border-t border-black/[0.04] pt-5">
              <h3 className="font-medium text-[#1A1A2E]">O que acontece se eu ultrapassar o limite do plano gratuito?</h3>
              <p className="text-sm text-[#718096] font-light mt-1">
                Você não perderá seus dados existentes, mas não poderá criar novos itens além do limite até fazer upgrade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
