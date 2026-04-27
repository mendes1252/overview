"use client";

import Image from "next/image";
import { AffiliatePlatform } from "@prisma/client";
import { PlatformBadge } from "./platform-badge";
import { ExternalLink } from "lucide-react";

interface StorefrontCardProps {
  name: string;
  imageUrl?: string | null;
  price?: number | null;
  category?: string | null;
  platform: AffiliatePlatform;
  trackUrl: string | null;
  themeColor?: string;
}

export function StorefrontCard({
  name,
  imageUrl,
  price,
  category,
  platform,
  trackUrl,
  themeColor = "#6366f1",
}: StorefrontCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {imageUrl ? (
        <div className="relative w-full aspect-square bg-muted">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ) : (
        <div className="w-full aspect-square bg-muted flex items-center justify-center">
          <span className="text-4xl text-muted-foreground/40">🛍️</span>
        </div>
      )}

      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-medium leading-tight line-clamp-2">{name}</p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <PlatformBadge platform={platform} />
          {category && (
            <span className="text-xs text-muted-foreground">{category}</span>
          )}
        </div>

        {price != null && (
          <p className="text-base font-bold text-foreground">
            {price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        )}

        <a
          href={trackUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: themeColor }}
        >
          Ver oferta
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
