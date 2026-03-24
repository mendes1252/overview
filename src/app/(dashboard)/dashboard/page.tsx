import { createClient } from "@/lib/supabase/server";
import { TrendingUp, ArrowUpRight, DollarSign, Percent } from "lucide-react";

function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#D6D6CD] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#6E6E63] uppercase tracking-wide">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#F0F3F9] flex items-center justify-center">
          <Icon size={16} strokeWidth={1.5} className="text-[#1E3A5F]" />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-[#1E3A5F] tabular-nums">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-[#8E8E83] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName =
    (user?.user_metadata?.name as string | undefined)?.split(" ")[0] ??
    "Franqueado";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">
          Olá, {firstName}!
        </h1>
        <p className="text-sm text-[#6E6E63] mt-0.5">
          Configure sua unidade para ver os dados financeiros.
        </p>
      </div>

      {/* Setup banner */}
      <div className="bg-[#1E3A5F] rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold text-sm mb-0.5">
            Configure sua unidade para começar
          </p>
          <p className="text-[#B8C6DE] text-xs">
            Leva menos de 5 minutos. Seus dados aparecem aqui em tempo real.
          </p>
        </div>
        <a
          href="/onboarding"
          className="shrink-0 bg-[#A07D2E] hover:bg-[#886A27] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Configurar agora
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KPICard
          title="Receita"
          value="R$ —"
          subtitle="Mês atual"
          icon={DollarSign}
        />
        <KPICard
          title="Despesas"
          value="R$ —"
          subtitle="Mês atual"
          icon={ArrowUpRight}
        />
        <KPICard
          title="Lucro"
          value="R$ —"
          subtitle="Operacional"
          icon={TrendingUp}
        />
        <KPICard
          title="Margem"
          value="— %"
          subtitle="De cada R$100"
          icon={Percent}
        />
      </div>

      {/* Breakeven */}
      <div className="bg-white rounded-xl border border-[#D6D6CD] p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#6E6E63] uppercase tracking-wide">
            Breakeven
          </span>
          <span className="text-xs text-[#8E8E83]">Sem dados</span>
        </div>
        <div className="h-2 bg-[#EFEFEB] rounded-full overflow-hidden">
          <div className="h-full w-0 bg-[#1E3A5F] rounded-full" />
        </div>
        <p className="text-xs text-[#8E8E83] mt-2">
          Lance suas receitas e despesas para ver o breakeven.
        </p>
      </div>

      {/* Chart placeholder */}
      <div className="bg-white rounded-xl border border-[#D6D6CD] p-5 shadow-sm">
        <p className="text-xs font-semibold text-[#6E6E63] uppercase tracking-wide mb-4">
          Evolução Mensal
        </p>
        <div className="h-48 flex items-center justify-center">
          <p className="text-sm text-[#B8B8AD]">
            Dados aparecerão após o primeiro lançamento.
          </p>
        </div>
      </div>
    </div>
  );
}
