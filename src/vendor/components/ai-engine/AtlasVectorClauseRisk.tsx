import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Search,
  Layers,
  Copy,
  Check,
  HelpCircle,
  Download,
  Building,
  Scale
} from 'lucide-react';
import { ContractClauseRisk } from '../../types';
import { api } from '../../services/api';
import { mockContractClauseRisks } from '../../data/mockData';
import { AIFalseNegativeModal, ChallengeItem } from './AIFalseNegativeModal';
import { Flag } from 'lucide-react';

export const AtlasVectorClauseRisk: React.FC = () => {
  const [clauses, setClauses] = useState<ContractClauseRisk[]>(mockContractClauseRisks);
  const [selectedClause, setSelectedClause] = useState<ContractClauseRisk | null>(mockContractClauseRisks[0] || null);
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [challengeTarget, setChallengeTarget] = useState<ChallengeItem | null>(null);
  const [overriddenClauseIds, setOverriddenClauseIds] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadRisks = async () => {
      try {
        const risks = await api.getClauseRisks('TNDR-2026-8819');
        if (risks && risks.length > 0) {
          setClauses(risks);
          setSelectedClause(prev => prev || risks[0]);
        }
      } catch (err) {}
    };
    loadRisks();
  }, []);

  const filteredClauses = clauses.filter(c => {
    if (riskFilter === 'ALL') return true;
    return c.riskLevel === riskFilter;
  });

  const handleCopyMitigation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadRepresentation = () => {
    if (!selectedClause) return;
    const textContent = `GOVERNMENT OF INDIA - PUBLIC PROCUREMENT FACILITATION
GEEM / CPPP PRE-BID REPRESENTATION LETTER
Ref: GeM/TENDER-REP/2026/089
Date: ${new Date().toLocaleDateString('en-IN')}

To:
The Procurement Officer / Tender Inviting Authority (TIA)
Department / Public Sector Undertaking

Subject: Representation regarding Clause: "${selectedClause.clauseTitle}" in Tender Document

Respected Sir/Madam,

With reference to the Notice Inviting Tender (NIT), we respectfully submit our formal pre-bid clarification regarding the following clause:

1. CLAUSE DETAILS:
   - Clause ID / Section: ${selectedClause.id} (${selectedClause.clauseNumber})
   - Clause Text: "${selectedClause.originalText}"

2. STATUTORY RISK & OPERATIONAL CONSTRAINTS:
   ${selectedClause.riskExplanation}
   
3. PROPOSED AMENDMENT / CLARIFICATION UNDER GFR 2017:
   ${selectedClause.recommendedMitigation}

We request the competent authority to kindly consider issuing a Corrigendum to ensure fair and competitive bidding.

Yours faithfully,
Authorized Signatory
(Registered GeM Vendor)`;

    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Pre_Bid_Representation_${selectedClause.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-4">

      <div className="gov-card gov-card-red p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-600/60 text-rose-400 mt-0.5 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  Contractual Risk &amp; Liquidated Damages (LD) Audit Docket
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold border border-rose-600 font-mono">
                  GFR Rule 173 Scrutiny
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Automated legal scrutiny of Special Terms &amp; Conditions (STC), Liquidated Damages (LD) caps, payment retention, and warranty liabilities before bid submission.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadRepresentation}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#002855] hover:bg-[#003A78] text-sky-300 hover:text-white border border-[#0284C7] text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export Pre-Bid Representation</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-[#23436E] pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-300 uppercase mr-2 tracking-wider">Filter Severity:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(level => (
            <button
              key={level}
              onClick={() => setRiskFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                riskFilter === level
                  ? 'bg-[#0284C7] text-white border-[#38BDF8] shadow-xs'
                  : 'bg-[#0E2038] text-slate-300 border-[#23436E] hover:bg-[#132540] hover:text-white'
              }`}
            >
              {level === 'ALL' && 'All Clauses (3)'}
              {level === 'CRITICAL' && 'Critical Non-Compliance (1)'}
              {level === 'HIGH' && 'High Financial Penalty (1)'}
              {level === 'MEDIUM' && 'Medium Ambiguity (1)'}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-300 font-mono hidden sm:block">
          Dossier Ref: <strong className="text-sky-300">GEM/2026/B/8901</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        <div className="lg:col-span-5 space-y-2">
          <div className="text-[11px] font-bold uppercase text-slate-300 px-1 tracking-wider">
            Audited Tender Clauses ({filteredClauses.length})
          </div>

          <div className="space-y-2">
            {filteredClauses.map(clause => {
              const isSelected = selectedClause.id === clause.id;
              return (
                <div
                  key={clause.id}
                  onClick={() => setSelectedClause(clause)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0E2748] border-[#0284C7] shadow-sm'
                      : 'bg-[#0E2038] border-[#23436E] hover:bg-[#132540] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-amber-300 bg-[#0B192C] px-2 py-0.5 rounded border border-[#23436E]">
                      {clause.id} &bull; {clause.clauseNumber}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                      clause.riskLevel === 'CRITICAL'
                        ? 'bg-[#3B0D0D] text-rose-300 border-[#B91C1C]'
                        : clause.riskLevel === 'HIGH'
                        ? 'bg-[#2D1A05] text-amber-300 border-[#9A3412]'
                        : 'bg-[#0B2545] text-blue-300 border-[#1D4ED8]'
                    }`}>
                      {clause.riskLevel} SEVERITY
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">
                    {clause.clauseTitle}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {clause.riskExplanation}
                  </p>

                  <div className="mt-2 pt-2 border-t border-[#1E3A68]/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Impact Score: <strong className="text-slate-200">{clause.impactScore}/10</strong></span>
                    <span className="text-cyan-400 font-semibold">Review Dossier &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          {selectedClause ? (
            <div className="gov-card p-4 space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#23436E]">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-mono bg-[#0A2240] text-amber-300 px-2.5 py-0.5 rounded border border-[#0284C7]/50 font-bold">
                      {selectedClause.id}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      Category: {selectedClause.category} &bull; {selectedClause.clauseNumber}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {selectedClause.clauseTitle}
                  </h3>
                </div>

                <div className="shrink-0 text-right">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border block font-mono ${
                    selectedClause.riskLevel === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border-rose-600'
                      : selectedClause.riskLevel === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border-amber-600'
                      : 'bg-sky-950 text-sky-300 border-sky-600'
                  }`}>
                    {selectedClause.riskLevel} RISK
                  </span>
                </div>
              </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Exact Tender Text Excerpt (Verbatim):
              </span>
              <div className="p-3.5 bg-[#0B192C] rounded-lg border border-[#23436E] text-xs text-slate-200 font-mono leading-relaxed italic border-l-4 border-l-amber-500 shadow-inner">
                "{selectedClause.originalText}"
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-[#0E2038] rounded-lg border border-[#23436E] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                  Legal &amp; Financial Risk Assessment:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedClause.riskExplanation}
                </p>
              </div>

              <div className="p-3 bg-[#0E2038] rounded-lg border border-[#23436E] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Statutory Rule Reference:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  GFR 2017 Rule 173 &amp; Public Procurement Guidelines. Liquidated damages should not exceed 10% of total contract value.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#0A2240] rounded-lg border border-[#0284C7] space-y-2.5 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  Official Pre-Bid Clarification Draft (GeM / CPPP Format)
                </span>
                <button
                  onClick={() => handleCopyMitigation(selectedClause.recommendedMitigation, selectedClause.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#002855] hover:bg-[#003875] text-sky-300 hover:text-white text-xs font-bold border border-[#0284C7] transition-all cursor-pointer shadow-xs"
                >
                  {copiedId === selectedClause.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Representation</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-200 font-mono leading-relaxed bg-[#0B192C] p-3 rounded border border-[#23436E]">
                {selectedClause.recommendedMitigation}
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between text-xs text-slate-300 border-t border-[#23436E] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Risk Model:</span>
                <span className="font-mono text-cyan-300 font-bold">RAG Atlas Vector GCC/SCC</span>
                {overriddenClauseIds[selectedClause.id] && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold border border-amber-600 font-mono">
                    HITL GROUND TRUTH ATTACHED
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChallengeTarget({
                    id: selectedClause.id,
                    title: selectedClause.clauseTitle,
                    clauseRef: `${selectedClause.id} (${selectedClause.clauseNumber})`,
                    aiReportedIssue: selectedClause.riskExplanation,
                    category: 'RAG_MISINTERPRETATION'
                  })}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0B192C] hover:bg-[#19355B] text-amber-300 hover:text-amber-200 text-xs font-bold border border-[#23436E] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Flag AI Error</span>
                </button>

                <button
                  onClick={handleDownloadRepresentation}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0E2038] hover:bg-[#132540] text-sky-300 hover:text-white text-xs font-semibold border border-[#23436E] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download (.TXT)</span>
                </button>
              </div>
            </div>

          </div>
          ) : (
            <div className="gov-card p-8 text-center text-slate-400 space-y-2">
              <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-sm font-bold text-slate-300">No Clause Selected</div>
              <p className="text-xs text-slate-500">Select a contract clause from the list on the left to review legal and liquidated damages risks.</p>
            </div>
          )}
        </div>

      </div>

      <AIFalseNegativeModal
        isOpen={!!challengeTarget}
        onClose={() => setChallengeTarget(null)}
        targetItem={challengeTarget}
        onChallengeSubmitted={(data) => {
          setOverriddenClauseIds(prev => ({
            ...prev,
            [data.itemId]: data.groundTruthText
          }));
        }}
      />

    </div>
  );
};