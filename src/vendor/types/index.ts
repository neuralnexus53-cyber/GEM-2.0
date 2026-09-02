export type UserRole = 'OEM_SELLER' | 'MSME_STARTUP' | 'WORKS_CONTRACTOR';

export interface VendorProfile {
  id: string;
  name: string;
  role: UserRole;
  gstin: string;
  pan: string;
  turnoverCr: number; // in Crores INR
  experienceYears: number;
  udyamNumber?: string;
  dpiitRegistered?: boolean;
  brandName?: string;
  oemCertifications?: string[];
  contractorClass?: string; // Class-1, Class-2
  miiPercentage: number; // Make in India local content %
  complianceScore: number; // 0-100
  verifiedDocsCount: number;
  totalDocsCount: number;
  profilePhotoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  authorizedSignatory?: string;
  address?: string;
  state?: string;
  pincode?: string;
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
}

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  verified: boolean;
}

export interface OcrDocument {
  id: string;
  name: string;
  type: 'GSTIN' | 'PAN' | 'TURNOVER_CA' | 'UDYAM' | 'DPIIT' | 'PQC_EXPERIENCE' | 'OEM_AUTH' | 'BIS_CERT';
  fileName: string;
  uploadDate: string;
  fileSize: string;
  status: 'SCANNING' | 'VERIFIED' | 'DISCREPANCY_FLAGGED' | 'PENDING';
  confidence: number;
  extractedFields: ExtractedField[];
  highlightText?: string;
  parsedSummary: string;
}

export interface PqcCriterion {
  id: string;
  title: string;
  requirement: string;
  vendorValue: string;
  status: 'PASS' | 'SHORTFALL' | 'RELAXED_MSME' | 'REVIEW_NEEDED';
  shortfallPercentage?: number;
  aiExplanation: string;
  remedyAction?: string;
}

export interface EligibilityEvaluation {
  tenderId: string;
  tenderTitle: string;
  overallStatus: 'ELIGIBLE' | 'AT_RISK' | 'DISQUALIFIED' | 'ELIGIBLE_WITH_RELAXATION';
  score: number; // 0 - 100
  evaluatedWithModel: string; // "Llama 3 70B (GovPrequal Fine-Tuned)"
  criteria: PqcCriterion[];
  discrepancies: string[];
  recommendations: string[];
  timestamp: string;
}

export interface ContractClauseRisk {
  id: string;
  clauseNumber: string;
  clauseTitle: string;
  category: 'LIQUIDATED_DAMAGES' | 'BG_FORFEITURE' | 'ARBITRATION' | 'PRICE_VARIATION' | 'PAYMENT_MILESTONE' | 'WARRANTY';
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  originalText: string;
  vectorSimilarity: number; // % match with high-dispute historical clauses
  riskExplanation: string;
  recommendedMitigation: string;
  impactScore: number; // 1-10
}

export interface TenderItem {
  id: string;
  tenderRefNumber: string;
  title: string;
  organization: string; // e.g. "Ministry of Railways", "National Highways Authority (NHAI)"
  portal: 'GeM' | 'CPPP' | 'State eProcurement' | 'Defense Proc';
  category: 'Goods' | 'Works' | 'Services';
  estimatedValueCr: number; // in Crores INR
  emdAmountLakhs: number; // in Lakhs INR (or 0 for exempt)
  submissionDeadline: string;
  daysRemaining: number;
  aiMatchScore: number; // 0-100%
  suitableRoles: UserRole[];
  keyPqc: string[];
  location: string;
  hasMsmePreference: boolean;
  hasMiiPreference: boolean;
}

export interface BoQItem {
  id: string;
  itemCode: string;
  description: string;
  unit: string;
  quantity: number;
  estimatedRate: number;
  quotedRate: number;
  gstRate: number; // %
  notes?: string;
}

export interface MilestoneItem {
  id: string;
  milestoneName: string;
  targetDays: number;
  weightagePercent: number;
  paymentPercent: number;
  retentionPercent: number;
  slaCriteria: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'AT_RISK';
}

export interface CompetitorBid {
  name: string;
  bidAmountCr: number;
  variancePercentage: number;
  rank: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  marketShare: number;
}