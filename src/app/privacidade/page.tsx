import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Politica de Privacidade - pulse",
};

export default function PrivacidadePage() {
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
          <h1 className="text-4xl font-light text-white">Politica de Privacidade</h1>
          <p className="text-white/50 font-light mt-2">Ultima atualizacao: Fevereiro 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-black/[0.04] p-8 lg:p-12 space-y-8">
          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">1. Informacoes que Coletamos</h2>
            <p className="text-[#718096] font-light leading-relaxed mb-3">
              Coletamos as seguintes informacoes quando voce utiliza o pulse:
            </p>
            <ul className="space-y-2 text-[#718096] font-light">
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                <strong className="font-medium text-[#1A1A2E]">Dados de conta:</strong> nome, email e senha (criptografada)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                <strong className="font-medium text-[#1A1A2E]">Dados de uso:</strong> tarefas, habitos, metas e relatorios que voce cria
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                <strong className="font-medium text-[#1A1A2E]">Dados de pagamento:</strong> processados pelo Asaas, nao armazenamos dados de cartao
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                <strong className="font-medium text-[#1A1A2E]">Dados tecnicos:</strong> endereco IP, tipo de navegador e cookies essenciais
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">2. Como Usamos suas Informacoes</h2>
            <p className="text-[#718096] font-light leading-relaxed mb-3">
              Utilizamos seus dados para:
            </p>
            <ul className="space-y-2 text-[#718096] font-light">
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Fornecer e manter nossos servicos de produtividade
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Gerar relatorios e insights personalizados com inteligencia artificial
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Enviar comunicacoes transacionais (confirmacoes de pagamento, relatorios semanais)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Melhorar a experiencia do usuario e a plataforma
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">3. Inteligencia Artificial</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              O pulse utiliza servicos de inteligencia artificial (OpenAI) para gerar relatorios e insights.
              Seus dados de produtividade sao enviados de forma anonimizada para gerar analises. Nao utilizamos
              seus dados para treinar modelos de IA. Os dados sao processados em tempo real e nao sao
              armazenados pelos provedores de IA.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">4. Compartilhamento de Dados</h2>
            <p className="text-[#718096] font-light leading-relaxed mb-3">
              Nao vendemos seus dados pessoais. Compartilhamos informacoes apenas com:
            </p>
            <ul className="space-y-2 text-[#718096] font-light">
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                <strong className="font-medium text-[#1A1A2E]">Asaas:</strong> processamento de pagamentos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                <strong className="font-medium text-[#1A1A2E]">OpenAI:</strong> geracao de relatorios (dados anonimizados)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                <strong className="font-medium text-[#1A1A2E]">Resend:</strong> envio de emails transacionais
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                <strong className="font-medium text-[#1A1A2E]">Vercel:</strong> hospedagem da plataforma
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">5. Seguranca dos Dados</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              Implementamos medidas de seguranca para proteger seus dados, incluindo criptografia de senhas
              (bcrypt), conexoes seguras (HTTPS), autenticacao via tokens e acesso restrito ao banco de dados.
              Nenhum sistema e 100% seguro, mas nos esforcarmos para proteger suas informacoes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">6. Seus Direitos</h2>
            <p className="text-[#718096] font-light leading-relaxed mb-3">
              De acordo com a LGPD (Lei Geral de Protecao de Dados), voce tem direito a:
            </p>
            <ul className="space-y-2 text-[#718096] font-light">
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Acessar seus dados pessoais
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Corrigir dados incompletos ou inexatos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Solicitar a exclusao dos seus dados
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Revogar o consentimento a qualquer momento
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4A9FFF] mt-1">•</span>
                Solicitar portabilidade dos dados
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">7. Cookies</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              Utilizamos apenas cookies essenciais para o funcionamento da plataforma, incluindo cookies
              de sessao para autenticacao. Nao utilizamos cookies de rastreamento ou publicidade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">8. Retencao de Dados</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              Mantemos seus dados enquanto sua conta estiver ativa. Apos a exclusao da conta, seus dados
              serao removidos em ate 30 dias. Dados de pagamento sao retidos conforme exigencias legais
              e fiscais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-3">9. Contato</h2>
            <p className="text-[#718096] font-light leading-relaxed">
              Para questoes sobre privacidade ou para exercer seus direitos, entre em contato pelo email{" "}
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
