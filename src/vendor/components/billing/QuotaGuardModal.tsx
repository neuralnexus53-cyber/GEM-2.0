import React from 'react';
import { 
  X, 
  Lock, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2
} from 'lucide-react';
import { PlanTier } from '../../types/auth_billing';

interface QuotaGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing: () => void;
  reason: 'QUOTA_EXCEEDED' | 'TIER_LOCKED';
  featureName?: string;
  requiredTier?: PlanTier;
  currentTier?: PlanTier;
  evaluationsUsed?: number;
  evaluationsLimit?: number;
}

export const QuotaGuardModal: React.FC<QuotaGuardModalProps> = ({
  isOpen,
  onClose,
  onOpenPricing,
  reason,
  featureName = 'Contract Liquidated Damages & Risk Audit',
  requiredTier = 'PRO',
  currentTier = 'FREE',
  evaluationsUsed = 5,
  evaluationsLimit = 5
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0C1A30] border border-[#1E3A68] rounded-lg shadow-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between border-b border-[#1E3A68] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#001D3D] text-amber-400 border border-[#1E3A68]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2D1A05] text-amber-300 font-bold uppercase border border-[#9A3412]">
                {reason === 'QUOTA_EXCEEDED' ? 'Evaluation Quota Limit Reached' : 'Enterprise Feature'}
              </span>
              <h3 className="text-sm font-bold text-slate-100 mt-1">
                {reason === 'QUOTA_EXCEEDED'
                  ? 'Monthly Free Tender Scrutiny Limit Reached'
                  : `${featureName} requires Pro Enterprise Access`}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#002855] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {reason === 'QUOTA_EXCEEDED' ? (
            <div className="p-3 bg-[#051124] rounded border border-[#1E3A68] space-y-1.5 text-xs text-slate-300">
              <p>
                You have utilized all <strong className="text-amber-400">{evaluationsLimit} free evaluations</strong> included in your Basic tier.
              </p>
              <p className="text-slate-400 text-[11px]">
                To evaluate more tender documents and access unlimited GFR scrutiny dockets, upgrade your subscription to Pro Enterprise.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-[#051124] rounded border border-[#1E3A68] space-y-1.5 text-xs text-slate-300">
              <p>
                The <strong className="text-cyan-300">{featureName}</strong> performs automated legal scrutiny across tender Special Terms & Conditions (STC) and Liquidated Damages (LD) clauses.
              </p>
              <p className="text-slate-400 text-[11px]">
                Upgrade to Pro Enterprise to unlock unlimited legal risk audits and printable pre-bid representation letters.
              </p>
            </div>
          )}

          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Complies with General Financial Rules (GFR), 2017</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full GST Input Tax Credit (ITC) tax invoice provided</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#1E3A68]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-[#08172D] text-slate-400 text-xs font-semibold hover:bg-[#0E203B]"
          >
            Close
          </button>
          
          <button
            onClick={() => {
              onClose();
              onOpenPricing();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-xs"
          >
            <span>View Subscription Options</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};