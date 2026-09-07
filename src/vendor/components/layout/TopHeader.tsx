import React from 'react';
import { 
  Menu, 
  ShieldCheck, 
  CreditCard, 
  HelpCircle,
  Lock,
  LogOut,
  UserCheck,
  FileCheck,
  CheckCircle2,
  Star,
  ChevronDown,
  Building2
} from 'lucide-react';
import { UserRole, VendorProfile } from '../../types';
import { SubscriptionState } from '../../types/auth_billing';
import { useAuth } from '../../context/AuthContext';
import { mockProfiles } from '../../data/mockData';
import { LanguageSelector } from '../../../components/LanguageSelector';

interface TopHeaderProps {
  currentRole: UserRole;
  profile: VendorProfile;
  subscription: SubscriptionState;
  onOpenPricingModal: () => void;
  onOpenGuide: () => void;
  onToggleMobileSidebar: () => void;
  onSelectRole?: (role: UserRole) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentRole,
  profile,
  subscription,
  onOpenPricingModal,
  onOpenGuide,
  onToggleMobileSidebar,
  onSelectRole
}) => {
  const { user, logout, switchDossier } = useAuth();

  // Read other registered vendor dossiers
  const otherRegisteredAccounts = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('gem_registered_vendors');
      if (!raw) return [];
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return [];
      return list.filter((item: any) => {
        const id = item.session?.vendorId || item.profile?.id;
        return id && id !== profile.id && id !== user?.vendorId;
      });
    } catch (e) {
      return [];
    }
  }, [profile.id, user?.vendorId]);

  const handleAccountSelect = (val: string) => {
    if (val === '__REGISTER_OEM__') {
      window.location.hash = '#/vendor/register?role=OEM_SELLER';
      return;
    }
    if (val === '__REGISTER_MSME__') {
      window.location.hash = '#/vendor/register?role=MSME_STARTUP';
      return;
    }
    if (val === '__REGISTER_WORKS__') {
      window.location.hash = '#/vendor/register?role=WORKS_CONTRACTOR';
      return;
    }
    if (val.startsWith('DOSSIER:')) {
      const vendorId = val.replace('DOSSIER:', '');
      switchDossier(vendorId);
      window.location.reload();
      return;
    }
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '#/';
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#002855] text-white border-b-2 border-[#E65100] px-3 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-md">
      
      <div className="flex items-center justify-between sm:justify-start gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="p-1.5 rounded bg-[#001D3D] border border-[#1E3A68] text-slate-200 hover:text-white lg:hidden"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#001833] border border-[#FF9933]/70 flex items-center justify-center p-1.5 shrink-0 shadow-inner">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FF9933] fill-current">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14M7.05 2.93l9.9 18.14M2.93 7.05l18.14 9.9M2.93 16.95l18.14-9.9M7.05 21.07l9.9-18.14" stroke="currentColor" strokeWidth="0.75" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider text-[#FF9933] uppercase">
                  GeM 2.0
                </span>
                <span className="text-slate-400">&bull;</span>
                <h1 className="font-bold text-xs sm:text-sm text-white tracking-tight leading-tight">
                  Government e-Marketplace
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-[#052410] text-[#86EFAC] font-bold border border-[#15803D]">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  GFR 2017 & PPP-MII
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium hidden sm:block">
                केन्द्रीय लोक खरीद एवं निविदा पोर्टल | National Public Procurement & Bid Scrutiny Portal
              </p>
            </div>
          </div>
        </div>

        <div className="flex sm:hidden items-center gap-1">
          <button
            onClick={onOpenPricingModal}
            className="px-2 py-1 rounded bg-[#E65100] text-white font-bold text-[10px]"
          >
            {subscription.planId}
          </button>
          <button
            onClick={handleLogout}
            className="p-1 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px]"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
        
        {/* Active Vendor Entity & Account Selector */}
        <div className="flex items-center gap-1.5 bg-[#001833] px-2 py-1 rounded border border-[#1E3A68] text-xs">
          <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[10px] text-slate-400 font-medium hidden md:inline">Account:</span>
          <select
            value="CURRENT"
            onChange={e => handleAccountSelect(e.target.value)}
            className="bg-transparent text-slate-100 font-semibold text-[11px] focus:outline-none cursor-pointer pr-1 max-w-[210px] truncate"
          >
            <option value="CURRENT" className="bg-[#002855] text-white">
              {profile.name} ({profile.role === 'OEM_SELLER' ? 'OEM Manufacturer' : profile.role === 'AUTHORIZED_RESELLER' || profile.role === 'MSME_STARTUP' ? 'MSME / Reseller' : 'Works Contractor'})
            </option>

            {otherRegisteredAccounts.length > 0 && (
              <optgroup label="Registered Vendor Accounts" className="bg-[#001833] text-cyan-300">
                {otherRegisteredAccounts.map((acc: any, i: number) => {
                  const r = acc.profile?.role || acc.session?.role;
                  const roleLabel = r === 'OEM_SELLER' ? 'OEM' : r === 'MSME_STARTUP' || r === 'AUTHORIZED_RESELLER' ? 'MSME' : 'Works';
                  return (
                    <option key={i} value={`DOSSIER:${acc.session?.vendorId || acc.profile?.id}`} className="bg-[#002855] text-white">
                      {acc.profile?.name || acc.session?.fullName} ({roleLabel})
                    </option>
                  );
                })}
              </optgroup>
            )}

            <optgroup label="+ Register for Another Role" className="bg-[#001833] text-amber-300">
              {profile.role !== 'OEM_SELLER' && (
                <option value="__REGISTER_OEM__" className="bg-[#002855] text-amber-300">
                  + Sign Up as OEM Manufacturer
                </option>
              )}
              {profile.role !== 'MSME_STARTUP' && profile.role !== 'AUTHORIZED_RESELLER' && (
                <option value="__REGISTER_MSME__" className="bg-[#002855] text-amber-300">
                  + Sign Up as MSME / Startup
                </option>
              )}
              {profile.role !== 'WORKS_CONTRACTOR' && profile.role !== 'SERVICE_PROVIDER' && (
                <option value="__REGISTER_WORKS__" className="bg-[#002855] text-amber-300">
                  + Sign Up as Works Contractor
                </option>
              )}
            </optgroup>
          </select>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs bg-[#001833] px-2.5 py-1 rounded border border-[#1E3A68]">
          <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{profile.gemStarRating ? profile.gemStarRating.toFixed(1) : '4.8'}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[10px] text-slate-300">
            GSTIN: <strong className="text-white font-mono">{profile.gstin}</strong>
          </span>
        </div>


        <LanguageSelector variant="topbar" />

        <button
          onClick={onOpenPricingModal}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
            subscription.planId === 'PRO'
              ? 'bg-[#0B2545] hover:bg-[#112E55] text-blue-200 border-[#1D4ED8]'
              : 'bg-[#E65100] hover:bg-[#C2410C] text-white border-[#EA580C]'
          }`}
        >
          <CreditCard className="w-3 h-3" />
          <span className="text-[11px]">{subscription.planId === 'PRO' ? 'Pro Access' : 'Subscription'}</span>
        </button>

        <button
          onClick={handleLogout}
          title="Sign Out & Lock Vendor Session"
          className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-[#3B0D0D] hover:bg-[#501212] border border-[#B91C1C] text-rose-200 text-xs font-medium transition-all cursor-pointer"
        >
          <LogOut className="w-3 h-3 text-rose-400" />
          <span className="text-[10px]">Exit</span>
        </button>

      </div>

    </header>
  );
};