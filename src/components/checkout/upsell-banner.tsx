"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Zap } from "lucide-react";

interface UpsellCampaign {
  id: string;
  slug: string;
  headline: string;
  description: string;
  badgeText?: string;
  originalPrice: number;
  offerPrice: number;
  targetPlan: string;
  expiresAt?: string;
  limitedSlots?: number;
  slotsUsed: number;
}

interface UpsellBannerProps {
  currentPlan?: string;
}

export function UpsellBanner({ currentPlan = "free" }: UpsellBannerProps) {
  const [campaign, setCampaign] = useState<UpsellCampaign | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (currentPlan !== "free") return;

    fetch("/api/upsell")
      .then((r) => r.json())
      .then((campaigns: UpsellCampaign[]) => {
        if (campaigns.length > 0) {
          setCampaign(campaigns[0]);
        }
      })
      .catch(() => {});
  }, [currentPlan]);

  // Countdown timer
  useEffect(() => {
    if (!campaign?.expiresAt) return;

    const update = () => {
      const now = new Date().getTime();
      const end = new Date(campaign.expiresAt!).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Expirado");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [campaign?.expiresAt]);

  if (!campaign || currentPlan !== "free") return null;

  const discount = Math.round(
    ((campaign.originalPrice - campaign.offerPrice) / campaign.originalPrice) * 100
  );
  const slotsRemaining = campaign.limitedSlots
    ? campaign.limitedSlots - campaign.slotsUsed
    : null;

  return (
    <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Badge */}
      {campaign.badgeText && (
        <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
          {campaign.badgeText}
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <div className="bg-white/20 rounded-lg p-2">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{campaign.headline}</h3>
          <p className="text-white/80 text-sm mt-1">{campaign.description}</p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-white/60 line-through text-sm">
          R${campaign.originalPrice.toFixed(2)}/mes
        </span>
        <span className="text-2xl font-bold">
          R${campaign.offerPrice.toFixed(2)}/mes
        </span>
        <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded-full">
          -{discount}%
        </span>
      </div>

      {/* Urgency indicators */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        {timeLeft && (
          <div className="flex items-center gap-1 text-yellow-300">
            <Clock className="w-4 h-4" />
            {timeLeft}
          </div>
        )}
        {slotsRemaining !== null && (
          <div className="flex items-center gap-1 text-orange-300">
            <Zap className="w-4 h-4" />
            {slotsRemaining} vagas restantes
          </div>
        )}
      </div>

      <Link href={`/checkout?plan=${campaign.targetPlan}&campaign=${campaign.slug}`}>
        <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold">
          Aproveitar Oferta
        </Button>
      </Link>
    </div>
  );
}
