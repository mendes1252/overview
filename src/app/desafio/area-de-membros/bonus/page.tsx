"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy,
  Gift,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Crown,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface BonusData {
  success: boolean;
  bonus: { claimed: boolean; message: string };
  proOffer: {
    headline: string;
    description: string;
    originalPrice: number;
    offerPrice: number;
    badgeText: string;
    checkoutUrl: string;
  } | null;
}

export default function BonusPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<BonusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    claimBonus();
  }, []);

  const claimBonus = async () => {
    setClaiming(true);
    try {
      const res = await fetch("/api/challenge/bonus", { method: "POST" });
      const d = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          router.push("/desafio/area-de-membros");
          return;
        }
        toast({
          title: "Erro",
          description: d.error,
          variant: "destructive",
        });
        return;
      }
      setData(d);
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao carregar bonus",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A9FFF] mx-auto mb-3" />
          <p className="text-white/50 font-light">Carregando seu bonus...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const discount = data.proOffer
    ? Math.round(
        ((data.proOffer.originalPrice - data.proOffer.offerPrice) /
          data.proOffer.originalPrice) *
          100
      )
    : 0;

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      {/* Celebration header */}
      <div className="text-center mb-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4A9FFF] to-[#6BB5FF] flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-medium text-white mb-3">
          Parabens! Desafio Completo!
        </h1>
        <p className="text-white/50 font-light max-w-md mx-auto">
          Voce completou todos os 7 dias do Desafio de Produtividade. Isso
          prova que voce leva produtividade a serio.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Dias Completos", value: "7/7", icon: CheckCircle },
          { label: "Desafios Feitos", value: "7", icon: Sparkles },
          { label: "Status", value: "Completo", icon: Trophy },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white/[0.05] border border-white/10 rounded-xl p-4 text-center"
          >
            <Icon className="w-5 h-5 text-[#4A9FFF] mx-auto mb-2" />
            <div className="text-xl font-medium text-white">{value}</div>
            <div className="text-xs text-white/40 font-light">{label}</div>
          </div>
        ))}
      </div>

      {/* Bonus section */}
      <div className="bg-gradient-to-br from-[#4A9FFF]/10 to-[#4A9FFF]/5 border border-[#4A9FFF]/20 rounded-2xl p-8 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-6 h-6 text-[#4A9FFF]" />
          <h2 className="text-xl font-medium text-white">
            Seu Bonus Exclusivo
          </h2>
        </div>
        <p className="text-white/60 font-light mb-4">
          Como desafiante que completou os 7 dias, voce ganhou acesso a
          conteudo bonus exclusivo e uma oferta especial para continuar sua
          jornada de produtividade.
        </p>
        <div className="bg-white/[0.05] rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/70 font-light">
            O conteudo bonus sera definido em breve. Fique atento ao seu email!
          </p>
        </div>
      </div>

      {/* Pro Offer */}
      {data.proOffer && (
        <div className="bg-[#0F1419] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          {/* Glow background */}
          <div className="absolute inset-0 gradient-radial-glow opacity-50" />

          <div className="relative">
            {data.proOffer.badgeText && (
              <span className="inline-block bg-[#4A9FFF] text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                {data.proOffer.badgeText}
              </span>
            )}

            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-6 h-6 text-[#4A9FFF]" />
              <h2 className="text-xl font-medium text-white">
                {data.proOffer.headline}
              </h2>
            </div>

            <p className="text-white/60 font-light mb-6">
              {data.proOffer.description}
            </p>

            {/* Pricing */}
            <div className="bg-white/[0.05] rounded-xl p-5 mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50 font-light">
                  Plano Pro — 1 ano de acesso completo
                </p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-medium text-white">
                    R${data.proOffer.offerPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-white/30 line-through">
                    R${data.proOffer.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-[#4A9FFF] font-medium">
                    -{discount}%
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                "Tarefas ilimitadas",
                "Habitos ilimitados",
                "Metas ilimitadas",
                "Relatorios semanais com IA",
                "Coach de IA personalizado",
                "Suporte prioritario",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-[#4A9FFF] shrink-0" />
                  <span className="text-white/60 font-light">{f}</span>
                </div>
              ))}
            </div>

            <Link href={data.proOffer.checkoutUrl}>
              <Button
                size="lg"
                className="w-full gap-2 bg-[#4A9FFF] hover:bg-[#6BB5FF] btn-pulse"
              >
                Quero o Pulse Pro com desconto
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="text-center mt-8">
        <Link
          href="/desafio/area-de-membros"
          className="text-sm text-white/40 hover:text-white/60 transition-colors font-light"
        >
          Voltar ao painel do desafio
        </Link>
      </div>
    </div>
  );
}
