import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import {
  CheckCircle2,
  Play,
  FileText,
  Target,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  ChevronRight,
  Star,
  BookOpen,
  Trophy,
  Flame,
  Users,
} from "lucide-react";

const DAYS = [
  { day: 1, title: "Clareza de Proposito", desc: "Defina suas 3 metas para 90 dias com o framework de priorizacao" },
  { day: 2, title: "Auditoria de Tempo", desc: "Descubra para onde vai seu tempo e recupere horas invisiveis" },
  { day: 3, title: "Sistema de Prioridades", desc: "Domine a Matriz de Eisenhower e separe urgente de importante" },
  { day: 4, title: "Rotina Matinal", desc: "Crie uma rotina que prepara seu cerebro para alta performance" },
  { day: 5, title: "Deep Work", desc: "Aprenda a tecnica dos blocos de 90 minutos de foco total" },
  { day: 6, title: "Habitos Atomicos", desc: "Construa micro-habitos que se mantem usando ciencia comportamental" },
  { day: 7, title: "Seu Sistema Pessoal", desc: "Monte seu sistema completo de produtividade no Pulse" },
];

const INCLUDES = [
  { icon: Play, label: "7 video-aulas exclusivas" },
  { icon: FileText, label: "PDFs e materiais de apoio" },
  { icon: Target, label: "Desafio pratico diario" },
  { icon: BookOpen, label: "Conteudo escrito complementar" },
  { icon: Trophy, label: "Bonus exclusivo ao completar" },
  { icon: Flame, label: "Acesso vitalicio ao conteudo" },
];

const FAQS = [
  {
    q: "Preciso de experiencia previa com produtividade?",
    a: "Nao! O desafio foi criado para todos os niveis. Cada dia tem instrucoes claras e praticas.",
  },
  {
    q: "Quanto tempo preciso dedicar por dia?",
    a: "Cerca de 30-60 minutos. O video dura ~15 minutos e o desafio pratico leva de 15 a 45 minutos.",
  },
  {
    q: "Posso fazer no meu ritmo?",
    a: "Sim! O conteudo desbloqueia ao completar cada dia, mas nao ha limite de tempo entre os dias.",
  },
  {
    q: "E se eu nao gostar?",
    a: "Voce tem 7 dias de garantia incondicional. Se nao gostar, devolvemos 100% do valor.",
  },
  {
    q: "O que ganho ao completar o desafio?",
    a: "Alem de um sistema de produtividade completo, voce recebe um bonus exclusivo + oferta especial do Pulse Pro.",
  },
];

