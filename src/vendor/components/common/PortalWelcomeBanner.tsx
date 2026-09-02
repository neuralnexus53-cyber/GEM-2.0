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
      onSelectTab('TENDERS');
    }
  };

  return (
    <div className="bg-[#002046] border border-[#1E3A68] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#052410] text-emerald-300 border border-[#15803D]">
            GFR 2017 & MSME Compliant
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Seller ID: <strong className="text-slate-200">{profile.id}</strong>
          </span>
        </div>

        <h2 className="text-base font-bold text-slate-100">
          {profile.name}
        </h2>

        <p className="text-xs text-slate-300">
          {currentRole === 'OEM_SELLER' && 'OEM Direct Manufacturer Desk &bull; Brand Registered on GeM'}
          {currentRole === 'MSME_STARTUP' && 'MSME & Startup Facilitation Desk &bull; Udyam Registered Enterprise'}
          {currentRole === 'WORKS_CONTRACTOR' && 'Civil & Works EPC Contractor Desk &bull; CPWD Class-1 Enlistment'}
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
              className="pl-8 pr-3 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 text-xs font-mono focus:border-[#0284C7] focus:outline-none w-48"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold"
          >
            Audit
          </button>
        </form>

        <button
          onClick={onOpenGuide}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded bg-[#08172D] hover:bg-[#0E203B] text-slate-300 border border-[#1E3A68] text-xs font-medium"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>SOP Guide</span>
        </button>
      </div>

    </div>
  );
};