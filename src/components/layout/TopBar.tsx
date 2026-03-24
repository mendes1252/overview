import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  unitName?: string;
  userName?: string | null;
}

export function TopBar({ unitName = "Minha Unidade", userName }: TopBarProps) {
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="h-14 bg-[#FAFAF8] border-b border-[#D6D6CD] flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[#1E3A5F] text-sm">{unitName}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#6E6E63] hover:text-[#1E3A5F] hover:bg-[#EFEFEB] relative"
          aria-label="Notificações"
        >
          <Bell size={18} strokeWidth={1.5} />
        </Button>
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarFallback className="bg-[#1E3A5F] text-white text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
