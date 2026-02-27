"use client";

import {
  CheckCircle2,
  TrendingUp,
  Target,
  Brain,
  BarChart3,
  Zap,
  Flame,
  Sparkles,
  Calendar,
  Circle,
} from "lucide-react";

function ScreenHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-3 pb-2 phone-item-enter" style={{ animationDelay: "0ms" }}>
      <div className="w-7 h-7 rounded-lg bg-[#4A9FFF]/15 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-[#4A9FFF]" />
      </div>
      <span className="text-sm font-medium text-white">{title}</span>
    </div>
  );
}

function MiniProgressBar({ value, color = "#4A9FFF", delay = 300 }: { value: number; color?: string; delay?: number }) {
  return (
    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full animate-progress-fill"
        style={{ "--progress-width": `${value}%`, backgroundColor: color, animationDelay: `${delay}ms` } as React.CSSProperties}
      />
    </div>
  );
}

// Screen 1: Task Management — items slide in staggered, checkboxes tick
export function TaskScreen() {
  const tasks = [
    { title: "Revisar proposta do cliente", priority: "high", category: "Trabalho", categoryColor: "#4A9FFF", done: true },
    { title: "Preparar apresentação Q1", priority: "high", category: "Trabalho", categoryColor: "#4A9FFF", done: false },
    { title: "Responder e-mails pendentes", priority: "medium", category: "Pessoal", categoryColor: "#10b981", done: false },
    { title: "Atualizar portfólio", priority: "low", category: "Pessoal", categoryColor: "#10b981", done: false },
    { title: "Reunião com equipe", priority: "medium", category: "Trabalho", categoryColor: "#4A9FFF", done: true },
  ];

  const priorityColor = (p: string) =>
    p === "high" ? "#ef4444" : p === "medium" ? "#eab308" : "#22c55e";

  return (
    <div className="h-full bg-[#1A1A2E] phone-screen-content">
      <ScreenHeader icon={CheckCircle2} title="Tarefas" />
      <div className="px-3 pb-4 space-y-2">
        {tasks.map((t, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.06] phone-item-enter"
            style={{ animationDelay: `${150 + i * 120}ms` }}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                t.done ? "bg-[#4A9FFF] border-[#4A9FFF]" : "border-white/20"
              }`}
            >
              {t.done && (
                <CheckCircle2
                  className="w-2.5 h-2.5 text-white check-tick-enter"
                  style={{ animationDelay: `${350 + i * 120}ms` }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className={`text-xs font-medium block truncate ${
                  t.done ? "line-through text-white/30" : "text-white/80"
                }`}
              >
                {t.title}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Circle
                  className="w-2 h-2"
                  style={{ fill: priorityColor(t.priority), color: priorityColor(t.priority) }}
                />
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: `${t.categoryColor}20`, color: t.categoryColor }}
                >
                  {t.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Screen 2: Habit Tracking — habit cards slide in, day cells fill one by one
export function HabitScreen() {
  const habits = [
    { name: "Meditação", color: "#8b5cf6", streak: 12, days: [true, true, true, true, true, false, false] },
    { name: "Exercício", color: "#10b981", streak: 5, days: [true, true, false, true, true, true, false] },
    { name: "Leitura", color: "#f59e0b", streak: 8, days: [true, true, true, true, false, false, false] },
  ];
  const dayLabels = ["S", "T", "Q", "Q", "S", "S", "D"];

  return (
    <div className="h-full bg-[#1A1A2E] phone-screen-content">
      <ScreenHeader icon={TrendingUp} title="Hábitos" />
      <div className="px-3 pb-4 space-y-2.5">
        {habits.map((h, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.06] phone-item-enter"
            style={{ animationDelay: `${150 + i * 200}ms` }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color }} />
                <span className="text-xs font-medium text-white/80">{h.name}</span>
              </div>
              <span
                className="text-[9px] bg-orange-500/15 text-orange-400 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 stat-pop-enter"
                style={{ animationDelay: `${400 + i * 200}ms` }}
              >
                <Flame className="w-2 h-2" />
                {h.streak}d
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {h.days.map((done, d) => (
                <div key={d} className="text-center">
                  <span className="text-[8px] text-white/30 block mb-0.5">{dayLabels[d]}</span>
                  <div
                    className={`w-6 h-6 mx-auto rounded-md text-[9px] flex items-center justify-center font-medium ${
                      done ? "bg-[#4A9FFF] text-white day-fill-enter" : "bg-white/[0.06] text-white/20"
                    }`}
                    style={done ? { animationDelay: `${500 + i * 200 + d * 60}ms` } : undefined}
                  >
                    {done ? "✓" : d + 14}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Screen 3: Smart Goals — cards slide in, progress bars fill
export function GoalScreen() {
  const goals = [
    { title: "Completar curso de React", progress: 75, status: "Em progresso", period: "Mensal" },
    { title: "Ler 2 livros", progress: 50, status: "Em progresso", period: "Mensal" },
    { title: "Correr 20km", progress: 100, status: "Alcançada", period: "Semanal" },
  ];

  return (
    <div className="h-full bg-[#1A1A2E] phone-screen-content">
      <ScreenHeader icon={Target} title="Metas" />
      <div className="px-3 pb-4 space-y-2.5">
        {goals.map((g, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.06] phone-item-enter"
            style={{ animationDelay: `${150 + i * 180}ms` }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-white/80 truncate flex-1">{g.title}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-md stat-pop-enter ${
                  g.status === "Alcançada"
                    ? "bg-green-500/15 text-green-400"
                    : "bg-[#4A9FFF]/15 text-[#4A9FFF]"
                }`}
                style={{ animationDelay: `${350 + i * 180}ms` }}
              >
                {g.status}
              </span>
              <span className="text-[9px] text-white/30">{g.period}</span>
            </div>
            <div className="flex items-center gap-2">
              <MiniProgressBar
                value={g.progress}
                color={g.progress === 100 ? "#22c55e" : "#4A9FFF"}
                delay={450 + i * 180}
              />
              <span
                className="text-[10px] text-white/50 font-medium w-8 text-right stat-pop-enter"
                style={{ animationDelay: `${550 + i * 180}ms` }}
              >
                {g.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Screen 4: AI Coach — chat bubbles appear one by one with typing feel
export function CoachScreen() {
  const messages = [
    { from: "ai", text: "Bom dia! Vi que você completou 94% das tarefas essa semana. Excelente!" },
    { from: "user", text: "Obrigado! Alguma dica para manter o ritmo?" },
    { from: "ai", text: "Seu pico de foco é entre 9h-11h. Tente agendar tarefas difíceis nesse horário. E continue com a meditação matinal — faz diferença nos seus dados!" },
  ];

  return (
    <div className="h-full bg-[#1A1A2E] phone-screen-content flex flex-col">
      <ScreenHeader icon={Brain} title="Coach IA" />
      <div className="flex-1 px-3 pb-3 space-y-2 flex flex-col justify-end">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex chat-bubble-enter ${m.from === "user" ? "justify-end" : "justify-start"}`}
            style={{ animationDelay: `${300 + i * 500}ms` }}
          >
            <div
              className={`max-w-[85%] p-2.5 rounded-xl text-[10px] leading-relaxed ${
                m.from === "user"
                  ? "bg-[#4A9FFF] text-white rounded-br-sm"
                  : "bg-white/[0.07] text-white/70 rounded-bl-sm border border-white/[0.06]"
              }`}
            >
              {m.from === "ai" && (
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#4A9FFF]" />
                  <span className="text-[8px] text-[#4A9FFF] font-medium">Coach IA</span>
                </div>
              )}
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Screen 5: Weekly Reports — stats pop in, cards slide in
export function ReportScreen() {
  return (
    <div className="h-full bg-[#1A1A2E] phone-screen-content">
      <ScreenHeader icon={BarChart3} title="Relatório Semanal" />
      <div className="px-3 pb-4 space-y-2.5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { value: "94%", label: "Tarefas", icon: CheckCircle2 },
            { value: "86%", label: "Hábitos", icon: TrendingUp },
            { value: "3/4", label: "Metas", icon: Target },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white/[0.05] rounded-xl p-2.5 text-center border border-white/[0.06] phone-item-enter"
              style={{ animationDelay: `${150 + i * 100}ms` }}
            >
              <s.icon className="w-3 h-3 text-[#4A9FFF] mx-auto mb-1" />
              <div
                className="text-sm font-medium text-[#4A9FFF] stat-pop-enter"
                style={{ animationDelay: `${350 + i * 100}ms` }}
              >
                {s.value}
              </div>
              <div className="text-[8px] text-white/30 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        {/* AI Insight */}
        <div
          className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.06] phone-item-enter"
          style={{ animationDelay: "550ms" }}
        >
          <div className="flex items-center gap-1 mb-1.5">
            <Sparkles className="w-2.5 h-2.5 text-[#4A9FFF]" />
            <span className="text-[9px] text-[#4A9FFF] font-medium">Insight da IA</span>
          </div>
          <p className="text-[10px] text-white/60 leading-relaxed">
            &ldquo;Você completou 15% mais tarefas de alta prioridade esta semana. Seu pico de foco é entre 9h-11h.&rdquo;
          </p>
        </div>
        {/* Recommendations */}
        <div
          className="p-3 rounded-xl bg-[#4A9FFF]/[0.08] border border-[#4A9FFF]/[0.12] phone-item-enter"
          style={{ animationDelay: "700ms" }}
        >
          <span className="text-[9px] text-[#4A9FFF] font-medium block mb-1.5">Recomendações</span>
          <ul className="space-y-1">
            {["Agendar tarefas difíceis entre 9h-11h", "Manter streak de meditação"].map((r, i) => (
              <li
                key={i}
                className="text-[9px] text-white/50 flex items-center gap-1.5 phone-item-enter"
                style={{ animationDelay: `${800 + i * 100}ms` }}
              >
                <div className="w-1 h-1 rounded-full bg-[#4A9FFF]" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Screen 6: Dashboard Overview — cards slide in, progress fills, items appear
export function DashboardScreen() {
  return (
    <div className="h-full bg-[#1A1A2E] phone-screen-content">
      <ScreenHeader icon={Zap} title="Dashboard" />
      <div className="px-3 pb-4 space-y-2">
        {/* Welcome */}
        <div
          className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.06] phone-item-enter"
          style={{ animationDelay: "100ms" }}
        >
          <span className="text-[10px] text-white/40">Olá,</span>
          <span className="text-xs font-medium text-white ml-1">Usuário!</span>
        </div>
        {/* Weekly overview */}
        <div
          className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.06] phone-item-enter"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-white/40 flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" /> Visão Semanal
            </span>
            <span
              className="text-[9px] text-white/60 font-medium stat-pop-enter"
              style={{ animationDelay: "500ms" }}
            >
              12/15 tarefas
            </span>
          </div>
          <MiniProgressBar value={80} delay={550} />
        </div>
        {/* Today tasks */}
        <div
          className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.06] phone-item-enter"
          style={{ animationDelay: "400ms" }}
        >
          <span className="text-[9px] text-white/40 mb-1.5 block">Tarefas de Hoje</span>
          {["Revisar proposta", "Reunião 14h", "Enviar relatório"].map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 py-1 phone-item-enter"
              style={{ animationDelay: `${600 + i * 100}ms` }}
            >
              <div className="w-3 h-3 rounded-full border border-white/20" />
              <span className="text-[9px] text-white/60">{t}</span>
            </div>
          ))}
        </div>
        {/* Habits mini */}
        <div
          className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.06] phone-item-enter"
          style={{ animationDelay: "550ms" }}
        >
          <span className="text-[9px] text-white/40 mb-1.5 block">Hábitos</span>
          <div className="flex gap-1">
            {[true, true, true, true, false, false, false].map((done, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-md text-[8px] flex items-center justify-center ${
                  done
                    ? "bg-[#4A9FFF] text-white day-fill-enter"
                    : "bg-white/[0.06] text-white/20"
                }`}
                style={done ? { animationDelay: `${750 + i * 80}ms` } : undefined}
              >
                {done ? "✓" : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const phoneScreens = [
  TaskScreen,
  HabitScreen,
  GoalScreen,
  CoachScreen,
  ReportScreen,
  DashboardScreen,
];
