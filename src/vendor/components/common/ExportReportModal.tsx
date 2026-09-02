import React from 'react';
import { 
  X, 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Award,
  Printer
} from 'lucide-react';
import { VendorProfile } from '../../types';
import { formatINR } from '../../lib/utils';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: VendorProfile;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    window.print();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0C1A30] border border-[#1E3A68] rounded-lg shadow-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between border-b border-[#1E3A68] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#001D3D] text-amber-300 border border-[#1E3A68]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Official Tender Bid Submission Dossier</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
                  NIC-FORMAT
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Official consolidated compliance package for GeM & CPPP technical bid submissions.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#002855] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 bg-[#051124] rounded border border-[#1E3A68] space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#1E3A68]">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Vendor Enterprise Name:</span>
            <span className="font-bold text-slate-100">{profile.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block">GSTIN Registration:</span>
              <span className="font-mono text-amber-300 font-bold">{profile.gstin}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Permanent Account Number (PAN):</span>
              <span className="font-mono text-slate-200">{profile.pan}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Audited Turnover (3-Yr Avg):</span>
              <span className="font-mono text-emerald-400 font-bold">₹ {profile.turnoverCr} Crores</span>
            </div>
            <div>
              <span className="text-slate-400 block">PPP-MII Local Content:</span>
              <span className="font-mono text-cyan-300 font-bold">{profile.miiPercentage}% (Class-I)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1E3A68] space-y-1">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">Included Submission Dockets:</span>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>GFR 2017 Rule 144(xi) Land Border Compliance Declaration</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Statutory Make in India (PPP-MII) Local Content Certificate</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bid Security Declaration (In Lieu of EMD under GFR Rule 170)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#1E3A68] text-xs">
          <span className="text-slate-400">Digitally Verified & Ready for Submission</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-[#08172D] text-slate-300 border border-[#1E3A68] hover:bg-[#0E203B]"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save Official PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};