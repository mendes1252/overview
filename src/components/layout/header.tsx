"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Settings, User, Crown, Zap } from "lucide-react";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/[0.04]">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Mobile Menu */}
        <div className="flex items-center gap-4 lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4A9FFF]/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#4A9FFF]" />
            </div>
            <span className="font-light text-[#1A1A2E] tracking-tight">pulse</span>
          </Link>
        </div>

        {/* Search - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar tarefas, habitos, metas..."
              className="w-full h-10 pl-4 pr-4 rounded-xl border border-black/[0.04] bg-[#F5F7FA] text-sm font-light text-[#1A1A2E] placeholder:text-[#718096] focus:outline-none focus:ring-2 focus:ring-[#4A9FFF]/30 focus:border-[#4A9FFF] transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Upgrade button */}
          <Link href="/configuracoes/plano" className="hidden sm:block">
            <Button variant="outline" size="sm" className="gap-2 rounded-full border-[#4A9FFF]/30 text-[#4A9FFF] hover:bg-[#4A9FFF]/5">
              <Crown className="w-4 h-4" />
              Upgrade
            </Button>
          </Link>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-[#F5F7FA]">
            <Bell className="w-5 h-5 text-[#718096]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#4A9FFF] rounded-full" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.image || undefined} alt={user.name || ""} />
                  <AvatarFallback className="bg-[#4A9FFF]/10 text-[#4A9FFF] text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl border-black/[0.04] shadow-lg" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-[#1A1A2E]">{user.name}</p>
                  <p className="text-xs text-[#718096] font-light">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/configuracoes/perfil" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4 text-[#718096]" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/configuracoes" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4 text-[#718096]" />
                  Configuracoes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/configuracoes/plano" className="cursor-pointer">
                  <Crown className="mr-2 h-4 w-4 text-[#4A9FFF]" />
                  Meu Plano
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
