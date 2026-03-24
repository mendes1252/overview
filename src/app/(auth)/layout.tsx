import Link from "next/link";
import { SteddiLogo } from "@/components/brand/SteddiLogo";
import { SteddiMark } from "@/components/brand/SteddiMark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side — Navy brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1E3A5F] items-center justify-center p-12 relative overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative max-w-sm text-white">
          <Link href="/" className="block mb-10">
            <SteddiLogo variant="dark" size="lg" showDescriptor />
          </Link>

          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            Saiba quanto realmente sobra da sua franquia.
          </h1>
          <p className="text-[#B8C6DE] text-base leading-relaxed mb-10">
            Dashboard financeiro inteligente para franqueados brasileiros.
            Sem planilhas, sem complicação.
          </p>

          <div className="space-y-4">
            {[
              "Dashboard com KPIs em tempo real",
              "Breakeven calculado automaticamente",
              "Relatório mensal com análise IA",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A07D2E] shrink-0" />
                <span className="text-[#DEE4F0] text-sm">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-[#5C7BA8] text-xs">
              Para os 202.000+ franqueados do Brasil
            </p>
          </div>
        </div>
      </div>

      {/* Right side — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#FAFAF8]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex justify-center mb-8 lg:hidden">
            <SteddiMark size={32} className="text-[#1E3A5F]" />
          </Link>

          <div className="bg-white rounded-2xl p-8 border border-[#D6D6CD] shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
