-- ============================================================
-- Steddi — Initial Schema Migration
-- Sprint 1 · Foundation
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: users
-- Extends Supabase auth.users with app-specific fields
-- ============================================================
CREATE TABLE public.users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  name         TEXT,
  plan         TEXT CHECK (plan IN ('starter', 'pro', 'multi')) DEFAULT NULL,
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger: create user row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- TABLE: units (unidades/lojas)
-- ============================================================
CREATE TABLE public.units (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  brand_name           TEXT NOT NULL,
  segment              TEXT NOT NULL CHECK (segment IN ('food', 'varejo', 'saude', 'servicos', 'educacao')),
  city                 TEXT,
  state                TEXT,
  tax_regime           TEXT NOT NULL DEFAULT 'simples' CHECK (tax_regime IN ('simples', 'presumido', 'mei')),
  investment_total     NUMERIC(15, 2),
  royalty_pct          NUMERIC(5, 2),
  mkt_fund_pct         NUMERIC(5, 2),
  avg_monthly_revenue  NUMERIC(15, 2),
  opened_at            DATE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own units"
  ON public.units FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  segment     TEXT,             -- NULL = common to all segments
  is_default  BOOLEAN NOT NULL DEFAULT TRUE,
  icon        TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories are readable by all authenticated users
CREATE POLICY "Authenticated users can read categories"
  ON public.categories FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: transactions
-- ============================================================
CREATE TABLE public.transactions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id              UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  type                 TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  amount               NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  category_id          UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  date                 DATE NOT NULL,
  description          TEXT,
  is_recurring         BOOLEAN NOT NULL DEFAULT FALSE,
  recurring_frequency  TEXT CHECK (recurring_frequency IN ('mensal', 'semanal')),
  is_estimated         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own unit transactions"
  ON public.transactions FOR SELECT
  USING (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own unit transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own unit transactions"
  ON public.transactions FOR UPDATE
  USING (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own unit transactions"
  ON public.transactions FOR DELETE
  USING (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()));

-- ============================================================
-- TABLE: employees
-- ============================================================
CREATE TABLE public.employees (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id           UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  role              TEXT,
  salary_gross      NUMERIC(15, 2) NOT NULL,
  admission_date    DATE,
  vt_value          NUMERIC(15, 2) DEFAULT 0,
  va_value          NUMERIC(15, 2) DEFAULT 0,
  has_health_plan   BOOLEAN DEFAULT FALSE,
  health_plan_value NUMERIC(15, 2) DEFAULT 0,
  has_insalubrity   BOOLEAN DEFAULT FALSE,
  has_periculosity  BOOLEAN DEFAULT FALSE,
  union_pct         NUMERIC(5, 2) DEFAULT 0,
  uniform_annual    NUMERIC(15, 2) DEFAULT 0,
  training_annual   NUMERIC(15, 2) DEFAULT 0,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own unit employees"
  ON public.employees FOR ALL
  USING (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()))
  WITH CHECK (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()));

-- ============================================================
-- TABLE: alerts
-- ============================================================
CREATE TABLE public.alerts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id    UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('cost_deviation', 'margin_drop', 'breakeven_risk', 'stock_low')),
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  severity   TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own unit alerts"
  ON public.alerts FOR ALL
  USING (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()))
  WITH CHECK (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()));

-- ============================================================
-- TABLE: reports
-- ============================================================
CREATE TABLE public.reports (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id        UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  month          INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year           INTEGER NOT NULL,
  pdf_url        TEXT,
  total_revenue  NUMERIC(15, 2),
  total_expenses NUMERIC(15, 2),
  net_profit     NUMERIC(15, 2),
  ai_analysis    TEXT,
  generated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own unit reports"
  ON public.reports FOR ALL
  USING (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()))
  WITH CHECK (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()));

-- ============================================================
-- TABLE: subscriptions
-- ============================================================
CREATE TABLE public.subscriptions (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan                   TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'multi')),
  status                 TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'canceled', 'expired')),
  asaas_customer_id      TEXT,
  asaas_subscription_id  TEXT,
  trial_ends_at          TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  current_period_end     TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- TABLE: goals
-- ============================================================
CREATE TABLE public.goals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id       UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('margem', 'lucro', 'receita', 'cmv_pct')),
  target_value  NUMERIC(15, 2) NOT NULL,
  current_value NUMERIC(15, 2),
  month         INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year          INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own unit goals"
  ON public.goals FOR ALL
  USING (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()))
  WITH CHECK (unit_id IN (SELECT id FROM public.units WHERE user_id = auth.uid()));

