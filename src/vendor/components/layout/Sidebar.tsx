import React from 'react';
import { 
  Building2, 
  Rocket, 
  HardHat, 
  FileCheck2, 
  ShieldAlert, 
  TrendingUp, 
  Layers, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  ChevronRight,
  UploadCloud,
  UserCheck
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
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 bg-[#08172D] text-slate-200 border-r border-[#1E3A68]
        flex flex-col justify-between
        transform transition-transform duration-200 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-4 text-xs">
          
          <div className="bg-[#051124] p-2.5 rounded border border-[#1E3A68] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Vendor Class
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
                VERIFIED
              </span>
            </div>
            <div className="text-xs font-bold text-slate-100 truncate">
              {profile.name}
            </div>
            <div className="text-[10px] text-amber-400 font-mono">
              GSTIN: {profile.gstin}
            </div>
          </div>

          <div className="space-y-1">
            <div className="px-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Core Procurement Desks
              </span>
            </div>

            <button
              onClick={() => handleNavClick('OVERVIEW')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'OVERVIEW'
                  ? 'bg-[#002855] text-white border-l-3 border-[#FF9933]'
                  : 'text-slate-300 hover:bg-[#0A1E3D] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Executive Dashboard</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => handleNavClick('PROFILE')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'PROFILE'
                  ? 'bg-[#002855] text-white border-l-3 border-[#10B981]'
                  : 'text-slate-300 hover:bg-[#0A1E3D] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>My Profile &amp; GFR Vault</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
                NEW
              </span>
            </button>

            <button
              onClick={() => handleNavClick('TENDERS')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'TENDERS' || activeTab === 'MARKETPLACE'
                  ? 'bg-[#002855] text-white border-l-3 border-[#0284C7]'
                  : 'text-slate-300 hover:bg-[#0A1E3D] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Live GeM &amp; CPPP Tender Feed</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#001833] text-amber-400 font-mono border border-[#1E3A68]">
                1,482
              </span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-2 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Automated Bid Scrutiny
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#002855] text-cyan-300 font-mono font-bold border border-[#1E3A68]">
                AI-GFR
              </span>
            </div>

            <button
              onClick={() => handleNavClick('OCR_SCANNER')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'OCR_SCANNER'
                  ? 'bg-[#002855] text-white border-l-3 border-[#0284C7]'
                  : 'text-slate-300 hover:bg-[#0A1E3D] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <span>NIT Document Scrutiny & OCR</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">14 Docs</span>
            </button>

            <button
              onClick={() => handleNavClick('ELIGIBILITY')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'ELIGIBILITY'
                  ? 'bg-[#002855] text-white border-l-3 border-[#138808]'
                  : 'text-slate-300 hover:bg-[#0A1E3D] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>PQC Criteria & GFR Evaluation</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
                96%
              </span>
            </button>

            <button
              onClick={() => handleNavClick('CLAUSE_RISK')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'CLAUSE_RISK'
                  ? 'bg-[#002855] text-white border-l-3 border-[#DC2626]'
                  : 'text-slate-300 hover:bg-[#0A1E3D] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Contract & LD Risk Audit</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#3B0D0D] text-rose-300 font-bold border border-[#B91C1C]">
                3 Alerts
              </span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Bidding & Rate Intelligence
              </span>
            </div>

            <button
              onClick={() => handleNavClick('PRICING_ADVISOR')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'PRICING_ADVISOR'
                  ? 'bg-[#002855] text-white border-l-3 border-[#E65100]'
                  : 'text-slate-300 hover:bg-[#0A1E3D] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Schedule of Rates & L1 Advisor</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

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
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'OEM_PORTAL'
                  ? 'bg-[#002855] text-white border-l-3 border-[#0284C7]'
                  : 'text-slate-300 hover:bg-[#0A1E3D] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>OEM Catalog & MAF Generator</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#001833] text-cyan-300 border border-[#1E3A68]">
                MII 74%
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('MSME_STARTUP');
                handleNavClick('MSME_PORTAL');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'MSME_PORTAL'
                  ? 'bg-[#002855] text-white border-l-3 border-[#E65100]'
                  : 'text-slate-300 hover:bg-[#0A1E3D] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Rocket className="w-4 h-4 text-amber-400" />
                <span>MSME Exemption & EMD Waiver</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2D1A05] text-amber-300 border border-[#9A3412]">
                Udyam
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('WORKS_CONTRACTOR');
                handleNavClick('WORKS_PORTAL');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'WORKS_PORTAL'
                  ? 'bg-[#002855] text-white border-l-3 border-[#138808]'
                  : 'text-slate-300 hover:bg-[#0A1E3D] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HardHat className="w-4 h-4 text-emerald-400" />
                <span>Works BoQ & Bidding Capacity</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#052410] text-emerald-300 border border-[#15803D]">
                CPWD
              </span>
            </button>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#1E3A68]">
            <button
              onClick={onOpenOcrModal}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded bg-[#00244D] hover:bg-[#003366] text-slate-200 border border-[#1E3A68] text-xs font-semibold transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ingest Tender NIT (PDF)</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded bg-[#0B2545] hover:bg-[#112E55] text-blue-200 border border-[#1D4ED8] text-xs font-semibold transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Generate Signed Dossier</span>
            </button>
          </div>

        </div>

        <div className="p-3 bg-[#051124] border-t border-[#1E3A68] space-y-2">
          <button
            onClick={onOpenProfileModal}
            className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-[#0A1E3D] text-left transition-all text-xs"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <div className="text-[11px] font-bold text-slate-200">Vendor Registry Form</div>
                <div className="text-[9px] text-slate-400 font-mono">PAN: {profile.pan}</div>
              </div>
            </div>
            <span className="text-[9px] px-1 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
              V-01
            </span>
          </button>

          <div className="px-2 py-1 bg-[#001833] rounded text-[9px] text-slate-400 border border-[#1E3A68] leading-tight">
            <span className="text-amber-400 font-bold">NIC Security Certified:</span> Verified under GFR 2017 & Public Procurement Policy.
          </div>
        </div>

      </aside>
    </>
  );
};