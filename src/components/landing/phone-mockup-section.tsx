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

// Fan card slot positions — desktop (full-size phone)
const desktopSlots: Record<
  number,
  { rotate: number; x: number; y: number; scale: number; opacity: number }
> = {
  [-2]: { rotate: -16, x: -200, y: 20, scale: 0.55, opacity: 0.25 },
  [-1]: { rotate: -7, x: -110, y: 8, scale: 0.65, opacity: 0.45 },
  1: { rotate: 6, x: 100, y: 5, scale: 0.68, opacity: 0.5 },
  2: { rotate: 14, x: 175, y: 15, scale: 0.58, opacity: 0.35 },
  3: { rotate: 20, x: 235, y: 30, scale: 0.48, opacity: 0.2 },
};

// Fan card slot positions — mobile (scaled-down phone)
const mobileSlots: Record<
  number,
  { rotate: number; x: number; y: number; scale: number; opacity: number }
> = {
  [-2]: { rotate: -14, x: -85, y: 15, scale: 0.4, opacity: 0.2 },
  [-1]: { rotate: -6, x: -45, y: 5, scale: 0.5, opacity: 0.35 },
  1: { rotate: 5, x: 42, y: 3, scale: 0.52, opacity: 0.4 },
  2: { rotate: 12, x: 80, y: 12, scale: 0.42, opacity: 0.25 },
  3: { rotate: 17, x: 110, y: 20, scale: 0.35, opacity: 0.15 },
};

function getFanSlot(
  itemIndex: number,
  activeIndex: number,
  total: number
): number | null {
  const diff = ((itemIndex - activeIndex) % total + total) % total;
  if (diff === 0) return null; // active — shown in phone
  if (diff <= Math.ceil((total - 1) / 2)) return diff; // right side
  return diff - total; // left side (negative)
}

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

  // Mobile observer — rootMargin focuses on lower viewport (below sticky phone)
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
        rootMargin: "-50% 0px -20% 0px",
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

  const renderFanCards = (
    slots: Record<
      number,
      { rotate: number; x: number; y: number; scale: number; opacity: number }
    >,
    cardClass: string,
    iconClass: string,
    textClass: string
  ) => {
    return features.map((feature, i) => {
      const slot = getFanSlot(i, activeIndex, features.length);
      if (slot === null) return null;
      const pos = slots[slot];
      if (!pos) return null;
      const Icon = feature.icon;
      return (
        <div
          key={`fan-${feature.num}`}
          className="fan-card"
          style={{
            transform: `translate(-50%, -50%) translateX(${pos.x}px) translateY(${pos.y}px) rotate(${pos.rotate}deg) scale(${pos.scale})`,
            opacity: pos.opacity,
          }}
        >
          <div
            className={`${cardClass} rounded-[20px] bg-white/[0.06] border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center gap-2`}
          >
            <div
              className={`${iconClass} rounded-xl bg-[#4A9FFF]/15 flex items-center justify-center`}
            >
              <Icon className="w-5 h-5 text-[#4A9FFF]" />
            </div>
            <span
              className={`${textClass} text-white/80 font-medium text-center px-2 leading-tight`}
            >
              {feature.title}
            </span>
            <span className="font-mono text-[9px] text-[#4A9FFF]/40">
              {feature.num}
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <section
      id="funcionalidades"
      className="py-24 sm:py-32 px-6 bg-[#1A1A2E] relative overflow-x-clip"
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

          {/* Right: sticky phone + fan cards */}
          <div className="sticky top-32 flex justify-center pb-16 overflow-visible">
            <div className="relative">
              {/* Fan cards behind phone */}
              {renderFanCards(
                desktopSlots,
                "w-[140px] h-[200px]",
                "w-12 h-12",
                "text-xs"
              )}
              {/* Phone in front */}
              <div className="relative z-10">
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
          </div>
        </div>

        {/* =================== MOBILE LAYOUT (<lg) — carousel style =================== */}
        <div className="lg:hidden">
          {/* Sticky phone — single phone that transitions between screens */}
          <div className="sticky top-14 z-30 bg-[#1A1A2E] pt-2 pb-1 overflow-visible">
            <div className="flex justify-center overflow-visible">
              <div className="h-[315px] sm:h-[398px] relative">
                {/* Fan cards behind phone */}
                {renderFanCards(
                  mobileSlots,
                  "w-[100px] h-[140px]",
                  "w-10 h-10",
                  "text-[10px]"
                )}
                {/* Phone in front */}
                <div className="relative z-10">
                  <PhoneFrame className="scale-[0.55] sm:scale-[0.65] origin-top">
                    {PreviousScreen && (
                      <div className="absolute inset-0 phone-screen-exit z-0">
                        <PreviousScreen />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 phone-screen-enter z-10"
                      key={`mobile-${activeIndex}`}
                    >
                      <ActiveScreen />
                    </div>
                  </PhoneFrame>
                </div>
              </div>
            </div>
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-1">
              {features.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? "w-6 bg-[#4A9FFF]"
                      : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-[#1A1A2E] to-transparent translate-y-full pointer-events-none" />
          </div>

          {/* Feature descriptions — scroll sentinels drive phone transitions */}
          <div className="space-y-3 mt-6 px-2">
            {features.map((feature, i) => (
              <div
                key={feature.num}
                ref={(el) => {
                  mobileFeatureRefs.current[i] = el;
                }}
                data-feature-index={i}
                className={`min-h-[160px] p-5 rounded-2xl border transition-all duration-500 ${
                  activeIndex === i
                    ? "bg-white/[0.06] border-[#4A9FFF]/20"
                    : "bg-white/[0.02] border-white/[0.05] opacity-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeIndex === i ? "bg-[#4A9FFF]/15" : "bg-white/5"
                    }`}
                  >
                    <feature.icon
                      className={`w-5 h-5 transition-colors ${
                        activeIndex === i ? "text-[#4A9FFF]" : "text-white/30"
                      }`}
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#4A9FFF]/50 block">
                      {feature.num}
                    </span>
                    <h3
                      className={`text-base font-medium transition-colors ${
                        activeIndex === i ? "text-white" : "text-white/40"
                      }`}
                    >
                      {feature.title}
                    </h3>
                  </div>
                </div>
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
