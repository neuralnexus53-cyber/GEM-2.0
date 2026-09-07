import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  Building2, 
  Factory, 
  HardHat, 
  Landmark, 
  Receipt, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ExternalLink,
  BookOpen,
  Scale,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export type SectorCategory = 'ALL' | 'MSME' | 'OEM' | 'WORKS' | 'OFFICER' | 'STATUTORY' | 'AUDIT';

interface FaqItem {
  id: string;
  category: SectorCategory;
  categoryLabel: string;
  sectorIcon: any;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  legalReference: string;
  tags: string[];
}

export const SECTOR_FAQS: FaqItem[] = [
  // 1. MSME & STARTUPS
  {
    id: 'FAQ-MSME-01',
    category: 'MSME',
    categoryLabel: 'MSME & Startups',
    sectorIcon: Building2,
    question: 'Are MSMEs and DPIIT-recognized Startups exempt from EMD (Earnest Money Deposit)?',
    shortAnswer: 'Yes, 100% exemption from EMD is statutory under GFR 2017 Rule 170(i) and the Public Procurement Policy for MSEs Order, 2012.',
    detailedAnswer: 'Micro and Small Enterprises (MSEs) registered with Udyam or recognized by DPIIT as Startups are entitled to 100% waiver of Earnest Money Deposit (EMD / Bid Security). In GeM 2.0, the portal automatically verifies the vendor’s Udyam Registration Number via real-time API integration with the Ministry of MSME database, applying the exemption without requiring manual notarized affidavits.',
    legalReference: 'GFR 2017 Rule 170(i) • Public Procurement Policy for MSEs Order, 2012 (Section 4)',
    tags: ['EMD Exemption', 'Udyam', 'Startup India', 'Bid Security']
  },
  {
    id: 'FAQ-MSME-02',
    category: 'MSME',
    categoryLabel: 'MSME & Startups',
    sectorIcon: Building2,
    question: 'What is the mandatory 25% annual public procurement reservation for MSEs?',
    shortAnswer: 'All Central Ministries, Departments, and CPSUs must procure at least 25% of their total annual procurement from Micro and Small Enterprises.',
    detailedAnswer: 'Under the Public Procurement Policy for MSEs Order 2012 (as amended in 2018), every Central Ministry, Department, and PSU is statutorily mandated to procure a minimum of 25% of their annual procurement value from MSEs. Out of this 25%, 4% is sub-reserved for MSEs owned by SC/ST entrepreneurs, and 3% is sub-reserved for MSEs owned by Women entrepreneurs (Womaniya initiative on GeM).',
    legalReference: 'Ministry of MSME Notification S.O. 581(E) • GeM Procurement Directive 2024',
    tags: ['25% Quota', 'SC/ST MSEs', 'Women Entrepreneurs', 'CPSU Mandate']
  },
  {
    id: 'FAQ-MSME-03',
    category: 'MSME',
    categoryLabel: 'MSME & Startups',
    sectorIcon: Building2,
    question: 'How do relaxed Prior Turnover and Prior Experience rules apply to Startups on GeM?',
    shortAnswer: 'Procurement authorities may waive prior turnover and past experience criteria for Startups, subject to meeting technical quality specs.',
    detailedAnswer: 'Pursuant to Department of Expenditure DoE O.M. No. F.20/2/2014-PPD, procuring entities are empowered to exempt DPIIT-recognized Startups from the requirements of prior turnover and prior operational experience, provided the Startup demonstrates the technical capability, infrastructure, and quality standards to execute the contract.',
    legalReference: 'GFR 2017 Rule 173(i) • DoE O.M. F.20/2/2014-PPD dated 20-Sep-2016',
    tags: ['Turnover Relaxation', 'Experience Waiver', 'Startup Runway', 'PQC Criteria']
  },

  // 2. OEM & LARGE MANUFACTURERS
  {
    id: 'FAQ-OEM-01',
    category: 'OEM',
    categoryLabel: 'OEMs & Manufacturers',
    sectorIcon: Factory,
    question: 'What is the difference between Class-I and Class-II Local Suppliers under PPP-MII Order?',
    shortAnswer: 'Class-I suppliers have ≥50% local content (eligible for purchase preference); Class-II suppliers have 20% to 50% local content.',
    detailedAnswer: 'Under the Public Procurement (Preference to Make in India) Order, 2017 (DPIIT O.M. P-45021/2/2017-PP (BE-II)): \n• Class-I Local Supplier: Goods/services have local content equal to or exceeding 50%. Eligible for purchase preference in all tenders.\n• Class-II Local Supplier: Local content between 20% and 50%. Permitted to bid when estimated tender value is below ₹200 Cr, but without purchase preference margin over non-local suppliers.\n• Non-Local Supplier: Local content <20%. Ineligible for tenders under ₹200 Cr unless Global Tender Enquiry (GTE) is formally approved by Cabinet Secretary.',
    legalReference: 'DPIIT Public Procurement (Preference to Make in India) Order 2017 (revised 16-Sep-2020)',
    tags: ['Make in India', 'Class-I Supplier', 'Local Content', 'GTE ₹200 Cr']
  },
  {
    id: 'FAQ-OEM-02',
    category: 'OEM',
    categoryLabel: 'OEMs & Manufacturers',
    sectorIcon: Factory,
    question: 'How does the L1 Purchase Preference Margin (20%) work for Class-I Local Manufacturers?',
    shortAnswer: 'If the L1 bid is non-local, the lowest Class-I local bidder within 20% of L1 is given the opportunity to match L1 and win 50% or 100% of the order.',
    detailedAnswer: 'In divisible tenders, if the lowest quoted price (L1) is from a Class-II or Non-Local supplier, the lowest Class-I Local Supplier quoting within L1 + 20% margin is invited to match the L1 price for 50% of the tender quantity. In non-divisible tenders (e.g. specialized machinery), the Class-I supplier matching L1 is awarded 100% of the contract.',
    legalReference: 'PPP-MII Order 2017 Clause 3(a) & 3(b) • GFR 2017 Rule 153',
    tags: ['Purchase Preference', 'L1 Matching', '20% Margin', 'Divisible Bids']
  },
  {
    id: 'FAQ-OEM-03',
    category: 'OEM',
    categoryLabel: 'OEMs & Manufacturers',
    sectorIcon: Factory,
    question: 'What is the Manufacturer Authorization Form (MAF) requirement for Resellers/Distributors?',
    shortAnswer: 'Resellers must submit an authentic, cryptographically verifiable MAF directly issued by the registered OEM.',
    detailedAnswer: 'When a reseller or authorized distributor bids on behalf of an OEM, they must submit a valid MAF containing the specific Tender Reference Number, authorized territorial jurisdiction, and OEM guarantee of warranty and spare-parts support. GeM 2.0 validates the OEM’s PAN/CIN against the MCA-21 registry and cross-references digital signature tokens.',
    legalReference: 'GeM GTC (General Terms and Conditions) Clause 4(xxvii) • OEM Guidelines 2025',
    tags: ['MAF', 'Reseller Authorization', 'Warranty Guarantee', 'OEM Verification']
  },

  {
    id: 'FAQ-OEM-04',
    category: 'OEM',
    categoryLabel: 'OEMs & Manufacturers',
    sectorIcon: Factory,
    question: 'If a vendor registers or logs in as an OEM Manufacturer, how are their dashboard features and account permissions restricted?',
    shortAnswer: 'OEM Manufacturer accounts are strictly bound to OEM-exclusive privileges (MII local content declarations, factory audits, BoM breakdown). Accessing Reseller or Service features requires dedicated registration.',
    detailedAnswer: 'To maintain regulatory integrity and prevent conflicting bids, GeM 2.0 enforces strict account-type segregation. An OEM Manufacturer account receives specialized capabilities—including direct Make in India Class-I local content certification, Bill of Materials (BOM) value-addition computation, factory geo-tagged inspection uploads, and MAF issuance. Under GFR separation-of-roles mandates, if an enterprise also operates as a third-party Reseller or Service Contractor, they cannot mix these features in one session and must register a dedicated credential dossier for that specific entity role.',
    legalReference: 'GFR 2017 Rule 153 • PPP-MII Order 2017 • GeM Vendor Governance Policy',
    tags: ['OEM Role', 'Account Isolation', 'Role Segregation', 'Make in India', 'BOM Breakdown']
  },

  // 3. CIVIL & WORKS CONTRACTORS
  {
    id: 'FAQ-WORKS-01',
    category: 'WORKS',
    categoryLabel: 'Works & Civil Contractors',
    sectorIcon: HardHat,
    question: 'How are Schedule of Rates (SoR) and BoQ items calculated in Works contracts on GeM?',
    shortAnswer: 'Works tenders use CPWD/MES item-rate or percentage-rate BoQ templates with automated tax, cess, and milestone breakdown.',
    detailedAnswer: 'Public works tenders (Civil, Electrical, Roadways, Bridges, Smart Cities) incorporate standardized Schedule of Rates based on CPWD Delhi Schedule of Rates (DSR), State PWD schedules, or National Highway Authority (NHAI) specifications. Vendors submit either Item-Rate or Percentage (+/- over SoR) bids. The GeM 2.0 platform computes the BoQ composite landed cost including GST, Labor Welfare Cess (1%), and Performance Guarantee margins.',
    legalReference: 'CPWD Works Manual 2024 • GFR 2017 Rule 130 to 141 (Procurement of Works)',
    tags: ['BoQ Matrix', 'CPWD SoR', 'Percentage Rate', 'Labor Cess']
  },
  {
    id: 'FAQ-WORKS-02',
    category: 'WORKS',
    categoryLabel: 'Works & Civil Contractors',
    sectorIcon: HardHat,
    question: 'What are the statutory limits on Liquidated Damages (LD) and Contract Performance Security?',
    shortAnswer: 'Performance Security is 3% to 5% of contract value; Liquidated Damages are typically 0.5% per week up to a maximum of 10%.',
    detailedAnswer: 'Under GFR 2017 Rule 171, Performance Security (e-PBG or Bank Guarantee) is required between 3% and 5% of the total contract value. If a contractor experiences unapproved delays in milestone execution, Liquidated Damages (LD) are calculated at 0.5% of the delayed works portion per week, capped at a statutory maximum of 10% of total contract value, after which the contract may be terminated.',
    legalReference: 'GFR 2017 Rule 171 • Manual for Procurement of Works 2022 (Section 6.4)',
    tags: ['Liquidated Damages', 'Performance Security', 'e-PBG', 'Milestone Penalties']
  },

  // 4. PROCUREMENT OFFICERS & BUYERS
  {
    id: 'FAQ-OFFICER-01',
    category: 'OFFICER',
    categoryLabel: 'Procurement Officers & Buyers',
    sectorIcon: Landmark,
    question: 'What are the threshold rules for Direct Purchase, L1 Comparison, and Custom Bidding on GeM?',
    shortAnswer: 'Direct purchase up to ₹25,000; L1 comparison for ₹25,000 to ₹5,00,000; Mandatory e-Bidding/Reverse Auction above ₹5,00,000.',
    detailedAnswer: 'Under GFR 2017 Rule 149:\n• Up to ₹25,000: Direct purchase permitted through any available supplier on GeM meeting quality and delivery specs.\n• ₹25,000 to ₹5,00,000: Mandatory comparison across at least 3 distinct manufacturers/sellers to award the order to L1.\n• Above ₹5,00,000: Mandatory online open bidding or Reverse Auction (RA) through GeM.\n• For proprietary items: Proprietary Article Certificate (PAC) mode permitted under GFR Rule 166.',
    legalReference: 'GFR 2017 Rule 149 (Mandatory Procurement through GeM) • DoE O.M. 2023',
    tags: ['Rule 149', 'Direct Purchase', 'L1 Comparison', 'Reverse Auction', 'PAC Buying']
  },
  {
    id: 'FAQ-OFFICER-02',
    category: 'OFFICER',
    categoryLabel: 'Procurement Officers & Buyers',
    sectorIcon: Landmark,
    question: 'How does the Double-Blind Zero-Bias Evaluation workflow operate during Technical Evaluation?',
    shortAnswer: 'Bidder company names and identifiers are cryptographically masked (VEN-ANON-XXXX) until all technical scoring is locked.',
    detailedAnswer: 'To ensure 100% fair and unbiased evaluation pursuant to the Central Vigilance Commission (CVC) Vigilance Guidelines, the Procurement Officer Executive Suite anonymizes vendor corporate entities. Technical Evaluation Committee (TEC) members review past experience, technical compliance, and AI statutory scores blindly. Financial quotes and real corporate identities remain sealed in cryptographic escrow until authorized unmasking under GFR Rule 160(xiv).',
    legalReference: 'CVC Vigilance Manual 2021 (Tender Evaluation Principles) • GFR 2017 Rule 160',
    tags: ['Double-Blind Vault', 'Zero Bias', 'CVC Guidelines', 'Masked Evaluation']
  },
  {
    id: 'FAQ-OFFICER-03',
    category: 'OFFICER',
    categoryLabel: 'Procurement Officers & Buyers',
    sectorIcon: Landmark,
    question: 'When is a Buyer permitted to unmask the commercial bids in the Double-Blind Vault?',
    shortAnswer: 'Only after the Technical Evaluation Committee has approved and signed off on the technical qualification list.',
    detailedAnswer: 'Under GFR Rule 160(xiv), financial bids may only be unmasked and opened in the presence of or with the authenticated Class-3 Digital Signature Certificate (DSC) of the designated Buyer Authority after the technical evaluation results are finalized, recorded, and anchored in the audit ledger.',
    legalReference: 'GFR 2017 Rule 160(xiv) (Two-Bid System Commercial Opening)',
    tags: ['Vault Unmasking', 'Two-Bid System', 'Class-3 DSC', 'Financial Stage']
  },
  {
    id: 'FAQ-OFFICER-04',
    category: 'OFFICER',
    categoryLabel: 'Procurement Officers & Buyers',
    sectorIcon: Landmark,
    question: 'Which Government Officer holds the final statutory authority to award the tender to the winning bidder?',
    shortAnswer: 'The Competent Financial Authority (CFA) / Competent Buyer Authority under GFR Rule 160 & DFPR holds exclusive sovereign authority to accept recommendations and award the contract.',
    detailedAnswer: 'Under GFR 2017 Rule 160, Rule 173(xxii), and the Delegation of Financial Power Rules (DFPR), the Tender Evaluation Committee (TEC) only performs double-blind technical evaluation and submits recommendations. The Competent Financial Authority (CFA) / Buyer Authority (such as the Joint Secretary, Head of Department, or Director) holds the exclusive statutory authority to authorize double-blind commercial vault unmasking, finalize the QCBS/L1 ranking, and formally approve and sign the award of contract / Letter of Acceptance (LoA) to the winning bidder.',
    legalReference: 'GFR 2017 Rule 160, Rule 173(xxii) • DFPR 1978 • GeM Procurement Manual 2024',
    tags: ['Tender Award', 'Competent Financial Authority', 'Buyer Authority', 'GFR Rule 160', 'Final Decision', 'TEC vs CFA']
  },
  {
    id: 'FAQ-OFFICER-05',
    category: 'OFFICER',
    categoryLabel: 'Procurement Officers & Buyers',
    sectorIcon: Landmark,
    question: 'Why were cross-portal "Switch to Vendor Portal" or "Switch to Officer Dashboard" options removed from all portals?',
    shortAnswer: 'To enforce strict statutory separation of duties between public buyers and private suppliers, preventing unauthorized privilege escalation.',
    detailedAnswer: 'Under Central Vigilance Commission (CVC) rules and GFR 2017 conflict-of-interest principles, Government Procurement Officers and commercial Vendors must operate in completely insulated, cryptographic environments. Providing direct "Switch Here" shortcuts within active sessions posed a compliance risk. Each role is strictly bounded to its designated sovereign domain, and officers or sellers must explicitly log out and authenticate with verified credentials to enter their respective environments.',
    legalReference: 'CVC Guidelines on Conflict of Interest (O.M. No. 005/CRD/19) • GFR 2017 Rule 175',
    tags: ['Separation of Duties', 'CVC Conflict of Interest', 'Portal Isolation', 'No Cross Switching']
  },
  {
    id: 'FAQ-OFFICER-06',
    category: 'OFFICER',
    categoryLabel: 'Procurement Officers & Buyers',
    sectorIcon: Landmark,
    question: 'How does GeM 2.0 compartmentalize officer duties across Scrutiny, TEC, Buyer, and CAG Auditor roles?',
    shortAnswer: 'Each officer account is permanently bound to a single GFR 2017 role with hardware DSC token enforcement, preventing combined or overlapping evaluation powers.',
    detailedAnswer: 'Under GFR 2017 Rules 164, 189, and 160, separation of duties is strictly enforced:\n• Preliminary Scrutiny Officer: Validates 7 sovereign registries (GSTN, MCA, EPFO, CBDT) and PQC eligibility. Issues 48h discrepancy notices. Cannot assign technical scores or unmask commercial vaults.\n• TEC Member: Blindly scores technical criteria (/100) and Make-in-India compliance. Cannot create tenders or unmask commercial vaults.\n• Competent Buyer Authority: Publishes tenders, sets QCBS weights, holds the vault key, and awards the contract.\n• CAG Auditor: Independent read-only vigilance inspection and cryptographic ledger auditing.',
    legalReference: 'GFR 2017 Rules 160, 164, 189 • CAG Act 1971 (Section 14)',
    tags: ['Role Separation', 'Scrutiny Officer', 'TEC Member', 'Buyer Authority', 'CAG Auditor']
  },

  // 5. STATUTORY & TAX COMPLIANCE
  {
    id: 'FAQ-STATUTORY-01',
    category: 'STATUTORY',
    categoryLabel: 'Tax & Statutory Gateways',
    sectorIcon: Receipt,
    question: 'How does GeM 2.0 verify 24-month GSTN and Income Tax return compliance automatically?',
    shortAnswer: 'Direct API integrations query GSTN for GSTR-3B/1 regularity and CBDT for 3-year ITR-V and Form 26AS matching.',
    detailedAnswer: 'GeM 2.0 connects via secured NIC API gateways directly to the GST Network (GSTN) and Central Board of Direct Taxes (CBDT). The system verifies that the vendor has an ACTIVE GSTIN without default notices, validates 24 continuous months of GSTR-3B monthly return filings, matches declared tender turnover against Form 26AS gross receipts, and flags UDIN mismatches in Chartered Accountant audit certificates.',
    legalReference: 'Central Goods and Services Tax (CGST) Act, 2017 (Section 39) • Income Tax Act 1961 (Sec 139)',
    tags: ['GSTN Verification', 'GSTR-3B', 'Form 26AS', 'CBDT', 'CA UDIN']
  },
  {
    id: 'FAQ-STATUTORY-02',
    category: 'STATUTORY',
    categoryLabel: 'Tax & Statutory Gateways',
    sectorIcon: Receipt,
    question: 'Why is EPFO Electronic Challan Return (ECR) and ESIC validation mandatory for public tenders?',
    shortAnswer: 'To ensure statutory workforce social security compliance and prevent the engagement of defaulting contractors.',
    detailedAnswer: 'Under the Contract Labour (Regulation and Abolition) Act, 1970 and the Employees’ Provident Funds and Miscellaneous Provisions Act, 1952, public contractors must deposit mandatory PF and ESI contributions for their workforce. GeM 2.0 checks the Shram Suvidha and EPFO portal for active Electronic Challan Receipts (ECRs) to ensure labor welfare dues are up-to-date.',
    legalReference: 'Contract Labour Act, 1970 • EPF & MP Act 1952 • Shram Suvidha National Portal',
    tags: ['EPFO ECR', 'ESIC Pehchan', 'Social Security', 'Labor Welfare']
  },
  {
    id: 'FAQ-STATUTORY-03',
    category: 'STATUTORY',
    categoryLabel: 'Tax & Statutory Gateways',
    sectorIcon: Receipt,
    question: 'Why is 2-Step OTP Security Verification strictly mandatory for all Vendor and Officer portal logins?',
    shortAnswer: 'Statutory 2-Factor Authentication (Aadhaar/Mobile OTP + Password/DSC) is mandatory under GFR 2017 & GeM 2.0 Security Guidelines to prevent session hijacking and bid tampering.',
    detailedAnswer: 'In compliance with National Informatics Centre (NIC) and CERT-In sovereign cybersecurity directives, dual-factor authentication is no longer optional. Every vendor sign-in requires an instantaneous 6-digit OTP dispatched to the registered mobile/email alongside password credentials. Government procurement officers must authenticate via dual-factor Aadhaar OTP and Class-3 PKCS#11 Hardware Token DSC to access tender evaluation consoles.',
    legalReference: 'CERT-In Cyber Security Directions 2022 • GFR 2017 Chapter 2 • Information Technology Rules',
    tags: ['2-Step OTP', 'Mandatory 2FA', 'CERT-In Compliance', 'Session Security', 'Aadhaar OTP']
  },
  {
    id: 'FAQ-STATUTORY-04',
    category: 'STATUTORY',
    categoryLabel: 'Tax & Statutory Gateways',
    sectorIcon: Receipt,
    question: 'Which languages are supported across the GeM 2.0 portals, and how does multilingual accessibility work?',
    shortAnswer: 'Minimum 10 official Indian languages (English, हिन्दी, मराठी, தமிழ், తెలుగు, বাংলা, ગુજરાતી, ಕನ್ನಡ, മലയാളം, ਪੰਜਾਬੀ) are natively integrated across all portals.',
    detailedAnswer: 'In line with the Digital India Bhashini initiative and Eighth Schedule to the Constitution of India, GeM 2.0 provides native multilingual support across the Landing Page, Vendor Portal, Procurement Officer Portal, and Authentication Gateways. Users can switch between 10 official Indian languages in real time with persistent browser preferences, ensuring Micro, Small, Rural, and Tribal artisans and suppliers from every state can seamlessly participate in national procurement without linguistic barriers.',
    legalReference: 'Official Languages Act, 1963 • Digital India Bhashini Mission • GeM Inclusivity Directives',
    tags: ['Language Support', '10 Indian Languages', 'Bhashini', 'Linguistic Inclusivity', 'Multilingual Portal']
  },
  {
    id: 'FAQ-STATUTORY-05',
    category: 'STATUTORY',
    categoryLabel: 'Tax & Statutory Gateways',
    sectorIcon: Receipt,
    question: 'What are the streamlined authentication methods available on the Vendor Sign-In Gateway?',
    shortAnswer: 'Vendors can authenticate directly via: 1) Login with OTP, 2) Vendor Sign-In (Password + Mandatory OTP), or 3) New Registration.',
    detailedAnswer: 'To ensure rapid, tamper-resistant access for both seasoned enterprises and first-time rural sellers, the login gateway has been streamlined into three clear, standardized pathways: direct OTP login to verified mobile numbers, standard credential sign-in enforced with mandatory 2-step OTP, and unified registration connected to DigiLocker and Udyam databases.',
    legalReference: 'GeM Seller Onboarding Standards 2025 • IT Act 2000',
    tags: ['Vendor Sign-In', 'Login with OTP', 'Streamlined Auth', 'New Registration']
  },

  // 6. INTEGRITY & CAG AUDIT
  {
    id: 'FAQ-AUDIT-01',
    category: 'AUDIT',
    categoryLabel: 'CAG Audit & Anti-Cartelization',
    sectorIcon: ShieldCheck,
    question: 'What is the Immutable CAG Cryptographic Merkle Audit Ledger in GeM 2.0?',
    shortAnswer: 'A tamper-proof SHA-256 blockchain ledger recording every tender creation, bid submission, score, and vault opening.',
    detailedAnswer: 'To satisfy Comptroller and Auditor General (CAG) and Central Vigilance Commission (CVC) audit scrutiny under Article 149 of the Constitution of India, every significant procurement transaction generates an unalterable cryptographic block. Each block contains: Block Index, UTC Timestamp, Previous Block SHA-256 Hash, Action Code, Officer DSC Fingerprint, and Transaction Payload Hash. If any record is tampered with, the Merkle tree breaks immediately.',
    legalReference: 'Constitution of India (Article 149 - CAG Duties & Powers) • IT Act 2000 (Section 3)',
    tags: ['CAG Ledger', 'Merkle Blockchain', 'SHA-256', 'Tamper Evident', 'CVC Audit']
  },
  {
    id: 'FAQ-AUDIT-02',
    category: 'AUDIT',
    categoryLabel: 'CAG Audit & Anti-Cartelization',
    sectorIcon: ShieldCheck,
    question: 'How does the AI Engine detect cartels, bid-rigging, and blacklisted vendors?',
    shortAnswer: 'By cross-referencing CPPP debarment registers, common director DINs, overlapping IP/bank coordinates, and font tampering.',
    detailedAnswer: 'The GeM 2.0 AI Compliance Engine runs automated heuristic and semantic checks across multiple data dimensions:\n1. Central Debarment Watch: Real-time queries to CPPP, GeM Incident Management, and CVC debarment databases.\n2. Cartel & Common Ownership: Cross-checks Director Identification Numbers (DIN) via MCA-21 to identify shadow subsidiaries.\n3. Document Forensic OCR: Detects font mismatches, copy-pasted seals, and invalid UDIN formats in CA certificates.',
    legalReference: 'Competition Act, 2002 (Section 3 - Anti-Competitive Agreements) • GeM Incident Management Policy',
    tags: ['Anti-Cartel', 'Bid Rigging', 'CPPP Blacklist', 'Forensic OCR', 'DIN Cross-Check']
  },
  {
    id: 'FAQ-AUDIT-03',
    category: 'AUDIT',
    categoryLabel: 'CAG Audit & Anti-Cartelization',
    sectorIcon: ShieldCheck,
    question: 'Why is the cryptographic token number concealed/masked in the Vendor Portal during technical evaluation?',
    shortAnswer: 'To eliminate external token correlation, insider bias, and potential collusion during the double-blind evaluation phase.',
    detailedAnswer: 'In traditional procurement systems, static token identifiers or serial numbers can inadvertently be shared or cross-referenced between bidders and evaluation officers, introducing subtle bias. Under GeM 2.0\'s enhanced zero-bias architecture, raw token numbers and corporate identifiers (PAN, GSTIN, legal names) are strictly concealed from open views. Officers evaluate technical submissions against anonymous ephemeral tags (e.g. VEN-ANON-XXXX) within a sealed cryptographic vault, guaranteeing 100% impartial merit-based scoring.',
    legalReference: 'CVC Zero-Bias Procurement Guidelines • IT Act 2000 (Section 43A) • GFR Rule 160(xiv)',
    tags: ['Token Masking', 'Zero Bias', 'Double Blind Vault', 'Collusion Defense', 'Anti-Corruption']
  }
];

