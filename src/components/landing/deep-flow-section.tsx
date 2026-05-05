"use client";

import { useEffect, useRef, useState } from "react";
import { Brain, Shield, Zap, CheckCircle2, Clock, Users } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

// ─── Circadian Energy Chart ───────────────────────────────────────────────────

const W = 800;
const H = 200;

const hourlyEnergy = [
  { hour: 6, energy: 28 },
  { hour: 7, energy: 44 },
  { hour: 8, energy: 60 },
  { hour: 9, energy: 82 },
  { hour: 10, energy: 91 },
  { hour: 11, energy: 87 },
  { hour: 12, energy: 68 },
  { hour: 13, energy: 51 },
  { hour: 14, energy: 47 },
  { hour: 15, energy: 71 },
  { hour: 16, energy: 79 },
  { hour: 17, energy: 73 },
  { hour: 18, energy: 57 },
  { hour: 19, energy: 43 },
  { hour: 20, energy: 32 },
  { hour: 21, energy: 21 },
  { hour: 22, energy: 13 },
];

const SCALE = 1.52;
const BASE = 182;

const pts = hourlyEnergy.map((d, i) => ({
  x: (i / (hourlyEnergy.length - 1)) * W,
  y: BASE - d.energy * SCALE,
}));

function smoothPath(points: { x: number; y: number }[]): string {
  const n = points.length;
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

const linePath = smoothPath(pts);
const areaPath = linePath + ` L ${W} ${H} L 0 ${H} Z`;

// x positions for notable hours (0-indexed from hour 6)
const xAt = (hour: number) => ((hour - 6) / 16) * W;
const yAt = (hour: number) => {
  const idx = hour - 6;
  return BASE - hourlyEnergy[idx].energy * SCALE;
};

// "Now" is at 10h (morning peak) for the mockup
const NOW_X = xAt(10);
const NOW_Y = yAt(10);

const timeLabels = [6, 9, 12, 15, 18, 21];
const gridLines = [25, 50, 75];

// ─── Flow Guard messages ──────────────────────────────────────────────────────

const flowMessages = [
  {
    from: "user",
    text: "Adicionei mais 8 tarefas para hoje. Preciso terminar tudo.",
  },
  {
    from: "ai",
    text: "Vejo que você quer muito avançar hoje — e admiro isso. Mas com 13 tarefas de alta complexidade, o risco de fadiga cognitiva é alto.",
    highlight: true,
  },
  {
    from: "ai",
    text: "Sugiro focar nestas 3 que são realmente críticas agora:",
    tasks: ["Revisar arquitetura do módulo de pagamento", "Code review do PR #47", "Reunião com stakeholders às 15h"],
  },
];

// ─── Bio-Adaptive states ──────────────────────────────────────────────────────

const energyStates = [
  { label: "Baixa", emoji: "😴", color: "border-white/10 text-white/40", active: "border-[#6BB5FF]/40 text-[#6BB5FF] bg-[#4A9FFF]/5", hint: "Interface simplificada ativada — menos decisões, mais foco." },
  { label: "Média", emoji: "⚡", color: "border-white/10 text-white/40", active: "border-[#4A9FFF]/60 text-white bg-[#4A9FFF]/8", hint: "Modo equilibrado — visão completa com pausas sugeridas." },
  { label: "Alta", emoji: "🚀", color: "border-white/10 text-white/40", active: "border-[#4A9FFF] text-white bg-[#4A9FFF]/15", hint: "Modo Deep Work ativado — notificações silenciadas por 90min." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DeepFlowSection() {
  const [selectedEnergy, setSelectedEnergy] = useState(2);
  const [dotVisible, setDotVisible] = useState(true);
  const [lineProgress, setLineProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          let start: number | null = null;
          const dur = 1800;
          const tick = (ts: number) => {
            if (!start) start = ts;
            const t = Math.min((ts - start) / dur, 1);
            setLineProgress(t);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setDotVisible((v: boolean) => !v), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="deep-flow"
      className="py-24 sm:py-32 px-6 bg-[#1A1A2E] relative border-t border-white/5 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(74,159,255,0.18) 0%, transparent 70%)" }} />

      <div className="relative max-w-[1200px] mx-auto">
        {/* ── Section Header ────────────────────────────────────────────── */}
        <ScrollReveal>
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-[#4A9FFF] uppercase tracking-[0.18em] mb-6">
              <Zap className="w-3.5 h-3.5" />
              Pulse 2.0 · The Deep Flow System
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-light text-white leading-tight tracking-[-0.02em] mb-5">
              Alta performance não precisa<br />
              <span className="text-gradient font-medium">custar sua saúde mental.</span>
            </h2>
            <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
              O primeiro Sistema de Gestão de Energia humano. A IA entende seus ritmos biológicos
              e cria um ambiente que protege seu foco — e sua sanidade.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Circadian Energy Dashboard ────────────────────────────────── */}
        <ScrollReveal>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 mb-8 backdrop-blur-sm">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4A9FFF]/15 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#4A9FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3v1m0 16v1M3 12h1m16 0h1M5.6 5.6l.7.7m11.4-.7-.7.7M5.6 18.4l.7-.7m11.4.7-.7-.7" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Dashboard de Energia Circadiana</div>
                  <div className="text-white/30 text-xs font-light">Baseado no seu ritmo ultradiano</div>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4A9FFF]" />
                  <span className="text-xs text-white/50 font-light">Deep Work</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6BB5FF]/50" />
                  <span className="text-xs text-white/50 font-light">Reuniões</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="text-xs text-white/50 font-light">Descanso</span>
                </div>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="w-full overflow-hidden rounded-xl">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="w-full"
                style={{ height: "clamp(120px, 22vw, 200px)" }}
              >
                <defs>
                  {/* Area gradient */}
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A9FFF" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#4A9FFF" stopOpacity="0" />
                  </linearGradient>
                  {/* Line gradient */}
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4A9FFF" stopOpacity="0.3" />
                    <stop offset="30%" stopColor="#4A9FFF" stopOpacity="1" />
                    <stop offset="100%" stopColor="#6BB5FF" stopOpacity="0.6" />
                  </linearGradient>
                  {/* Clip for progress animation */}
                  <clipPath id="progressClip">
                    <rect x="0" y="0" width={W * lineProgress} height={H} />
                  </clipPath>
                  {/* Deep Work zone 1 gradient */}
                  <linearGradient id="zone1Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A9FFF" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#4A9FFF" stopOpacity="0" />
                  </linearGradient>
                  {/* Deep Work zone 2 gradient */}
                  <linearGradient id="zone2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A9FFF" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="#4A9FFF" stopOpacity="0" />
                  </linearGradient>
                  {/* Rest zone gradient */}
                  <linearGradient id="restGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#718096" stopOpacity="0.07" />
                    <stop offset="100%" stopColor="#718096" stopOpacity="0" />
                  </linearGradient>
                  {/* Dot glow */}
                  <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4A9FFF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#4A9FFF" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Grid lines */}
                {gridLines.map((level) => {
                  const gy = BASE - level * SCALE;
                  return (
                    <line
                      key={level}
                      x1={0} y1={gy} x2={W} y2={gy}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Zone: Deep Work Peak 1 (9h–11h) */}
                <rect
                  x={xAt(9)} y={0}
                  width={xAt(11) - xAt(9)} height={H}
                  fill="url(#zone1Grad)"
                />
                <line x1={xAt(9)} y1={0} x2={xAt(9)} y2={H} stroke="#4A9FFF" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={xAt(11)} y1={0} x2={xAt(11)} y2={H} stroke="#4A9FFF" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />

                {/* Zone: Post-lunch dip (13h–14h) */}
                <rect
                  x={xAt(13)} y={0}
                  width={xAt(14) - xAt(13)} height={H}
                  fill="url(#restGrad)"
                />

                {/* Zone: Deep Work Peak 2 (15h–17h) */}
                <rect
                  x={xAt(15)} y={0}
                  width={xAt(17) - xAt(15)} height={H}
                  fill="url(#zone2Grad)"
                />
                <line x1={xAt(15)} y1={0} x2={xAt(15)} y2={H} stroke="#4A9FFF" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={xAt(17)} y1={0} x2={xAt(17)} y2={H} stroke="#4A9FFF" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />

                {/* Area fill (animated) */}
                <path
                  d={areaPath}
                  fill="url(#areaGrad)"
                  clipPath="url(#progressClip)"
                />

                {/* Line (animated) */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  clipPath="url(#progressClip)"
                />

                {/* Time axis labels */}
                {timeLabels.map((h) => (
                  <text
                    key={h}
                    x={xAt(h)}
                    y={H - 2}
                    fill="rgba(255,255,255,0.25)"
                    fontSize="11"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {h}h
                  </text>
                ))}

                {/* Zone labels */}
                <text
                  x={(xAt(9) + xAt(11)) / 2} y={16}
                  fill="#4A9FFF" fontSize="9" textAnchor="middle"
                  fontFamily="system-ui, sans-serif" fontWeight="600"
                  opacity={lineProgress > 0.3 ? 1 : 0}
                  style={{ transition: "opacity 0.5s" }}
                >
                  DEEP WORK
                </text>
                <text
                  x={(xAt(15) + xAt(17)) / 2} y={16}
                  fill="#6BB5FF" fontSize="9" textAnchor="middle"
                  fontFamily="system-ui, sans-serif" fontWeight="600"
                  opacity={lineProgress > 0.7 ? 1 : 0}
                  style={{ transition: "opacity 0.5s" }}
                >
                  2º PICO
                </text>
                <text
                  x={(xAt(13) + xAt(14)) / 2} y={yAt(13) - 10}
                  fill="rgba(113,128,150,0.8)" fontSize="8" textAnchor="middle"
                  fontFamily="system-ui, sans-serif"
                  opacity={lineProgress > 0.55 ? 1 : 0}
                  style={{ transition: "opacity 0.5s" }}
                >
                  RECARREGAR
                </text>

                {/* "Now" dot (at 10h) */}
                {lineProgress > 0.25 && (
                  <>
                    {/* Glow ring */}
                    <circle
                      cx={NOW_X} cy={NOW_Y} r={dotVisible ? 18 : 12}
                      fill="url(#dotGlow)"
                      style={{ transition: "r 0.8s ease" }}
                    />
                    {/* Outer ring */}
                    <circle
                      cx={NOW_X} cy={NOW_Y} r={6}
                      fill="none"
                      stroke="#4A9FFF"
                      strokeWidth="1.5"
                      strokeOpacity={dotVisible ? 0.6 : 0.2}
                      style={{ transition: "stroke-opacity 0.8s ease" }}
                    />
                    {/* Inner dot */}
                    <circle cx={NOW_X} cy={NOW_Y} r={3.5} fill="#4A9FFF" />
                    {/* "Agora" label */}
                    <text
                      x={NOW_X + 12} y={NOW_Y - 10}
                      fill="#4A9FFF" fontSize="10" fontWeight="600"
                      fontFamily="system-ui, sans-serif"
                    >
                      Agora
                    </text>
                  </>
                )}
              </svg>
            </div>

            {/* Insight strip */}
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-[#4A9FFF]/10 border border-[#4A9FFF]/20 rounded-full px-4 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4A9FFF] animate-pulse" />
                <span className="text-xs text-[#4A9FFF] font-medium">Pico de foco: 09h–11h</span>
              </div>
              <div className="flex items-center gap-2 bg-[#6BB5FF]/8 border border-[#6BB5FF]/15 rounded-full px-4 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6BB5FF]" />
                <span className="text-xs text-[#6BB5FF] font-medium">Reuniões ideais: 12h–14h</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <span className="text-xs text-white/40 font-medium">Pausa ultradiana: 13h–14h</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Bottom 3-column cards ─────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Flow Guard */}
          <ScrollReveal delay={0}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm h-full flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#4A9FFF]/15 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-[#4A9FFF]" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Flow Guard</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-emerald-400 font-light">AI Pilot ativo</span>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 space-y-3 text-sm">
                {flowMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-3 ${
                      msg.from === "user"
                        ? "bg-white/5 border border-white/8 ml-6"
                        : msg.highlight
                        ? "bg-[#4A9FFF]/10 border border-[#4A9FFF]/20"
                        : "bg-white/[0.04] border border-white/6"
                    }`}
                  >
                    {msg.from === "ai" && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Brain className="w-3 h-3 text-[#4A9FFF]" />
                        <span className="text-[10px] text-[#4A9FFF] font-semibold uppercase tracking-wider">Flow Guard</span>
                      </div>
                    )}
                    <p className={`leading-relaxed font-light ${msg.from === "user" ? "text-white/50 text-[12px]" : "text-white/70 text-[12px]"}`}>
                      {msg.text}
                    </p>
                    {msg.tasks && (
                      <ul className="mt-2 space-y-1.5">
                        {msg.tasks.map((task, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#4A9FFF] shrink-0 mt-0.5" />
                            <span className="text-[11px] text-white/60 font-light leading-snug">{task}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-[#4A9FFF]/15 hover:bg-[#4A9FFF]/25 border border-[#4A9FFF]/25 text-[#4A9FFF] text-[11px] font-medium rounded-xl py-2.5 transition-colors">
                  Sim, faz sentido ✓
                </button>
                <button className="px-3 bg-white/5 hover:bg-white/8 border border-white/10 text-white/40 text-[11px] rounded-xl py-2.5 transition-colors">
                  Ver todas
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Body Doubling */}
          <ScrollReveal delay={100}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm h-full flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Modo Body Doubling</div>
                  <div className="text-white/30 text-xs font-light">Para TDAH & foco profundo</div>
                </div>
              </div>

              {/* Session card */}
              <div className="flex-1 bg-white/[0.04] border border-white/8 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Sessão de Foco</span>
                  <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-full px-2.5 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-semibold">AO VIVO</span>
                  </div>
                </div>

                {/* Timer */}
                <div className="text-center py-4">
                  <div className="text-4xl font-light text-white tracking-[0.05em] font-mono">47:23</div>
                  <div className="text-xs text-white/30 font-light mt-1">de 90 min · ciclo ultradiano</div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#4A9FFF] to-[#6BB5FF]" style={{ width: "52%" }} />
                  </div>
                </div>

                {/* AI check-in */}
                <div className="bg-[#4A9FFF]/8 border border-[#4A9FFF]/15 rounded-xl p-3 mt-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Brain className="w-3 h-3 text-[#4A9FFF]" />
                    <span className="text-[9px] text-[#4A9FFF] font-semibold uppercase tracking-wider">Parceiro IA</span>
                  </div>
                  <p className="text-[11px] text-white/60 font-light leading-snug">
                    &ldquo;Ótimo progresso! Em mais 43 minutos sugiro uma pausa de 5 min.&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/30 font-light">
                <Clock className="w-3.5 h-3.5" />
                <span>Pausa sugerida às 16h05 · Respiração guiada disponível</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Bio-Adaptive Onboarding */}
          <ScrollReveal delay={200}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm h-full flex flex-col sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#6BB5FF]/15 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-[#6BB5FF]" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Onboarding Bio-Adaptativo</div>
                  <div className="text-white/30 text-xs font-light">Interface que se adapta a você</div>
                </div>
              </div>

              <p className="text-sm text-white/50 font-light mb-5 leading-relaxed">
                Como está sua energia <span className="text-white/70">hoje?</span>
              </p>

              {/* Energy selector */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {energyStates.map((state, i) => (
                  <button
                    key={state.label}
                    onClick={() => setSelectedEnergy(i)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all duration-300 ${
                      selectedEnergy === i ? state.active : state.color + " hover:border-white/20"
                    }`}
                  >
                    <span className="text-2xl">{state.emoji}</span>
                    <span className={`text-xs font-medium transition-colors ${selectedEnergy === i ? "" : "text-white/40"}`}>
                      {state.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Adaptive hint */}
              <div className="flex-1 bg-[#4A9FFF]/8 border border-[#4A9FFF]/15 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4A9FFF] animate-pulse" />
                  <span className="text-[10px] text-[#4A9FFF] font-semibold uppercase tracking-wider">Interface Adaptada</span>
                </div>
                <p className="text-xs text-white/60 font-light leading-relaxed">
                  {energyStates[selectedEnergy].hint}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Dark mode nativo", "Sem distrações", "Ciclos ultradianos"].map((tag) => (
                  <span key={tag} className="text-[10px] text-white/30 font-light bg-white/5 border border-white/8 rounded-full px-2.5 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
