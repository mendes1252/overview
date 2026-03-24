// Auto-generated types from Supabase. Run `npx supabase gen types` to update.
// Minimal stub for Sprint 1 — will be replaced after running migrations.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          plan: "starter" | "pro" | "multi" | null;
          trial_ends_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          plan?: "starter" | "pro" | "multi" | null;
          trial_ends_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          plan?: "starter" | "pro" | "multi" | null;
          trial_ends_at?: string | null;
          created_at?: string;
        };
      };
      units: {
        Row: {
          id: string;
          user_id: string;
          brand_name: string;
          segment: "food" | "varejo" | "saude" | "servicos" | "educacao";
          city: string | null;
          state: string | null;
          tax_regime: "simples" | "presumido" | "mei";
          investment_total: number | null;
          royalty_pct: number | null;
          mkt_fund_pct: number | null;
          avg_monthly_revenue: number | null;
          opened_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          brand_name: string;
          segment: "food" | "varejo" | "saude" | "servicos" | "educacao";
          city?: string | null;
          state?: string | null;
          tax_regime?: "simples" | "presumido" | "mei";
          investment_total?: number | null;
          royalty_pct?: number | null;
          mkt_fund_pct?: number | null;
          avg_monthly_revenue?: number | null;
          opened_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          brand_name?: string;
          segment?: "food" | "varejo" | "saude" | "servicos" | "educacao";
          city?: string | null;
          state?: string | null;
          tax_regime?: "simples" | "presumido" | "mei";
          investment_total?: number | null;
          royalty_pct?: number | null;
          mkt_fund_pct?: number | null;
          avg_monthly_revenue?: number | null;
          opened_at?: string | null;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          unit_id: string;
          type: "receita" | "despesa";
          amount: number;
          category_id: string | null;
          date: string;
          description: string | null;
          is_recurring: boolean;
          recurring_frequency: "mensal" | "semanal" | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          type: "receita" | "despesa";
          amount: number;
          category_id?: string | null;
          date: string;
          description?: string | null;
          is_recurring?: boolean;
          recurring_frequency?: "mensal" | "semanal" | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          unit_id?: string;
          type?: "receita" | "despesa";
          amount?: number;
          category_id?: string | null;
          date?: string;
          description?: string | null;
          is_recurring?: boolean;
          recurring_frequency?: "mensal" | "semanal" | null;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          type: "receita" | "despesa";
          segment: string | null;
          is_default: boolean;
          icon: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          type: "receita" | "despesa";
          segment?: string | null;
          is_default?: boolean;
          icon?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "receita" | "despesa";
          segment?: string | null;
          is_default?: boolean;
          icon?: string | null;
          sort_order?: number;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: "starter" | "pro" | "multi";
          status: "trial" | "active" | "canceled" | "expired" | "past_due";
          asaas_customer_id: string | null;
          asaas_subscription_id: string | null;
          trial_ends_at: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: "starter" | "pro" | "multi";
          status?: "trial" | "active" | "canceled" | "expired" | "past_due";
          asaas_customer_id?: string | null;
          asaas_subscription_id?: string | null;
          trial_ends_at?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: "starter" | "pro" | "multi";
          status?: "trial" | "active" | "canceled" | "expired" | "past_due";
          asaas_customer_id?: string | null;
          asaas_subscription_id?: string | null;
          trial_ends_at?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