export default function DesafioLandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-light tracking-tight text-[#1A1A2E]">
              pulse
            </Link>
            <Link href="/desafio/checkout">
              <Button className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full px-6 text-sm">
                Quero Participar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <ScrollReveal>
            <span className="inline-block bg-[#4A9FFF]/10 text-[#4A9FFF] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              Desafio de 7 Dias
            </span>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#1A1A2E] mb-6 leading-[1.1]">
              Transforme sua{" "}
              <span className="text-gradient font-normal">produtividade</span>
              <br />
              em 7 dias.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-lg text-[#718096] font-light max-w-[600px] mx-auto mb-8 leading-relaxed">
              Um metodo passo a passo com video-aulas, materiais de apoio e desafios praticos
              para voce parar de ser ocupado e comecar a ser produtivo de verdade.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/desafio/checkout">
                <Button
                  size="lg"
                  className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full px-8 text-base btn-pulse gap-2"
                >
                  Comecar o Desafio — R$97
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <span className="text-sm text-[#718096] font-light flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Garantia de 7 dias
              </span>
            </div>
          </ScrollReveal>

          {/* Social proof */}
          <ScrollReveal delay={400}>
            <div className="flex items-center justify-center gap-6 text-sm text-[#718096]">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#4A9FFF]" />
                <span className="font-light">Para empreendedores e profissionais</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#4A9FFF]" />
                <span className="font-light">~30 min/dia</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-[#1A1A2E] mb-3">
                O que voce vai receber
              </h2>
              <p className="text-[#718096] font-light">
                Tudo que voce precisa para transformar sua rotina em 7 dias
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INCLUDES.map(({ icon: Icon, label }, i) => (
              <ScrollReveal key={label} delay={i * 80}>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F5F7FA] border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-[#4A9FFF]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#4A9FFF]" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A2E]">{label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Day Timeline */}
      <section className="py-20 px-6" id="roadmap">
        <div className="max-w-[700px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-light text-[#1A1A2E] mb-3">
                Roadmap dos 7 dias
              </h2>
              <p className="text-[#718096] font-light">
                Cada dia constroi sobre o anterior, criando um sistema completo
              </p>
            </div>
          </ScrollReveal>

          {/* Vertical timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-[#4A9FFF]/30 via-[#4A9FFF]/15 to-transparent" />

            <div className="space-y-6">
              {DAYS.map(({ day, title, desc }, i) => (
                <ScrollReveal key={day} delay={i * 100}>
                  <div className="relative flex items-start gap-5 group">
                    {/* Timeline dot */}
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-[#4A9FFF]/20 flex items-center justify-center shrink-0 group-hover:border-[#4A9FFF]/50 transition-colors">
                      <span className="text-sm font-medium text-[#4A9FFF]">
                        {day}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 flex-1 group-hover:border-[#4A9FFF]/20 group-hover:shadow-sm transition-all">
                      <h3 className="font-medium text-[#1A1A2E] mb-1">
                        {title}
                      </h3>
                      <p className="text-sm text-[#718096] font-light">
                        {desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}

              {/* Bonus day */}
              <ScrollReveal delay={800}>
                <div className="relative flex items-start gap-5">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-[#4A9FFF] flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-[#4A9FFF]/5 rounded-xl border border-[#4A9FFF]/20 p-5 flex-1">
                    <h3 className="font-medium text-[#1A1A2E] mb-1">
                      Bonus Exclusivo
                    </h3>
                    <p className="text-sm text-[#718096] font-light">
                      Complete os 7 dias e desbloqueie um bonus especial + oferta exclusiva do Pulse Pro
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[800px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-[#1A1A2E] mb-3">
                Para quem e esse desafio?
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Empreendedores que se sentem sobrecarregados",
              "Profissionais que querem fazer mais em menos tempo",
              "Freelancers buscando organizar sua rotina",
              "Qualquer pessoa cansada de ser ocupada sem ser produtiva",
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F5F7FA]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-[#1A1A2E] font-light">{item}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 px-6">
        <div className="max-w-[600px] mx-auto">
          <ScrollReveal>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <Shield className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-medium text-[#1A1A2E] mb-2">
                Garantia de 7 dias
              </h3>
              <p className="text-[#718096] font-light leading-relaxed">
                Se por qualquer motivo voce nao gostar do desafio, basta enviar um email
                dentro de 7 dias e devolvemos 100% do valor. Sem perguntas, sem burocracia.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[700px] mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-light text-[#1A1A2E] mb-10 text-center">
              Perguntas frequentes
            </h2>
          </ScrollReveal>

          <div className="space-y-4">
            {FAQS.map(({ q, a }, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-[#F5F7FA] rounded-xl p-5">
                  <h4 className="font-medium text-[#1A1A2E] mb-2 flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-[#4A9FFF] shrink-0 mt-1" />
                    {q}
                  </h4>
                  <p className="text-sm text-[#718096] font-light ml-6">{a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-[600px] mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-light text-[#1A1A2E] mb-4">
              Pronto para transformar sua produtividade?
            </h2>
            <p className="text-[#718096] font-light mb-8">
              7 dias. 7 video-aulas. 7 desafios praticos. 1 sistema completo.
            </p>
            <Link href="/desafio/checkout">
              <Button
                size="lg"
                className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full px-10 text-base btn-pulse gap-2"
              >
                Comecar Agora — R$97
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <p className="text-xs text-[#718096] mt-4 font-light">
              Pagamento unico. Garantia de 7 dias. Acesso vitalicio.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between text-xs text-[#718096]">
          <span className="font-light">pulse — Produtividade Intencional</span>
          <div className="flex gap-4">
            <Link href="/termos" className="hover:text-[#1A1A2E] transition-colors">
              Termos
            </Link>
            <Link href="/privacidade" className="hover:text-[#1A1A2E] transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
