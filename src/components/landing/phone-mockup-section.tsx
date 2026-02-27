"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  CheckCircle2,
  TrendingUp,
  Target,
  Brain,
  BarChart3,
  Zap,
} from "lucide-react";
import { PhoneFrame } from "./phone-frame";
import { phoneScreens } from "./phone-screens";

const features = [
  {
    icon: CheckCircle2,
    num: "01",
    title: "Gestão de Tarefas",
    desc: "Organize suas tarefas com prioridades inteligentes, categorias personalizadas e prazos automáticos. Configure recorrência para rotinas diárias e semanais — nunca mais esqueça uma entrega importante.",
    detail: "Lista e Kanban, filtros por status/prioridade/categoria, subtarefas e integração com o relatório semanal de IA.",
  },
  {
    icon: TrendingUp,
    num: "02",
    title: "Rastreamento de Hábitos",
    desc: "Construa consistência com streaks visuais, grid semanal interativo e lembretes personalizados. Acompanhe seu progresso dia a dia e veja padrões de comportamento ao longo do tempo.",
    detail: "Heatmap de consistência mensal, arquivamento de hábitos, histórico completo e notificações configuráveis por horário.",
  },
  {
    icon: Target,
    num: "03",
    title: "Metas Inteligentes",
    desc: "Defina metas semanais, mensais e trimestrais com acompanhamento em tempo real. Metas binárias ou quantificáveis com barras de progresso e status automático.",
    detail: "Progresso calculado automaticamente, categorização por área da vida e integração direta com tarefas e hábitos relacionados.",
  },
  {
    icon: Brain,
    num: "04",
    title: "Coach de IA",
    desc: "Receba coaching personalizado de uma IA que analisa seus dados reais. Entenda seus padrões de produtividade e receba sugestões específicas para melhorar semana a semana.",
    detail: "4 tons de coaching (motivador, calmo, direto, amigável), respostas baseadas em dados reais e adaptação ao seu estilo de trabalho.",
  },
  {
    icon: BarChart3,
    num: "05",
    title: "Relatórios Semanais",
    desc: "Toda semana, a IA gera um relatório completo com análise de desempenho, padrões identificados, conquistas celebradas e recomendações acionáveis para a próxima semana.",
    detail: "Métricas de conclusão, comparativo com semanas anteriores, identificação de horários de pico e sugestões personalizadas de melhoria.",
  },
  {
    icon: Zap,
    num: "06",
    title: "Dashboard Completo",
    desc: "Visão unificada da sua semana com métricas consolidadas, tarefas do dia, hábitos pendentes e progresso das metas. Tudo num só lugar para começar o dia com clareza.",
    detail: "Overview semanal, próximo relatório de IA, resumo de conquistas e acesso rápido para criar tarefas, hábitos e metas.",
  },
];

