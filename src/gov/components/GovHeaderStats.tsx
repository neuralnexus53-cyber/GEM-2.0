import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  FileCheck2,
  Lock,
  Cpu,
  Award,
  Clock
} from 'lucide-react';
import { Tender, UserRole, OfficerProfile } from '../types/procurement';

interface GovHeaderStatsProps {
  tender: Tender;
  currentRole: UserRole;
  officerProfile: OfficerProfile;
  submissionsCount: number;
  isVaultUnmasked: boolean;
  ledgerCount: number;
}

export const GovHeaderStats: React.FC<GovHeaderStatsProps> = ({
  tender,
  currentRole,
  officerProfile,
  submissionsCount,
  isVaultUnmasked,
  ledgerCount,
}) => {
  return (
    <div className="bg-[#051124] border border-[#1E3A68] rounded p-3 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1E3A68] text-xs shadow-md">
      
      <div className="px-3 py-1.5 space-y-0.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
          Officer Authority &amp; Role
        </span>
        <div className="text-sm font-bold text-slate-100 truncate flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{officerProfile.designation || 'Procurement Officer'}</span>
        </div>
        <div className="text-[11px] text-cyan-300 font-mono">
          {officerProfile.badgeId} &bull; {officerProfile.clearanceLevel}
        </div>
      </div>

      <div className="px-3 py-1.5 space-y-0.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
          Active Tender Scrutiny
        </span>
        <div className="text-sm font-bold text-slate-100 font-mono truncate">
          ₹{tender.estimatedBudget.toFixed(2)} Cr &bull; {tender.tenderNumber}
        </div>
        <div className="text-[11px] text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>{tender.evaluationMode} Evaluation Mode</span>
        </div>
      </div>

      <div className="px-3 py-1.5 space-y-0.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
          Double-Blind Sealed Vault
        </span>
        <div className="text-sm font-bold text-[#FF9933] font-mono flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>{submissionsCount} Masked Bids</span>
        </div>
        <div className="text-[11px] text-amber-300">
          {isVaultUnmasked ? '⚠️ Buyer Authority: Unmasked' : '🔒 KMS SHA-256 Vault: Active'}
        </div>
      </div>

      <div className="px-3 py-1.5 space-y-0.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
          CAG Sovereign Merkle Ledger
        </span>
        <div className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>{ledgerCount} Cryptographic Blocks</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          14-Point Sovereign API: 100% Online
        </div>
      </div>

    </div>
  );
};
