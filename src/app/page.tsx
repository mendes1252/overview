import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Target,
  TrendingUp,
  Brain,
  Calendar,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PULSO</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/cadastro">
                <Button>Comece Gratis</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Produtividade potencializada por IA
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme sua produtividade<br />
            com <span className="text-primary">inteligencia artificial</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            O PULSO e a primeira plataforma brasileira que combina gestao de tarefas,
            habitos e metas com analise inteligente via IA, gerando insights acionaveis
            automaticamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" className="gap-2 text-lg px-8">
                Comece Gratis <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#como-funciona">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Como Funciona
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Sem cartao de credito. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tudo que voce precisa para ser mais produtivo
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas poderosas combinadas com inteligencia artificial para
              maximizar seu potencial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border bg-white card-hover">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestao de Tarefas
              </h3>
              <p className="text-gray-600">
                Organize suas tarefas com prioridades, categorias e datas.
                Visualize em lista ou Kanban.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border bg-white card-hover">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rastreamento de Habitos
              </h3>
              <p className="text-gray-600">
                Construa habitos saudaveis com streaks, gamificacao e
                visualizacao de progresso.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border bg-white card-hover">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Metas Inteligentes
              </h3>
              <p className="text-gray-600">
                Defina metas semanais, mensais e trimestrais. Acompanhe
                seu progresso em tempo real.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border bg-white card-hover">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Coach de IA
              </h3>
              <p className="text-gray-600">
                Receba coaching personalizado baseado nos seus padroes
                de comportamento e desempenho.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border bg-white card-hover">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Relatorios com IA
              </h3>
              <p className="text-gray-600">
                Relatorios semanais automaticos com insights, padroes
                detectados e recomendacoes.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border bg-white card-hover">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Visao Semanal
              </h3>
              <p className="text-gray-600">
                Dashboard completo com visao da semana, progresso e
                proximas atividades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="gradient-primary rounded-3xl p-8 sm:p-12 lg:p-16 text-white text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              Inteligencia Artificial
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Relatorios semanais que transformam dados em acao
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Todo fim de semana, nossa IA analisa seus dados e gera um relatorio
              personalizado com insights sobre seus padroes, celebra suas conquistas
              e sugere melhorias especificas para a proxima semana.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">87%</div>
                <div className="text-white/80 text-sm">dos usuarios melhoram produtividade</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">3x</div>
                <div className="text-white/80 text-sm">mais consistencia em habitos</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">92%</div>
                <div className="text-white/80 text-sm">satisfacao com os insights</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Planos simples e transparentes
            </h2>
            <p className="text-xl text-gray-600">
              Comece gratis e evolua conforme sua necessidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border-2 border-gray-200 bg-white">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
              <p className="text-gray-600 mb-6">Para comecar sua jornada</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">R$0</span>
                <span className="text-gray-600">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Ate 10 tarefas ativas
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Ate 3 habitos
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  1 meta por periodo
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Relatorios mensais basicos
                </li>
              </ul>
              <Link href="/cadastro">
                <Button variant="outline" className="w-full" size="lg">
                  Comecar Gratis
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl border-2 border-primary bg-primary/5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                Mais Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">Para quem leva produtividade a serio</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">R$29,90</span>
                <span className="text-gray-600">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Tarefas ilimitadas
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Habitos ilimitados
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Metas ilimitadas
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Relatorios semanais com IA
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Coach de IA personalizado
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Exportacao de dados
                </li>
              </ul>
              <Link href="/checkout?plan=pro">
                <Button className="w-full" size="lg">
                  Assinar Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Pronto para transformar sua produtividade?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de pessoas que ja estao usando o PULSO para
            alcancar seus objetivos.
          </p>
          <Link href="/cadastro">
            <Button size="lg" className="gap-2 text-lg px-8">
              Comece Agora - E Gratis <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PULSO</span>
            </div>
            <p className="text-gray-600 text-sm">
              2024 PULSO. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
