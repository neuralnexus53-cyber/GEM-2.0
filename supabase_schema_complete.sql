-- ============================================================================
-- Sovereign Procurement Suite (SIH 2026) - Locked 10-Table PostgreSQL Schema
-- Database Target: Supabase PostgreSQL
-- Foundation: GFR 2017, PPP-MII Order, MSME Public Procurement Policy 2012
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. SUBSCRIPTION PLANS TABLE
-- Defines billing tiers, evaluation quotas, and AI feature access flags
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price_inr INTEGER NOT NULL DEFAULT 0,
  billing_period VARCHAR(50) DEFAULT 'monthly',
  monthly_evaluation_quota INTEGER NOT NULL, -- -1 represents unlimited
  has_vector_rag BOOLEAN DEFAULT false,
  has_pricing_advisor BOOLEAN DEFAULT false,
  has_pdf_dossier_export BOOLEAN DEFAULT false,
  razorpay_plan_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. VENDORS TABLE
-- Core seller registry strictly adhering to GeM 3-tier seller classifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('OEM_SELLER', 'AUTHORIZED_RESELLER', 'SERVICE_PROVIDER')),
  gstin VARCHAR(15) NOT NULL UNIQUE,
  pan VARCHAR(10) NOT NULL,
  cin VARCHAR(21) UNIQUE,
  gem_seller_id VARCHAR(50) UNIQUE,
  registered_address TEXT,
  gem_star_rating NUMERIC(2,1) DEFAULT 4.8 CHECK (gem_star_rating >= 0.0 AND gem_star_rating <= 5.0),
  turnover_cr NUMERIC(12,2) DEFAULT 0.00,
  experience_years INTEGER DEFAULT 1,
  udyam_number VARCHAR(50),      -- MSME Statutory Privilege Flag (GFR 170 EMD waiver)
  dpiit_registered BOOLEAN DEFAULT false, -- Startup Statutory Privilege Flag (GFR 173 relaxation)
  brand_name VARCHAR(100),
  contractor_class VARCHAR(50),  -- Class 1, 2, 3 Works Contractor
  mii_percentage NUMERIC(5,2) DEFAULT 50.00, -- PPP-MII Local Content %
  compliance_score NUMERIC(5,2) DEFAULT 85.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. VENDOR STATUTORY DOCUMENTS TABLE
-- Statutory document expiry tracking & proactive alert registry
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.vendor_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('CA_UDIN', 'MSME_UDYAM', 'ISO_9001', 'SPCB_NOC', 'CPWD_ENLISTMENT', 'OTHER')),
  document_number VARCHAR(100),
  expiry_date DATE NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  file_hash VARCHAR(128),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. USER AUTHENTICATION TABLE
-- Vendor portal user accounts & credential hashes
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_auth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone BIGINT,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 5. GOVERNMENT PROCUREMENT OFFICERS TABLE
-- Evaluation committee officers, buyers, and technical scrutinizers
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.officers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_id VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  ministry VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone BIGINT,
  clearance_level VARCHAR(50) DEFAULT 'LEVEL_3_COMMITTEE_CHAIR',
  office_location VARCHAR(255) DEFAULT 'New Delhi, India',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. GOVERNMENT OFFICER AUTHENTICATION TABLE
