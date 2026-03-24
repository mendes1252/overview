"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Heart, Gamepad2, BookMarked, BookHeart } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", icon: BookOpen, label: "Devocional" },
  { href: "/familia", icon: Heart, label: "Família" },
  { href: "/jogos", icon: Gamepad2, label: "Jogos" },
  { href: "/flashcards", icon: BookMarked, label: "Versículos" },
  { href: "/diario", icon: BookHeart, label: "Diário" },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="max-w-lg mx-auto flex">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition",
                active ? "text-[#1e3a8a]" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-[#1e3a8a]" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
