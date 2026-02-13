import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Uso - pulse",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="gradient-hero py-16">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-4xl font-light text-white">Termos de Uso</h1>
          <p className="text-white/50 font-light mt-2">Ultima atualizacao: Fevereiro 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-black/[0.04] p-8 lg:p-12 space-y-8">
          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">1. Aceitacao dos Termos</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              Ao acessar e utilizar o pulse, voce concorda com estes Termos de Uso. Se voce nao concordar
              com qualquer parte destes termos, nao devera utilizar nossos servicos. O uso continuado da
              plataforma constitui aceitacao de quaisquer alteracoes feitas a estes termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">2. Descricao do Servico</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              O pulse e uma plataforma de produtividade intencional que oferece ferramentas para gerenciamento
              de tarefas, rastreamento de habitos, definicao de metas e relatorios gerados por inteligencia
              artificial. Nossos servicos estao disponiveis em planos gratuitos e pagos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">3. Conta do Usuario</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              Para utilizar o pulse, voce deve criar uma conta fornecendo informacoes precisas e completas.
              Voce e responsavel por manter a confidencialidade da sua senha e por todas as atividades que
              ocorram em sua conta. Notifique-nos imediatamente sobre qualquer uso nao autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">4. Planos e Pagamentos</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              O pulse oferece um plano gratuito com funcionalidades limitadas e planos pagos com recursos
              adicionais. Os pagamentos sao processados por meio de parceiros terceirizados (Asaas).
              Cobrancas recorrentes serao realizadas conforme o ciclo de faturamento escolhido.
              Cancelamentos podem ser feitos a qualquer momento e terao efeito ao final do periodo pago.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">5. Uso Aceitavel</h2>
            <p className="text-[#718096] font-light leading-relaxed mb-3">
              Ao utilizar o pulse, voce concorda em nao:
            </p>
            <ul className="space-y-2 text-[#718096] font-light">
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Utilizar o servico para atividades ilegais ou nao autorizadas
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Tentar acessar contas de outros usuarios
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Interferir no funcionamento da plataforma
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Reproduzir ou redistribuir o servico sem autorizacao
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">6. Propriedade Intelectual</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              Todo o conteudo, design, codigo e funcionalidades do pulse sao propriedade exclusiva do pulse
              e estao protegidos por leis de propriedade intelectual. Os dados que voce insere na plataforma
              permanecem de sua propriedade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">7. Limitacao de Responsabilidade</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              O pulse e fornecido &quot;como esta&quot;, sem garantias de qualquer tipo. Nao nos responsabilizamos
              por danos indiretos, incidentais ou consequenciais decorrentes do uso da plataforma. Nossa
              responsabilidade total sera limitada ao valor pago pelo servico nos ultimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">8. Modificacoes</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alteracoes significativas
              serao comunicadas por email ou por meio da plataforma. O uso continuado apos as modificacoes
              constitui aceitacao dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">9. Contato</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              Para questoes relacionadas a estes termos, entre em contato pelo email{" "}
              <a href="mailto:contato@pulso.app" className="text-[#4A9FFF] hover:underline">
                contato@pulso.app
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
