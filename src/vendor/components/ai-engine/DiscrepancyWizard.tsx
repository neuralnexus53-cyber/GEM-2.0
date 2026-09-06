import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  UploadCloud, 
  FileCheck2, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Check, 
  X,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { VendorProfile } from '../../types';
import { AIFalseNegativeModal, ChallengeItem } from './AIFalseNegativeModal';
import { Flag } from 'lucide-react';

interface DiscrepancyItem {
  id: string;
  category: 'FINANCIAL' | 'STATUTORY' | 'TECHNICAL' | 'OEM_MAF';
  title: string;
  description: string;
  statutoryRule: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  remedyAction: string;
  status: 'PENDING' | 'SCANNING' | 'RESOLVED';
  uploadedFileName?: string;
  resolvedScoreBoost: number;
}

const INITIAL_DISCREPANCIES: DiscrepancyItem[] = [
  {
    id: 'DISC-01',
    category: 'FINANCIAL',
    title: 'Missing CA UDIN QR Code on 3-Yr Turnover Certificate',
    description: 'The uploaded chartered accountant turnover statement is missing a 18-digit Unique Document Identification Number (UDIN) required under ICAI Gazette notification.',
    statutoryRule: 'ICAI UDIN Mandatory Directive (Gazette Notification No. 1-CA(7)/192/2019) & GFR Rule 144',
    severity: 'CRITICAL',
    remedyAction: 'Upload CA Turnover Certificate with valid 18-digit UDIN and QR verification stamp.',
    status: 'PENDING',
    resolvedScoreBoost: 14
  },
  {
    id: 'DISC-02',
    category: 'STATUTORY',
    title: 'Make-in-India (MII) Self-Declaration Annexure Incomplete',
    description: 'The domestic value addition declaration lacks specific percentage breakdown for Tier-2 local sub-assembly suppliers required for Class-I Local Supplier status.',
    statutoryRule: 'Public Procurement (Preference to Make in India) Order 2017 (DPIIT Clause 9(a))',
    severity: 'HIGH',
    remedyAction: 'Upload signed MII Self-Declaration confirming minimum 50% audited local content.',
    status: 'PENDING',
    resolvedScoreBoost: 10
  },
  {
    id: 'DISC-03',
    category: 'TECHNICAL',
    title: 'Client Satisfaction Certificate for Past 3-Year Similar Works',
    description: 'Performance completion certificate from previous central/state PSU procurement missing official signatory designation stamp.',
    statutoryRule: 'Manual for Procurement of Goods 2024 (Section 5.1.4 - Past Performance Credential)',
    severity: 'MEDIUM',
    remedyAction: 'Attach signed Client Performance Completion Certificate with Work Order reference number.',
    status: 'PENDING',
    resolvedScoreBoost: 8
  }
];

interface DiscrepancyWizardProps {
  profile: VendorProfile;
  onOpenReportModal: () => void;
  onNavigateToEligibility?: () => void;
}

