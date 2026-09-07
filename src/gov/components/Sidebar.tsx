import React from 'react';
import { 
  FileText, 
  Layers, 
  Building2, 
  Cpu, 
  Flag, 
  Calculator, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Landmark, 
  Scale, 
  Database,
  Award,
  UserCheck,
  Shield,
  ArrowDownToLine,
  EyeOff,
  Eye,
  FileCheck,
  Lock,
  Unlock,
  PlusCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserRole, Tender, OfficerProfile, ActiveTab, ROLE_DEFINITIONS } from '../types/procurement';

export type { ActiveTab };

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingCount: number;
  flaggedCount: number;
  ledgerCount: number;
  openExportModal: () => void;
  currentRole: UserRole;
  setCurrentRole?: (role: UserRole) => void;
  selectedTender: Tender;
  allTenders: Tender[];
  setSelectedTenderId: (id: string) => void;
  isVaultUnmasked: boolean;
  setIsVaultUnmasked: (val: boolean) => void;
  officerProfile: OfficerProfile;
  onOpenOfficerProfile: () => void;
  onOpenVendorIntake: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
  flaggedCount,
  ledgerCount,
  openExportModal,
  currentRole,
  setCurrentRole,
  selectedTender,
  allTenders,
  setSelectedTenderId,
  isVaultUnmasked,
  setIsVaultUnmasked,
  officerProfile,
  onOpenOfficerProfile,
  onOpenVendorIntake,
}) => {
  const tenderNavItems = [
    {
      id: 'TENDERS' as ActiveTab,
      label: 'Tender & PQC Clauses',
      icon: FileText,
      badge: null,
      desc: 'Set budgets & PQC requirements'
    },
    {
      id: 'OFFICER_PROFILE' as ActiveTab,
      label: 'Officer Profile & DSC Vault',
      icon: Award,
      badge: 'Authority',
      badgeColor: 'bg-[#2D1A05] text-[#FDBA74] border border-[#9A3412]',
      desc: 'NIC Class-3 Signature Dossier'
    }
  ];

  const evalNavItems = [
    {
      id: 'EVAL_QUEUE' as ActiveTab,
      label: 'Bidder Evaluation List',
      icon: Layers,
      badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
      badgeColor: 'bg-[#0B2545] text-[#93C5FD] border border-[#1D4ED8]',
      desc: 'Double-blind masked review'
    },
    {
      id: 'STATUTORY' as ActiveTab,
      label: 'Multi-Portal Sovereign Checks',
      icon: Building2,
      badge: flaggedCount > 0 ? `${flaggedCount} Alerts` : '7 Verified',
      badgeColor: flaggedCount > 0 
        ? 'bg-[#3B0D0D] text-[#FCA5A5] border border-[#B91C1C]' 
        : 'bg-[#052410] text-[#86EFAC] border border-[#15803D]',
      desc: 'GSTN, MCA, EPFO, ESIC, CBDT'
    },
    {
      id: 'AI_SCORECARD' as ActiveTab,
      label: 'AI Discrepancy Assistant',
      icon: Cpu,
      badge: 'Auto-Check',
      badgeColor: 'bg-[#28103F] text-[#D8B4FE] border border-[#7E22CE]',
      desc: 'Instant rule compliance scanner'
    },
    {
      id: 'MII_AUDIT' as ActiveTab,
      label: 'Make in India (Local Content)',
      icon: Flag,
      badge: 'Class I/II',
      badgeColor: 'bg-[#2D1A05] text-[#FDBA74] border border-[#9A3412]',
      desc: 'Domestic manufacturing %'
    },
    {
      id: 'COMPOSITE_MATRIX' as ActiveTab,
      label: 'Final Scores & Merit Matrix',
      icon: Calculator,
      badge: 'Rankings',
      badgeColor: 'bg-[#0B2545] text-[#93C5FD] border border-[#1D4ED8]',
      desc: 'Consolidated bidder merit list'
    }
  ];

  const auditNavItems = [
    {
      id: 'CAG_LEDGER' as ActiveTab,
      label: 'CAG Merkle Audit Ledger',
      icon: ShieldCheck,
      badge: `${ledgerCount} Blocks`,
      badgeColor: 'bg-[#052410] text-[#86EFAC] border border-[#15803D]',
      desc: 'Permanent cryptographic trail'
    }
  ];

  const roleConfig = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS.TEC_MEMBER;
  const allowedTabs = roleConfig.allowedTabs;

  const visibleTenderNav = tenderNavItems.filter(item => allowedTabs.includes(item.id));
  const visibleEvalNav = evalNavItems.filter(item => allowedTabs.includes(item.id));
  const visibleAuditNav = auditNavItems.filter(item => allowedTabs.includes(item.id));

  // Check for any secondary/prior role dossiers registered under the same officer identity
  const regOfficers: any[] = JSON.parse(localStorage.getItem('gem_registered_officers') || '[]');
  const otherDossiers = regOfficers.filter((o: any) => {
    const emailMatch = o.officer?.email && officerProfile.email && o.officer.email.toLowerCase() === officerProfile.email.toLowerCase();
    const nameMatch = o.officer?.fullName && officerProfile.fullName && o.officer.fullName.toLowerCase() === officerProfile.fullName.toLowerCase();
    return (emailMatch || nameMatch) && o.officer?.badgeId !== officerProfile.badgeId;
  });

  return (
    <aside className="w-64 min-w-[16rem] bg-[#08172D] text-slate-200 border-r border-[#1E3A68] flex flex-col justify-between p-3.5 h-[calc(100vh-80px)] overflow-y-auto shrink-0 shadow-lg">
      <div className="flex flex-col gap-3.5">
        
        <div className="bg-[#051124] p-2.5 rounded-lg border border-[#1E3A68] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Authorized Jurisdiction
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
              CLEARED
            </span>
          </div>
          <div className="text-xs font-bold text-slate-100 truncate">
            {officerProfile.fullName}
          </div>
          <div className="text-[10px] text-amber-400 font-mono truncate">
            {officerProfile.department || 'Central Procurement Division'}
          </div>

          <div className="pt-1.5 border-t border-[#1E3A68]/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-amber-400" />
                <span>Statutory GFR Role</span>
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                LOCKED
              </span>
            </div>
            <div className="bg-[#001D3D] text-slate-100 border border-[#1E3A68] rounded-lg p-2 text-left">
              <div className="text-[11px] font-bold text-amber-300">
                {roleConfig.title}
              </div>
              <div className="text-[9px] text-sky-300 font-mono mt-0.5">
                {roleConfig.statutoryRule}
              </div>
              <div className="text-[8px] text-slate-400 mt-1 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-emerald-400" />
                <span>Single-role mandate &bull; {officerProfile.badgeId}</span>
              </div>
            </div>

            {/* Exceptional Secondary Role Dossiers & Switcher */}
            {otherDossiers.length > 0 && (
              <div className="pt-2 border-t border-[#1E3A68]/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span>Dual Role (GFR Exception)</span>
                  </span>
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    SEPARATE
                  </span>
                </div>
                {otherDossiers.map((d: any, idx: number) => {
                  const rKey = (d.officer?.role || 'BUYER_AUTHORITY') as UserRole;
                  const rDef = ROLE_DEFINITIONS[rKey] || ROLE_DEFINITIONS.BUYER_AUTHORITY;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        localStorage.setItem('gem_gov_auth_session', JSON.stringify(d.officer));
                        window.location.reload();
                      }}
                      className="w-full p-2 bg-[#0B2545] hover:bg-[#1D4ED8]/30 border border-[#1E3A68] hover:border-blue-400 rounded-lg text-left transition-all cursor-pointer group"
                      title="Switch to this role's isolated dashboard session"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-200 group-hover:text-blue-300">
                          Switch to {rDef.title.split(' ')[0]}
                        </span>
                        <span className="text-[8px] font-mono text-sky-300 font-bold">
                          {d.officer?.badgeId}
                        </span>
                      </div>
                      <div className="text-[8px] text-slate-400 font-mono mt-0.5 truncate">
                        {rDef.statutoryRule}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Direct Link to Register Exceptional Second Role */}
            <div className="pt-1.5">
              <Link
                to={`/gov/register?secondary=true&email=${encodeURIComponent(officerProfile.email || '')}&name=${encodeURIComponent(officerProfile.fullName || '')}`}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#001D3D] hover:bg-[#002855] border border-dashed border-[#1E3A68] hover:border-amber-400/80 rounded text-[10px] font-bold text-amber-300 hover:text-amber-200 transition-colors no-underline text-center cursor-pointer"
                title="Register a separate credential dossier for an assigned secondary role under GFR 2017 separation of duties"
              >
                <PlusCircle className="w-3 h-3 text-amber-400 shrink-0" />
                <span>+ Register Exceptional 2nd Role</span>
              </Link>
            </div>
          </div>
        </div>

        {visibleTenderNav.length > 0 && (
          <div className="space-y-1">
            <div className="px-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tender Administration
              </span>
            </div>

            {visibleTenderNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-left font-semibold text-xs transition-all border-none cursor-pointer ${
                    isActive
                      ? 'bg-[#002855] text-amber-400 border border-[#0284C7] font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-[#0C1A30] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {visibleEvalNav.length > 0 && (
          <div className="space-y-1">
            <div className="px-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                14-Point Evaluation Desk
              </span>
            </div>

            {visibleEvalNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-left font-semibold text-xs transition-all border-none cursor-pointer ${
                    isActive
                      ? 'bg-[#002855] text-amber-400 border border-[#0284C7] font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-[#0C1A30] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {visibleAuditNav.length > 0 && (
          <div className="space-y-1">
            <div className="px-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Audit &amp; Oversight
              </span>
            </div>

            {visibleAuditNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-left font-semibold text-xs transition-all border-none cursor-pointer ${
                    isActive
                      ? 'bg-[#002855] text-amber-400 border border-[#0284C7] font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-[#0C1A30] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>

      <div className="mt-4 pt-3 border-t border-[#1E3A68] space-y-2">
        
        {roleConfig.canUnmaskVault && (
          <div className="bg-[#051124] p-2 rounded-lg border border-[#1E3A68]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Vault Masking (Buyer Only)</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                isVaultUnmasked ? 'bg-[#3B0D0D] text-red-300' : 'bg-[#052410] text-emerald-300'
              }`}>
                {isVaultUnmasked ? 'UNMASKED' : 'MASKED'}
              </span>
            </div>
            <button
              onClick={() => setIsVaultUnmasked(!isVaultUnmasked)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#001D3D] hover:bg-[#002855] border border-[#1E3A68] rounded text-[11px] font-bold text-slate-200 hover:text-amber-400 transition-colors border-none cursor-pointer"
            >
              {isVaultUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isVaultUnmasked ? 'Re-Mask Double-Blind Vault' : 'Authorize Vault Unmasking'}</span>
            </button>
          </div>
        )}

        {roleConfig.canExportCagDossier && (
          <button
            onClick={openExportModal}
            className="w-full flex items-center justify-center gap-2 bg-[#15803D] hover:bg-[#166534] text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors border-none cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CAG Audit Dossier</span>
          </button>
        )}

        {roleConfig.canSimulateVendorIntake && (
          <button
            onClick={onOpenVendorIntake}
            className="w-full flex items-center justify-center gap-1.5 bg-[#002855] hover:bg-[#001D3D] border border-[#1E3A68] text-slate-200 hover:text-amber-400 font-semibold py-1.5 px-3 rounded-lg text-[11px] transition-colors border-none cursor-pointer"
          >
            <PlusCircle className="w-3 h-3 text-amber-400" />
            <span>Vendor Intake Simulator</span>
          </button>
        )}

      </div>
    </aside>
  );
};