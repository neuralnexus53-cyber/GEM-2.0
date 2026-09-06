export type UserRole = 
  | 'SCRUTINY_OFFICER' 
  | 'TEC_MEMBER' 
  | 'BUYER_AUTHORITY' 
  | 'CAG_AUDITOR';

export type SupplierClass = 'Class-I' | 'Class-II' | 'Non-Local';

export type SubmissionStatus = 
  | 'PENDING_SCRUTINY' 
  | 'TEC_BLIND_EVAL' 
  | 'STATUTORY_FLAGGED' 
  | 'EVALUATION_APPROVED' 
  | 'FINANCIAL_UNMASKED' 
  | 'REJECTED';

export interface OfficerProfile {
  officerId: string; // e.g. "GEM-OFF-9041"
  fullName: string; // "Shri Rajesh Sharma"
  designation: string; // "Director (Procurement & Evaluation)"
  ministry: string; // "Ministry of Electronics & Information Technology"
  department: string; // "Public Procurement & GeM Governance Division"
  securityClearanceLevel: 'Level-4 (Top Secret / Sovereign Procurement)' | 'Level-3 (Confidential)' | 'Level-2 (Restricted)' | string;
  badgeId: string; // "GEM-OFF-9041"
  profilePhotoUrl?: string;
  email?: string;
  phone?: string;
  officeLocation?: string;
  dscCertificate: {
    issuer: string; // "National Informatics Centre (NIC-CA) Class-3"
    tokenType: string; // "PKCS#11 Hardware Token (ePass2003)"
    serialNumber: string; // "IN-NIC-8942-0199-B7"
    fingerprintSha256: string; // "7B8F9A01C2945DF8812456AE3290FE19823467AB"
    validUntil: string; // "2028-12-31"
    status: 'ACTIVE_VALIDATED' | 'REVOKED' | 'EXPIRED';
  };
  sessionContext: {
    tokenHash: string;
    loginTimestamp: string;
    ipAddress: string;
    mfaMethod: string; // "Dual-Factor: Aadhaar OTP + DSC Hardware Token"
    expiresInMinutes: number;
  };
}

export interface PQCItem {
  id: string;
  clauseNumber: string;
  description: string;
  mandatory: boolean;
  minThreshold: string;
  category: 'FINANCIAL' | 'TECHNICAL' | 'STATUTORY' | 'ESG_MII';
}

export interface Tender {
  id: string;
  tenderNumber: string;
  title: string;
  department: string;
  gemCategory: string;
  estimatedBudget: number; // in INR Crores
  emdAmount: number; // in INR Lakhs
  publishedDate: string;
  closingDate: string;
  status: 'ACTIVE_BIDDING' | 'TECHNICAL_EVALUATION' | 'FINANCIAL_OPENING' | 'AWARDED';
  evaluationMode: 'QCBS' | 'LCS_L1';
  weights: {
    technical: number;
    statutory: number;
    aiCompliance: number;
    miiLocalContent: number;
  };
  pqcCriteria: PQCItem[];
}

export interface DocumentDiscrepancy {
  id: string;
  docName: string;
  pageNumber: number;
  docParameter: string;
  declaredValue: string;
  llama3ExtractedValue: string;
  registryValue: string;
  discrepancyType: 'TURNOVER_MISMATCH' | 'EXPIRED_CERT' | 'CLAUSE_NON_COMPLIANCE' | 'RESTRICTED_TERMS' | 'FORGED_METADATA';
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM' | 'LOW';
  explanation: string;
  citationSnippet: string;
}

