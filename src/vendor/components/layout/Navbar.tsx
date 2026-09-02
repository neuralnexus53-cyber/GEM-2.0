import React from 'react';
import { 
  Building2, 
  Sparkles, 
  Rocket, 
  HardHat, 
  FileCheck2, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Cpu,
  FileText,
  CreditCard,
  User,
  Zap,
  Lock
} from 'lucide-react';
import { UserRole, VendorProfile } from '../../types';
import { SubscriptionState } from '../../types/auth_billing';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
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
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  profile,
  subscription,
  onOpenOcrModal,
  onOpenReportModal,
  onOpenPricingModal,
  onOpenAuthModal
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080C16]/90 backdrop-blur-xl">
      
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 border-b border-cyan-500/15 px-4 py-1 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            GeM & CPPP LIVE SYNC ACTIVE
          </span>
          <span className="hidden sm:inline text-slate-400">
            Atlas Vector RAG Engine v4.2 &bull; Sovereign Treasury Gateway Connected
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-slate-400">Evaluation Quota:</span>
            <span className={`font-bold ${subscription.planId === 'PRO' ? 'text-violet-400' : 'text-cyan-400'}`}>
              {subscription.evaluationsLimit === -1 
                ? 'Unlimited (Pro)' 
                : `${subscription.evaluationsUsed}/${subscription.evaluationsLimit} Used`}
            </span>
          </div>

          <button
            onClick={onOpenPricingModal}
            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase transition-all flex items-center gap-1 ${
              subscription.planId === 'PRO'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                : subscription.planId === 'STARTER'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {subscription.planId} PLAN {subscription.planId !== 'PRO' && '— UPGRADE'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-lg shadow-cyan-500/25 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-100">
                  GovVendor<span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-semibold border border-cyan-500/30">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Procurement Intelligence, Monetization & Gating
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentRole('OEM_SELLER')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'OEM_SELLER'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              OEMs & Products
            </button>
            <button
              onClick={() => setCurrentRole('MSME_STARTUP')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'MSME_STARTUP'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              MSMEs & Startups
            </button>
            <button
              onClick={() => setCurrentRole('WORKS_CONTRACTOR')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'WORKS_CONTRACTOR'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              Works & BoQ
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenPricingModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-600/30 to-indigo-600/30 hover:from-violet-600/40 hover:to-indigo-600/40 text-violet-300 border border-violet-500/40 text-xs font-bold transition-all shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5 text-violet-400" />
              <span>Plans & Billing</span>
            </button>

            <button
              onClick={onOpenOcrModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <span>OCR Ingestion</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Export Audit</span>
            </button>

            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-90 transition-opacity text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-300">
                {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'VN'}
              </div>
              <div className="hidden xl:block">
                <div className="text-xs font-bold text-slate-200 max-w-[120px] truncate">
                  {user?.fullName || profile.name}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                  <span>{user?.email || 'vendor@gov.in'}</span>
                </div>
              </div>
            </button>
          </div>

        </div>

        <div className="lg:hidden flex items-center justify-between gap-1 py-2 border-t border-slate-800/60 overflow-x-auto">
          <button
            onClick={() => setCurrentRole('OEM_SELLER')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
              currentRole === 'OEM_SELLER' ? 'bg-cyan-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <Building2 className="w-3 h-3" />
            OEM Portal
          </button>
          <button
            onClick={() => setCurrentRole('MSME_STARTUP')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
              currentRole === 'MSME_STARTUP' ? 'bg-amber-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <Rocket className="w-3 h-3" />
            MSME / DPIIT
          </button>
          <button
            onClick={() => setCurrentRole('WORKS_CONTRACTOR')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
              currentRole === 'WORKS_CONTRACTOR' ? 'bg-emerald-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <HardHat className="w-3 h-3" />
            Works & BoQ
          </button>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto pt-1 pb-2 border-t border-slate-800/40 text-xs font-medium">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            Segmentation Workspace
          </button>

          <button
            onClick={() => setActiveTab('AI_DOCS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'AI_DOCS'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            AI Document & OCR Engine
          </button>

          <button
            onClick={() => setActiveTab('LLAMA_PREQUAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'LLAMA_PREQUAL'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Llama 3 Pre-Submission Checker
          </button>

          <button
            onClick={() => setActiveTab('ATLAS_VECTOR')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'ATLAS_VECTOR'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4 text-violet-400" />
            Atlas Vector Clause Risk (RAG)
            {subscription.planId !== 'PRO' && (
              <span className="p-0.5 rounded bg-violet-500/20 text-violet-300 text-[9px] font-mono ml-0.5">
                <Lock className="w-2.5 h-2.5 inline" /> PRO
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('MARKETPLACE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'MARKETPLACE'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Marketplace & Optimal Pricing
          </button>
        </nav>

      </div>
    </header>
  );
};