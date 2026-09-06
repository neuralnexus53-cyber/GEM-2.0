import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Rocket, 
  HardHat, 
  Layers, 
  FileCheck2, 
  ShieldAlert, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  ChevronRight, 
  Home, 
  Clock, 
  CheckCircle2, 
  FileText,
  Wrench,
  KeyRound,
  Activity,
  Sparkles,
  History,
  ArrowRight
} from 'lucide-react';
import { UserRole, VendorProfile } from './types';
import { SubscriptionState } from './types/auth_billing';
import { useAuth } from './context/AuthContext';
import { mockProfiles } from './data/mockData';

// Layout & Institutional Header Components
import { GovNationalTopBar } from './components/layout/GovNationalTopBar';
import { TopHeader } from './components/layout/TopHeader';
import { Sidebar } from './components/layout/Sidebar';
import { HeaderStats } from './components/layout/HeaderStats';
import { GovOfficialFooter } from './components/layout/GovOfficialFooter';

// AI Bid Scrutiny & Ingestion Engines
import { AtlasVectorClauseRisk } from './components/ai-engine/AtlasVectorClauseRisk';
import { EligibilityChecker } from './components/ai-engine/EligibilityChecker';
import { OcrScannerView } from './components/ai-engine/OcrScannerView';
import { OcrIngestionModal } from './components/ai-engine/OcrIngestionModal';
import { DiscrepancyWizard } from './components/ai-engine/DiscrepancyWizard';

// Segmentation Desks
import { OemPortal } from './components/segmentation/OemPortal';
import { MsmeStartupPortal } from './components/segmentation/MsmeStartupPortal';
import { WorksContractorPortal } from './components/segmentation/WorksContractorPortal';

// Blind Evaluation & Cryptographic Vault
import { BlindTokenManager } from './components/vault/BlindTokenManager';
import { EvaluationArchiveView } from './components/vault/EvaluationArchiveView';

// Marketplace & Pricing Advisors
import { TenderMatching } from './components/marketplace/TenderMatching';
import { OptimalPricingAdvisor } from './components/marketplace/OptimalPricingAdvisor';

// Common Modals & Guides
import { PortalWelcomeBanner } from './components/common/PortalWelcomeBanner';
import { HowItWorksGuide } from './components/common/HowItWorksGuide';
import { ExportReportModal } from './components/common/ExportReportModal';
import { VendorProfileModal } from './components/profile/VendorProfileModal';
import { VendorProfileView } from './components/profile/VendorProfileView';
import { DocumentExpiryAlerts } from './components/profile/DocumentExpiryAlerts';
import { PricingModal } from './components/billing/PricingModal';
import { QuotaGuardModal } from './components/billing/QuotaGuardModal';
import { SubscriptionTracker } from './components/billing/SubscriptionTracker';
import { SectorWiseFaq } from '../components/SectorWiseFaq';
import { DigiLockerModal } from './components/digilocker/DigiLockerModal';
import { DigiLockerVaultView } from './components/digilocker/DigiLockerVaultView';

