import Link from "next/link";
import { SteddiLogo } from "@/components/brand/SteddiLogo";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Nav */}
      <header className="h-16 flex items-center justify-between px-6 lg:px-12 border-b border-[#D6D6CD]">
        <SteddiLogo variant="light" size="md" showDescriptor />
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-[#1E3A5F] font-medium text-sm"
            >
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button className="bg-[#A07D2E] hover:bg-[#886A27] text-white text-sm font-semibold">
              Começar grátis
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-6 py-20 text-center max-w-3xl mx-auto">
        <span className="inline-block bg-[#FBF8F0] border border-[#E8D5A8] text-[#886A27] text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          7 dias grátis · Sem cartão
        </span>

        <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1E3A5F] leading-tight mb-4">
          Saiba quanto realmente sobra da sua franquia.
        </h1>

        <p className="text-lg text-[#6E6E63] mb-8 max-w-xl leading-relaxed">
          Dashboard financeiro inteligente para franqueados brasileiros. Sem
          planilhas, sem complicação. KPIs, breakeven e relatório mensal em
          minutos.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/cadastro" className="w-full sm:w-auto">
            <Button className="w-full bg-[#A07D2E] hover:bg-[#886A27] text-white font-semibold h-12 px-8 text-base">
              Criar conta grátis
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full border-[#D6D6CD] text-[#1E3A5F] font-medium h-12 px-8 text-base hover:bg-[#F5F5F2]"
            >
              Já tenho conta
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full text-left">
          {[
            {
              title: "Dashboard ao vivo",
              desc: "KPIs, margem e lucro operacional atualizados a cada lançamento.",
            },
            {
              title: "Breakeven automático",
              desc: "Veja em qual dia do mês você cobre seus custos fixos.",
            },
            {
              title: "Relatório com IA",
              desc: "Análise mensal em português, gerada pela Claude API.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl border border-[#D6D6CD] p-5 shadow-sm"
            >
              <h3 className="font-bold text-[#1E3A5F] mb-1 text-sm">
                {f.title}
              </h3>
              <p className="text-xs text-[#6E6E63] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D6D6CD] py-6 px-6 text-center">
        <p className="text-xs text-[#8E8E83]">
          © 2025 Steddi · Para os 202.000+ franqueados do Brasil
        </p>
      </footer>
    </div>
  );
}
