-- GovVendor AI: Sovereign Procurement Suite (SIH 2026)
-- Complete Enterprise Supabase PostgreSQL Schema with 14 Synchronized Tables

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. SUBSCRIPTION PLANS REFERENCE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id character varying NOT NULL PRIMARY KEY,
  name character varying NOT NULL,
  price_inr integer NOT NULL,
  billing_period character varying DEFAULT 'monthly'::character varying,
  monthly_evaluation_quota integer NOT NULL,
  has_vector_rag boolean DEFAULT false,
  has_pricing_advisor boolean DEFAULT false,
  has_pdf_dossier_export boolean DEFAULT false,
  razorpay_plan_id character varying
);

INSERT INTO public.subscription_plans (id, name, price_inr, billing_period, monthly_evaluation_quota, has_vector_rag, has_pricing_advisor, has_pdf_dossier_export, razorpay_plan_id)
VALUES 
    ('FREE', 'Free Tier', 0, 'monthly', 5, FALSE, FALSE, FALSE, NULL),
    ('STARTER', 'Starter Plan', 9900, 'monthly', 50, FALSE, TRUE, TRUE, 'plan_starter_99_mo'),
    ('PRO', 'Enterprise Pro Plan', 49900, 'monthly', -1, TRUE, TRUE, TRUE, 'plan_pro_499_mo')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    price_inr = EXCLUDED.price_inr,
    monthly_evaluation_quota = EXCLUDED.monthly_evaluation_quota,
    has_vector_rag = EXCLUDED.has_vector_rag,
    has_pricing_advisor = EXCLUDED.has_pricing_advisor,
    has_pdf_dossier_export = EXCLUDED.has_pdf_dossier_export;

-- ============================================================================
-- 2. VENDORS PROFILE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- 3. USER AUTHENTICATION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_auth (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id uuid REFERENCES public.vendors(id) ON DELETE CASCADE,
  email character varying NOT NULL UNIQUE,
  hashed_password character varying NOT NULL,
  full_name character varying,
  phone bigint,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone
);

-- ============================================================================
-- 4. GOVERNMENT PROCUREMENT OFFICERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.officers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- 5. GOVERNMENT OFFICER AUTHENTICATION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.gov_auth (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  officer_id uuid REFERENCES public.officers(id) ON DELETE CASCADE,
  email character varying NOT NULL UNIQUE,
  badge_id character varying NOT NULL,
  hashed_password character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone
);

