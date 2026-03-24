"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  SlidersHorizontal,
  TrendingUp,
  FileText,
  Settings,
} from "lucide-react";
import { SteddiLogo } from "@/components/brand/SteddiLogo";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Lançamentos", href: "/lancamentos", icon: PlusCircle },
  { name: "Pessoas", href: "/pessoas", icon: Users },
  { name: "Simulador", href: "/simulador", icon: SlidersHorizontal },
  { name: "Fluxo de Caixa", href: "/fluxo-caixa", icon: TrendingUp },
  { name: "Relatórios", href: "/relatorios", icon: FileText },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-[#1E3A5F] border-r border-[#1A3254]">
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center px-5 border-b border-white/10">
          <Link href="/dashboard">
            <SteddiLogo variant="dark" size="sm" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-[#B8C6DE] hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon
                  size={18}
                  strokeWidth={1.5}
                  className={isActive ? "text-[#A07D2E]" : ""}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[10px] text-[#5C7BA8] font-medium tracking-wide">
            v1.0.0 — Sprint 1
          </p>
        </div>
      </div>
    </div>
  );
}
