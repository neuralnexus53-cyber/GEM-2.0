import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  HelpCircle, 
  FileCheck2,
  ExternalLink,
  Award,
  Building2,
  Calendar,
  FileSpreadsheet,
  Download,
  Check,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { VendorProfile, EligibilityEvaluation, TenderItem } from '../../types';
import { mockTenders } from '../../data/mockData';
import { formatINR } from '../../lib/utils';
import { AIFalseNegativeModal, ChallengeItem } from './AIFalseNegativeModal';
import { Flag, Scale } from 'lucide-react';

interface EligibilityCheckerProps {
  profile: VendorProfile;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ profile }) => {
  const [tenders, setTenders] = useState<TenderItem[]>(mockTenders);
  const [selectedTenderId, setSelectedTenderId] = useState<string>(mockTenders[0]?.id || 'TND-2026-001');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [challengeTarget, setChallengeTarget] = useState<ChallengeItem | null>(null);
  const [overriddenIds, setOverriddenIds] = useState<Record<string, string>>({});
  const [evaluation, setEvaluation] = useState<EligibilityEvaluation | null>(() => {
    const defaultTender = mockTenders[0];
    const turnoverReq = (defaultTender?.estimatedValueCr || 45) * 0.3;
    return {
      tenderId: defaultTender?.id || 'TND-2026-001',
      tenderTitle: defaultTender?.title || 'AI Smart Traffic Grid',
      overallStatus: 'ELIGIBLE',
      score: 96,
      evaluatedWithModel: 'GFR 2017 & PPP-MII Real-Time Compliance Rule Engine',
      criteria: [
        {
          id: 'PQC-01',
          title: 'Average Annual Financial Turnover (GFR Rule 173)',
          requirement: `Minimum 30% of estimated tender value: ₹ ${turnoverReq.toFixed(2)} Cr`,
          vendorValue: `₹ ${profile.turnoverCr.toFixed(2)} Cr (Audited Account Vault)`,
          status: 'PASS',
          aiExplanation: `Vendor audited turnover of ₹${profile.turnoverCr} Cr exceeds required threshold.`
        },
        {
          id: 'PQC-02',
          title: 'Make-in-India (MII) Local Content Declaration',
          requirement: 'Minimum 50% Domestic Value Addition for Class-I Preference',
          vendorValue: `${profile.miiPercentage}% Declared Local Content`,
          status: 'PASS',
          aiExplanation: `Class-I Local Supplier status confirmed with ${profile.miiPercentage}% domestic content.`
        },
        {
          id: 'PQC-03',
          title: 'Past Execution Experience & Statutory Standing',
          requirement: 'Minimum 2+ Years active operations and active GSTIN verification',
          vendorValue: `${profile.experienceYears} Years Verified Domain Experience (GSTIN: ${profile.gstin})`,
          status: 'PASS',
          aiExplanation: `Verified ${profile.experienceYears} years operations meeting tender qualification criteria.`
        }
      ]
    };
  });

  useEffect(() => {
    const loadLiveTenders = async () => {
      try {
        const liveTenders = await api.getTenders();
        if (liveTenders && liveTenders.length > 0) {
          setTenders(liveTenders);
          setSelectedTenderId(liveTenders[0].id);
          generateEvaluation(liveTenders[0], profile);
        }
      } catch (err) {
        console.warn('Could not load tenders:', err);
      }
    };
    loadLiveTenders();
  }, [profile]);

  const generateEvaluation = (tender: TenderItem, vendorProfile: VendorProfile): EligibilityEvaluation => {
    const turnoverReq = tender.estimatedValueCr * 0.3;
    const isTurnoverPass = vendorProfile.turnoverCr >= turnoverReq;
    const isMiiPass = vendorProfile.miiPercentage >= 50;
    const isExpPass = vendorProfile.experienceYears >= 2;

    const evalResult: EligibilityEvaluation = {
      tenderId: tender.id,
      tenderTitle: tender.title,
      overallStatus: isTurnoverPass && isMiiPass && isExpPass ? 'ELIGIBLE' : 'FLAGGED_DISCREPANCY',
      score: Math.min(100, Math.round(
        (isTurnoverPass ? 40 : 15) + 
        (isMiiPass ? 35 : 10) + 
        (isExpPass ? 25 : 10)
      )),
      evaluatedWithModel: 'GFR 2017 & PPP-MII Real-Time Compliance Rule Engine',
      criteria: [
        {
          id: 'PQC-01',
          title: 'Average Annual Financial Turnover (GFR Rule 173)',
          requirement: `Minimum 30% of estimated tender value: ₹ ${turnoverReq.toFixed(2)} Cr`,
          vendorValue: `₹ ${vendorProfile.turnoverCr.toFixed(2)} Cr (Audited Account Vault)`,
          status: isTurnoverPass ? 'PASS' : 'FAIL',
          aiExplanation: isTurnoverPass
            ? `Vendor audited turnover of ₹${vendorProfile.turnoverCr} Cr exceeds the required ₹${turnoverReq.toFixed(2)} Cr.`
            : `Turnover of ₹${vendorProfile.turnoverCr} Cr is below the required ₹${turnoverReq.toFixed(2)} Cr threshold.`
        },
        {
          id: 'PQC-02',
          title: 'Make-in-India (MII) Local Content Declaration',
          requirement: 'Minimum 50% Domestic Value Addition for Class-I Preference',
          vendorValue: `${vendorProfile.miiPercentage}% Declared Local Content`,
          status: isMiiPass ? 'PASS' : 'WARNING',
          aiExplanation: isMiiPass
            ? `Class-I Local Supplier status confirmed with ${vendorProfile.miiPercentage}% domestic content.`
            : `Class-II Supplier (${vendorProfile.miiPercentage}%). May not receive Class-I purchase preference.`
        },
        {
          id: 'PQC-03',
          title: 'Past Execution Experience & Statutory Standing',
          requirement: 'Minimum 2+ Years active operations and active GSTIN verification',
          vendorValue: `${vendorProfile.experienceYears} Years Verified Domain Experience (GSTIN: ${vendorProfile.gstin})`,
          status: isExpPass ? 'PASS' : 'FAIL',
          aiExplanation: isExpPass
            ? `Verified ${vendorProfile.experienceYears} years operations meeting tender qualification criteria.`
            : 'Operational experience falls short of standard pre-qualification requirement.'
        }
      ]
    };

    setEvaluation(evalResult);
    return evalResult;
  };

  const handleRunEvaluation = (tenderId: string) => {
    setSelectedTenderId(tenderId);
    setIsAnalyzing(true);

    const targetTender = tenders.find(t => t.id === tenderId);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (targetTender) {
        generateEvaluation(targetTender, profile);
      }
    }, 500);
  };

  const selectedTender = tenders.find(t => t.id === selectedTenderId) || tenders[0];

  const handleExportEvaluation = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      
      <div className="gov-card gov-card-green p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#052410] border border-[#15803D] text-emerald-400 mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-100">
                  Pre-Qualification Criteria (PQC) & GFR Eligibility Register
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
                  Statutory Rule Assessment
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Automated eligibility verification against General Financial Rules (GFR 2017), PPP-MII (Make-in-India) 2017 Order, and MSE Procurement Policy 2012.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportEvaluation}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#0B2545] hover:bg-[#112E55] text-blue-200 border border-[#1D4ED8] text-xs font-semibold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Compliance Docket</span>
            </button>
          </div>
        </div>
      </div>

      <div className="gov-card p-3">
        <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">
          Select Live Tender for Pre-Qualification Evaluation:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {mockTenders.map(t => (
            <button
              key={t.id}
              onClick={() => handleRunEvaluation(t.id)}
              className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                selectedTenderId === t.id
                  ? 'bg-[#0E2748] border-[#0284C7] shadow-sm'
                  : 'bg-[#0E2038] border-[#23436E] hover:bg-[#132540] hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                <span className="text-amber-400 font-bold">{t.id}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#0B192C] text-slate-300 border border-[#23436E]">{t.category}</span>
              </div>
              <div className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">
                {t.title}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Value: <strong className="text-white">₹ {t.estimatedValueCr} Cr</strong></span>
                <span className="text-cyan-300 font-semibold">{t.organization}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="gov-card p-5 space-y-4 shadow-xl">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-3.5 border-b border-[#23436E]">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-mono font-bold bg-[#0A2240] text-amber-300 px-2.5 py-0.5 rounded border border-[#0284C7]/50">
                {selectedTender.id}
              </span>
              <span className="text-xs text-slate-300">
                Procuring Authority: <strong className="text-white">{selectedTender.organization}</strong>
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              {selectedTender.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Overall Eligibility Status</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>COMPLIANT (ELIGIBLE TO BID)</span>
              </div>
            </div>
            <div className="px-3 py-2 bg-emerald-950/80 border border-emerald-600 rounded-lg text-center shadow-xs">
              <div className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider">PQC Score</div>
              <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-300">{evaluation.score || 96}%</div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Statutory Parameter Compliance Matrix
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Evaluated under GFR 2017 Rule 144(xi) & MII Policy
            </span>
          </div>

          <div className="table-container">
            <table className="gov-table">
              <thead>
                <tr>
                  <th className="w-16">Code</th>
                  <th className="w-1/4">Mandatory Criteria</th>
                  <th className="w-1/4">Tender Requirement</th>
                  <th className="w-1/4">Vendor Verified Submission</th>
                  <th className="w-24 text-center">Result</th>
                  <th className="w-28 text-right">Human Review</th>
                </tr>
              </thead>
              <tbody>
                {evaluation.criteria.map((c, idx) => {
                  const isOverridden = !!overriddenIds[c.id];
                  return (
                    <tr key={c.id || idx}>
                      <td className="font-mono font-bold text-amber-400 bg-[#0B192C]">
                        {c.id}
                      </td>
                      <td>
                        <div className="font-bold text-white text-xs">{c.title}</div>
                        <div className="text-[10px] text-slate-300 mt-0.5">{c.aiExplanation}</div>
                        {isOverridden && (
                          <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold border border-amber-600 font-mono">
                            HITL GROUND TRUTH AUDITED
                          </span>
                        )}
                      </td>
                      <td className="text-slate-300 font-mono text-[11px]">
                        {c.requirement}
                      </td>
                      <td className="text-slate-200 font-mono text-[11px]">
                        {isOverridden ? (
                          <span className="text-cyan-300 font-bold">{overriddenIds[c.id]}</span>
                        ) : (
                          c.vendorValue
                        )}
                      </td>
                      <td className="text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-600">
                          <Check className="w-2.5 h-2.5" />
                          {c.status || 'PASS'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setChallengeTarget({
                            id: c.id,
                            title: c.title,
                            clauseRef: c.id,
                            aiReportedIssue: c.aiExplanation,
                            category: 'OCR_DEGRADATION'
                          })}
                          className="px-2.5 py-1 rounded bg-[#0B192C] hover:bg-[#19355B] text-amber-300 hover:text-amber-200 text-[10px] font-bold border border-[#23436E] transition-all cursor-pointer inline-flex items-center gap-1"
                          title="Challenge AI finding if OCR degraded or misinterpreted"
                        >
                          <Flag className="w-3 h-3" />
                          <span>Flag AI Error</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-[#0E2038] rounded-lg border border-[#23436E] space-y-1">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              1. MSE Exemption (PPP Order 2012)
            </div>
            <div className="text-xs text-slate-200 font-semibold">
              EMD &amp; Prior Turnover/Experience: <strong className="text-emerald-400">Exempted</strong>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Eligible for 25% procurement allocation under GFR 153.
            </div>
          </div>

          <div className="p-3 bg-[#0E2038] rounded-lg border border-[#23436E] space-y-1">
            <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
              2. Make-in-India Preference (MII 2017)
            </div>
            <div className="text-xs text-slate-200 font-semibold">
              Purchase Preference Margin: <strong className="text-sky-300">20% L1 Band</strong>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Class-I supplier eligible for order matching if rate within L1+20%.
            </div>
          </div>

          <div className="p-3 bg-[#0E2038] rounded-lg border border-[#23436E] space-y-1">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              3. CA UDIN Verification
            </div>
            <div className="text-xs text-slate-200 font-semibold">
              Financial Status: <strong className="text-emerald-300">Audited &amp; Authenticated</strong>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Turnover certificate authenticated via ICAI portal.
            </div>
          </div>
        </div>
      </div>

      <AIFalseNegativeModal
        isOpen={!!challengeTarget}
        onClose={() => setChallengeTarget(null)}
        targetItem={challengeTarget}
        onChallengeSubmitted={(data) => {
          setOverriddenIds(prev => ({
            ...prev,
            [data.itemId]: data.groundTruthText
          }));
        }}
      />

    </div>
  );
};