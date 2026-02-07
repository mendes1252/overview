import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Gratuito",
    description: "Para começar sua jornada de produtividade",
    price: 0,
    features: [
      "Até 10 tarefas ativas",
      "Até 3 hábitos",
      "1 meta por período",
      "Relatórios básicos mensais",
    ],
    limits: {
      tasks: 10,
      habits: 3,
      goals: 1,
      reports: "monthly",
    },
  },
  pro: {
    name: "Pro",
    description: "Para quem leva produtividade a sério",
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    price: 29.9,
    features: [
      "Tarefas ilimitadas",
      "Hábitos ilimitados",
      "Metas ilimitadas",
      "Relatórios semanais com IA",
      "Coach de IA personalizado",
      "Exportação de dados",
      "Suporte prioritário",
    ],
    limits: {
      tasks: Infinity,
      habits: Infinity,
      goals: Infinity,
      reports: "weekly",
    },
  },
  enterprise: {
    name: "Enterprise",
    description: "Para times e empresas",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    price: 99.9,
    features: [
      "Tudo do plano Pro",
      "Dashboard de time",
      "Relatórios consolidados",
      "API access",
      "SSO",
      "Suporte dedicado",
    ],
    limits: {
      tasks: Infinity,
      habits: Infinity,
      goals: Infinity,
      reports: "daily",
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;
