"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  TrendingUp,
  BarChart3,
  Settings,
  Crown,
  Zap,
  ShoppingBag,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tarefas", href: "/tarefas", icon: CheckSquare },
  { name: "Hábitos", href: "/habitos", icon: TrendingUp },
  { name: "Metas", href: "/metas", icon: Target },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Afiliados", href: "/affiliate", icon: ShoppingBag },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar - Dark */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col gradient-hero border-r border-white/5">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4A9FFF]/15 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#4A9FFF]" />
              </div>
              <span className="text-xl font-light text-white tracking-tight">pulse</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                      isActive
                        ? "bg-[#4A9FFF]/15 text-white font-medium"
                        : "text-white/40 hover:bg-white/5 hover:text-white/70 font-light"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                        isActive
                          ? "bg-[#4A9FFF] shadow-lg shadow-[#4A9FFF]/25"
                          : "bg-white/5 group-hover:bg-white/10"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-white/50 group-hover:text-white/70")} />
                    </div>
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4A9FFF]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Upgrade Banner */}
          <div className="p-4">
            <div className="rounded-2xl bg-gradient-to-br from-[#4A9FFF]/10 to-[#6BB5FF]/5 border border-[#4A9FFF]/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-[#4A9FFF]" />
                <span className="font-medium text-white text-sm">Upgrade para Pro</span>
              </div>
              <p className="text-xs text-white/40 mb-3 font-light">
                Desbloqueie relatórios com IA e recursos ilimitados.
              </p>
              <Link
                href="/configuracoes/plano"
                className="block text-center bg-[#4A9FFF] text-white font-medium py-2 px-4 rounded-xl text-sm hover:bg-[#6BB5FF] transition-colors"
              >
                Ver Planos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A2E]/95 backdrop-blur-xl border-t border-white/5">
        <nav className="flex justify-around py-1.5 px-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 relative",
                  isActive ? "text-[#4A9FFF]" : "text-white/30"
                )}
              >
                {isActive && (
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#4A9FFF]" />
                )}
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                    isActive
                      ? "bg-[#4A9FFF]/15"
                      : "bg-transparent"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-[#4A9FFF]" : "text-white/30")} />
                </div>
                <span className={cn("text-[10px]", isActive ? "font-medium" : "font-light")}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
