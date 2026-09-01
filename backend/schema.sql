-- GovVendor AI: Enterprise Supabase / PostgreSQL Database Schema
-- Production Ready Schema synchronized with Supabase Architecture

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Subscription Plans Reference Table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id character varying NOT NULL,
  name character varying NOT NULL,
  price_inr integer NOT NULL,
  billing_period character varying DEFAULT 'monthly'::character varying,
  monthly_evaluation_quota integer NOT NULL,
  has_vector_rag boolean DEFAULT false,
  has_pricing_advisor boolean DEFAULT false,
  has_pdf_dossier_export boolean DEFAULT false,
  razorpay_plan_id character varying,
  CONSTRAINT subscription_plans_pkey PRIMARY KEY (id)
);

-- Seed Default Subscription Plans
INSERT INTO public.subscription_plans (id, name, price_inr, billing_period, monthly_evaluation_quota, has_vector_rag, has_pricing_advisor, has_pdf_dossier_export, razorpay_plan_id)
VALUES 
    ('FREE', 'Free Tier', 0, 'monthly', 5, FALSE, FALSE, FALSE, NULL),
    ('STARTER', 'Starter Plan', 9900, 'monthly', 50, FALSE, TRUE, TRUE, 'plan_starter_99_mo'),
    ('PRO', 'Enterprise Pro Plan', 49900, 'monthly', -1, TRUE, TRUE, TRUE, 'plan_pro_499_mo')
ON CONFLICT (id) DO NOTHING;

-- 2. Vendors Profile Table
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  role character varying NOT NULL,
  gstin character varying NOT NULL UNIQUE,
  pan character varying NOT NULL,
  turnover_cr numeric DEFAULT 0.00,
  experience_years integer DEFAULT 1,
  udyam_number character varying,
  dpiit_registered boolean DEFAULT false,
  brand_name character varying,
  contractor_class character varying,
  mii_percentage numeric DEFAULT 50.00,
  compliance_score numeric DEFAULT 85.00,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vendors_pkey PRIMARY KEY (id)
);

-- 3. User Authentication Table
CREATE TABLE IF NOT EXISTS public.user_auth (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vendor_id uuid,
  email character varying NOT NULL UNIQUE,
  hashed_password character varying NOT NULL,
  full_name character varying,
  phone bigint,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone,
  CONSTRAINT user_auth_pkey PRIMARY KEY (id),
  CONSTRAINT user_auth_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE
);

-- 4. Government Procurement Officers Table
CREATE TABLE IF NOT EXISTS public.officers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  badge_id character varying NOT NULL UNIQUE,
  full_name character varying NOT NULL,
  designation character varying NOT NULL,
  ministry character varying NOT NULL,
  department character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  phone bigint,
  clearance_level character varying DEFAULT 'LEVEL_3_CAG_SIGNER'::character varying,
  cag_key_hash character varying,
  profile_photo_url text,
  office_location character varying DEFAULT 'New Delhi, India'::character varying,
  is_active boolean DEFAULT true,
  CONSTRAINT officers_pkey PRIMARY KEY (id)
);

-- 5. Government Officer Authentication Table
CREATE TABLE IF NOT EXISTS public.gov_auth (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  officer_id uuid,
  email character varying NOT NULL UNIQUE,
  badge_id character varying NOT NULL,
  hashed_password character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone,
  CONSTRAINT gov_auth_pkey PRIMARY KEY (id),
  CONSTRAINT gov_auth_officer_id_fkey FOREIGN KEY (officer_id) REFERENCES public.officers(id) ON DELETE CASCADE
);

-- 6. Feature Quotas & Monthly Counter Table
CREATE TABLE IF NOT EXISTS public.feature_quotas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  plan_id character varying DEFAULT 'FREE'::character varying,
  evaluations_used integer DEFAULT 0,
  evaluations_limit integer DEFAULT 5,
  cycle_start_date timestamp with time zone DEFAULT now(),
  cycle_reset_date timestamp with time zone DEFAULT (now() + '30 days'::interval),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT feature_quotas_pkey PRIMARY KEY (id),
  CONSTRAINT feature_quotas_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_auth(id) ON DELETE CASCADE,
  CONSTRAINT feature_quotas_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id)
);

-- 7. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  plan_id character varying DEFAULT 'FREE'::character varying,
  status character varying NOT NULL,
  current_period_start timestamp with time zone DEFAULT now(),
  current_period_end timestamp with time zone DEFAULT (now() + '30 days'::interval),
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_auth(id) ON DELETE CASCADE,
  CONSTRAINT subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id)
);

-- 8. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  subscription_id uuid,
  razorpay_order_id character varying,
  razorpay_payment_id character varying UNIQUE,
  razorpay_signature character varying,
  amount_inr numeric NOT NULL,
  currency character varying DEFAULT 'INR'::character varying,
  status character varying NOT NULL,
  payment_method character varying,
  event_type character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_auth(id) ON DELETE SET NULL,
  CONSTRAINT transactions_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON DELETE SET NULL
);

-- 9. Evaluation Logs Table
CREATE TABLE IF NOT EXISTS public.evaluation_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vendor_id uuid,
  officer_id uuid,
  tender_id character varying NOT NULL,
  anon_token character varying NOT NULL,
  compliance_status character varying NOT NULL,
  gfr_rule_reference character varying NOT NULL,
  merkle_hash character varying NOT NULL,
  ai_confidence_score numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT evaluation_logs_pkey PRIMARY KEY (id),
  CONSTRAINT evaluation_logs_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL,
  CONSTRAINT evaluation_logs_officer_id_fkey FOREIGN KEY (officer_id) REFERENCES public.officers(id) ON DELETE SET NULL
);

-- Optimized Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_auth_email ON public.user_auth(email);
CREATE INDEX IF NOT EXISTS idx_user_auth_vendor_id ON public.user_auth(vendor_id);
CREATE INDEX IF NOT EXISTS idx_gov_auth_email ON public.gov_auth(email);
CREATE INDEX IF NOT EXISTS idx_gov_auth_badge_id ON public.gov_auth(badge_id);
CREATE INDEX IF NOT EXISTS idx_officers_badge_id ON public.officers(badge_id);
CREATE INDEX IF NOT EXISTS idx_vendors_gstin ON public.vendors(gstin);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_quotas_user_id ON public.feature_quotas(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON public.transactions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_logs_tender_id ON public.evaluation_logs(tender_id);
