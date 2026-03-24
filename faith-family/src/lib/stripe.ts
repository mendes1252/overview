import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export const PLANS = {
  monthly: {
    name: "Plano Mensal",
    price: 2490, // R$ 24,90 in cents
    interval: "month" as const,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID ?? "",
  },
  annual: {
    name: "Plano Anual",
    price: 23880, // R$ 238,80 (~R$ 19,90/mês, 20% off)
    interval: "year" as const,
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID ?? "",
  },
} as const;
