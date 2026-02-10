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
  AlertTriangle,
  Sparkles,
  Building2,
} from "lucide-react";

const PLANS = {
  free: {
    name: "Gratuito",
    price: "R$ 0",
    period: "",
    description: "Para comecar sua jornada de produtividade",
    icon: Sparkles,
    features: [
      "Ate 10 tarefas ativas",
      "Ate 3 habitos",
      "1 meta por periodo",
      "Relatorios basicos mensais",
    ],
  },
  pro: {
    name: "Pro",
    price: "R$ 29,90",
    period: "/mes",
    description: "Para quem leva produtividade a serio",
    icon: Crown,
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
    price: "R$ 99,90",
    period: "/mes",
    description: "Para times e empresas",
    icon: Building2,
    features: [
      "Tudo do plano Pro",
      "Dashboard de time",
      "Relatorios consolidados",
      "Acesso via API",
      "SSO (Login unico)",
      "Suporte dedicado",
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
    if (!confirm("Tem certeza que deseja cancelar sua assinatura? Voce perdera acesso aos recursos premium ao final do periodo atual.")) {
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch("/api/subscription", { method: "DELETE" });
      if (!res.ok) throw new Error();

      const data = await res.json();
      toast({
        title: "Assinatura cancelada",
        description: "Voce ainda tera acesso ate o final do periodo atual.",
      });
      setUserPlan((prev) => ({ ...prev, plan: "free", asaasSubscriptionId: null }));
    } catch {
      toast({
        title: "Erro",
        description: "Nao foi possivel cancelar a assinatura.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      <div className="flex items-center gap-3 mb-8">
        <Crown className="w-7 h-7 text-yellow-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Plano</h1>
          <p className="text-gray-500 text-sm">Gerencie sua assinatura</p>
        </div>
      </div>

      {/* Current plan badge */}
      {currentPlan !== "free" && periodEnd && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-medium text-primary">
              Plano {PLANS[currentPlan].name} ativo
            </p>
            <p className="text-sm text-gray-600">Proximo pagamento em {periodEnd}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isCancelling}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isCancelling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Cancelar plano"
            )}
          </Button>
        </div>
      )}

      {/* Plans grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {(Object.entries(PLANS) as [PlanKey, (typeof PLANS)[PlanKey]][]).map(
          ([key, plan]) => {
            const isCurrent = currentPlan === key;
            const isPopular = key === "pro";
            const Icon = plan.icon;

            return (
              <div
                key={key}
                className={`relative bg-white rounded-xl border-2 p-6 transition-all ${
                  isCurrent
                    ? "border-primary shadow-lg"
                    : isPopular
                      ? "border-yellow-300"
                      : "border-gray-200"
                }`}
              >
                {isPopular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                    MAIS POPULAR
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    PLANO ATUAL
                  </div>
                )}

                <div className="text-center mb-6 pt-2">
                  <div
                    className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                      key === "pro"
                        ? "bg-yellow-100"
                        : key === "enterprise"
                          ? "bg-purple-100"
                          : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        key === "pro"
                          ? "text-yellow-600"
                          : key === "enterprise"
                            ? "text-purple-600"
                            : "text-gray-600"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button disabled className="w-full" variant="outline">
                    Plano atual
                  </Button>
                ) : key === "free" ? (
                  <div />
                ) : (
                  <Button
                    className={`w-full ${
                      isPopular
                        ? "bg-yellow-500 hover:bg-yellow-600 text-yellow-950"
                        : ""
                    }`}
                    onClick={() => handleUpgrade(key)}
                  >
                    Fazer upgrade
                  </Button>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* FAQ */}
      <div className="mt-10 bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Perguntas frequentes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Posso cancelar a qualquer momento?</h3>
            <p className="text-sm text-gray-500 mt-1">
              Sim, voce pode cancelar a qualquer momento. Voce tera acesso aos recursos premium ate o final do periodo pago.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Quais formas de pagamento sao aceitas?</h3>
            <p className="text-sm text-gray-500 mt-1">
              Aceitamos Pix, cartao de credito e boleto bancario.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">O que acontece se eu ultrapassar o limite do plano gratuito?</h3>
            <p className="text-sm text-gray-500 mt-1">
              Voce nao perdera seus dados existentes, mas nao podera criar novos itens alem do limite ate fazer upgrade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
