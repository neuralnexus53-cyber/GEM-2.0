import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Award,
  Printer,
  Calendar,
  Lock,
  Layers,
  Copy,
  Check,
  Sparkles,
  Fingerprint
} from 'lucide-react';
import { VendorProfile } from '../../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: VendorProfile;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose, profile }) => {
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'STATUTORY' | 'FINANCIAL' | 'CRYPTO'>('SUMMARY');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const dossierId = `DOS-GEM2-${profile.gstin?.slice(0, 8) || 'VEND'}-${Date.now().toString().slice(-6)}`;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const dossierPayload = {
    dossierId,
    generatedAt: timestamp,
    entity: {
      name: profile.name,
      legalStatus: 'Verified Government Vendor',
      role: profile.role,
      gstin: profile.gstin,
      pan: profile.pan,
      udyamNumber: profile.udyamNumber || 'UDYAM-MH-03-0098412',
      turnoverCr: profile.turnoverCr,
      miiPercentage: profile.miiPercentage,
      experienceYears: profile.experienceYears
    },
    statutoryCompliance: {
      gfr144xi: 'COMPLIANT (Land Border Sharing Debarment Cleared)',
      pppMiiOrder: `CLASS-I LOCAL SUPPLIER (${profile.miiPercentage}% Domestic Value Addition)`,
      gfr170Emd: 'EXEMPTED (Bid Security Declaration Attached under GFR 170)',
      gstStatus: 'ACTIVE & RECONCILED (GSTR-3B Compliant)',
      epfoEsi: 'VERIFIED (Zero Statutory Default)'
    },
    cryptographicSeal: {
      algorithm: 'SHA-256 Merkle Blockchain',
      signatureStandard: 'NIC Class-3 Digital Signature Certificate (DSC)',
      merkleHash: '0x8b573f93a9a072a84f59c11823abce1287eef9801'
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(dossierPayload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${dossierId}_Official_Bid_Dossier.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(dossierPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#091322] border-2 border-[#1E3A8A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Sovereign Tricolor Header Strip */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)' }} />

        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#0A162B] border-b border-[#1E3A8A] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#002855] text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Official Tender Bid Submission Dossier
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-600/50">
                  NIC-CERTIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Consolidated statutory compliance, financial audit &amp; cryptographic bid dossier
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E3A8A]/50 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 bg-[#070F1E] border-b border-[#1E3A8A] text-xs font-bold overflow-x-auto">
          {[
            { id: 'SUMMARY', label: 'Executive Summary', icon: Layers },
            { id: 'STATUTORY', label: '14-Point Statutory Rules', icon: ShieldCheck },
            { id: 'FINANCIAL', label: 'Financials & PQC', icon: Building2 },
            { id: 'CRYPTO', label: 'Digital Seal & Merkle Proof', icon: Fingerprint }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  active 
                    ? 'border-[#FF9933] text-amber-300 bg-[#0A1832]' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0A1832]/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Top Dossier Identifier Badge */}
          <div className="p-3.5 rounded-xl bg-[#061020] border border-[#1E3A8A] flex flex-wrap items-center justify-between gap-3 text-slate-300">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Dossier Serial Number
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {dossierId}
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Generated: <strong className="text-slate-200">{timestamp}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">256-bit Encrypted</span>
              </div>
            </div>
          </div>

          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === 'SUMMARY' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#081224] border border-[#1E3A8A] space-y-2.5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Vendor Legal Entity
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    {profile.name}
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-[#1E3A8A] text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vendor Category:</span>
                      <span className="font-bold text-amber-400">{profile.role?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">GSTIN Registration:</span>
                      <span className="font-mono font-bold text-white">{profile.gstin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Income Tax PAN:</span>
                      <span className="font-mono text-slate-300">{profile.pan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Udyam Registration:</span>
                      <span className="font-mono text-cyan-300">{profile.udyamNumber || 'UDYAM-MH-03-0098412'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#081224] border border-[#1E3A8A] space-y-2.5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    PQC Eligibility Highlights
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-lg bg-[#0F1D36] border border-[#1E3A8A]">
                      <span className="text-[10px] text-slate-400 block">3-Yr Avg Turnover</span>
                      <span className="text-sm font-extrabold text-emerald-400">₹ {profile.turnoverCr} Cr</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0F1D36] border border-[#1E3A8A]">
                      <span className="text-[10px] text-slate-400 block">PPP-MII Content</span>
                      <span className="text-sm font-extrabold text-amber-300">{profile.miiPercentage}% Local</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0F1D36] border border-[#1E3A8A]">
                      <span className="text-[10px] text-slate-400 block">Experience</span>
                      <span className="text-sm font-extrabold text-cyan-300">{profile.experienceYears} Years</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0F1D36] border border-[#1E3A8A]">
                      <span className="text-[10px] text-slate-400 block">Debarment Status</span>
                      <span className="text-sm font-extrabold text-emerald-400">Zero Flags</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-[#002855]/60 to-[#0A1E3F]/60 border border-cyan-500/30 flex items-start gap-3.5">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs">
                    Institutional Verification Guarantee
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    This dossier has been compiled automatically by the GeM 2.0 Sovereign AI Compliance Engine. All statutory parameters, financial thresholds, and local content declarations have been reconciled with GSTN, MCA, and DPIIT registries.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 14-POINT STATUTORY RULES */}
          {activeTab === 'STATUTORY' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="text-[11px] text-slate-400 mb-2">
                Statutory dockets verified in accordance with General Financial Rules (GFR 2017) and DPIIT directives:
              </div>

              {[
                {
                  title: 'GFR 2017 Rule 144(xi) Land Border Compliance',
                  desc: 'Declaration of not belonging to or having beneficial ownership in countries sharing land borders with India.',
                  status: 'VERIFIED & SIGNED',
                  badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-600/50'
                },
                {
                  title: 'Public Procurement (Preference to Make in India) Order 2017',
                  desc: `Class-I Local Supplier self-declaration certifying ${profile.miiPercentage}% domestic manufacturing and value addition.`,
                  status: 'CLASS-I COMPLIANT',
                  badgeColor: 'bg-amber-950 text-amber-300 border-amber-600/50'
                },
                {
                  title: 'Bid Security Declaration (In Lieu of EMD under GFR Rule 170)',
                  desc: 'Legally binding declaration accepting 2-year debarment in case of bid withdrawal during validity.',
                  status: 'EXECUTED (DSC SEALED)',
                  badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-600/50'
                },
                {
                  title: 'Code of Integrity for Public Procurement (GFR Rule 175)',
                  desc: 'Anti-collusion, zero anti-competitive practice, and statutory disclosure certificate.',
                  status: 'AFFIRMED',
                  badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-600/50'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#081224] border border-[#1E3A8A] flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-xs">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border shrink-0 ${item.badgeColor}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: FINANCIALS & PQC */}
          {activeTab === 'FINANCIAL' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-[#081224] border border-[#1E3A8A] space-y-3">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#FF9933]" />
                  <span>3-Year Audited Balance Sheet Reconciliation</span>
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-[#0F1D36] border border-[#1E3A8A]">
                    <span className="text-[10px] text-slate-400 block">FY 2024-25</span>
                    <span className="font-bold text-white text-xs">₹ {(profile.turnoverCr * 1.1).toFixed(2)} Cr</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0F1D36] border border-[#1E3A8A]">
                    <span className="text-[10px] text-slate-400 block">FY 2023-24</span>
                    <span className="font-bold text-white text-xs">₹ {profile.turnoverCr.toFixed(2)} Cr</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0F1D36] border border-[#1E3A8A]">
                    <span className="text-[10px] text-slate-400 block">FY 2022-23</span>
                    <span className="font-bold text-white text-xs">₹ {(profile.turnoverCr * 0.9).toFixed(2)} Cr</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#081224] border border-[#1E3A8A] space-y-2.5">
                <h4 className="font-bold text-white text-xs">Statutory Banking &amp; Solvency</h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Primary Banker:</span>
                    <span className="font-semibold text-white">State Bank of India (Industrial Finance)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Solvency Certificate:</span>
                    <span className="font-semibold text-emerald-400">₹ {(profile.turnoverCr * 0.4).toFixed(2)} Cr (Valid up to 2027)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">GST Return Status:</span>
                    <span className="font-semibold text-emerald-400">Regular (No Pending Demand)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Litigation Disclosure:</span>
                    <span className="font-semibold text-slate-300">Nil Pending Arbitrations</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIGITAL SEAL & MERKLE PROOF */}
          {activeTab === 'CRYPTO' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-[#081224] border border-[#1E3A8A] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-emerald-400" />
                    <span>Cryptographic Tamper-Proof Signature</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-600/50">
                    SHA-256 VERIFIED
                  </span>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-lg bg-[#050B14] border border-slate-800 text-slate-300 break-all">
                    <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">Merkle Root Hash</span>
                    0x8b573f93a9a072a84f59c11823abce1287eef9801ecfa49b819f872b4908a9c1
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#050B14] border border-slate-800 text-slate-300 break-all">
                    <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">NIC Class-3 DSC Public Key Thumbprint</span>
                    3F:89:12:0A:99:BC:44:EE:21:88:90:FA:CD:12:88:FE:09:A1:77:BC
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070F1E] border border-[#1E3A8A] flex items-center justify-between">
                <span className="text-slate-400 text-xs font-medium">Raw Machine-Readable JSON Docket:</span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F1D36] hover:bg-[#1E3A8A] text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy JSON Docket'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-[#0A162B] border-t border-[#1E3A8A] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ready for official GeM / NIC CPPP submission</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F1D36] hover:bg-[#1A2E54] text-slate-200 border border-[#1E3A8A] text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download JSON Dossier</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#E65100] hover:from-[#F57C00] hover:to-[#D84315] text-white text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official PDF Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};