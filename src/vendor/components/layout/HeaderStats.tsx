import React from 'react';
import { 
  Building2, 
  Rocket, 
  HardHat, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  FileCheck2
} from 'lucide-react';
import { VendorProfile, UserRole } from '../../types';
import { formatINR } from '../../lib/utils';

interface HeaderStatsProps {
  profile: VendorProfile;
  currentRole: UserRole;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({ profile, currentRole }) => {
  return (
    <div className="bg-[#051124] border border-[#1E3A68] rounded p-3 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1E3A68] text-xs">
      
      <div className="px-3 py-1.5 space-y-0.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
          GFR Classification
        </span>
        <div className="text-sm font-bold text-slate-100 truncate">
          {currentRole === 'OEM_SELLER' && 'OEM Direct Manufacturer'}
          {currentRole === 'MSME_STARTUP' && 'MSME (Micro & Small)'}
          {currentRole === 'WORKS_CONTRACTOR' && 'Civil EPC Contractor'}
        </div>
        <div className="text-[11px] text-cyan-300 font-mono">
          {profile.brandName || profile.contractorClass || 'Verified Class-I'} &bull; {profile.experienceYears} Yrs
        </div>
      </div>

      <div className="px-3 py-1.5 space-y-0.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
          Audited 3-Yr Turnover
        </span>
        <div className="text-sm font-bold text-slate-100 font-mono">
          {formatINR(profile.turnoverCr * 10000000)}
        </div>
        <div className="text-[11px] text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>CA UDIN Validated</span>
        </div>
      </div>

      <div className="px-3 py-1.5 space-y-0.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
          Make-in-India (MII) Content
        </span>
        <div className="text-sm font-bold text-[#FF9933] font-mono">
          {profile.miiPercentage}% Local Content
        </div>
        <div className="text-[11px] text-amber-300">
          {profile.miiPercentage >= 50 ? 'Class-I Local Supplier' : 'Class-II Local Supplier'}
        </div>
      </div>

      <div className="px-3 py-1.5 space-y-0.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
          PQC Compliance Rate
        </span>
        <div className="text-sm font-bold text-emerald-400 font-mono">
          {profile.complianceScore}% High Match
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {profile.verifiedDocsCount}/{profile.totalDocsCount} Verified Dockets
        </div>
      </div>

    </div>
  );
};