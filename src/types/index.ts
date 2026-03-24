// Steddi — shared types
// More specific DB types live in types/supabase.ts

export type Segment = "food" | "varejo" | "saude" | "servicos" | "educacao";
export type TaxRegime = "simples" | "presumido" | "mei";
export type TransactionType = "receita" | "despesa";
export type SubscriptionPlan = "starter" | "pro" | "multi";
export type SubscriptionStatus =
  | "trial"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

export interface KPIData {
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  revenueChange?: number;
  expensesChange?: number;
  profitChange?: number;
  marginChange?: number;
}

export interface BreakevenData {
  fixedCosts: number;
  accumulatedRevenue: number;
  progress: number;
  achievedOnDay: number | null;
  projectedDay: number | null;
}
