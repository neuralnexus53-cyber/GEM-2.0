import React from 'react';
import { 
  Building2, 
  Rocket, 
  HardHat, 
  ShieldCheck, 
  FileCheck2, 
  TrendingUp, 
  AlertTriangle, 
  X, 
  BookOpen,
  CheckCircle2,
  Scale
} from 'lucide-react';

interface HowItWorksGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const HowItWorksGuide: React.FC<HowItWorksGuideProps> = ({ isOpen, onClose, onSelectTab }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0C1A30] border border-[#1E3A68] rounded-lg shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-[#1E3A68] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#001D3D] text-amber-300 border border-[#1E3A68]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Standard Operating Procedure (SOP) & Bidding Handbook</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
                  GeM 2.0 / GFR 2017
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Official step-by-step facilitation guide for OEMs, MSMEs, DPIIT startups, and civil contractors.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#002855] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded bg-[#08172D] border border-[#1E3A68] space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Public Procurement Regulatory Architecture</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All government tenders in India are governed by the <strong>General Financial Rules (GFR), 2017</strong>, the <strong>Public Procurement Policy for Micro & Small Enterprises (MSEs) Order, 2012</strong>, and the <strong>Public Procurement (Preference to Make in India) Order, 2017</strong>. This portal provides automated compliance evaluation, risk scrutiny, and rate estimation.
          </p>
        </div>

        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Official Bidding Scrutiny Workflow
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#051124] rounded border border-[#1E3A68] space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-[#001D3D] text-amber-400 flex items-center justify-center font-mono text-[11px] border border-[#1E3A68]">1</span>
                <span>Document Scrutiny & OCR</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Upload the Notice Inviting Tender (NIT) or Special Terms & Conditions (STC) in PDF format to automatically extract all mandatory bidding parameters.
              </p>
            </div>

            <div className="p-3 bg-[#051124] rounded border border-[#1E3A68] space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-[#001D3D] text-emerald-400 flex items-center justify-center font-mono text-[11px] border border-[#1E3A68]">2</span>
                <span>PQC & Statutory Eligibility</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Verify audited turnover, past experience, and MSE / MII statutory purchase preferences against tender requirements.
              </p>
            </div>

            <div className="p-3 bg-[#051124] rounded border border-[#1E3A68] space-y-1">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-[#001D3D] text-rose-400 flex items-center justify-center font-mono text-[11px] border border-[#1E3A68]">3</span>
                <span>Liquidated Damages & Clause Risk</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Scrutinize delay penalties, milestone obligations, and generate formal pre-bid clarification letters in standard GeM format.
              </p>
            </div>

            <div className="p-3 bg-[#051124] rounded border border-[#1E3A68] space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-[#001D3D] text-cyan-400 flex items-center justify-center font-mono text-[11px] border border-[#1E3A68]">4</span>
                <span>Schedule of Rates & L1 Advisory</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Determine viable, compliant bid price ranges based on historical GeM award data and CVC guidelines on abnormally low bids.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-[#1E3A68] text-xs">
          <span className="text-slate-400">Complies with Ministry of Finance Procurement Guidelines</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold transition-all"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};