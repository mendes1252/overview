"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  Columns,
  Users,
  CreditCard,
  LogOut,
  Waves,
} from "lucide-react";

const nav = [
  { href: "/pdv/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pdv/nova-os", label: "Nova OS", icon: PlusCircle },
  { href: "/pdv/producao", label: "Produção", icon: Columns },
  { href: "/pdv/clientes", label: "Clientes", icon: Users },
  { href: "/pdv/caixa", label: "Caixa", icon: CreditCard },
];

interface PdvLayoutProps {
  children: React.ReactNode;
  userName: string;
  userRole: string;
}

export function PdvLayout({ children, userName, userRole }: PdvLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const roleLabel: Record<string, string> = {
    admin: "Administrador",
    manager: "Gerente",
    operator: "Operador",
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-56 bg-teal-800 text-white flex flex-col shrink-0 print:hidden">
        <div className="p-4 border-b border-teal-700">
          <div className="flex items-center gap-2 mb-1">
            <Waves className="w-5 h-5 text-teal-300" />
            <span className="font-bold text-lg">Predileta</span>
          </div>
          <p className="text-teal-300 text-xs truncate">{userName}</p>
          <p className="text-teal-400 text-xs">{roleLabel[userRole] ?? userRole}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-teal-600 text-white font-medium"
                  : "text-teal-200 hover:bg-teal-700 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-teal-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-teal-200 hover:bg-teal-700 hover:text-white rounded-lg text-sm transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-h-screen">{children}</main>
    </div>
  );
}
