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
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tarefas", href: "/tarefas", icon: CheckSquare },
  { name: "Habitos", href: "/habitos", icon: TrendingUp },
  { name: "Metas", href: "/metas", icon: Target },
  { name: "Relatorios", href: "/relatorios", icon: BarChart3 },
  { name: "Configuracoes", href: "/configuracoes", icon: Settings },
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
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-light text-white tracking-tight">pulse</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#4A9FFF]/15 text-[#4A9FFF]"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade Banner */}
          <div className="p-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-[#4A9FFF]" />
                <span className="font-medium text-white text-sm">Upgrade para Pro</span>
              </div>
              <p className="text-xs text-white/40 mb-3 font-light">
                Desbloqueie relatorios com IA e recursos ilimitados.
              </p>
              <Link
                href="/configuracoes/plano"
                className="block text-center bg-[#4A9FFF] text-white font-medium py-2 px-4 rounded-xl text-sm hover:bg-[#6BB5FF] transition-colors btn-pulse"
              >
                Ver Planos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 glass-dark z-50">
        <nav className="flex justify-around py-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 transition-colors",
                  isActive ? "text-[#4A9FFF]" : "text-white/40"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-light">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