-- ============================================================
-- SEED: Default categories (common to all segments)
-- ============================================================

-- Receitas comuns
INSERT INTO public.categories (name, type, segment, is_default, icon, sort_order) VALUES
  ('Vendas / Faturamento',        'receita', NULL, TRUE, 'shopping-bag',     1),
  ('Delivery / Apps',             'receita', NULL, TRUE, 'smartphone',        2),
  ('Outros (receita)',            'receita', NULL, TRUE, 'plus-circle',      99);

-- Despesas comuns a todos os segmentos
INSERT INTO public.categories (name, type, segment, is_default, icon, sort_order) VALUES
  ('Aluguel',                     'despesa', NULL, TRUE, 'home',              1),
  ('Condomínio / IPTU',           'despesa', NULL, TRUE, 'building',          2),
  ('Energia Elétrica',            'despesa', NULL, TRUE, 'zap',               3),
  ('Água',                        'despesa', NULL, TRUE, 'droplets',          4),
  ('Internet / Telefone',         'despesa', NULL, TRUE, 'wifi',              5),
  ('Contabilidade',               'despesa', NULL, TRUE, 'calculator',        6),
  ('Software / Sistemas',         'despesa', NULL, TRUE, 'monitor',           7),
  ('Seguro',                      'despesa', NULL, TRUE, 'shield',            8),
  ('Manutenção',                  'despesa', NULL, TRUE, 'wrench',            9),
  ('Marketing Local',             'despesa', NULL, TRUE, 'megaphone',        10),
  ('Royalties',                   'despesa', NULL, TRUE, 'percent',          11),
  ('Fundo de Marketing',          'despesa', NULL, TRUE, 'trending-up',      12),
  ('Impostos',                    'despesa', NULL, TRUE, 'file-text',        13),
  ('Pró-labore',                  'despesa', NULL, TRUE, 'user',             14),
  ('Folha de Pagamento',          'despesa', NULL, TRUE, 'users',            15),
  ('Outros (despesa)',            'despesa', NULL, TRUE, 'plus-circle',      99);

-- Despesas por segmento: Food Service
INSERT INTO public.categories (name, type, segment, is_default, icon, sort_order) VALUES
  ('CMV — Insumos',               'despesa', 'food', TRUE, 'package',          20),
  ('Embalagens',                  'despesa', 'food', TRUE, 'box',              21),
  ('Gás',                         'despesa', 'food', TRUE, 'flame',            22),
  ('Descartáveis',                'despesa', 'food', TRUE, 'trash-2',          23);

-- Despesas por segmento: Varejo
INSERT INTO public.categories (name, type, segment, is_default, icon, sort_order) VALUES
  ('CMV — Mercadorias',           'despesa', 'varejo', TRUE, 'package',        20),
  ('Embalagens',                  'despesa', 'varejo', TRUE, 'box',            21),
  ('Frete',                       'despesa', 'varejo', TRUE, 'truck',          22),
  ('Perdas / Avarias',            'despesa', 'varejo', TRUE, 'alert-triangle', 23);

-- Despesas por segmento: Saúde/Estética
INSERT INTO public.categories (name, type, segment, is_default, icon, sort_order) VALUES
  ('Insumos / Materiais',         'despesa', 'saude', TRUE, 'activity',        20),
  ('Descartáveis',                'despesa', 'saude', TRUE, 'trash-2',         21),
  ('Equipamentos',                'despesa', 'saude', TRUE, 'tool',            22);

-- Despesas por segmento: Serviços
INSERT INTO public.categories (name, type, segment, is_default, icon, sort_order) VALUES
  ('Insumos',                     'despesa', 'servicos', TRUE, 'package',      20),
  ('Materiais de Limpeza',        'despesa', 'servicos', TRUE, 'droplets',     21),
  ('Equipamentos',                'despesa', 'servicos', TRUE, 'tool',         22);

-- Despesas por segmento: Educação
INSERT INTO public.categories (name, type, segment, is_default, icon, sort_order) VALUES
  ('Material Didático',           'despesa', 'educacao', TRUE, 'book-open',    20),
  ('Licenças de Software',        'despesa', 'educacao', TRUE, 'monitor',      21);
