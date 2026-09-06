import React from 'react';
import { 
  Building2, 
  Rocket, 
  HardHat, 
  FileCheck2, 
  ShieldAlert, 
  Layers, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  ChevronRight,
  UploadCloud,
  UserCheck,
  KeyRound,
  Wrench,
  CreditCard,
  Sparkles,
  History
} from 'lucide-react';
import { UserRole, VendorProfile } from '../../types';
import { SubscriptionState } from '../../types/auth_billing';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: VendorProfile;
  subscription: SubscriptionState;
  onOpenOcrModal: () => void;
  onOpenReportModal: () => void;
  onOpenPricingModal: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenDigiLockerModal?: () => void;
  onOpenGuide: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  profile,
  subscription,
  onOpenOcrModal,
  onOpenReportModal,
  onOpenProfileModal,
  isOpenMobile,
  setIsOpenMobile
}) => {
  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 bg-[#0A192F] text-slate-100 border-r border-[#23436E]
        flex flex-col justify-between shadow-md
        transform transition-transform duration-200 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-4 text-xs">
          
          <div className="bg-[#132540] p-2.5 rounded-lg border border-[#23436E] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                Active Vendor Class
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600">
                VERIFIED
              </span>
            </div>
            <div className="text-xs font-bold text-white truncate">
              {profile.name}
            </div>
            <div className="text-[10px] text-slate-300 font-mono">
              GSTIN: <span className="font-bold text-cyan-300">{profile.gstin}</span>
            </div>
          </div>

          {/* Section 1: Executive Telemetry & Profile */}
          <div className="space-y-1">
            <div className="px-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Executive Telemetry
              </span>
            </div>

            <button
              onClick={() => handleNavClick('OVERVIEW')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'OVERVIEW'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${activeTab === 'OVERVIEW' ? 'text-cyan-300' : 'text-amber-400'}`} />
                <span>Executive Dashboard</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'OVERVIEW' ? 'text-cyan-300' : 'text-slate-500'}`} />
            </button>

            <button
              onClick={() => handleNavClick('PROFILE')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'PROFILE'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className={`w-4 h-4 ${activeTab === 'PROFILE' ? 'text-cyan-300' : 'text-emerald-400'}`} />
                <span>My Profile &amp; GFR Data</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600/70 font-mono">
                100%
              </span>
            </button>
          </div>

          {/* Section 2: AI-Powered Bid Scrutiny Engine */}
          <div className="space-y-1">
            <div className="px-2 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                AI Bid Scrutiny Engine
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 font-mono font-bold border border-sky-600/70">
                CORE IP
              </span>
            </div>

            <button
              onClick={() => handleNavClick('OCR_SCANNER')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'OCR_SCANNER'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className={`w-4 h-4 ${activeTab === 'OCR_SCANNER' ? 'text-cyan-300' : 'text-sky-400'}`} />
                <span>NIT Document OCR</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">14 Docs</span>
            </button>

            <button
              onClick={() => handleNavClick('ELIGIBILITY')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'ELIGIBILITY'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className={`w-4 h-4 ${activeTab === 'ELIGIBILITY' ? 'text-cyan-300' : 'text-emerald-400'}`} />
                <span>PQC &amp; GFR Evaluation</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600/70 font-mono">
                96%
              </span>
            </button>

            <button
              onClick={() => handleNavClick('CLAUSE_RISK')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'CLAUSE_RISK'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className={`w-4 h-4 ${activeTab === 'CLAUSE_RISK' ? 'text-cyan-300' : 'text-rose-400'}`} />
                <span>Contract &amp; LD Risk Audit</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-600/70 font-mono">
                {profile.riskAlertsCount ?? 3} Alerts
              </span>
            </button>

            <button
              onClick={() => handleNavClick('DISCREPANCY_WIZARD')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'DISCREPANCY_WIZARD'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wrench className={`w-4 h-4 ${activeTab === 'DISCREPANCY_WIZARD' ? 'text-cyan-300' : 'text-amber-400'}`} />
                <span>Discrepancy Remediation</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-600/70 font-mono">
                WIZARD
              </span>
            </button>
          </div>

          {/* Section 3: Bias-Free Evaluation & Cryptographic Vault */}
          <div className="space-y-1">
            <div className="px-2 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Bias-Free &amp; Audit Trail
              </span>
            </div>

            <button
              onClick={() => handleNavClick('BLIND_VAULT')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'BLIND_VAULT'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className={`w-4 h-4 ${activeTab === 'BLIND_VAULT' ? 'text-cyan-300' : 'text-indigo-400'}`} />
                <span>Blind Evaluation Token</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono font-bold border border-indigo-600/70">
                anon_token
              </span>
            </button>

            <button
              onClick={() => handleNavClick('EVALUATION_ARCHIVE')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'EVALUATION_ARCHIVE'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className={`w-4 h-4 ${activeTab === 'EVALUATION_ARCHIVE' ? 'text-cyan-300' : 'text-cyan-400'}`} />
                <span>Historical Dossier Archive</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-600/70">
                MERKLE
              </span>
            </button>
          </div>

          {/* Section 4: Bidding & Rate Intelligence (Monetization / Gated) */}
          <div className="space-y-1">
            <div className="px-2 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Rate Intelligence
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold border border-amber-600/70 flex items-center gap-0.5 font-mono">
                <Sparkles className="w-2.5 h-2.5" /> PRO
              </span>
            </div>

            <button
              onClick={() => handleNavClick('PRICING_ADVISOR')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'PRICING_ADVISOR'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className={`w-4 h-4 ${activeTab === 'PRICING_ADVISOR' ? 'text-cyan-300' : 'text-amber-400'}`} />
                <span>Schedule of Rates &amp; L1</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'PRICING_ADVISOR' ? 'text-cyan-300' : 'text-slate-500'}`} />
            </button>
          </div>

          {/* Section 5: Specialized Vendor Desks */}
          <div className="space-y-1">
            <div className="px-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Specialized Vendor Desks
              </span>
            </div>

            <button
              onClick={() => {
                setCurrentRole('OEM_SELLER');
                handleNavClick('OEM_PORTAL');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'OEM_PORTAL'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className={`w-4 h-4 ${activeTab === 'OEM_PORTAL' ? 'text-cyan-300' : 'text-sky-400'}`} />
                <span>OEM Catalog &amp; MAF Issuer</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-mono font-bold border border-sky-600/70">
                MII 74%
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('AUTHORIZED_RESELLER');
                handleNavClick('MSME_PORTAL');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'MSME_PORTAL'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Rocket className={`w-4 h-4 ${activeTab === 'MSME_PORTAL' ? 'text-cyan-300' : 'text-amber-400'}`} />
                <span>Authorized Reseller &amp; MAF</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold border border-amber-600/70">
                MAF Valid
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('SERVICE_PROVIDER');
                handleNavClick('WORKS_PORTAL');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'WORKS_PORTAL'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HardHat className={`w-4 h-4 ${activeTab === 'WORKS_PORTAL' ? 'text-cyan-300' : 'text-emerald-400'}`} />
                <span>Service Provider &amp; SLAs</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-600/70">
                Services
              </span>
            </button>
          </div>

          {/* Section 6: SaaS Subscription & Tracker */}
          <div className="space-y-1">
            <div className="px-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                SaaS Subscription &amp; Quota
              </span>
            </div>

            <button
              onClick={() => handleNavClick('BILLING_TRACKER')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                activeTab === 'BILLING_TRACKER'
                  ? 'bg-gradient-to-r from-[#0284C7]/30 to-[#0284C7]/10 text-white border-l-4 border-[#38BDF8] shadow-sm'
                  : 'text-slate-300 hover:bg-[#132540] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className={`w-4 h-4 ${activeTab === 'BILLING_TRACKER' ? 'text-cyan-300' : 'text-cyan-400'}`} />
                <span>Billing &amp; Usage Meter</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-600/70">
                {subscription.evaluationsUsed}/{subscription.evaluationsLimit === 9999 ? '∞' : subscription.evaluationsLimit}
              </span>
            </button>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#23436E]">
            <button
              onClick={onOpenOcrModal}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#132540] hover:bg-[#193256] text-white border border-[#23436E] text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
              <span>Ingest Tender NIT (PDF)</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#002855] hover:bg-[#003875] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs border border-[#23436E]"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Generate Signed Dossier</span>
            </button>
          </div>

        </div>

        <div className="p-3 bg-[#071322] border-t border-[#23436E] space-y-2">
          <button
            onClick={onOpenProfileModal}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[#132540] text-left transition-all text-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <div className="text-[11px] font-bold text-white">Vendor Registry Form</div>
                <div className="text-[9px] text-slate-400 font-mono">PAN: {profile.pan}</div>
              </div>
            </div>
            <span className="text-[9px] px-1 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600">
              V-01
            </span>
          </button>

          <div className="px-2 py-1 bg-[#132540] rounded text-[9px] text-slate-300 border border-[#23436E] leading-tight shadow-xs">
            <span className="text-sky-300 font-bold">NIC Security Certified:</span> Verified under GFR 2017 &amp; Public Procurement Policy.
          </div>
        </div>

      </aside>
    </>
  );
};