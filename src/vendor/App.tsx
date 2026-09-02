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
  FileText
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

// Segmentation Desks
import { OemPortal } from './components/segmentation/OemPortal';
import { MsmeStartupPortal } from './components/segmentation/MsmeStartupPortal';
import { WorksContractorPortal } from './components/segmentation/WorksContractorPortal';

// Marketplace & Pricing Advisors
import { TenderMatching } from './components/marketplace/TenderMatching';
import { OptimalPricingAdvisor } from './components/marketplace/OptimalPricingAdvisor';

// Common Modals & Guides
import { PortalWelcomeBanner } from './components/common/PortalWelcomeBanner';
import { HowItWorksGuide } from './components/common/HowItWorksGuide';
import { ExportReportModal } from './components/common/ExportReportModal';
import { VendorProfileModal } from './components/profile/VendorProfileModal';
import { VendorProfileView } from './components/profile/VendorProfileView';
import { PricingModal } from './components/billing/PricingModal';
import { QuotaGuardModal } from './components/billing/QuotaGuardModal';

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

  useEffect(() => {
    if (authProfile) {
      setActiveProfile(authProfile);
      setCurrentRole(authProfile.role || 'OEM_SELLER');
    }
  }, [authProfile]);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (mockProfiles[role]) {
      setActiveProfile(mockProfiles[role]);
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
        return 'Executive Dashboard';
      case 'TENDERS':
      case 'MARKETPLACE':
        return 'Live GeM & CPPP Tender Bulletin';
      case 'OCR_SCANNER':
      case 'AI_DOCS':
        return 'NIT Document Scrutiny & OCR';
      case 'ELIGIBILITY':
      case 'LLAMA_PREQUAL':
        return 'PQC Criteria & GFR Evaluation';
      case 'CLAUSE_RISK':
      case 'ATLAS_VECTOR':
        return 'Contractual & LD Risk Audit';
      case 'PRICING_ADVISOR':
        return 'Schedule of Rates (SoR) & L1 Price Estimator';
      case 'OEM_PORTAL':
        return 'OEM Manufacturer & MII Catalog Registry';
      case 'MSME_PORTAL':
        return 'MSME Exemption & EMD Waiver Desk';
      case 'WORKS_PORTAL':
        return 'Civil & Works Contractor BoQ Matrix';
      default:
        return 'Procurement Workspace';
    }
  };

  return (
    <div className="min-h-screen bg-[#070F1E] text-slate-100 flex flex-col font-sans">
      
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
          onOpenOcrModal={() => setIsOcrModalOpen(true)}
          onOpenReportModal={handleOpenReportModal}
          onOpenPricingModal={() => setIsPricingModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          isOpenMobile={isOpenMobile}
          setIsOpenMobile={setIsOpenMobile}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-[#070F1E]">
          
          <div className="w-full bg-[#051124] border-b border-[#1E3A68] px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button 
                onClick={() => handleTabChange('OVERVIEW')} 
                className="flex items-center gap-1 text-slate-300 hover:text-amber-400 font-semibold transition-all"
              >
                <Home className="w-3.5 h-3.5 text-amber-400" />
                <span>GeM 2.0 Portal</span>
              </button>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-200 font-semibold">
                {getBreadcrumbTitle()}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400">
              <span>Security Level: <strong className="text-emerald-400">STQC Certified</strong></span>
              <span>&bull;</span>
              <span className="font-mono text-cyan-300">GFR 2017 Mode</span>
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
                
                <HeaderStats profile={activeProfile} currentRole={currentRole} />

                <div className="gov-card p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1E3A68]">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Active Procurement Dockets & Readiness Summary
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Last Updated: Live
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded border border-[#1E3A68]">
                    <table className="gov-table">
                      <thead>
                        <tr>
                          <th>Procurement Area</th>
                          <th>Status / Regulatory Ref</th>
                          <th>Key Metric</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="font-semibold text-slate-200">
                            NIT Tender Scrutiny & Ingested Documents
                          </td>
                          <td className="text-slate-300">
                            14 Certified Documents &bull; SHA-256 Verified
                          </td>
                          <td className="font-mono text-cyan-300">100% Parsed</td>
                          <td className="text-right">
                            <button
                              onClick={() => handleTabChange('OCR_SCANNER')}
                              className="text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                            >
                              View Docs &rarr;
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-slate-200">
                            GFR 2017 Pre-Qualification (PQC) Evaluation
                          </td>
                          <td className="text-slate-300">
                            Turnover, Past Experience & MII Criteria
                          </td>
                          <td className="font-mono text-emerald-400 font-bold">96% High Match</td>
                          <td className="text-right">
                            <button
                              onClick={() => handleTabChange('ELIGIBILITY')}
                              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                            >
                              Run Audit &rarr;
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-slate-200">
                            Contract Liquidated Damages (LD) & Penalties
                          </td>
                          <td className="text-slate-300">
                            3 Flagged Special Terms & Conditions (STC)
                          </td>
                          <td className="font-mono text-rose-400 font-bold">3 Attention Required</td>
                          <td className="text-right">
                            <button
                              onClick={() => handleTabChange('CLAUSE_RISK')}
                              className="text-xs font-semibold text-rose-400 hover:text-rose-300"
                            >
                              Review &rarr;
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-slate-200">
                            Central Public Procurement Bulletin (Live)
                          </td>
                          <td className="text-slate-300">
                            GeM 2.0 + CPPP eProcure Notices
                          </td>
                          <td className="font-mono text-amber-400 font-bold">1,482 Active Bids</td>
                          <td className="text-right">
                            <button
                              onClick={() => handleTabChange('TENDERS')}
                              className="text-xs font-semibold text-amber-400 hover:text-amber-300"
                            >
                              Browse &rarr;
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {(activeTab === 'TENDERS' || activeTab === 'MARKETPLACE') && (
              <div className="space-y-4">
                <TenderMatching
                  currentRole={currentRole}
                  onSelectTenderForCheck={handleSelectTenderForCheck}
                />
              </div>
            )}

            {(activeTab === 'OCR_SCANNER' || activeTab === 'AI_DOCS') && (
              <div className="space-y-4">
                <OcrScannerView profile={activeProfile} />
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

            {activeTab === 'PRICING_ADVISOR' && (
              <div className="space-y-4">
                <OptimalPricingAdvisor />
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

            {activeTab === 'PROFILE' && (
              <div className="space-y-4">
                <VendorProfileView 
                  profile={activeProfile} 
                  onProfileUpdated={handleProfileUpdated} 
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

      <OcrIngestionModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
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