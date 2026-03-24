import Link from "next/link";
import { Check } from "lucide-react";

const FEATURES = [
  "Devocional diário com IA personalizada",
  "Histórias infantis adaptadas por idade",
  "Jogos bíblicos (Quiz, Memória, Aventura)",
  "50+ flashcards de versículos",
  "Diário da família",
  "Gamificação com pontos e conquistas",
  "Streaks e progresso dos filhos",
  "Notificações diárias (em breve)",
];

export default function PrecosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#1e2d6b] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">✝️</div>
          <h1 className="text-4xl font-bold font-playfair text-white mb-3">
            Planos Fé em Família
          </h1>
          <p className="text-blue-200 text-base">
            Invista na fé e no vínculo da sua família
          </p>
        </div>

        {/* Free trial callout */}
        <div className="bg-amber-400 rounded-2xl p-4 text-center mb-6">
          <p className="text-amber-900 font-bold">🎁 7 dias grátis para todos os planos!</p>
          <p className="text-amber-800 text-sm">Sem cartão de crédito necessário para começar.</p>
        </div>

        <div className="space-y-4">
          {/* Monthly */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold font-playfair text-[#1e3a8a]">Plano Mensal</h2>
                <p className="text-gray-500 text-sm">Flexibilidade mensal</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#1e3a8a]">R$ 24,90</p>
                <p className="text-gray-400 text-sm">/mês</p>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/cadastro"
              className="block w-full bg-[#1e3a8a] hover:bg-[#1e2d6b] text-white font-semibold py-3 rounded-xl text-center transition"
            >
              Começar gratuitamente →
            </Link>
          </div>

          {/* Annual (recommended) */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-400 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full">
              MAIS POPULAR · 20% OFF
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold font-playfair text-[#1e3a8a]">Plano Anual</h2>
                <p className="text-gray-500 text-sm">Melhor custo-benefício</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#1e3a8a]">R$ 19,90</p>
                <p className="text-gray-400 text-sm">/mês · cobrado anualmente</p>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/cadastro"
              className="block w-full bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold py-3 rounded-xl text-center transition"
            >
              Começar gratuitamente →
            </Link>
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-8">
          Cancele a qualquer momento. Suporte via e-mail incluído.
        </p>
        <div className="text-center mt-4">
          <Link href="/login" className="text-blue-300 hover:text-white text-sm underline">
            Já tenho uma conta
          </Link>
        </div>
      </div>
    </div>
  );
}
