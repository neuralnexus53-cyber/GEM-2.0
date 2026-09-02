import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileCheck2, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  FileSpreadsheet,
  Check
} from 'lucide-react';

interface OcrIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OcrIngestionModal: React.FC<OcrIngestionModalProps> = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [docType, setDocType] = useState('NIT_TENDER');
  const [completedExtraction, setCompletedExtraction] = useState<any>(null);

  if (!isOpen) return null;

  const handleSimulateDrop = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCompletedExtraction({
        title: 'Notice Inviting Tender & Schedule of Requirements',
        confidence: 99.4,
        fields: [
          { label: 'Tender Reference Number', value: 'GEM/2026/B/982104' },
          { label: 'Procuring Department', value: 'Ministry of Power & Energy' },
          { label: 'Estimated Value', value: '₹ 18.50 Crores' },
          { label: 'Make in India Requirement', value: '50% (Class-I Local Supplier)' },
          { label: 'Submission Deadline', value: '25-Sep-2026 15:00 IST' }
        ]
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0C1A30] border border-[#1E3A68] rounded-lg shadow-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between border-b border-[#1E3A68] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#001D3D] text-amber-300 border border-[#1E3A68]">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Ingest & Scrutinize Tender Document (PDF)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
                  NIC-OCR ENGINE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Upload Notice Inviting Tender (NIT), Corrigendum, or BoQ files for optical parameter extraction.
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

        <div className="space-y-1.5 text-xs">
          <label className="block text-slate-300 font-semibold">Select Document Type to Ingest:</label>
          <select
            value={docType}
            onChange={e => setDocType(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 focus:border-[#0284C7] focus:outline-none"
          >
            <option value="NIT_TENDER">Notice Inviting Tender (NIT / Bid Document)</option>
            <option value="BOQ_SCHEDULE">Schedule of Quantities (BoQ / Price Schedule)</option>
            <option value="CORRIGENDUM">Tender Corrigendum & Addendum Notice</option>
            <option value="CA_AUDIT">CA Audited Turnover & Net Worth Certificate</option>
            <option value="MII_DECLARATION">Make in India Local Content Certificate</option>
          </select>
        </div>

        {!completedExtraction ? (
          <div
            onClick={handleSimulateDrop}
            className={`p-6 rounded border-2 border-dashed text-center cursor-pointer transition-all ${
              isProcessing
                ? 'bg-[#001D3D] border-[#0284C7]'
                : 'bg-[#051124] border-[#1E3A68] hover:border-[#0284C7]'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-200">
              {isProcessing ? 'Scrutinizing & Extracting Tender Clauses...' : 'Click to Upload or Drag & Drop Tender Document'}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Accepts PDF, DOCX, XLS (Up to 50 MB) &bull; Digitally Signed Files Supported
            </p>
          </div>
        ) : (
          
          <div className="p-3.5 bg-[#051124] rounded border border-[#15803D] space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1E3A68]">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Document Scrutiny Complete ({completedExtraction.confidence}% Confidence)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">SHA-256 Verified</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {completedExtraction.fields.map((f: any, i: number) => (
                <div key={i} className="p-2 bg-[#091528] rounded border border-[#1E3A68]">
                  <span className="text-[10px] text-slate-400 block">{f.label}</span>
                  <span className="font-bold text-slate-100 font-mono">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[#1E3A68] text-xs">
          <span className="text-slate-400">Verified against GeM Schema Definition</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-[#08172D] text-slate-300 border border-[#1E3A68] hover:bg-[#0E203B]"
            >
              Close
            </button>
            {completedExtraction && (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold shadow-xs"
              >
                Proceed to PQC Evaluation &rarr;
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};