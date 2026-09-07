import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Building2, 
  Rocket, 
  HardHat, 
  ArrowRight, 
  UserPlus, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { UserRole, VendorProfile } from '../../types';
import { getVendorDeskConfig, VENDOR_ROLE_DEFINITIONS } from '../../types/roleConfig';
import { useAuth } from '../../context/AuthContext';

interface RoleAuthorityGuardProps {
  requiredRole: 'OEM_SELLER' | 'MSME_STARTUP' | 'WORKS_CONTRACTOR';
  currentProfile: VendorProfile;
  onNavigateToAllowedDesk: () => void;
  onNavigateToOverview: () => void;
}

export const RoleAuthorityGuard: React.FC<RoleAuthorityGuardProps> = ({
  requiredRole,
  currentProfile,
  onNavigateToAllowedDesk,
  onNavigateToOverview
}) => {
  const { login } = useAuth();
  const currentConfig = getVendorDeskConfig(currentProfile.role);
  const targetConfig = getVendorDeskConfig(requiredRole);

  // Check if user has already registered an account matching the required role
  const registeredAccounts = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('gem_registered_vendors');
      if (!raw) return [];
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return [];
      return list.filter((item: any) => {
        const itemRole = item.profile?.role || item.session?.role;
        if (requiredRole === 'MSME_STARTUP') {
          return itemRole === 'MSME_STARTUP' || itemRole === 'AUTHORIZED_RESELLER';
        }
        if (requiredRole === 'WORKS_CONTRACTOR') {
          return itemRole === 'WORKS_CONTRACTOR' || itemRole === 'SERVICE_PROVIDER';
        }
        return itemRole === 'OEM_SELLER';
      });
    } catch (e) {
      return [];
    }
  }, [requiredRole]);

  const handleSwitchToRegistered = async (account: any) => {
    const identifier = account.session?.email || account.session?.vendorId || account.session?.gstin;
    const password = account.password || 'VendorPass@2026';
    if (identifier) {
      await login(identifier, password);
      window.location.reload();
    }
  };

  const handleSignUpForRole = () => {
    window.location.hash = `#/vendor/register?role=${requiredRole}`;
  };

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6 animate-fadeIn">
      
      {/* Top Security Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-[#132540] to-slate-900 border-2 border-rose-500/60 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#23436E]">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-rose-950 text-rose-400 border border-rose-500/80 shadow-lg shrink-0">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-600 font-mono tracking-wider">
                  ROLE SEGREGATION RESTRICTION (GFR 2017)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600 font-mono">
                  RBAC ENFORCED
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                Role Authority Limitation: {targetConfig.deskTitle}
              </h2>
            </div>
          </div>

          <div className="text-right text-xs font-mono text-slate-300">
            <span className="text-rose-400 font-bold">Access Status:</span> RESTRICTED
          </div>
        </div>

        {/* Core explanation */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Current Account Card */}
          <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Authenticated Account</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-600">
                ACTIVE
              </span>
            </div>
            <div className="text-sm font-bold text-white truncate">
              {currentProfile.name}
            </div>
            <div className="text-[11px] text-cyan-300 font-medium">
              Registered Role: <strong className="text-white">{currentConfig.title}</strong>
            </div>
            <div className="text-[10px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
              Your account possesses features strictly limited to <span className="text-cyan-300 font-semibold">{currentConfig.statutoryCategory}</span>.
            </div>
          </div>

          {/* Target Required Role Card */}
          <div className="p-4 rounded-xl bg-[#0B1528] border border-rose-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-rose-300">Target Desk Statutory Requisite</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-mono font-bold border border-rose-600">
                REQUIRED
              </span>
            </div>
            <div className="text-sm font-bold text-white truncate">
              {targetConfig.deskTitle}
            </div>
            <div className="text-[11px] text-rose-300 font-medium">
              Mandated Role: <strong className="text-white">{targetConfig.title}</strong>
            </div>
            <div className="text-[10px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
              {targetConfig.description}
            </div>
          </div>

        </div>

        {/* Statutory Policy Callout */}
        <div className="mt-4 p-3.5 rounded-lg bg-amber-950/40 border border-amber-600/50 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-300">
              Why can't I use this desk with my current account?
            </div>
            <div className="text-[11px] text-slate-300 leading-normal">
              In accordance with GeM 2.0 statutory procurement integrity guidelines and GFR 2017 Rule 170 / 173, vendor roles are legally segregated. An OEM Manufacturer account cannot issue self-authorizations or claim MSME exemptions under the same identifier. To access {targetConfig.title} features, you must sign up for an isolated dossier under that role.
            </div>
          </div>
        </div>

        {/* Existing Registered Account Quick-Switch (if any) */}
        {registeredAccounts.length > 0 && (
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 to-teal-950/40 border border-emerald-500/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">
                  You already have an existing registered account for this role!
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 font-mono">
                {registeredAccounts.length} Found
              </span>
            </div>

            <div className="space-y-2">
              {registeredAccounts.map((acc: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#0B1528] border border-emerald-700/50 text-xs">
                  <div>
                    <div className="font-bold text-white">{acc.profile?.name || acc.session?.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      GSTIN: {acc.profile?.gstin || acc.session?.gstin} &bull; ID: {acc.profile?.id || acc.session?.vendorId}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSwitchToRegistered(acc)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                  >
                    <span>Switch to this Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#23436E]">
          <button
            onClick={onNavigateToAllowedDesk}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#132540] hover:bg-[#1C355E] text-slate-200 border border-[#23436E] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Return to My Authorized Desk ({currentConfig.shortLabel})</span>
          </button>

          <button
            onClick={handleSignUpForRole}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span>Sign Up Again as {targetConfig.title}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

      </div>

    </div>
  );
};
