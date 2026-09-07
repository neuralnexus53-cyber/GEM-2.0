import { UserRole } from './index';

export interface VendorRoleDeskConfig {
  role: UserRole;
  title: string;
  hindiTitle: string;
  shortLabel: string;
  badgeColor: string;
  primaryDeskTab: 'OEM_PORTAL' | 'MSME_PORTAL' | 'WORKS_PORTAL';
  deskTitle: string;
  statutoryCategory: string;
  description: string;
  allowedSpecializedDesks: string[];
}

export const VENDOR_ROLE_DEFINITIONS: Record<string, VendorRoleDeskConfig> = {
  OEM_SELLER: {
    role: 'OEM_SELLER',
    title: 'OEM Original Manufacturer',
    hindiTitle: 'मूल उपकरण निर्माता',
    shortLabel: 'OEM MFR',
    badgeColor: 'bg-sky-950 text-sky-300 border-sky-600',
    primaryDeskTab: 'OEM_PORTAL',
    deskTitle: 'OEM Catalog & MAF Issuer Desk',
    statutoryCategory: 'DPIIT & BIS Validated Original Equipment Manufacturer',
    description: 'Direct manufacturer authority to publish verified product catalogs, compute domestic Bill of Materials (BoM), verify Class-I local content (>=50%), and digitally issue Manufacturer Authorization Forms (MAF) to tender bidders.',
    allowedSpecializedDesks: ['OEM_PORTAL']
  },
  AUTHORIZED_RESELLER: {
    role: 'AUTHORIZED_RESELLER',
    title: 'MSME & Authorized Reseller',
    hindiTitle: 'अधिकृत पुनर्विक्रेता एवं एमएसएमई',
    shortLabel: 'MSME / RESELLER',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-600',
    primaryDeskTab: 'MSME_PORTAL',
    deskTitle: 'MSME Exemption & GFR 170 Desk',
    statutoryCategory: 'Udyam Registered Micro/Small Enterprise & Authorized Channel Partner',
    description: 'Claim statutory GFR 2017 Rule 170 Earnest Money Deposit (EMD) waivers, apply for 25% annual public procurement MSE quotas, and link valid OEM Manufacturer Authorization Forms (MAF).',
    allowedSpecializedDesks: ['MSME_PORTAL']
  },
  MSME_STARTUP: {
    role: 'MSME_STARTUP',
    title: 'DPIIT Startup & Micro/Small Enterprise',
    hindiTitle: 'डीपीआईआईटी स्टार्टअप एवं एमएसएमई',
    shortLabel: 'MSME STARTUP',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-600',
    primaryDeskTab: 'MSME_PORTAL',
    deskTitle: 'MSME Exemption & GFR 170 Desk',
    statutoryCategory: 'DPIIT Certificate of Recognition & Udyam Verified Enterprise',
    description: 'Claim GFR Rule 173(i) relaxations on prior turnover and prior experience, obtain complete EMD tender fee waivers, and access reserved public tender categories.',
    allowedSpecializedDesks: ['MSME_PORTAL']
  },
  SERVICE_PROVIDER: {
    role: 'SERVICE_PROVIDER',
    title: 'Works & Infrastructure Contractor',
    hindiTitle: 'कार्य एवं अवसंरचना ठेकेदार',
    shortLabel: 'WORKS CONTRACTOR',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-600',
    primaryDeskTab: 'WORKS_PORTAL',
    deskTitle: 'Works Contractor & Consortia Desk',
    statutoryCategory: 'CPWD / State PWD Registered Class-1 Engineering Contractor',
    description: 'Configure multi-entity Joint Ventures (JV), consortium lead member mandates, escrow milestones, and bank guarantee solvency limits for large infrastructure tenders.',
    allowedSpecializedDesks: ['WORKS_PORTAL']
  },
  WORKS_CONTRACTOR: {
    role: 'WORKS_CONTRACTOR',
    title: 'Works & Infrastructure Contractor',
    hindiTitle: 'कार्य एवं अवसंरचना ठेकेदार',
    shortLabel: 'WORKS CONTRACTOR',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-600',
    primaryDeskTab: 'WORKS_PORTAL',
    deskTitle: 'Works Contractor & Consortia Desk',
    statutoryCategory: 'CPWD / State PWD Registered Class-1 Engineering Contractor',
    description: 'Configure multi-entity Joint Ventures (JV), consortium lead member mandates, escrow milestones, and bank guarantee solvency limits for large infrastructure tenders.',
    allowedSpecializedDesks: ['WORKS_PORTAL']
  }
};

export function getVendorDeskConfig(role?: string): VendorRoleDeskConfig {
  if (!role) return VENDOR_ROLE_DEFINITIONS.OEM_SELLER;
  return VENDOR_ROLE_DEFINITIONS[role] || VENDOR_ROLE_DEFINITIONS.OEM_SELLER;
}
