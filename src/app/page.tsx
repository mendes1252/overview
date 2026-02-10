import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Target,
  TrendingUp,
  Brain,
  BarChart3,
  Zap,
  ArrowRight,
  Quote,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-dark z-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <span className="text-xl font-light tracking-tight text-white">
              pulse
            </span>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full btn-pulse px-6">
                  Comecar Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dark */}
      <section className="relative gradient-hero min-h-screen flex items-center overflow-hidden">
        {/* Breathing glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-radial-glow animate-breathe pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-full text-sm font-light tracking-wider mb-8 animate-slideDown">
            <Zap className="w-4 h-4 text-[#4A9FFF]" />
            Produtividade Intencional
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-[120px] font-light text-white leading-[0.9] tracking-[-0.03em] mb-8 animate-slideUp">
            Nao faca<br />
            <span className="text-gradient font-medium">mais.</span><br />
            Faca <span className="text-gradient font-medium">melhor.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed animate-fadeIn">
            O pulse combina gestao de tarefas, habitos e metas com IA empatica
            que entende seus padroes e transforma dados em acao.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
            <Link href="/cadastro">
              <Button size="lg" className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full btn-pulse gap-2 text-base px-8 py-6 font-semibold">
                Comecar Gratis <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#funcionalidades">
              <Button size="lg" variant="outline" className="rounded-full border-2 border-[#4A9FFF] text-[#4A9FFF] hover:bg-[#4A9FFF] hover:text-white px-8 py-6 text-base font-medium bg-transparent">
                Como Funciona
              </Button>
            </Link>
          </div>

          <p className="text-sm text-white/40 mt-6 font-light">
            Sem cartao de credito. Cancele quando quiser.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-20">
            <div>
              <div className="text-3xl sm:text-4xl font-light text-[#4A9FFF]">87%</div>
              <div className="text-xs sm:text-sm text-white/40 font-light mt-1">mais produtividade</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-light text-[#4A9FFF]">3x</div>
              <div className="text-xs sm:text-sm text-white/40 font-light mt-1">mais consistencia</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-light text-[#4A9FFF]">92%</div>
              <div className="text-xs sm:text-sm text-white/40 font-light mt-1">satisfacao com IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="funcionalidades" className="py-24 sm:py-32 px-6 bg-[#F5F7FA]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-light text-[#1A1A2E] leading-tight tracking-[-0.02em] mb-4">
              Tudo que voce precisa.<br />
              <span className="text-gradient font-medium">Nada que nao precisa.</span>
            </h2>
            <p className="text-lg text-[#718096] max-w-2xl mx-auto font-light">
              Ferramentas essenciais combinadas com inteligencia artificial
              para maximizar seu potencial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle2,
                title: "Gestao de Tarefas",
                desc: "Organize suas tarefas com prioridades, categorias e prazos. Sem ruido, so clareza.",
              },
              {
                icon: TrendingUp,
                title: "Rastreamento de Habitos",
                desc: "Construa habitos com streaks e visualizacao de progresso. Consistencia gera resultados.",
              },
              {
                icon: Target,
                title: "Metas Inteligentes",
                desc: "Defina metas semanais, mensais e trimestrais. Acompanhe em tempo real.",
              },
              {
                icon: Brain,
                title: "Coach de IA",
                desc: "Coaching personalizado que entende seus padroes e sugere melhorias reais.",
              },
              {
                icon: BarChart3,
                title: "Relatorios com IA",
                desc: "Relatorios semanais com insights, padroes e recomendacoes gerados automaticamente.",
              },
              {
                icon: Zap,
                title: "Performance",
                desc: "Dashboard completo com visao da semana, metricas e proximos passos.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 sm:p-10 rounded-3xl border border-black/[0.04] bg-white card-hover"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#4A9FFF]/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-[#4A9FFF]" />
                </div>
                <h3 className="text-xl sm:text-[22px] font-medium text-[#1A1A2E] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#718096] font-light leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section - Dark */}
      <section className="py-24 sm:py-32 px-6 gradient-hero relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] gradient-radial-glow animate-breathe pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-[#4A9FFF] px-4 py-2 rounded-full text-sm font-light tracking-wider mb-8">
            <Brain className="w-4 h-4" />
            Inteligencia Artificial
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-light text-white leading-tight tracking-[-0.02em] mb-6">
            Dados viram <span className="text-gradient font-medium">acao.</span>
          </h2>

          <p className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            Nossa IA analisa seus padroes semanais e gera relatorios com insights
            acionaveis, celebra conquistas e sugere melhorias especificas.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Analise de padroes", desc: "IA identifica seus ciclos de produtividade" },
              { label: "Sugestoes proativas", desc: "Recomendacoes baseadas em seus dados reais" },
              { label: "Coach personalizado", desc: "Tom adaptado ao seu perfil e estilo" },
            ].map((item) => (
              <div key={item.label} className="card-dark rounded-2xl p-6 text-left">
                <h4 className="text-white font-medium mb-2">{item.label}</h4>
                <p className="text-white/50 text-sm font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 sm:py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="w-10 h-10 text-[#4A9FFF]/30 mx-auto mb-8" />
          <blockquote className="text-2xl sm:text-3xl font-light text-[#1A1A2E] leading-relaxed mb-8 tracking-[-0.01em]">
            &ldquo;O pulse mudou minha relacao com produtividade. Nao e sobre fazer mais,
            e sobre fazer o que importa.&rdquo;
          </blockquote>
          <div className="text-[#718096] font-light">
            <span className="font-medium text-[#1A1A2E]">Maria Silva</span> — Product Designer
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 sm:py-32 px-6 bg-[#F5F7FA]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-light text-[#1A1A2E] leading-tight tracking-[-0.02em] mb-4">
              Simples. <span className="text-gradient font-medium">Transparente.</span>
            </h2>
            <p className="text-lg text-[#718096] font-light">
              Comece gratis e evolua quando estiver pronto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 sm:p-10 rounded-3xl border border-black/[0.04] bg-white">
              <h3 className="text-2xl font-medium text-[#1A1A2E] mb-2">Gratuito</h3>
              <p className="text-[#718096] font-light mb-6">Para comecar sua jornada</p>
              <div className="mb-8">
                <span className="text-5xl font-light text-[#1A1A2E]">R$0</span>
                <span className="text-[#718096] font-light">/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Ate 10 tarefas ativas", "Ate 3 habitos", "1 meta por periodo", "Relatorios mensais"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[#718096] font-light">
                    <CheckCircle2 className="w-5 h-5 text-[#4A9FFF] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/cadastro">
                <Button variant="outline" className="w-full rounded-full border-2 border-[#4A9FFF] text-[#4A9FFF] hover:bg-[#4A9FFF] hover:text-white py-6 text-base font-medium" size="lg">
                  Comecar Gratis
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 sm:p-10 rounded-3xl border-2 border-[#4A9FFF] bg-white relative animate-pulse-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider">
                MAIS POPULAR
              </div>
              <h3 className="text-2xl font-medium text-[#1A1A2E] mb-2">Pro</h3>
              <p className="text-[#718096] font-light mb-6">Para quem leva produtividade a serio</p>
              <div className="mb-8">
                <span className="text-5xl font-light text-[#1A1A2E]">R$29,90</span>
                <span className="text-[#718096] font-light">/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Tarefas ilimitadas", "Habitos ilimitados", "Metas ilimitadas", "Relatorios semanais com IA", "Coach de IA personalizado", "Suporte prioritario"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[#718096] font-light">
                    <CheckCircle2 className="w-5 h-5 text-[#4A9FFF] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/checkout?plan=pro">
                <Button className="w-full bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full btn-pulse py-6 text-base font-semibold" size="lg">
                  Assinar Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 px-6 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 gradient-radial-glow animate-breathe pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-light text-white leading-tight tracking-[-0.02em] mb-6">
            Pronto para o seu<br /><span className="text-gradient font-medium">proximo nivel?</span>
          </h2>
          <p className="text-lg text-white/60 mb-10 font-light">
            Junte-se a quem ja transformou produtividade em intencao.
          </p>
          <Link href="/cadastro">
            <Button size="lg" className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full btn-pulse gap-2 text-base px-8 py-6 font-semibold">
              Comecar Agora — E Gratis <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#1A1A2E] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-lg font-light text-white/80 tracking-tight">
              pulse
            </span>
            <p className="text-white/30 text-sm font-light">
              2025 pulse. Simples. Vivo. Seu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
