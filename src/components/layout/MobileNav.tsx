"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Users,
  SlidersHorizontal,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Início", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pessoas", href: "/pessoas", icon: Users },
  { name: "Simular", href: "/simulador", icon: SlidersHorizontal },
  { name: "Mais", href: "/configuracoes", icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[#FAFAF8] border-t border-[#D6D6CD] z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.slice(0, 2).map((tab) => (
          <TabItem key={tab.name} tab={tab} pathname={pathname} />
        ))}

        {/* FAB — Lançar */}
        <Link
          href="/lancamentos"
          className="flex flex-col items-center justify-center -mt-5"
          aria-label="Lançar"
        >
          <div className="w-14 h-14 rounded-full bg-[#A07D2E] flex items-center justify-center shadow-lg">
            <Plus size={24} strokeWidth={2} className="text-white" />
          </div>
          <span className="text-[10px] font-semibold text-[#A07D2E] mt-0.5">
            Lançar
          </span>
        </Link>

        {tabs.slice(2).map((tab) => (
          <TabItem key={tab.name} tab={tab} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}

function TabItem({
  tab,
  pathname,
}: {
  tab: (typeof tabs)[number];
  pathname: string;
}) {
  const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
  return (
    <Link
      href={tab.href}
      className="flex flex-col items-center justify-center gap-1 px-3 py-1"
    >
      <tab.icon
        size={20}
        strokeWidth={1.5}
        className={cn(isActive ? "text-[#1E3A5F]" : "text-[#8E8E83]")}
      />
      <span
        className={cn(
          "text-[10px] font-semibold",
          isActive ? "text-[#1E3A5F]" : "text-[#8E8E83]"
        )}
      >
        {tab.name}
      </span>
    </Link>
  );
}
