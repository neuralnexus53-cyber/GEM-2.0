import { UserRole } from './index';

export type PlanTier = 'FREE' | 'STARTER' | 'PRO';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  role: UserRole;
  vendorId: string;
  gstin: string;
  pan: string;
  token: string;
  isMfaVerified: boolean;
  loginTimestamp: string;
  sessionId: string;
  ipAddress: string;
  planId?: PlanTier;
}

export interface SubscriptionState {
  planId: PlanTier;
  status: 'active' | 'halted' | 'canceled';
  evaluationsUsed: number;
  evaluationsLimit: number; // -1 for unlimited
  isAutopayEnabled: boolean;
  currentPeriodEnd: string;
  hasVectorRag: boolean;
  hasPricingAdvisor: boolean;
  hasPdfDossierExport: boolean;
}

export interface PlanFeature {
  name: string;
  includedIn: PlanTier[];
}

export const PLAN_DETAILS: Record<PlanTier, {
  name: string;
  priceINR: number;
  description: string;
  evaluationCap: string;
  badgeColor: string;
}> = {
  FREE: {
    name: 'Free Starter',
    priceINR: 0,
    description: 'Basic tender matching & standard OCR for initial exploration.',
    evaluationCap: '5 Tender Evaluations / Month',
    badgeColor: 'slate'
  },
  STARTER: {
    name: 'Growth Starter',
    priceINR: 99,
    description: 'Full Llama 3 Prequalification checks & BoQ Excel export.',
    evaluationCap: '50 Tender Evaluations / Month',
    badgeColor: 'cyan'
  },
  PRO: {
    name: 'Enterprise Pro',
    priceINR: 499,
    description: 'Unlimited AI evaluations, Atlas Vector Clause Risk RAG & Regional Pricing Guidance.',
    evaluationCap: 'Unlimited Evaluations',
    badgeColor: 'violet'
  }
};