export const App: React.FC = () => {
  const { profile: authProfile, updateProfile } = useAuth();

  const [currentRole, setCurrentRole] = useState<UserRole>('OEM_SELLER');
  const [activeProfile, setActiveProfile] = useState<VendorProfile>(authProfile || mockProfiles.OEM_SELLER);
  const [activeTab, setActiveTab] = useState<string>('OVERVIEW');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const [subscription, setSubscription] = useState<SubscriptionState>({
    planId: 'PRO',
    status: 'active',
    evaluationsUsed: 14,
    evaluationsLimit: -1,
    isAutopayEnabled: true,
    currentPeriodEnd: '30-Sep-2026',
    hasVectorRag: true,
    hasPricingAdvisor: true,
    hasPdfDossierExport: true
  });

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState<boolean>(false);
  const [isDigiLockerModalOpen, setIsDigiLockerModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (authProfile) {
      setActiveProfile(authProfile);
      const userRole = authProfile.role || 'OEM_SELLER';
      setCurrentRole(userRole);
      // Dynamic role-based routing: default desk based on vendors.role
      if (activeTab === 'OEM_PORTAL' || activeTab === 'MSME_PORTAL' || activeTab === 'WORKS_PORTAL') {
        if (userRole === 'AUTHORIZED_RESELLER') setActiveTab('MSME_PORTAL');
        else if (userRole === 'SERVICE_PROVIDER') setActiveTab('WORKS_PORTAL');
        else setActiveTab('OEM_PORTAL');
      }
    }
  }, [authProfile]);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (mockProfiles[role]) {
      setActiveProfile(mockProfiles[role]);
    }
    // Dynamic role-based routing
    if (role === 'AUTHORIZED_RESELLER') {
      setActiveTab('MSME_PORTAL');
    } else if (role === 'SERVICE_PROVIDER') {
      setActiveTab('WORKS_PORTAL');
    } else if (role === 'OEM_SELLER') {
      setActiveTab('OEM_PORTAL');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileUpdated = (updated: Partial<VendorProfile>) => {
    const merged = { ...activeProfile, ...updated };
    setActiveProfile(merged);
    updateProfile(merged);
  };

  const handleSelectTenderForCheck = (tenderId: string) => {
    setActiveTab('ELIGIBILITY');
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return 'Executive Dashboard & Ingested Tender Scrutiny Dockets';
      case 'PROFILE':
        return 'My Profile & Core GFR Verification';
      case 'OCR_SCANNER':
      case 'AI_DOCS':
        return 'NIT Document Scrutiny & OCR Engine';
      case 'ELIGIBILITY':
      case 'LLAMA_PREQUAL':
        return 'PQC Criteria & GFR 2017 Pre-Qualification Evaluation';
      case 'CLAUSE_RISK':
      case 'ATLAS_VECTOR':
        return 'Contractual & Liquidated Damages (LD) Risk Audit';
      case 'DISCREPANCY_WIZARD':
        return 'Discrepancy Remediation & Re-scoring Wizard';
      case 'BLIND_VAULT':
        return 'Cryptographic Blind Evaluation Token Manager (anon_token)';
      case 'EVALUATION_ARCHIVE':
        return 'Historical Evaluation Archive & Merkle-Tree Audit Vault';
      case 'PRICING_ADVISOR':
        return 'Schedule of Rates (SoR) & L1 Pricing Advisor (Gated SaaS)';
      case 'OEM_PORTAL':
        return 'OEM Manufacturer & MII Catalog Registry';
      case 'MSME_PORTAL':
        return 'MSME Exemption & GFR 170 EMD Waiver Desk';
      case 'WORKS_PORTAL':
        return 'Civil & Works Contractor BoQ Matrix';
      case 'BILLING_TRACKER':
        return 'SaaS Subscription & Evaluation Quota Tracker';
      default:
        return 'Procurement Workspace';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B192C] text-slate-100 flex flex-col font-sans">
      
      <GovNationalTopBar onOpenGuide={() => setIsGuideOpen(true)} />

      <TopHeader
        currentRole={currentRole}
        profile={activeProfile}
        subscription={subscription}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onToggleMobileSidebar={() => setIsOpenMobile(!isOpenMobile)}
        onSelectRole={handleRoleChange}
      />

      <div className="flex-1 flex">
        
        <Sidebar
          currentRole={currentRole}
          setCurrentRole={handleRoleChange}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          profile={activeProfile}
          subscription={subscription}
          onOpenOcrModal={() => {
            if (subscription.evaluationsLimit !== -1 && subscription.evaluationsUsed >= subscription.evaluationsLimit) {
              setIsQuotaModalOpen(true);
            } else {
              setIsOcrModalOpen(true);
            }
          }}
          onOpenReportModal={handleOpenReportModal}
          onOpenPricingModal={() => setIsPricingModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenDigiLockerModal={() => setIsDigiLockerModalOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          isOpenMobile={isOpenMobile}
          setIsOpenMobile={setIsOpenMobile}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-[#0B192C]">
          
          <div className="w-full bg-[#0E2038] border-b border-[#23436E] px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-[11px] text-slate-300 shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button 
                onClick={() => handleTabChange('OVERVIEW')} 
                className="flex items-center gap-1 text-slate-300 hover:text-sky-300 font-semibold transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-amber-400" />
                <span>GeM 2.0 Portal</span>
              </button>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className="text-white font-semibold">
                {getBreadcrumbTitle()}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400">
              <span>Security Level: <strong className="text-emerald-400 font-semibold">STQC Certified</strong></span>
              <span>&bull;</span>
              <span className="font-mono text-sky-400 font-semibold">GFR 2017 Mode</span>
            </div>
          </div>

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 max-w-6xl w-full mx-auto space-y-4">
            
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-4">
                
                <PortalWelcomeBanner
                  currentRole={currentRole}
                  profile={activeProfile}
                  onOpenGuide={() => setIsGuideOpen(true)}
                  onSelectTab={handleTabChange}
                />

                <DocumentExpiryAlerts
                  profile={activeProfile}
                  onOpenProfile={() => setIsProfileModalOpen(true)}
                />
                
                <HeaderStats profile={activeProfile} currentRole={currentRole} />

                {/* Ingested Tender Scrutiny Dockets & Readiness Summary */}
                <div className="gov-card p-5 space-y-4 border-t-2 border-t-[#0284C7] shadow-xl">
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#23436E]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#0E2748] border border-[#0284C7]/60 text-sky-400">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-extrabold text-white">
                            Ingested Tender Scrutiny Dockets &amp; Readiness Summary
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-600 flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            MANUAL NIT INGESTION
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Consolidated audit status for manually ingested Notice Inviting Tender (NIT) PDFs, queried from <code className="text-cyan-300 font-mono">evaluation_logs</code> grouped by <code className="text-cyan-300 font-mono">tender_id</code>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <span className="text-[11px] px-2.5 py-1 rounded bg-[#0B192C] border border-[#23436E] text-slate-300">
                        6 Dockets Scrutinized
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Table */}
                  <div className="table-container">
                    <table className="gov-table">
                      <thead>
                        <tr>
                          <th className="w-1/3">Procurement Area &amp; Module</th>
                          <th className="w-1/3">Status / Regulatory Reference</th>
                          <th className="w-1/6 text-center">Compliance Metric</th>
                          <th className="w-1/6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 1. OCR Ingestion */}
                        <tr>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-sky-950/80 text-sky-400 border border-sky-600/60 shrink-0">
                                <FileCheck2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs sm:text-sm">
                                  NIT Document Scrutiny &amp; OCR Engine
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  MODULE: DOC-OCR-01 &bull; 14 Certified Files
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-slate-200 text-xs font-medium">
                              14 Certified Documents Parsed
                            </div>
                            <div className="text-[10px] text-sky-300 font-mono mt-0.5">
                              SHA-256 HMAC Verified &bull; NIC Schema v2
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-950 text-sky-300 font-bold text-xs border border-sky-500 shadow-xs font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                              100% Parsed
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleTabChange('OCR_SCANNER')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002855] hover:bg-[#003B7A] text-sky-300 hover:text-white border border-[#0284C7] text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <span>View Docs</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>

                        {/* 2. PQC Eligibility */}
                        <tr>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-600/60 shrink-0">
                                <ShieldCheck className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs sm:text-sm">
                                  GFR 2017 Pre-Qualification (PQC) Evaluation
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  MODULE: PQC-GFR-02 &bull; Rule 173 Compliance
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-slate-200 text-xs font-medium">
                              Turnover (₹48.2 Cr), Experience &amp; MII Criteria
                            </div>
                            <div className="text-[10px] text-emerald-300 font-mono mt-0.5">
                              Meets 30% Avg Turnover &amp; 3-Yr Track Record
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold text-xs border border-emerald-500 shadow-xs font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              96% High Match
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleTabChange('ELIGIBILITY')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-600 text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <span>Run Audit</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>

                        {/* 3. LD Clause Risk */}
                        <tr>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-600/60 shrink-0">
                                <ShieldAlert className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs sm:text-sm">
                                  Contract Liquidated Damages (LD) &amp; Penalties
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  MODULE: RISK-AUDIT-03 &bull; GFR Rule 173 STC
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-slate-200 text-xs font-medium">
                              3 Flagged Special Terms &amp; Conditions (STC)
                            </div>
                            <div className="text-[10px] text-rose-300 font-mono mt-0.5">
                              0.5%/Week Milestone Penalty &bull; Representation Drafted
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 font-bold text-xs border border-rose-600 shadow-xs font-mono">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                              3 Flags
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleTabChange('CLAUSE_RISK')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-600 text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <span>Review STC</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>

                        {/* 4. Discrepancy Wizard */}
                        <tr>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-600/60 shrink-0">
                                <Wrench className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs sm:text-sm">
                                  Discrepancy Remediation &amp; Re-scoring Wizard
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  MODULE: REMEDY-WIZ-04 &bull; Shortfall Clearance
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-slate-200 text-xs font-medium">
                              Automated Shortfall File Upload &amp; Ground Truth Override
                            </div>
                            <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                              Confidence Boost Potential: +32% (to 100%)
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 font-bold text-xs border border-amber-600 shadow-xs font-mono">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              Actionable
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleTabChange('DISCREPANCY_WIZARD')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 hover:text-white border border-amber-600 text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <span>Remediate</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>

                        {/* 5. Blind Evaluation Token */}
                        <tr>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-600/60 shrink-0">
                                <KeyRound className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs sm:text-sm">
                                  Cryptographic Blind Evaluation Token (anon_token)
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  MODULE: VAULT-ANON-05 &bull; Double-Blind Isolation
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-slate-200 text-xs font-medium">
                              Double-Blind Technical Scrutiny &bull; Officer Identity Masking
                            </div>
                            <div className="text-[10px] text-indigo-300 font-mono mt-0.5">
                              Active HMAC: ANON-2026-8849-F3E1 &bull; CAG Sync
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 font-bold text-xs border border-indigo-500 shadow-xs font-mono">
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                              HMAC Active
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleTabChange('BLIND_VAULT')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-600 text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <span>View Token</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>

                        {/* 6. Pricing Advisor */}
                        <tr>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-500/60 shrink-0">
                                <DollarSign className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs sm:text-sm">
                                  Schedule of Rates (SoR) &amp; L1 Pricing Advisor
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  MODULE: SOR-L1-06 &bull; CVC ALB Threshold Defense
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-slate-200 text-xs font-medium">
                              Historical GeM L1 Benchmarking &bull; Regional Cost Multipliers
                            </div>
                            <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                              Prevents Additional Performance Security (APS) Penalty
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 font-bold text-xs border border-amber-500 shadow-xs font-mono">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              Gated (PRO)
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleTabChange('PRICING_ADVISOR')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002855] hover:bg-[#003875] text-amber-300 hover:text-white border border-amber-600/70 text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <span>Pricing</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {(activeTab === 'OCR_SCANNER' || activeTab === 'AI_DOCS') && (
              <div className="space-y-4">
                <OcrScannerView 
                  profile={activeProfile} 
                  onOpenDigiLockerModal={() => setIsDigiLockerModalOpen(true)}
                />
              </div>
            )}

            {(activeTab === 'ELIGIBILITY' || activeTab === 'LLAMA_PREQUAL') && (
              <div className="space-y-4">
                <EligibilityChecker profile={activeProfile} />
              </div>
            )}

            {(activeTab === 'CLAUSE_RISK' || activeTab === 'ATLAS_VECTOR') && (
              <div className="space-y-4">
                <AtlasVectorClauseRisk />
              </div>
            )}

            {activeTab === 'DISCREPANCY_WIZARD' && (
              <div className="space-y-4">
                <DiscrepancyWizard 
                  profile={activeProfile}
                  onOpenReportModal={handleOpenReportModal}
                />
              </div>
            )}

            {activeTab === 'BLIND_VAULT' && (
              <div className="space-y-4">
                <BlindTokenManager profile={activeProfile} />
              </div>
            )}

            {activeTab === 'EVALUATION_ARCHIVE' && (
              <div className="space-y-4">
                <EvaluationArchiveView 
                  profile={activeProfile} 
                  onOpenReportModal={handleOpenReportModal}
                />
              </div>
            )}

            {activeTab === 'PRICING_ADVISOR' && (
              <div className="space-y-4">
                <OptimalPricingAdvisor onOpenPricingModal={() => setIsPricingModalOpen(true)} />
              </div>
            )}

            {activeTab === 'OEM_PORTAL' && (
              <div className="space-y-4">
                <OemPortal profile={activeProfile} />
              </div>
            )}

            {activeTab === 'MSME_PORTAL' && (
              <div className="space-y-4">
                <MsmeStartupPortal profile={activeProfile} />
              </div>
            )}

            {activeTab === 'WORKS_PORTAL' && (
              <div className="space-y-4">
                <WorksContractorPortal profile={activeProfile} />
              </div>
            )}

            {activeTab === 'BILLING_TRACKER' && (
              <div className="space-y-4">
                <SubscriptionTracker 
                  subscription={subscription}
                  onOpenPricingModal={() => setIsPricingModalOpen(true)}
                />
              </div>
            )}

            {activeTab === 'PROFILE' && (
              <div className="space-y-4">
                <VendorProfileView 
                  profile={activeProfile} 
                  onProfileUpdated={handleProfileUpdated} 
                  onOpenDigiLockerModal={() => setIsDigiLockerModalOpen(true)}
                />
              </div>
            )}

          </main>

          <GovOfficialFooter profile={activeProfile} />

        </div>

      </div>

      <HowItWorksGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectTab={handleTabChange}
      />

      <VendorProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={activeProfile}
        onProfileUpdated={handleProfileUpdated}
      />

      <DigiLockerModal
        isOpen={isDigiLockerModalOpen}
        onClose={() => setIsDigiLockerModalOpen(false)}
        profile={activeProfile}
        onDocumentsPulled={(docs) => {
          console.log('[DigiLocker] Pulled docs:', docs.length);
        }}
      />

      <OcrIngestionModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        subscription={subscription}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
      />

      <ExportReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        profile={activeProfile}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />

      <QuotaGuardModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        onOpenPricing={() => {
          setIsQuotaModalOpen(false);
          setIsPricingModalOpen(true);
        }}
        reason="QUOTA_EXCEEDED"
      />

    </div>
  );
};

export default App;