-- Secure authentication registry for government evaluation officers
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.gov_auth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  officer_id UUID REFERENCES public.officers(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  badge_id VARCHAR(50) NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 7. FEATURE QUOTAS TABLE
-- Real-time tracking of AI bid evaluation consumption vs plan limits
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.feature_quotas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_auth(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) REFERENCES public.subscription_plans(id) DEFAULT 'FREE',
  evaluations_used INTEGER DEFAULT 0,
  evaluations_limit INTEGER DEFAULT 5,
  cycle_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cycle_reset_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. SUBSCRIPTIONS TABLE
-- Active billing lifecycles, renewal cycles, and cancellation states
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_auth(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) REFERENCES public.subscription_plans(id) DEFAULT 'FREE',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 9. TRANSACTIONS TABLE
-- Financial ledger for subscription upgrades, GST compliance, and receipts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_auth(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(255),
  amount_inr NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) NOT NULL DEFAULT 'captured',
  payment_method VARCHAR(50) DEFAULT 'sovereign_gateway',
  event_type VARCHAR(50) DEFAULT 'order.paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 10. EVALUATION LOGS TABLE
-- AI bid evaluation scrutiny logs, risk alerts, and cryptographic audit hashes
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.evaluation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  officer_id UUID REFERENCES public.officers(id) ON DELETE SET NULL,
  tender_id VARCHAR(100) NOT NULL,
  tender_title VARCHAR(255),
  anon_token VARCHAR(100) NOT NULL,
  compliance_status VARCHAR(50) NOT NULL,
  gfr_rule_reference VARCHAR(100) NOT NULL,
  merkle_hash VARCHAR(128) NOT NULL,
  ai_confidence_score NUMERIC(5,2) NOT NULL DEFAULT 95.00,
  risk_alerts_count INTEGER DEFAULT 0,
  is_disputed BOOLEAN DEFAULT false,
  dispute_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_vendors_gstin ON public.vendors(gstin);
CREATE INDEX IF NOT EXISTS idx_vendors_role ON public.vendors(role);
CREATE INDEX IF NOT EXISTS idx_vendor_documents_vendor_id ON public.vendor_documents(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_documents_expiry ON public.vendor_documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_user_auth_email ON public.user_auth(email);
CREATE INDEX IF NOT EXISTS idx_user_auth_vendor_id ON public.user_auth(vendor_id);
CREATE INDEX IF NOT EXISTS idx_officers_badge_id ON public.officers(badge_id);
CREATE INDEX IF NOT EXISTS idx_gov_auth_email ON public.gov_auth(email);
CREATE INDEX IF NOT EXISTS idx_feature_quotas_user_id ON public.feature_quotas(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_logs_vendor_id ON public.evaluation_logs(vendor_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_logs_tender_id ON public.evaluation_logs(tender_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_logs_merkle_hash ON public.evaluation_logs(merkle_hash);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gov_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_logs ENABLE ROW LEVEL SECURITY;

-- Read policies for public plans
CREATE POLICY "Public Read Access for Plans" ON public.subscription_plans
  FOR SELECT USING (true);

-- Authenticated / Service role open access (customizable per JWT claims in production)
CREATE POLICY "Vendors Self Access" ON public.vendors
  FOR ALL USING (true);

CREATE POLICY "Vendor Documents Access" ON public.vendor_documents
  FOR ALL USING (true);

CREATE POLICY "User Auth Access" ON public.user_auth
  FOR ALL USING (true);

CREATE POLICY "Officers Access" ON public.officers
  FOR ALL USING (true);

CREATE POLICY "Gov Auth Access" ON public.gov_auth
  FOR ALL USING (true);

CREATE POLICY "Feature Quotas Access" ON public.feature_quotas
  FOR ALL USING (true);

CREATE POLICY "Subscriptions Access" ON public.subscriptions
  FOR ALL USING (true);

CREATE POLICY "Transactions Access" ON public.transactions
  FOR ALL USING (true);

CREATE POLICY "Evaluation Logs Access" ON public.evaluation_logs
  FOR ALL USING (true);

-- ============================================================================
-- SEED DATA: SUBSCRIPTION PLANS
-- ============================================================================
INSERT INTO public.subscription_plans (id, name, price_inr, billing_period, monthly_evaluation_quota, has_vector_rag, has_pricing_advisor, has_pdf_dossier_export, razorpay_plan_id)
VALUES 
  ('FREE', 'Sovereign Free Tier', 0, 'monthly', 5, false, false, false, NULL),
  ('STARTER', 'MSME Starter Suite', 9900, 'monthly', 50, false, true, true, 'plan_starter_99_mo'),
  ('PRO', 'Enterprise Sovereign Pro', 49900, 'monthly', -1, true, true, true, 'plan_pro_499_mo')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  price_inr = EXCLUDED.price_inr,
  monthly_evaluation_quota = EXCLUDED.monthly_evaluation_quota,
  has_vector_rag = EXCLUDED.has_vector_rag,
  has_pricing_advisor = EXCLUDED.has_pricing_advisor,
  has_pdf_dossier_export = EXCLUDED.has_pdf_dossier_export;

-- ============================================================================
-- SEED DATA: 3 GeM DEMO VENDORS
-- ============================================================================
-- 1. OEM Vendor
INSERT INTO public.vendors (id, name, role, gstin, pan, cin, gem_seller_id, registered_address, gem_star_rating, turnover_cr, experience_years, udyam_number, dpiit_registered, brand_name, mii_percentage, compliance_score)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'Apex Dynamics Private Limited',
  'OEM_SELLER',
  '07AABCA1234F1Z5',
  'AABCA1234F',
  'U72200DL2018PTC123456',
  'GEM-OEM-2024-8891',
  'Plot 42, Okhla Industrial Area Phase III, New Delhi 110020',
  4.9,
  14.50,
  6,
  'UDYAM-DL-01-0044921',
  true,
  'ApexSecure',
  82.50,
  98.40
) ON CONFLICT (gstin) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  gem_star_rating = EXCLUDED.gem_star_rating;

-- 2. Authorized Reseller Vendor
INSERT INTO public.vendors (id, name, role, gstin, pan, cin, gem_seller_id, registered_address, gem_star_rating, turnover_cr, experience_years, udyam_number, dpiit_registered, brand_name, mii_percentage, compliance_score)
VALUES (
  'b2222222-2222-2222-2222-222222222222',
  'Novavolt Commercial Limited',
  'AUTHORIZED_RESELLER',
  '27AACCN9988K1Z2',
  'AACCN9988K',
  'L51909MH2015PLC654321',
  'GEM-RES-2023-4102',
  'Unit 804, Bandra Kurla Complex, Mumbai 400051',
  4.8,
  8.20,
  4,
  'UDYAM-MH-02-0012890',
  false,
  'Novavolt Partner',
  64.00,
  92.10
) ON CONFLICT (gstin) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  gem_star_rating = EXCLUDED.gem_star_rating;

-- 3. Service Provider Vendor
INSERT INTO public.vendors (id, name, role, gstin, pan, cin, gem_seller_id, registered_address, gem_star_rating, turnover_cr, experience_years, udyam_number, dpiit_registered, contractor_class, mii_percentage, compliance_score)
VALUES (
  'c3333333-3333-3333-3333-333333333333',
  'Bharat Infra-Tech Solutions',
  'SERVICE_PROVIDER',
  '06AAEFB5544H1Z8',
  'AAEFB5544H',
  'U45200HR2019PTC789123',
  'GEM-SRV-2022-9931',
  'Tower B, Cyber City, Gurugram, Haryana 122002',
  4.7,
  22.00,
  7,
  'UDYAM-HR-04-0087612',
  false,
  'Class I CPWD',
  76.00,
  88.50
) ON CONFLICT (gstin) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  gem_star_rating = EXCLUDED.gem_star_rating;

-- ============================================================================
-- SEED DATA: STATUTORY CERTIFICATES (vendor_documents)
-- ============================================================================
INSERT INTO public.vendor_documents (vendor_id, document_type, document_number, expiry_date, is_verified, file_hash)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'CA_UDIN', '24123456AAAA1234', '2026-10-15', true, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
  ('a1111111-1111-1111-1111-111111111111', 'MSME_UDYAM', 'UDYAM-DL-01-0044921', '2027-03-31', true, 'ca978112ca1bbdcaf064278e4a1f2c41c3e387f54c9a4f4d2f093a1ef5d194cf'),
  ('a1111111-1111-1111-1111-111111111111', 'ISO_9001', 'ISO-9001-2026-IND-09', '2026-11-20', true, 'f4534a66a1e8c75c872d80d25c64c8d5d1c5d0a6c0e8a7d3b5b1a2c3d4e5f6a7'),
  ('a1111111-1111-1111-1111-111111111111', 'SPCB_NOC', 'NOC/SPCB/DL/2024/991', '2026-12-05', true, '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'),
  ('a1111111-1111-1111-1111-111111111111', 'CPWD_ENLISTMENT', 'CPWD/DEL/CL-1/4891', '2027-01-15', true, '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'),
  ('b2222222-2222-2222-2222-222222222222', 'CA_UDIN', '24123456BBBB5678', '2026-09-28', true, 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'),
  ('b2222222-2222-2222-2222-222222222222', 'MSME_UDYAM', 'UDYAM-MH-02-0012890', '2027-03-31', true, '88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589'),
  ('c3333333-3333-3333-3333-333333333333', 'CPWD_ENLISTMENT', 'CPWD/HR/CL-1/2021', '2026-12-31', true, '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b');

-- ============================================================================
-- SEED DATA: USER ACCOUNTS (user_auth)
-- ============================================================================
INSERT INTO public.user_auth (id, vendor_id, email, hashed_password, full_name, is_active, is_verified)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'director@apexdynamics.in', crypt('Sovereign@2026', gen_salt('bf')), 'Col. Arvind Sharma (Retd)', true, true),
  ('d2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'tenders@novavolt.co.in', crypt('Sovereign@2026', gen_salt('bf')), 'Priya Deshmukh', true, true),
  ('d3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'bids@bharatinfra.com', crypt('Sovereign@2026', gen_salt('bf')), 'Rajeshwer Hooda', true, true)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- SEED DATA: FEATURE QUOTAS & SUBSCRIPTIONS
-- ============================================================================
INSERT INTO public.feature_quotas (user_id, plan_id, evaluations_used, evaluations_limit)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'PRO', 12, -1),
  ('d2222222-2222-2222-2222-222222222222', 'STARTER', 18, 50),
  ('d3333333-3333-3333-3333-333333333333', 'FREE', 3, 5)
ON CONFLICT DO NOTHING;

INSERT INTO public.subscriptions (user_id, plan_id, status)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'PRO', 'active'),
  ('d2222222-2222-2222-2222-222222222222', 'STARTER', 'active'),
  ('d3333333-3333-3333-3333-333333333333', 'FREE', 'active')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: EVALUATION LOGS WITH MERKLE CRYPTOGRAPHIC AUDIT PROOFS
-- ============================================================================
INSERT INTO public.evaluation_logs (vendor_id, tender_id, tender_title, anon_token, compliance_status, gfr_rule_reference, merkle_hash, ai_confidence_score, risk_alerts_count)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'GEM/2026/B/8912401',
    'National Quantum Computing Infrastructure Node Deployment (MeitY)',
    'SOV-ANON-88912-DL',
    'COMPLIANT',
    'GFR Rule 170(i) & Rule 173(i)',
    '7d5f0e9b4e6d3c2a1f8b9a0c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
    98.40,
    1
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'GEM/2026/B/7761209',
    'High-Altitude Optical Surveillance System (MoD Border Roads)',
    'SOV-ANON-77612-DL',
    'COMPLIANT',
    'PPP-MII Order 2017 (Class I)',
    '3c2a1f8b9a0c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e7d5f0e9b4e6d',
    96.10,
    2
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'GEM/2026/B/6541982',
    'Enterprise Network Switches & SD-WAN Routing Hardware (DoT)',
    'SOV-ANON-65419-MH',
    'PARTIALLY_COMPLIANT',
    'GeM GTC Cl 4.19 (MAF Verification)',
    '1f2a3b4c5d6e7f8a9b0c1d2e7d5f0e9b4e6d3c2a1f8b9a0c3d4e5f6a7b8c9d0e',
    89.20,
    3
  );
