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
  ExternalLink
} from 'lucide-react';
import { UserRole, Tender, OfficerProfile } from '../types/procurement';

export type ActiveTab = 
  | 'TENDERS'
  | 'EVAL_QUEUE'
  | 'STATUTORY'
  | 'AI_SCORECARD'
  | 'MII_AUDIT'
  | 'COMPOSITE_MATRIX'
  | 'CAG_LEDGER'
  | 'OFFICER_PROFILE';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingCount: number;
  flaggedCount: number;
  ledgerCount: number;
  openExportModal: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
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

  return (
    <aside className="w-64 min-w-[16rem] bg-[#08172D] text-slate-200 border-r border-[#1E3A68] flex flex-col justify-between p-3.5 h-[calc(100vh-80px)] overflow-y-auto shrink-0 shadow-lg">
      <div className="flex flex-col gap-3.5">
        
        <div className="bg-[#051124] p-2.5 rounded-lg border border-[#1E3A68] space-y-1">
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
        </div>

        <div className="space-y-1">
          <div className="px-2 mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tender Administration
            </span>
          </div>

          {tenderNavItems.map(item => {
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

        <div className="space-y-1">
          <div className="px-2 mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              14-Point Evaluation Desk
            </span>
          </div>

          {evalNavItems.map(item => {
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

        <div className="space-y-1">
          <div className="px-2 mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Audit &amp; Oversight
            </span>
          </div>

          {auditNavItems.map(item => {
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

      </div>

      <div className="mt-4 pt-3 border-t border-[#1E3A68] space-y-2">
        
        <div className="bg-[#051124] p-2 rounded-lg border border-[#1E3A68]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Vault Masking</span>
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
            <span>{isVaultUnmasked ? 'Re-Mask Double-Blind Vault' : 'Buyer Vault Unmasking'}</span>
          </button>
        </div>

        <button
          onClick={openExportModal}
          className="w-full flex items-center justify-center gap-2 bg-[#15803D] hover:bg-[#166534] text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors border-none cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CAG Audit Dossier</span>
        </button>

        <button
          onClick={onOpenVendorIntake}
          className="w-full flex items-center justify-center gap-1.5 bg-[#002855] hover:bg-[#001D3D] border border-[#1E3A68] text-slate-200 hover:text-amber-400 font-semibold py-1.5 px-3 rounded-lg text-[11px] transition-colors border-none cursor-pointer"
        >
          <PlusCircle className="w-3 h-3 text-amber-400" />
          <span>Vendor Intake Simulator</span>
        </button>

      </div>
    </aside>
  );
};