import { Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding (Dark) */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        {/* Breathing glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] gradient-radial-glow animate-breathe pointer-events-none" />

        <div className="relative max-w-md text-white">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <span className="text-3xl font-light tracking-tight">pulse</span>
          </Link>
          <h1 className="text-5xl font-light mb-6 leading-tight tracking-[-0.02em]">
            Produtividade<br />
            <span className="text-gradient font-medium">intencional</span>
          </h1>
          <p className="text-xl text-white/50 mb-10 font-light leading-relaxed">
            Nao faca mais, faca melhor. Gerencie tarefas, construa habitos e
            alcance metas com inteligencia artificial.
          </p>
          <div className="space-y-5">
            {[
              "Organize suas tarefas diarias",
              "Construa habitos consistentes",
              "Receba insights personalizados",
            ].map((text, i) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-[#4A9FFF] text-sm font-medium">{i + 1}</span>
                </div>
                <span className="text-white/70 font-light">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F5F7FA]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-[#4A9FFF]/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#4A9FFF]" />
            </div>
            <span className="text-2xl font-light text-[#1A1A2E] tracking-tight">pulse</span>
          </Link>
          <div className="bg-white rounded-3xl p-8 border border-black/[0.04] shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
