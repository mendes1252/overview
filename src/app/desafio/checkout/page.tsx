"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChallengeCheckoutForm } from "@/components/challenge/challenge-checkout-form";
import {
  CheckCircle,
  Zap,
  ArrowLeft,
  Shield,
  Play,
  FileText,
  Target,
  Trophy,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const INCLUDES = [
  { icon: Play, label: "7 video-aulas exclusivas" },
  { icon: FileText, label: "PDFs e materiais de apoio" },
  { icon: Target, label: "7 desafios praticos" },
  { icon: Trophy, label: "Bonus ao completar" },
  { icon: Flame, label: "Acesso vitalicio" },
];

function CheckoutContent() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/desafio/checkout");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E]">
        <div className="animate-pulse text-white/50">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E]">
      {/* Header */}
      <header className="bg-[#1A1A2E] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/desafio" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4A9FFF]/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#4A9FFF]" />
            </div>
            <span className="text-xl font-medium text-white">Pulse</span>
          </Link>
          <Link href="/desafio">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-white/60 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Details */}
          <div>
            <span className="inline-block bg-[#4A9FFF]/10 text-[#4A9FFF] text-xs font-medium px-3 py-1 rounded-full mb-4">
              DESAFIO DE 7 DIAS
            </span>
            <h1 className="text-2xl font-medium text-white mb-2">
              Desafio de Produtividade em 7 Dias
            </h1>
            <p className="text-white/50 font-light mb-8">
              Acesso imediato apos o pagamento — conteudo vitalicio
            </p>

            <div className="bg-white/[0.05] backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
              <h3 className="font-medium text-white">O que esta incluso:</h3>
              {INCLUDES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[#4A9FFF] flex-shrink-0" />
                  <span className="text-white/60">{label}</span>
                </div>
              ))}
            </div>

            {/* Guarantee */}
            <div className="mt-6 bg-[#4A9FFF]/5 border border-[#4A9FFF]/15 rounded-2xl p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#4A9FFF] shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">
                  Garantia de 7 dias
                </p>
                <p className="text-white/50 text-xs font-light mt-1">
                  Se nao gostar, devolvemos 100% do seu dinheiro. Sem perguntas.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white/[0.05] backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-medium text-white mb-6">Pagamento</h2>
            <ChallengeCheckoutForm
              price={97}
              challengeTitle="Desafio de Produtividade em 7 Dias"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DesafioCheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
