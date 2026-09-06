import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserRole, VendorProfile } from '../../types';

interface PortalWelcomeBannerProps {
  currentRole: UserRole;
  profile: VendorProfile;
  onOpenGuide: () => void;
  onSelectTab: (tab: string) => void;
}

export const PortalWelcomeBanner: React.FC<PortalWelcomeBannerProps> = ({
  currentRole,
  profile,
  onOpenGuide,
  onSelectTab
}) => {
  const [quickBidNo, setQuickBidNo] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickBidNo.trim()) {
      onSelectTab('OCR_SCANNER');
    }
  };

  return (
    <div className="bg-[#132540] border border-[#23436E] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
      
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600">
            GFR 2017 & MSME Compliant
          </span>
          <span className="text-xs text-slate-300 font-mono">
            Seller ID: <strong className="text-white">{profile.id}</strong>
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-extrabold text-white">
          {profile.name}
        </h2>

        <p className="text-xs text-slate-200">
          {currentRole === 'OEM_SELLER' && 'OEM Direct Manufacturer Desk • Brand & Catalog Registered on GeM'}
          {currentRole === 'AUTHORIZED_RESELLER' && 'Authorized Reseller Desk • Back-to-Back OEM MAF & MSE Preferences'}
          {currentRole === 'SERVICE_PROVIDER' && 'Service Provider Desk • Manpower, Cloud, Facility & Works EPC SLAs'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
        <form onSubmit={handleQuickSearch} className="flex gap-1.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={quickBidNo}
              onChange={e => setQuickBidNo(e.target.value)}
              placeholder="Search GeM Bid No..."
              className="pl-8 pr-3 py-1.5 bg-[#0B192C] border border-[#23436E] rounded text-white text-xs font-mono placeholder-slate-400 focus:border-[#38BDF8] focus:outline-none w-48"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-xs"
          >
            Audit
          </button>
        </form>

        <button
          onClick={onOpenGuide}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#0B192C] hover:bg-[#1E3A68] text-white border border-[#23436E] text-xs font-medium transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>SOP Guide</span>
        </button>
      </div>

    </div>
  );
};