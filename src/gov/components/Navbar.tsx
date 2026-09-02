import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  ShieldCheck, 
  Clock, 
  Eye, 
  KeyRound, 
  CheckCircle2, 
  Landmark,
  Award,
  Lock,
  LogOut,
  Building2,
  ChevronDown,
  ArrowRightLeft
} from 'lucide-react';
import { Tender, UserRole, OfficerProfile } from '../types/procurement';
import { ActiveTab } from './Sidebar';

interface NavbarProps {
  selectedTender: Tender;
  allTenders?: Tender[];
  onSelectTender?: (id: string) => void;
  activeTab: ActiveTab;
  currentRole: UserRole;
  isVaultUnmasked: boolean;
  officerProfile: OfficerProfile;
  onOpenOfficerProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedTender,
  allTenders = [],
  onSelectTender,
  activeTab,
  currentRole,
  isVaultUnmasked,
  officerProfile,
  onOpenOfficerProfile,
}) => {
  const [istTime, setIstTime] = useState<string>('');
  const [showTenderMenu, setShowTenderMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(now.toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'TENDERS': return 'Tender Setup & PQC Governance';
      case 'EVAL_QUEUE': return 'Double-Blind Evaluation Queue';
      case 'STATUTORY': return 'Multi-Portal Sovereign Registry Gateways';
      case 'AI_SCORECARD': return 'AI Document Discrepancy & PQC Scorecard';
      case 'MII_AUDIT': return 'Make in India (MII) Local Content Audit';
      case 'COMPOSITE_MATRIX': return 'Consolidated Composite QCBS Rank Matrix';
      case 'CAG_LEDGER': return 'CAG Cryptographic Audit Ledger & Signatures';
      case 'OFFICER_PROFILE': return 'Officer Credentials & DSC Vault';
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to securely terminate this authenticated procurement officer session?')) {
      localStorage.removeItem('gem_gov_auth_session');
      window.location.href = '#/gov/login';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-lg">
      
      <div className="tricolor-strip" />

      <div className="gov-top-access-bar px-3 sm:px-6 py-1.5">
        <div className="gov-top-access-left">
          <div className="flex items-center gap-2">
            <span className="text-[#FF9933] font-black text-xs tracking-wider">भारत सरकार</span>
            <span className="text-white/40">|</span>
            <span className="text-white font-bold text-xs">Government of India</span>
          </div>
          <span className="text-white/20 hidden md:inline">|</span>
          <span className="text-slate-300 text-[11px] hidden md:inline">
            वाणिज्य एवं उद्योग मंत्रालय • Ministry of Commerce &amp; Industry
          </span>
        </div>

        <div className="gov-top-access-right flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 bg-[#0A192F] px-2.5 py-0.5 rounded border border-[#1E3A68] text-[11px]">
            <span className="text-sky-400 font-bold">{getTabTitle(activeTab)}</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-mono font-semibold">{selectedTender.tenderNumber}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{istTime || 'IST Live'}</span>
          </div>

          <span className="text-white/20">|</span>

          <div className="flex items-center gap-1 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-white font-bold">ENG</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400 hover:text-white cursor-pointer">हिंदी</span>
          </div>

          <span className="text-white/20 hidden sm:inline">|</span>
          <span className="text-emerald-400 font-bold text-[10px] hidden sm:inline">NIC Cloud Gate-4</span>
        </div>
      </div>

      <div className="w-full bg-[#002855] text-white border-b-2 border-[#E65100] px-3 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-3">
            
            <div className="w-10 h-10 rounded-full bg-[#001833] border border-[#FF9933]/70 flex items-center justify-center p-1.5 shrink-0 shadow-inner">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FF9933] fill-current">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14M7.05 2.93l9.9 18.14M2.93 7.05l18.14 9.9M2.93 16.95l18.14-9.9M7.05 21.07l9.9-18.14" stroke="currentColor" strokeWidth="0.75" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider text-[#FF9933] uppercase">
                  GeM 2.0
                </span>
                <span className="text-slate-400">&bull;</span>
                <h1 className="font-bold text-xs sm:text-sm text-white tracking-tight leading-tight">
                  Procurement Officer Executive Suite
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-[#052410] text-[#86EFAC] font-bold border border-[#15803D]">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {officerProfile.clearanceLevel || 'LEVEL_3_CAG_SIGNER'}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium hidden sm:block">
                सक्षम प्राधिकारी एवं तकनीकी मूल्यांकन समिति पोर्टल | Sovereign Public Procurement Evaluation
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          
          <div className="relative">
            <button
              onClick={() => setShowTenderMenu(!showTenderMenu)}
              className="flex items-center gap-2 bg-[#001D3D] hover:bg-[#001833] border border-[#1E3A68] px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 transition-colors shadow-sm cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="max-w-[140px] truncate">{selectedTender.tenderNumber}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showTenderMenu && allTenders.length > 0 && (
              <div className="absolute right-0 mt-1 w-72 bg-[#0C1A30] border border-[#1E3A68] rounded-xl shadow-2xl z-50 py-1.5 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-[#1E3A68]">
                  Select Active Tender
                </div>
                {allTenders.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (onSelectTender) onSelectTender(t.id);
                      setShowTenderMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#002855] transition-colors border-none cursor-pointer flex flex-col ${
                      t.id === selectedTender.id ? 'bg-[#002855] text-amber-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span className="font-mono text-[11px]">{t.tenderNumber}</span>
                    <span className="text-[10px] text-slate-400 truncate">{t.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/vendor"
            className="flex items-center gap-1.5 bg-[#001D3D] hover:bg-[#001833] border border-[#1E3A68] hover:border-[#FF9933] px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-amber-400 transition-all shadow-sm"
            title="Switch to Vendor Compliance Portal"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#FF9933]" />
            <span className="hidden sm:inline">Vendor Portal</span>
          </Link>

          <button
            onClick={onOpenOfficerProfile}
            className="flex items-center gap-2 bg-[#001D3D] hover:bg-[#001833] border border-[#1E3A68] px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 transition-colors shadow-sm cursor-pointer"
            title="Open Officer Credentials & DSC Vault"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="max-w-[100px] truncate">{officerProfile.fullName || 'Officer'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-[#3B0D0D] hover:bg-[#5C1414] border border-[#B91C1C] text-red-300 hover:text-white transition-colors cursor-pointer"
            title="Secure Session Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </div>

    </header>
  );
};