export function PhoneMockupSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileFeatureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mobileObserverRef = useRef<IntersectionObserver | null>(null);

  // Desktop scroll handler
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      let maxRatio = 0;
      let maxIndex = -1;

      entries.forEach((entry) => {
        const index = Number(entry.target.getAttribute("data-feature-index"));
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          maxIndex = index;
        }
      });

      if (maxRatio > 0.3 && maxIndex >= 0) {
        setActiveIndex((prev) => {
          if (prev !== maxIndex) {
            setPreviousIndex(prev);
            return maxIndex;
          }
          return prev;
        });
      }
    },
    []
  );

  // Desktop observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      rootMargin: "-35% 0px -35% 0px",
    });

    featureRefs.current.forEach((ref) => {
      if (ref) observerRef.current?.observe(ref);
    });

    return () => observerRef.current?.disconnect();
  }, [handleIntersection]);

  // Mobile observer — separate with different rootMargin for mobile viewport
  useEffect(() => {
    mobileObserverRef.current = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let maxIndex = -1;

        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-feature-index"));
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxIndex = index;
          }
        });

        if (maxRatio > 0.2 && maxIndex >= 0) {
          setActiveIndex((prev) => {
            if (prev !== maxIndex) {
              setPreviousIndex(prev);
              return maxIndex;
            }
            return prev;
          });
        }
      },
      {
        root: null,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-20% 0px -50% 0px",
      }
    );

    mobileFeatureRefs.current.forEach((ref) => {
      if (ref) mobileObserverRef.current?.observe(ref);
    });

    return () => mobileObserverRef.current?.disconnect();
  }, []);

  // Clear previous screen after exit animation
  useEffect(() => {
    if (previousIndex !== null) {
      const timeout = setTimeout(() => setPreviousIndex(null), 400);
      return () => clearTimeout(timeout);
    }
  }, [previousIndex]);

  const ActiveScreen = phoneScreens[activeIndex];
  const PreviousScreen =
    previousIndex !== null ? phoneScreens[previousIndex] : null;

  return (
    <section
      id="funcionalidades"
      className="py-24 sm:py-32 px-6 bg-[#1A1A2E] relative"
    >
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-20" />
      <div className="relative max-w-[1200px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="inline-block text-xs text-[#4A9FFF] font-medium uppercase tracking-[0.2em] mb-4">
            Funcionalidades
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-light text-white leading-tight tracking-[-0.02em] mb-5">
            Tudo que você precisa.
            <br />
            <span className="text-gradient font-medium">
              Nada que não precisa.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto font-light leading-relaxed">
            Ferramentas essenciais combinadas com inteligência artificial para
            maximizar seu potencial.
          </p>
        </div>

        {/* =================== DESKTOP LAYOUT (lg+) =================== */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Left: scrollable feature descriptions — scroll-only, no click */}
          <div className="space-y-0">
            {features.map((feature, i) => (
              <div
                key={feature.num}
                ref={(el) => {
                  featureRefs.current[i] = el;
                }}
                data-feature-index={i}
                className={`feature-item min-h-[240px] flex items-center py-8 pl-2 pr-8 border-l-2 ${
                  activeIndex === i
                    ? "feature-item-active border-l-[#4A9FFF]"
                    : "feature-item-inactive border-l-white/10"
                }`}
              >
                <div className="pl-6">
                  <span className="font-mono text-[11px] tracking-wider text-[#4A9FFF]/50">
                    {feature.num}
                  </span>
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mt-3 mb-4 transition-colors ${
                      activeIndex === i ? "bg-[#4A9FFF]/15" : "bg-white/5"
                    }`}
                  >
                    <feature.icon
                      className={`w-5 h-5 transition-colors ${
                        activeIndex === i ? "text-[#4A9FFF]" : "text-white/30"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-medium mb-2 transition-colors ${
                      activeIndex === i ? "text-white" : "text-white/40"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm font-light leading-relaxed transition-colors ${
                      activeIndex === i ? "text-white/60" : "text-white/25"
                    }`}
                  >
                    {feature.desc}
                  </p>
                  {activeIndex === i && (
                    <p className="text-xs text-[#4A9FFF]/60 font-light mt-2 leading-relaxed animate-fadeIn">
                      {feature.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right: sticky phone */}
          <div className="sticky top-32 flex justify-center pb-16">
            <PhoneFrame>
              {PreviousScreen && (
                <div className="absolute inset-0 phone-screen-exit z-0">
                  <PreviousScreen />
                </div>
              )}
              <div
                className="absolute inset-0 phone-screen-enter z-10"
                key={activeIndex}
              >
                <ActiveScreen />
              </div>
            </PhoneFrame>
          </div>
        </div>

        {/* =================== MOBILE LAYOUT (<lg) =================== */}
        {/* Each feature is a full block: phone + description together, no sticky overlap */}
        <div className="lg:hidden space-y-16">
          {features.map((feature, i) => {
            const Screen = phoneScreens[i];
            return (
              <div
                key={feature.num}
                ref={(el) => {
                  mobileFeatureRefs.current[i] = el;
                }}
                data-feature-index={i}
                className={`transition-opacity duration-500 ${
                  activeIndex === i ? "opacity-100" : "opacity-40"
                }`}
              >
                {/* Phone for this feature */}
                <div className="flex justify-center mb-6">
                  <PhoneFrame className="scale-[0.8] sm:scale-90 origin-top">
                    <div className="absolute inset-0" key={`mobile-screen-${i}`}>
                      <Screen />
                    </div>
                  </PhoneFrame>
                </div>

                {/* Feature description */}
                <div className="text-center max-w-md mx-auto px-2">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        activeIndex === i ? "bg-[#4A9FFF]/15" : "bg-white/5"
                      }`}
                    >
                      <feature.icon
                        className={`w-5 h-5 ${
                          activeIndex === i ? "text-[#4A9FFF]" : "text-white/30"
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <span className="font-mono text-[10px] text-[#4A9FFF]/50 block">
                        {feature.num}
                      </span>
                      <h3
                        className={`text-lg font-medium ${
                          activeIndex === i ? "text-white" : "text-white/40"
                        }`}
                      >
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-light leading-relaxed ${
                      activeIndex === i ? "text-white/60" : "text-white/25"
                    }`}
                  >
                    {feature.desc}
                  </p>
                  <p
                    className={`text-xs font-light mt-2 leading-relaxed ${
                      activeIndex === i ? "text-[#4A9FFF]/60" : "text-[#4A9FFF]/20"
                    }`}
                  >
                    {feature.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