-- ============================================================================
-- 6. FEATURE QUOTAS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.feature_quotas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.user_auth(id) ON DELETE CASCADE,
  plan_id character varying REFERENCES public.subscription_plans(id) DEFAULT 'FREE'::character varying,
  evaluations_used integer DEFAULT 0,
  evaluations_limit integer DEFAULT 5,
  cycle_start_date timestamp with time zone DEFAULT now(),
  cycle_reset_date timestamp with time zone DEFAULT (now() + '30 days'::interval),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- 7. SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.user_auth(id) ON DELETE CASCADE,
  plan_id character varying REFERENCES public.subscription_plans(id) DEFAULT 'FREE'::character varying,
  status character varying NOT NULL DEFAULT 'active',
  current_period_start timestamp with time zone DEFAULT now(),
  current_period_end timestamp with time zone DEFAULT (now() + '30 days'::interval),
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- 8. TRANSACTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.user_auth(id) ON DELETE SET NULL,
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  razorpay_order_id character varying,
  razorpay_payment_id character varying,
  razorpay_signature character varying,
  amount_inr numeric NOT NULL DEFAULT 0.00,
  currency character varying DEFAULT 'INR'::character varying,
  status character varying NOT NULL DEFAULT 'captured',
  payment_method character varying DEFAULT 'sovereign_gateway',
  event_type character varying DEFAULT 'order.paid',
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- 9. EVALUATION LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.evaluation_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id uuid REFERENCES public.vendors(id) ON DELETE SET NULL,
  officer_id uuid REFERENCES public.officers(id) ON DELETE SET NULL,
  tender_id character varying NOT NULL,
  anon_token character varying NOT NULL,
  compliance_status character varying NOT NULL,
  gfr_rule_reference character varying NOT NULL,
  merkle_hash character varying NOT NULL,
  ai_confidence_score numeric NOT NULL DEFAULT 95.00,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- 10. TENDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tenders (
  id character varying NOT NULL PRIMARY KEY,
  tender_number character varying,
  tender_ref_number character varying,
  title text NOT NULL,
  department text NOT NULL,
  organization text DEFAULT 'Government Ministry / PSU',
  gem_category text,
  category character varying DEFAULT 'Goods',
  portal character varying DEFAULT 'GeM',
  location character varying DEFAULT 'Pan-India',
  estimated_budget numeric DEFAULT 0.00,
  estimated_value_cr numeric DEFAULT 0.00,
  emd_amount_lakhs numeric DEFAULT 0.00,
  days_remaining integer DEFAULT 20,
  submission_deadline text DEFAULT '30-Sep-2026',
  ai_match_score integer DEFAULT 90,
  has_msme_preference boolean DEFAULT true,
  has_mii_preference boolean DEFAULT true,
  status character varying DEFAULT 'TECHNICAL_EVALUATION',
  pqc_criteria jsonb DEFAULT '[]'::jsonb,
  key_pqc jsonb DEFAULT '[]'::jsonb,
  published_by uuid REFERENCES public.officers(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- 11. SUBMISSIONS TABLE (Double-Blind Vault)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.submissions (
  id character varying NOT NULL PRIMARY KEY,
  tender_id character varying REFERENCES public.tenders(id) ON DELETE CASCADE,
  masked_vendor_id character varying NOT NULL,
  vault_cipher_token text NOT NULL,
  actual_vendor_name_hidden text,
  actual_pan_hidden text,
  actual_gstin_hidden text,
  submitted_at timestamp with time zone DEFAULT now(),
  status character varying DEFAULT 'PENDING_EVALUATION',
  statutory jsonb DEFAULT '{}'::jsonb,
  ai_scorecard jsonb DEFAULT '{}'::jsonb,
  mii_audit jsonb DEFAULT '{}'::jsonb,
  officer_reviews jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- 12. CAG AUDIT LEDGER TABLE (Cryptographic Merkle Blockchain)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.cag_ledger (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  block_height integer NOT NULL UNIQUE,
  block_hash character varying NOT NULL UNIQUE,
  previous_hash character varying NOT NULL,
  timestamp timestamp with time zone DEFAULT now(),
  tender_id character varying,
  masked_vendor_id character varying NOT NULL,
  officer_context jsonb DEFAULT '{}'::jsonb,
  action character varying NOT NULL,
  evaluation_payload jsonb DEFAULT '{}'::jsonb,
  merkle_root character varying NOT NULL,
  signature text NOT NULL,
  verified boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- 13. VENDOR STATUTORY DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id character varying NOT NULL PRIMARY KEY,
  vendor_id character varying,
  name text NOT NULL,
  type character varying NOT NULL,
  size character varying DEFAULT '2.4 MB',
  upload_date timestamp with time zone DEFAULT now(),
  status character varying DEFAULT 'VERIFIED',
  docket_hash character varying,
  udin_number character varying,
  digilocker_verified boolean DEFAULT true,
  parsed_summary text,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- 14. BOQ ITEMS & PRICING BENCHMARKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.boq_items (
  id character varying NOT NULL PRIMARY KEY,
  item_code character varying NOT NULL,
  description text NOT NULL,
  unit character varying DEFAULT 'NOS',
  quantity numeric DEFAULT 1,
  estimated_rate numeric DEFAULT 0.00,
  quoted_rate numeric DEFAULT 0.00,
  historical_l1_rate numeric DEFAULT 0.00,
  deviation_percentage numeric DEFAULT 0.00,
  risk_indicator character varying DEFAULT 'NORMAL',
  tender_id character varying,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR ULTRA-FAST QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_auth_email ON public.user_auth(email);
CREATE INDEX IF NOT EXISTS idx_user_auth_vendor_id ON public.user_auth(vendor_id);
CREATE INDEX IF NOT EXISTS idx_gov_auth_email ON public.gov_auth(email);
CREATE INDEX IF NOT EXISTS idx_gov_auth_badge_id ON public.gov_auth(badge_id);
CREATE INDEX IF NOT EXISTS idx_officers_badge_id ON public.officers(badge_id);
CREATE INDEX IF NOT EXISTS idx_vendors_gstin ON public.vendors(gstin);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON public.tenders(status);
CREATE INDEX IF NOT EXISTS idx_submissions_tender_id ON public.submissions(tender_id);
CREATE INDEX IF NOT EXISTS idx_submissions_masked_id ON public.submissions(masked_vendor_id);
CREATE INDEX IF NOT EXISTS idx_cag_ledger_block_height ON public.cag_ledger(block_height);
CREATE INDEX IF NOT EXISTS idx_documents_vendor_id ON public.documents(vendor_id);
