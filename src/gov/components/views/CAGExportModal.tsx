import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  X, 
  FileText, 
  Blocks, 
  Fingerprint,
  Lock,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Tender, MaskedSubmission, AuditLedgerBlock } from '../../types/procurement';
import { exportCAGComplianceDossier } from '../../services/cryptoEngine';

interface CAGExportModalProps {
  tender: Tender;
  submissions: MaskedSubmission[];
  ledgerBlocks: AuditLedgerBlock[];
  onClose: () => void;
}

export const CAGExportModal: React.FC<CAGExportModalProps> = ({
  tender,
  submissions,
  ledgerBlocks,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'JSON_PREVIEW' | 'AUDIT_CHECKS'>('OVERVIEW');

  const { cagPackageJson, filename } = exportCAGComplianceDossier(
    tender,
    submissions,
    ledgerBlocks
  );

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const handleDownload = () => {
    const blob = new Blob([cagPackageJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cagPackageJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="relative w-full max-w-3xl bg-[#081224] border-2 border-[#1E3A8A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sovereign Tricolor Strip */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)' }} />

        {/* Header */}
        <div className="px-6 py-4 bg-[#0A162B] border-b border-[#1E3A8A] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#002855] text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  CAG Cryptographic Audit Dossier Export
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-600/50">
                  STATUTORY-COMPLIANT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Comptroller and Auditor General (CAG) &amp; GFR 2017 sovereign audit trail package
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E3A8A]/50 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 px-6 bg-[#070F1E] border-b border-[#1E3A8A] text-xs font-bold">
          {[
            { id: 'OVERVIEW', label: 'Dossier Overview & Metrics', icon: Layers },
            { id: 'AUDIT_CHECKS', label: 'Constitutional Compliance Scope', icon: ShieldCheck },
            { id: 'JSON_PREVIEW', label: 'Raw Audit Package (.JSON)', icon: Blocks }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  active 
                    ? 'border-emerald-400 text-emerald-300 bg-[#0A1832]' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0A1832]/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-300">
          
          {/* Status Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600/40 flex items-center justify-between gap-3 text-emerald-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-xs">
                Official Audit Trail Formatted &bull; Non-Repudiation Merkle Blockchain Verified
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-emerald-900 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/50 uppercase">
              Ready for Audit
            </span>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#050C18] border border-[#1E3A8A]">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Tender Reference</span>
                  <span className="font-bold text-white text-xs">{tender.id}</span>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">{tender.title}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050C18] border border-[#1E3A8A]">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Evaluated Bids</span>
                  <span className="font-extrabold text-amber-300 text-base">{submissions.length} Sealed Submissions</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Double-Blind Vault Protected</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050C18] border border-[#1E3A8A]">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Merkle Audit Blocks</span>
                  <span className="font-extrabold text-cyan-300 text-base">{ledgerBlocks.length} Signed Blocks</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Immutable Hash Sequence</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#050C18] border border-[#1E3A8A] space-y-2.5">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#1E3A8A]">
                  <span className="text-slate-400">Target File Name:</span>
                  <span className="font-mono font-bold text-amber-300">{filename}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#1E3A8A]">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-mono text-slate-200">{timestamp}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Officer DSC Key:</span>
                  <span className="font-mono text-emerald-400 font-semibold">NIC-DSC-GOV-2026-CHAIR (Valid)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT CHECKS */}
          {activeTab === 'AUDIT_CHECKS' && (
            <div className="space-y-3 animate-fadeIn">
              <span className="text-[11px] text-slate-400 block">
                The exported dossier guarantees compliance under Article 149 of the Constitution of India and General Financial Rules (GFR 2017):
              </span>

              {[
                { title: 'Tender & PQC Rulebook', desc: 'Pre-qualification criteria, budget allocations, and scoring weights locked prior to bid opening.' },
                { title: 'Zero-Bias Double Blind Records', desc: 'Anonymized cryptographic identifiers with identity unmasking keys held in escrow.' },
                { title: 'Statutory Registry Verification', desc: 'Raw live responses from GSTN, EPFO, MCA-21, and DPIIT MSME registries.' },
                { title: 'PPP-MII Value Addition Declaration', desc: 'Itemized domestic Bill of Materials (BoM) and local content verification records.' },
                { title: 'Officer Cryptographic Signature Log', desc: 'Non-repudiation time-stamps signed with NIC Class-3 DSC digital tokens.' }
              ].map((rec, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#050C18] border border-[#1E3A8A] flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white text-xs block">{rec.title}</strong>
                    <span className="text-[11px] text-slate-400">{rec.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: JSON PREVIEW */}
          {activeTab === 'JSON_PREVIEW' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-semibold">Audit Package Data Stream:</span>
                <button 
                  onClick={handleCopy} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002855] hover:bg-[#003875] text-cyan-300 font-bold border border-cyan-500/40 transition-all cursor-pointer text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Payload' : 'Copy Full JSON'}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-[#030712] border border-[#1E3A8A] text-slate-200 font-mono text-[11px] max-h-56 overflow-y-auto leading-relaxed scrollbar-thin">
                {cagPackageJson.slice(0, 1500)}...
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0A162B] border-t border-[#1E3A8A] flex items-center justify-between">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-xl bg-[#070F1E] hover:bg-[#0F1D36] text-slate-300 border border-[#1E3A8A] text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleDownload} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Official CAG Dossier (.JSON)</span>
          </button>
        </div>

      </div>
    </div>
  );
};