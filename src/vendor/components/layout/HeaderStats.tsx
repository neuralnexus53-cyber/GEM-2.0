import React from 'react';
import { 
  Building2, 
  Rocket, 
  HardHat, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  FileCheck2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { VendorProfile, UserRole } from '../../types';
import { formatINR } from '../../lib/utils';

interface HeaderStatsProps {
  profile: VendorProfile;
  currentRole: UserRole;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({ profile, currentRole }) => {
  return (
    <div className="bg-[#132540] border border-[#23436E] rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#23436E] text-xs shadow-lg hover:border-[#38BDF8]/50 transition-all">
      
      {/* 1. GFR Classification */}
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
            GFR Classification
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-600/70 font-mono">
            SEC-144
          </span>
        </div>
        <div className="text-sm sm:text-base font-extrabold text-white truncate">
          {currentRole === 'OEM_SELLER' && 'OEM Direct Manufacturer'}
          {currentRole === 'AUTHORIZED_RESELLER' && 'Authorized GeM Reseller (MAF Active)'}
          {currentRole === 'SERVICE_PROVIDER' && 'Registered Service Provider (SLAs)'}
        </div>
        <div className="text-[11px] text-cyan-300 font-mono font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>{profile.brandName || profile.contractorClass || 'Verified Class-I'} &bull; {profile.experienceYears} Yrs Active</span>
        </div>
      </div>

      {/* 2. Audited Turnover */}
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
            Audited 3-Yr Turnover
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600/70 font-mono">
            UDIN-CA
          </span>
        </div>
        <div className="text-sm sm:text-base font-extrabold text-white font-mono">
          {formatINR(profile.turnoverCr * 10000000)}
        </div>
        <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>ICAI UDIN Digitally Validated</span>
        </div>
      </div>

      {/* 3. Make-in-India (MII) */}
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
            Make-in-India (MII) Content
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-600/70 font-mono">
            PPP-2017
          </span>
        </div>
        <div className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">
          {profile.miiPercentage}% Local Content
        </div>
        <div className="text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{profile.miiPercentage >= 50 ? 'Class-I Local Supplier (>50%)' : 'Class-II Local Supplier (20-50%)'}</span>
        </div>
      </div>

      {/* 4. PQC Compliance Rate */}
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
            PQC Compliance Rate
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600/70 font-mono">
            {profile.complianceScore}% SCORE
          </span>
        </div>
        <div className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
          {profile.complianceScore}% High Match
        </div>
        <div className="text-[11px] text-slate-300 font-mono font-medium flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{profile.verifiedDocsCount}/{profile.totalDocsCount} Verified Dockets Ready</span>
        </div>
      </div>

    </div>
  );
};