export interface StatutoryVerification {
  gstn: {
    status: 'ACTIVE' | 'SUSPENDED' | 'NON_COMPLIANT';
    regular3BFiling: boolean;
    turnoverVerifiedCr: number;
    panGstCrossMatch: boolean;
    lastFilingMonth: string;
  };
  epfo: {
    status: 'COMPLIANT' | 'DEFAULT_DETECTED';
    activeEmployeesCount: number;
    lastChallanDate: string;
    duesPending: number;
  };
  esic: {
    status: 'COMPLIANT' | 'DEFAULT';
    contributionMonthsRegular: number;
    lastContributionDate: string;
    employeeCount: number;
  };
  mca21: {
    status: 'ACTIVE' | 'STRIKE_OFF' | 'UNDER_LIQUIDATION';
    cinMasked: string;
    paidUpCapitalCr: number;
    disqualifiedDirectorsCount: number;
    chargeSatisfied: boolean;
  };
  udyam: {
    status: 'VERIFIED' | 'NOT_APPLICABLE' | 'MISMATCH';
    udyamNumberMasked: string;
    enterpriseType: 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE';
    priorityProcurementEligible: boolean;
    womenOwned: boolean;
    scStOwned: boolean;
  };
  digilocker: {
    status: 'AUTHENTICATED' | 'INVALID_HASH' | 'PENDING';
    verifiedHashesCount: number;
    rootCertFingerprint: string;
    docketSealVerified: boolean;
  };
  cpppDebarment: {
    status: 'CLEAR' | 'DEBARRED' | 'FLAGGED';
    debarmentCategory?: string;
    blacklistingAuthority?: string;
    checkedAt: string;
  };
  itr26as: {
    status: 'CONSISTENT' | 'MISMATCH' | 'UNDER_SCRUTINY';
    reportedTurnoverCr: number;
    gross26asCreditCr: number;
    filingAssessmentYear: string;
  };
  nsicStartup: {
    isDpiitStartup: boolean;
    startupCertificateNo?: string;
    nsicRegistered: boolean;
    oemAuthorizationValid: boolean;
  };
  overallHealthScore: number; // 0-100
  flags: string[];
}

export interface AICitation {
  clauseId: string;
  clauseTitle: string;
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
  confidenceScore: number; // 0-100%
  pageRef: number;
  sourceDoc: string;
  extractedSnippet: string;
  aiExplanation: string;
}

export interface AIScorecard {
  complianceScore: number; // 0-100
  confidenceRate: number; // 0-100%
  clausesPassed: number;
  clausesTotal: number;
  redFlags: string[];
  anomaliesDetected: string[];
  citations: AICitation[];
  discrepancies: DocumentDiscrepancy[];
}

export interface MIIBoMItem {
  componentName: string;
  countryOfOrigin: string;
  localContentPercent: number;
  costWeight: number;
  domesticValueAdditionInr: number;
}

export interface MIIAudit {
  supplierClass: SupplierClass;
  declaredPercentage: number;
  verifiedPercentage: number;
  auditorCertificateHash: string;
  auditorCertValid: boolean;
  purchasePreferenceEligible: boolean;
  marginOfPreference: number; // e.g. 20%
  bomItems: MIIBoMItem[];
}

export interface GFRJustification {
  ruleCited: string; // e.g. "Rule 173(xxii) - Technical Clarification & Concurrence"
  justificationText: string;
  overturnedRecommendation: string;
  statutoryRiskAccepted: boolean;
  loggedAt: string;
}

export interface OfficerScoreEntry {
  officerId: string;
  officerName: string;
  role: UserRole;
  timestamp: string;
  scores: {
    technicalCapability: number; // max 40
    pastExperience: number; // max 25
    methodologyWorkplan: number; // max 20
    keyPersonnel: number; // max 15
  };
  totalTechnicalMarks: number; // sum max 100
  remarks: string;
  flagRaised?: 'NONE' | 'REQUIRES_CLARIFICATION' | 'AUDIT_DISCREPANCY' | 'PQC_FAIL';
  dscSignature: string;
  gfrJustification?: GFRJustification;
}

export interface MaskedSubmission {
  id: string;
  tenderId: string;
  maskedVendorId: string; // e.g. "VEN-ANON-9041"
  vaultCipherToken: string; // Encrypted PII pointer
  actualVendorNameHidden?: string; // Only visible in Vault/Unmask stage
  actualPanHidden?: string;
  actualGstinHidden?: string;
  submittedAt: string;
  status: SubmissionStatus;
  statutory: StatutoryVerification;
  aiScorecard: AIScorecard;
  miiAudit: MIIAudit;
  officerReviews: OfficerScoreEntry[];
  consolidatedScore?: {
    technicalWeightScore: number;
    statutoryWeightScore: number;
    aiWeightScore: number;
    miiWeightScore: number;
    finalCompositeScore: number;
    rank: number;
  };
}

export interface AuditLedgerBlock {
  blockHeight: number;
  blockHash: string;
  previousHash: string;
  timestamp: string;
  tenderId: string;
  maskedVendorId: string;
  officerContext: {
    officerId: string;
    officerRole: string;
    dscFingerprint: string;
  };
  action: string;
  evaluationPayload: Record<string, any>;
  merkleRoot: string;
  signature: string;
  verified: boolean;
}

export interface UpstreamIntakeDocket {
  intakeId: string;
  vendorName: string;
  panNumber: string;
  gstinNumber: string;
  tenderNumber: string;
  submittedAt: string;
  docketSizeMb: number;
  digilockerHash: string;
  turnoverDeclaredCr: number;
  localContentDeclared: number;
  category: string;
}