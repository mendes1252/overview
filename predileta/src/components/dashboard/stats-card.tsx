import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "warning" | "danger" | "success";
}

const variantStyles: Record<string, string> = {
  default: "bg-card border-border",
  warning: "bg-yellow-50 border-yellow-200",
  danger: "bg-red-50 border-red-200",
  success: "bg-green-50 border-green-200",
};

const iconStyles: Record<string, string> = {
  default: "text-muted-foreground",
  warning: "text-yellow-600",
  danger: "text-red-600",
  success: "text-green-600",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
}: StatsCardProps) {
  return (
    <div className={cn("rounded-xl border p-5 shadow-sm", variantStyles[variant])}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <Icon className={cn("w-5 h-5", iconStyles[variant])} />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
