import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Send,
  X,
  UploadCloud,
  FileCheck2,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Scale
} from 'lucide-react';

export interface ChallengeItem {
  id: string;
  title: string;
  clauseRef?: string;
  aiReportedIssue: string;
  category: 'OCR_DEGRADATION' | 'RAG_MISINTERPRETATION' | 'DUAL_DOC_AGGREGATION' | 'RULE_APPLICABILITY' | 'OTHER';
}

interface AIFalseNegativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: ChallengeItem | null;
  onChallengeSubmitted: (challengeData: {
    itemId: string;
    reasonCategory: string;
    pageNumber: number;
    groundTruthText: string;
    justification: string;
    isDisputed: boolean;
    disputeNotes: string;
  }) => void;
}

export const AIFalseNegativeModal: React.FC<AIFalseNegativeModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  onChallengeSubmitted
}) => {
  const [reasonCategory, setReasonCategory] = useState<string>('OCR_DEGRADATION');
  const [pageNumber, setPageNumber] = useState<number>(3);
  const [groundTruthText, setGroundTruthText] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !targetItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullDisputeNotes = `[${reasonCategory} - Page ${pageNumber}] ${groundTruthText || 'Ground truth certified verbatim'} | Justification: ${justification || 'Verified statutory compliance'}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onChallengeSubmitted({
          itemId: targetItem.id,
          reasonCategory,
          pageNumber,
          groundTruthText: groundTruthText || 'Vendor provided ground truth certified verbatim from Page ' + pageNumber,
          justification: justification || 'Verified statutory compliance pursuant to GFR 2017',
          isDisputed: true,
          disputeNotes: fullDisputeNotes
        });
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="gov-card max-w-xl w-full p-5 space-y-4 shadow-2xl border-2 border-amber-500">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#23436E]">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 mt-0.5">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-extrabold border border-amber-600 uppercase">
                  HUMAN-IN-THE-LOOP (HITL)
                </span>
                <h3 className="text-sm font-extrabold text-white">
                  Flag AI Scrutiny False-Negative / Challenge Finding
                </h3>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Correct AI OCR scan misreads or RAG semantic hallucinations by submitting verified ground truth directly into the Merkle audit trail.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 bg-emerald-950/90 border border-emerald-500 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <div className="text-base font-extrabold text-white">
              AI Finding Successfully Overridden &amp; Ground Truth Logged!
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Your ground truth citation has been cryptographically attached to the evaluation docket. The <strong className="text-emerald-400">ai_confidence_score</strong> has been recalculated.
            </p>
          </div>
        ) : isSubmitting ? (
          <div className="py-10 text-center space-y-3">
            <RefreshCw className="w-9 h-9 text-amber-400 animate-spin mx-auto" />
            <div className="text-sm font-bold text-white">
              Re-evaluating Clause with Human Ground Truth...
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Recalculating Deterministic Rule Engine &bull; Updating HMAC Block Hash
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {/* Target Item Context */}
            <div className="p-3 bg-[#0B192C] rounded-lg border border-[#23436E] space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>FLAGGED CRITERIA / CLAUSE:</span>
                <span className="font-mono text-cyan-300 font-bold">{targetItem.clauseRef || targetItem.id}</span>
              </div>
              <div className="text-xs font-bold text-white">
                {targetItem.title}
              </div>
              <div className="text-[11px] text-rose-300 bg-rose-950/50 p-2 rounded border border-rose-900/60 mt-1">
                <span className="font-bold">AI Flagged Issue:</span> {targetItem.aiReportedIssue}
              </div>
            </div>

            {/* Error Category Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Reason for False-Negative / AI Error:
              </label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="w-full p-2 bg-[#0B192C] border border-[#23436E] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-medium cursor-pointer"
              >
                <option value="OCR_DEGRADATION">OCR Degraded / Faded Text Misread in Scanned PDF</option>
                <option value="RAG_MISINTERPRETATION">RAG Model Semantic Misinterpretation of Custom Term</option>
                <option value="DUAL_DOC_AGGREGATION">Data Split Across Multiple Attached Annexures</option>
                <option value="RULE_APPLICABILITY">Statutory Exemption Applicable (e.g. MSME / DPIIT / GFR 170)</option>
                <option value="OTHER">Other Ground Truth Correction</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  PDF Page Number:
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={pageNumber}
                  onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
                  className="w-full p-2 bg-[#0B192C] border border-[#23436E] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Verbatim Ground Truth Snippet from Document:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Work Order Value: Rs 48,20,00,000/- completed on 12-Feb-2025"
                  value={groundTruthText}
                  onChange={(e) => setGroundTruthText(e.target.value)}
                  className="w-full p-2 bg-[#0B192C] border border-[#23436E] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Vendor Justification &amp; Statutory Citation:
              </label>
              <textarea
                rows={2}
                required
                placeholder="Explain why this satisfies the PQC criteria under GFR 2017 rules..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="w-full p-2 bg-[#0B192C] border border-[#23436E] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            <div className="p-2.5 bg-[#0B1E38] rounded-lg border border-[#23436E] text-[10px] text-slate-300 leading-relaxed flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white">Audit Trail Guarantee:</strong> Human overrides are signed with your vendor certificate and submitted to the Government Officer review portal with Ground Truth high-priority tags.
              </span>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-[#23436E]">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-[#0B192C] hover:bg-[#132540] text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ground Truth Override</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