export interface SectorWiseFaqProps {
  initialSector?: SectorCategory;
  defaultCategory?: SectorCategory | string;
  title?: string;
  subtitle?: string;
}

export const SectorWiseFaq: React.FC<SectorWiseFaqProps> = ({
  initialSector,
  defaultCategory = 'ALL',
  title = 'Comprehensive Sector-Wise Public Procurement FAQ & Legal Knowledge Base',
  subtitle = 'Statutory guidelines, GFR 2017 rules, Make-in-India policies, and automated compliance answers across all public procurement domains.'
}) => {
  const initial = (initialSector || defaultCategory || 'ALL') as SectorCategory;
  const [selectedCategory, setSelectedCategory] = useState<SectorCategory>(initial);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(SECTOR_FAQS[0]?.id || null);

  const categories: { id: SectorCategory; label: string; icon: any; count: number }[] = [
    { id: 'ALL', label: 'All Sectors', icon: BookOpen, count: SECTOR_FAQS.length },
    { id: 'MSME', label: 'MSME & Startups', icon: Building2, count: SECTOR_FAQS.filter(f => f.category === 'MSME').length },
    { id: 'OEM', label: 'OEMs & Manufacturers', icon: Factory, count: SECTOR_FAQS.filter(f => f.category === 'OEM').length },
    { id: 'WORKS', label: 'Civil & Works', icon: HardHat, count: SECTOR_FAQS.filter(f => f.category === 'WORKS').length },
    { id: 'OFFICER', label: 'Procurement Officers', icon: Landmark, count: SECTOR_FAQS.filter(f => f.category === 'OFFICER').length },
    { id: 'STATUTORY', label: 'Tax & Statutory', icon: Receipt, count: SECTOR_FAQS.filter(f => f.category === 'STATUTORY').length },
    { id: 'AUDIT', label: 'CAG & Anti-Cartel', icon: ShieldCheck, count: SECTOR_FAQS.filter(f => f.category === 'AUDIT').length }
  ];

  const filteredFaqs = useMemo(() => {
    return SECTOR_FAQS.filter(faq => {
      const matchesCategory = selectedCategory === 'ALL' || faq.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch = 
        faq.question.toLowerCase().includes(query) ||
        faq.shortAnswer.toLowerCase().includes(query) ||
        faq.detailedAnswer.toLowerCase().includes(query) ||
        faq.legalReference.toLowerCase().includes(query) ||
        faq.tags.some(t => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
              Legal &amp; Policy Helpdesk
            </span>
            <span className="text-xs text-slate-400">GFR 2017 &bull; PPP-MII 2017 &bull; MSMED Act</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            {subtitle}
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px] sm:min-w-[320px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rules, exemptions, EMD, GFR, MII..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Sector Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-[#002855] text-white border-[#002855] shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No matching procurement FAQ found</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for keywords like &ldquo;EMD&rdquo;, &ldquo;Class-I&rdquo;, &ldquo;Rule 149&rdquo;, or &ldquo;GSTN&rdquo;.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
              className="mt-3 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedId === faq.id;
            const Icon = faq.sectorIcon;

            return (
              <div 
                key={faq.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isExpanded 
                    ? 'bg-blue-50/40 border-blue-200 shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full text-left p-4 sm:p-4.5 flex items-start justify-between gap-3 cursor-pointer bg-transparent border-none focus:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isExpanded 
                        ? 'bg-[#002855] text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-500 font-mono">
                          {faq.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-200/70 text-slate-700">
                          {faq.categoryLabel}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </h3>
                      {!isExpanded && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                          {faq.shortAnswer}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 p-1 text-slate-400 hover:text-slate-700 mt-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 sm:px-4.5 pb-4 pt-1 border-t border-blue-100 space-y-3.5 text-xs sm:text-sm animate-fadeIn">
                    
                    <div className="p-3 bg-white rounded-lg border border-blue-100 text-slate-700 leading-relaxed">
                      <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        Executive Direct Answer:
                      </div>
                      <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {faq.shortAnswer}
                      </p>
                    </div>

                    <div className="text-slate-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                      {faq.detailedAnswer}
                    </div>

                    {/* Statutory Citation Box */}
                    <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 flex items-start gap-2 text-xs">
                      <Scale className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">
                          Statutory &amp; Legal Authority:
                        </span>
                        <span className="font-mono text-slate-600 text-[11px]">
                          {faq.legalReference}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Tags:</span>
                      {faq.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                          #{tag}
                        </span>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