export const DiscrepancyWizard: React.FC<DiscrepancyWizardProps> = ({ 
  profile, 
  onOpenReportModal,
  onNavigateToEligibility 
}) => {
  const [items, setItems] = useState<DiscrepancyItem[]>(INITIAL_DISCREPANCIES);
  const [activeScanningId, setActiveScanningId] = useState<string | null>(null);
  const [challengeTarget, setChallengeTarget] = useState<ChallengeItem | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Calculate dynamic AI confidence score
  const resolvedBoost = items
    .filter(i => i.status === 'RESOLVED')
    .reduce((sum, i) => sum + i.resolvedScoreBoost, 0);
  
  const baseScore = 68;
  const currentConfidenceScore = Math.min(100, baseScore + resolvedBoost);
  const pendingCount = items.filter(i => i.status !== 'RESOLVED').length;

  const handleResolve = (item: DiscrepancyItem, simulatedFileName: string) => {
    setIsScanning(true);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'SCANNING' } : i));

    setTimeout(() => {
      setItems(prev => prev.map(i => {
        if (i.id === item.id) {
          return {
            ...i,
            status: 'RESOLVED',
            uploadedFileName: simulatedFileName
          };
        }
        return i;
      }));
      setIsScanning(false);
      setActiveScanningId(null);
    }, 1200);
  };

  const handleResetAll = () => {
    setItems(INITIAL_DISCREPANCIES);
  };

  return (
    <div className="space-y-4 text-slate-100">
      
      {/* Header Banner */}
      <div className="gov-card gov-card-saffron p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#2D1A05] border border-[#9A3412] text-amber-400 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Interactive Discrepancy Resolution Wizard (AI Scrutiny Remediation)
                </h2>
                <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold border ${
                  pendingCount === 0 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-amber-950 text-amber-300 border-amber-600'
                }`}>
                  {pendingCount === 0 ? 'ALL SHORTFALLS RESOLVED' : `${pendingCount} DISCREPANCIES DETECTED`}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                Actionable shortfall remediation portal. If the AI rule-checking engine flags missing compliance dockets, upload replacement certificates here to trigger real-time OCR re-verification and elevate your tender win probability before generating the final signed dossier.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pendingCount === 0 ? (
              <button
                onClick={onOpenReportModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#002855] hover:bg-[#003875] text-white text-xs font-bold transition-all cursor-pointer shadow-md border border-[#0284C7]"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Generate Signed Dossier (100% Pass)</span>
              </button>
            ) : (
              <button
                onClick={handleResetAll}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#0B192C] hover:bg-[#132540] text-slate-300 border border-[#23436E] text-xs font-medium transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Confidence Score Meter */}
      <div className="gov-card p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#23436E]">
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Pre-Qualification Compliance Confidence Meter
            </span>
            <span className="text-xs text-slate-300">
              Evaluated against tender PQC criteria, turnover thresholds, and statutory Annexures
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">Live AI Confidence Score:</span>
            <span className={`text-xl sm:text-2xl font-extrabold font-mono ${
              currentConfidenceScore >= 95 ? 'text-emerald-400' : currentConfidenceScore >= 80 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {currentConfidenceScore}%
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-3.5 bg-[#0B192C] rounded-full overflow-hidden border border-[#23436E] p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-700 ${
              currentConfidenceScore >= 95 ? 'bg-emerald-500' : currentConfidenceScore >= 80 ? 'bg-amber-400' : 'bg-rose-500'
            }`}
            style={{ width: `${currentConfidenceScore}%` }}
          />
        </div>
      </div>

      {/* Discrepancy Action List & Remediation Modal/Drawer */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const isResolved = item.status === 'RESOLVED';
          const isScanningThis = item.status === 'SCANNING';

          return (
            <div 
              key={item.id}
              className={`gov-card p-5 space-y-3 transition-all ${
                isResolved ? 'border-emerald-700/80 bg-[#0B2518]/30' : 'border-[#23436E]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2 border-b border-[#23436E]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0B192C] text-cyan-300 border border-[#23436E]">
                    #{idx + 1} &bull; {item.id}
                  </span>

                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                    item.severity === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : item.severity === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-sky-950 text-sky-300 border-sky-700'
                  }`}>
                    {item.severity} SHORTFALL
                  </span>

                  <span className="text-xs text-slate-300 font-medium">
                    {item.category} COMPLIANCE
                  </span>
                </div>

                <div>
                  {isResolved ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Resolved &bull; +{item.resolvedScoreBoost}% Score Boost
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-mono font-bold">
                      Potential Gain: +{item.resolvedScoreBoost}%
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="p-3 bg-[#0B192C] rounded-lg border border-[#23436E] space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                  Statutory Rule / Violation Citation:
                </span>
                <span className="font-mono text-slate-300 text-[11px] block">
                  {item.statutoryRule}
                </span>
              </div>

              {/* Upload & Remediation Controls */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#23436E]">
                <div className="text-xs text-slate-300">
                  <strong className="text-cyan-300">Required Action:</strong> {item.remedyAction}
                  {isResolved && (
                    <div className="text-emerald-400 text-[11px] font-mono mt-0.5">
                      ✓ Attached: {item.uploadedFileName} (SHA-256 Verified)
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  {isResolved ? (
                    <button
                      disabled
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-600 opacity-90 cursor-default"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Remediated</span>
                    </button>
                  ) : isScanningThis ? (
                    <button
                      disabled
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-sky-900 text-cyan-200 text-xs font-bold border border-sky-600 animate-pulse cursor-wait"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>AI OCR Scanning...</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setChallengeTarget({
                          id: item.id,
                          title: item.title,
                          clauseRef: item.id,
                          aiReportedIssue: item.description,
                          category: 'OCR_DEGRADATION'
                        })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0B192C] hover:bg-[#132540] text-amber-400 text-xs font-bold border border-[#23436E] transition-all cursor-pointer"
                      >
                        <Flag className="w-3 h-3" />
                        <span>Flag AI Error</span>
                      </button>

                      <button
                        onClick={() => handleResolve(item, `Remediated_${item.id}_Verified_Doc.pdf`)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload &amp; Re-Scrutinize</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AIFalseNegativeModal
        isOpen={!!challengeTarget}
        onClose={() => setChallengeTarget(null)}
        targetItem={challengeTarget}
        onChallengeSubmitted={(data) => {
          const target = items.find(i => i.id === data.itemId);
          if (target) {
            handleResolve(target, `HITL_GroundTruth_Override_${data.itemId}.pdf`);
          }
        }}
      />

    </div>
  );
};
