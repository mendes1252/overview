"use client";

import { AffiliatePlatform } from "@prisma/client";

interface PlatformBadgeProps {
  platform: AffiliatePlatform;
  size?: "sm" | "md";
}

const PLATFORM_CONFIG: Record<AffiliatePlatform, { label: string; bg: string; text: string }> = {
  AMAZON: { label: "Amazon", bg: "bg-orange-100", text: "text-orange-700" },
  SHOPEE: { label: "Shopee", bg: "bg-orange-50", text: "text-orange-600" },
  MERCADO_LIVRE: { label: "Mercado Livre", bg: "bg-yellow-100", text: "text-yellow-700" },
  OTHER: { label: "Loja", bg: "bg-gray-100", text: "text-gray-600" },
};

export function PlatformBadge({ platform, size = "sm" }: PlatformBadgeProps) {
  const cfg = PLATFORM_CONFIG[platform];
  const px = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${px} ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}
