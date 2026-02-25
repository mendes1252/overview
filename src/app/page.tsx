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
  Sparkles,
  Shield,
  Clock,
  ChevronRight,
  Star,
  Users,
  Mail,
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
            <div className="hidden sm:flex items-center gap-8">
              <Link href="#funcionalidades" className="text-sm text-white/50 hover:text-white transition-colors font-light">
                Funcionalidades
              </Link>
              <Link href="#como-funciona" className="text-sm text-white/50 hover:text-white transition-colors font-light">
                Como Funciona
              </Link>
              <Link href="#precos" className="text-sm text-white/50 hover:text-white transition-colors font-light">
                Preços
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full text-sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full btn-pulse px-5 text-sm">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative gradient-hero min-h-screen flex items-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-radial-glow animate-breathe pointer-events-none" />
        <div className="absolute top-20 right-10 w-2 h-2 rounded-full bg-[#4A9FFF]/30 animate-float" />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 rounded-full bg-[#6BB5FF]/20 animate-float delay-300" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-white/10 animate-float delay-500" />

        <div className="relative max-w-[1200px] mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-full text-sm font-light tracking-wider mb-10 animate-slideDown">
            <Zap className="w-3.5 h-3.5 text-[#4A9FFF]" />
            Produtividade Intencional
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-[110px] font-light text-white leading-[0.9] tracking-[-0.03em] mb-8 animate-slideUp">
            Não faça<br />
            <span className="text-gradient font-medium">mais.</span><br />
            Faça <span className="text-gradient font-medium">melhor.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-light leading-relaxed animate-fadeIn delay-200">
            Gestão de tarefas, hábitos e metas com IA que entende seus padrões
            e transforma dados em ação.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn delay-300">
            <Link href="/cadastro">
              <Button size="lg" className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full btn-pulse gap-2 text-base px-8 py-6 font-semibold">
                Começar Grátis <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#como-funciona">
              <Button size="lg" variant="outline" className="rounded-full border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-6 text-base font-light bg-transparent">
                Como Funciona
              </Button>
            </Link>
          </div>

          <p className="text-xs text-white/30 mt-6 font-light tracking-wide">
            Sem cartão de crédito. Cancele quando quiser.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 max-w-lg mx-auto mt-24">
            {[
              { value: "87%", label: "mais produtividade" },
              { value: "3x", label: "mais consistência" },
              { value: "92%", label: "satisfação com IA" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-4xl font-light text-white tracking-tight">{stat.value}</div>
                <div className="text-[11px] sm:text-xs text-white/30 font-light mt-2 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F7FA] to-transparent" />
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 px-6 bg-[#F5F7FA] border-b border-black/[0.04]">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-center text-xs text-[#718096]/60 font-light uppercase tracking-[0.2em] mb-6">
            Usado por profissionais que valorizam seu tempo
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16">
            {["Designers", "Desenvolvedores", "Empreendedores", "Gestores", "Freelancers"].map((role) => (
              <span key={role} className="text-sm text-[#718096]/40 font-light">
                {role}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="funcionalidades" className="py-24 sm:py-32 px-6 bg-[#F5F7FA] relative">
        <div className="absolute inset-0 bg-dot-pattern pointer-events-none" />
        <div className="relative max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block text-xs text-[#4A9FFF] font-medium uppercase tracking-[0.2em] mb-4">
              Funcionalidades
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-light text-[#1A1A2E] leading-tight tracking-[-0.02em] mb-5">
              Tudo que você precisa.<br />
              <span className="text-gradient font-medium">Nada que não precisa.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#718096] max-w-xl mx-auto font-light leading-relaxed">
              Ferramentas essenciais combinadas com inteligência artificial
              para maximizar seu potencial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: CheckCircle2, num: "01", title: "Gestão de Tarefas", desc: "Organize com prioridades, categorias e prazos. Recorrência automática para rotinas." },
              { icon: TrendingUp, num: "02", title: "Rastreamento de Hábitos", desc: "Streaks, visualização semanal e lembretes. Consistência gera resultados." },
              { icon: Target, num: "03", title: "Metas Inteligentes", desc: "Semanais, mensais e trimestrais com progresso em tempo real." },
              { icon: Brain, num: "04", title: "Coach de IA", desc: "Coaching personalizado que entende seus padrões e sugere melhorias reais." },
              { icon: BarChart3, num: "05", title: "Relatórios Semanais", desc: "Insights, padrões e recomendações gerados automaticamente por IA." },
              { icon: Zap, num: "06", title: "Dashboard Completo", desc: "Visão da semana, métricas consolidadas e próximos passos num só lugar." },
            ].map((feature) => (
              <div key={feature.title} className="group p-8 rounded-2xl border border-black/[0.04] bg-white card-hover relative">
                <span className="feature-number">{feature.num}</span>
                <div className="w-11 h-11 rounded-xl bg-[#4A9FFF]/10 flex items-center justify-center mt-3 mb-5 group-hover:bg-[#4A9FFF]/15 transition-colors">
                  <feature.icon className="w-5 h-5 text-[#4A9FFF]" />
                </div>
                <h3 className="text-lg font-medium text-[#1A1A2E] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#718096] font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-24 sm:py-32 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block text-xs text-[#4A9FFF] font-medium uppercase tracking-[0.2em] mb-4">
              Como Funciona
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-light text-[#1A1A2E] leading-tight tracking-[-0.02em] mb-5">
              Simples de <span className="text-gradient font-medium">começar.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#718096] max-w-xl mx-auto font-light">
              Em menos de 2 minutos você está pronto para transformar sua produtividade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Crie sua conta", desc: "Cadastro rápido com e-mail ou Google. Sem cartão de crédito.", icon: Mail },
              { step: "02", title: "Configure preferências", desc: "Escolha seu tom de coach, dia de início da semana e horários.", icon: Sparkles },
              { step: "03", title: "Comece a produzir", desc: "Adicione tarefas, hábitos e metas. A IA cuida do resto.", icon: Zap },
            ].map((item, i) => (
              <div key={item.step} className={`text-center ${i < 2 ? 'step-line' : ''}`}>
                <div className="w-16 h-16 rounded-2xl bg-[#4A9FFF]/8 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-7 h-7 text-[#4A9FFF]" />
                </div>
                <span className="text-xs text-[#4A9FFF] font-mono font-medium tracking-wider">PASSO {item.step}</span>
                <h3 className="text-xl font-medium text-[#1A1A2E] mt-2 mb-3">{item.title}</h3>
                <p className="text-sm text-[#718096] font-light leading-relaxed max-w-[280px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section - Dark */}
      <section className="py-24 sm:py-32 px-6 gradient-hero relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] gradient-radial-glow animate-breathe pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] gradient-radial-glow animate-breathe pointer-events-none" style={{ animationDelay: '4s' }} />

        <div className="relative max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-[#4A9FFF] px-4 py-2 rounded-full text-sm font-light tracking-wider mb-8">
                <Brain className="w-3.5 h-3.5" />
                Inteligência Artificial
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-light text-white leading-tight tracking-[-0.02em] mb-6">
                Seus dados viram<br /><span className="text-gradient font-medium">insights reais.</span>
              </h2>

              <p className="text-base sm:text-lg text-white/50 mb-10 font-light leading-relaxed max-w-lg">
                Nossa IA analisa seus padrões semanais e gera relatórios com insights
                acionáveis, celebra conquistas e sugere melhorias específicas.
              </p>

              <div className="space-y-5">
                {[
                  { label: "Análise de padrões", desc: "Identifica seus ciclos de produtividade e pontos de atenção" },
                  { label: "Sugestões proativas", desc: "Recomendações baseadas em seus dados reais, não genéricas" },
                  { label: "Coach personalizado", desc: "Escolha entre 4 tons: motivador, calmo, direto ou amigável" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#4A9FFF]/15 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight className="w-4 h-4 text-[#4A9FFF]" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm mb-1">{item.label}</h4>
                      <p className="text-white/40 text-sm font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup Card */}
            <div className="relative">
              <div className="card-dark rounded-2xl p-8 animate-shimmer">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Relatório Semanal</div>
                    <div className="text-white/30 text-xs font-light">Gerado por IA</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { value: "94%", label: "Tarefas" },
                    { value: "86%", label: "Habitos" },
                    { value: "3/4", label: "Metas" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-xl font-light text-[#4A9FFF]">{s.value}</div>
                      <div className="text-[10px] text-white/30 font-light mt-1 uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#4A9FFF]" />
                    <span className="text-xs text-white/50 font-medium uppercase tracking-wider">Insight</span>
                  </div>
                  <p className="text-sm text-white/70 font-light leading-relaxed">
                    &ldquo;Você completou 15% mais tarefas de alta prioridade esta semana. Seu pico de foco é entre 9h-11h.&rdquo;
                  </p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 gradient-radial-glow pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32 px-6 bg-white relative">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
        <div className="relative max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs text-[#4A9FFF] font-medium uppercase tracking-[0.2em] mb-4">
              Depoimentos
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-light text-[#1A1A2E] leading-tight tracking-[-0.02em]">
              Quem usa, <span className="text-gradient font-medium">recomenda.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { quote: "O Pulse mudou minha relação com produtividade. Não é sobre fazer mais, é sobre fazer o que importa.", name: "Maria Silva", role: "Product Designer" },
              { quote: "Os relatórios semanais com IA são incríveis. Consigo ver padrões que eu nunca percebia sozinho.", name: "Lucas Mendes", role: "Desenvolvedor Full Stack" },
              { quote: "Testei dezenas de apps de produtividade. O Pulse é o único que consegui manter por mais de 3 meses.", name: "Ana Costa", role: "Empreendedora" },
            ].map((t) => (
              <div key={t.name} className="testimonial-card p-8 rounded-2xl border border-black/[0.04] bg-white">
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#4A9FFF] fill-[#4A9FFF]" />
                  ))}
                </div>
                <blockquote className="text-[#1A1A2E] font-light leading-relaxed mb-6 text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1A1A2E]">{t.name}</div>
                    <div className="text-xs text-[#718096] font-light">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-24 sm:py-32 px-6 bg-[#F5F7FA] relative">
        <div className="absolute inset-0 bg-dot-pattern pointer-events-none" />
        <div className="relative max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block text-xs text-[#4A9FFF] font-medium uppercase tracking-[0.2em] mb-4">
              Preços
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-light text-[#1A1A2E] leading-tight tracking-[-0.02em] mb-5">
              Simples. <span className="text-gradient font-medium">Transparente.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#718096] font-light">
              Comece grátis e evolua quando estiver pronto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="p-8 sm:p-10 rounded-2xl border border-black/[0.04] bg-white">
              <h3 className="text-xl font-medium text-[#1A1A2E] mb-1">Gratuito</h3>
              <p className="text-sm text-[#718096] font-light mb-8">Para começar sua jornada</p>
              <div className="mb-8">
                <span className="text-5xl font-light text-[#1A1A2E] tracking-tight">R$0</span>
                <span className="text-[#718096] font-light text-sm ml-1">/mes</span>
              </div>
              <ul className="space-y-3.5 mb-10">
                {["Até 10 tarefas ativas", "Até 3 hábitos", "1 meta por período", "Relatórios mensais", "Dashboard completo"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#718096] font-light">
                    <CheckCircle2 className="w-4 h-4 text-[#4A9FFF] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/cadastro">
                <Button variant="outline" className="w-full rounded-full border border-black/[0.08] text-[#1A1A2E] hover:bg-[#F5F7FA] py-6 text-sm font-medium" size="lg">
                  Começar Grátis
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 sm:p-10 rounded-2xl border-2 border-[#4A9FFF] bg-white relative pricing-popular">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 gradient-primary text-white text-[11px] font-semibold px-5 py-1.5 rounded-full tracking-wider uppercase">
                Mais Popular
              </div>
              <h3 className="text-xl font-medium text-[#1A1A2E] mb-1">Pro</h3>
              <p className="text-sm text-[#718096] font-light mb-8">Para quem leva produtividade a sério</p>
              <div className="mb-8">
                <span className="text-5xl font-light text-[#1A1A2E] tracking-tight">R$29,90</span>
                <span className="text-[#718096] font-light text-sm ml-1">/mes</span>
              </div>
              <ul className="space-y-3.5 mb-10">
                {["Tarefas ilimitadas", "Hábitos ilimitados", "Metas ilimitadas", "Relatórios semanais com IA", "Coach de IA personalizado", "Suporte prioritário"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#718096] font-light">
                    <CheckCircle2 className="w-4 h-4 text-[#4A9FFF] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/checkout?plan=pro">
                <Button className="w-full bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full btn-pulse py-6 text-sm font-semibold" size="lg">
                  Assinar Pro
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
            <div className="flex items-center gap-2 text-xs text-[#718096]/60 font-light">
              <Shield className="w-4 h-4" />
              Pagamento seguro
            </div>
            <div className="flex items-center gap-2 text-xs text-[#718096]/60 font-light">
              <Clock className="w-4 h-4" />
              Cancele a qualquer momento
            </div>
            <div className="flex items-center gap-2 text-xs text-[#718096]/60 font-light">
              <Users className="w-4 h-4" />
              Suporte humanizado
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs text-[#4A9FFF] font-medium uppercase tracking-[0.2em] mb-4">
              Dúvidas
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1A1A2E] tracking-[-0.02em]">
              Perguntas <span className="text-gradient font-medium">frequentes</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "O plano gratuito tem limitações de tempo?", a: "Não. O plano gratuito é gratuito para sempre. Você pode usar com as funcionalidades básicas sem prazo de validade." },
              { q: "Como funciona a IA do Pulse?", a: "Nossa IA analisa seus dados de tarefas, hábitos e metas semanalmente para gerar relatórios com insights personalizados, padrões de comportamento e recomendações acionáveis." },
              { q: "Posso cancelar o plano Pro a qualquer momento?", a: "Sim. Sem multa, sem burocracia. Você continua com acesso até o final do período pago." },
              { q: "Meus dados estão seguros?", a: "Sim. Usamos criptografia em trânsito e em repouso. Seus dados nunca são compartilhados com terceiros." },
              { q: "Funciona no celular?", a: "Sim. O Pulse é um PWA (Progressive Web App) e pode ser instalado no seu celular como um app nativo, com acesso offline." },
            ].map((faq) => (
              <div key={faq.q} className="p-6 rounded-2xl border border-black/[0.04] bg-[#F5F7FA]/50">
                <h4 className="font-medium text-[#1A1A2E] text-[15px] mb-2">{faq.q}</h4>
                <p className="text-sm text-[#718096] font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 px-6 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 gradient-radial-glow animate-breathe pointer-events-none" />
        <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-[#4A9FFF]/20 animate-float" />
        <div className="absolute bottom-20 right-20 w-1.5 h-1.5 rounded-full bg-[#6BB5FF]/15 animate-float delay-300" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-light text-white leading-tight tracking-[-0.02em] mb-6">
            Pronto para o seu<br /><span className="text-gradient font-medium">próximo nível?</span>
          </h2>
          <p className="text-base sm:text-lg text-white/50 mb-10 font-light max-w-lg mx-auto">
            Junte-se a quem já transformou produtividade em intenção.
          </p>
          <Link href="/cadastro">
            <Button size="lg" className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-full btn-pulse gap-2 text-base px-8 py-6 font-semibold">
              Começar Agora — É Grátis <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <p className="text-xs text-white/25 mt-6 font-light">
            Configuração em menos de 2 minutos
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-[#1A1A2E] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 sm:col-span-1">
              <span className="text-lg font-light text-white/80 tracking-tight">pulse</span>
              <p className="text-sm text-white/30 font-light mt-2 leading-relaxed max-w-[200px]">
                Produtividade intencional com inteligência artificial.
              </p>
            </div>

            <div>
              <h4 className="text-xs text-white/40 font-medium uppercase tracking-wider mb-4">Produto</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Funcionalidades", href: "#funcionalidades" },
                  { label: "Preços", href: "#precos" },
                  { label: "Como Funciona", href: "#como-funciona" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/30 hover:text-white/60 font-light transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs text-white/40 font-medium uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Termos de Uso", href: "/termos" },
                  { label: "Privacidade", href: "/privacidade" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/30 hover:text-white/60 font-light transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs text-white/40 font-medium uppercase tracking-wider mb-4">Conta</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Entrar", href: "/login" },
                  { label: "Criar Conta", href: "/cadastro" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/30 hover:text-white/60 font-light transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/20 text-xs font-light">2026 pulse. Todos os direitos reservados.</p>
            <p className="text-white/20 text-xs font-light">Feito com intenção no Brasil.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
