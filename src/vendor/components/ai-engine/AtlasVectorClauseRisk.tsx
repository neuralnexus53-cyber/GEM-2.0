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

export const AtlasVectorClauseRisk: React.FC = () => {
  const [clauses, setClauses] = useState<ContractClauseRisk[]>([]);
  const [selectedClause, setSelectedClause] = useState<ContractClauseRisk | null>(null);
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadRisks = async () => {
      try {
        const risks = await api.getClauseRisks('TNDR-2026-8819');
        if (risks && risks.length > 0) {
          setClauses(risks);
          setSelectedClause(risks[0]);
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
            <div className="p-2 rounded bg-[#3B0D0D] border border-[#B91C1C] text-rose-400 mt-0.5">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-100">
                  Contractual Risk & Liquidated Damages (LD) Audit Docket
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#3B0D0D] text-rose-300 font-semibold border border-[#B91C1C]">
                  GFR Rule 173 Scrutiny Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Automated legal scrutiny of Special Terms & Conditions (STC), Liquidated Damages (LD) caps, payment retention, and warranty liabilities before bid submission.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadRepresentation}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#0B2545] hover:bg-[#112E55] text-blue-200 border border-[#1D4ED8] text-xs font-semibold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Pre-Bid Representation</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-[#1E3A68] pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-2">Filter by Severity:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(level => (
            <button
              key={level}
              onClick={() => setRiskFilter(level)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all border ${
                riskFilter === level
                  ? 'bg-[#002855] text-white border-[#0284C7]'
                  : 'bg-[#08172D] text-slate-400 border-[#1E3A68] hover:bg-[#0E2242] hover:text-slate-200'
              }`}
            >
              {level === 'ALL' && 'All Clauses (3)'}
              {level === 'CRITICAL' && 'Critical Non-Compliance (1)'}
              {level === 'HIGH' && 'High Financial Penalty (1)'}
              {level === 'MEDIUM' && 'Medium Ambiguity (1)'}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
          Dossier Ref: <strong className="text-slate-200">GEM/2026/B/8901</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        <div className="lg:col-span-5 space-y-2">
          <div className="text-[11px] font-bold uppercase text-slate-400 px-1">
            Audited Tender Clauses ({filteredClauses.length})
          </div>

          <div className="space-y-2">
            {filteredClauses.map(clause => {
              const isSelected = selectedClause.id === clause.id;
              return (
                <div
                  key={clause.id}
                  onClick={() => setSelectedClause(clause)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0F2548] border-[#0284C7] shadow-xs'
                      : 'bg-[#0C1A30] border-[#1E3A68] hover:bg-[#0E203B]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-amber-400 bg-[#001833] px-1.5 py-0.5 rounded border border-[#1E3A68]">
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
          <div className="gov-card p-4 space-y-4">
            
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1E3A68]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono bg-[#00244D] text-amber-300 px-2 py-0.5 rounded border border-[#1E3A68] font-bold">
                    {selectedClause.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Category: {selectedClause.category} &bull; {selectedClause.clauseNumber}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100">
                  {selectedClause.clauseTitle}
                </h3>
              </div>

              <div className="shrink-0 text-right">
                <span className={`text-[10px] px-2.5 py-1 rounded font-bold border block ${
                  selectedClause.riskLevel === 'CRITICAL'
                    ? 'bg-[#3B0D0D] text-rose-300 border-[#B91C1C]'
                    : selectedClause.riskLevel === 'HIGH'
                    ? 'bg-[#2D1A05] text-amber-300 border-[#9A3412]'
                    : 'bg-[#0B2545] text-blue-300 border-[#1D4ED8]'
                }`}>
                  {selectedClause.riskLevel} RISK
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Exact Tender Text Excerpt (Verbatim):
              </span>
              <div className="p-3 bg-[#051124] rounded border border-[#1E3A68] text-xs text-slate-300 font-mono leading-relaxed italic border-l-4 border-l-amber-500">
                "{selectedClause.originalText}"
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-[#091528] rounded border border-[#1E3A68]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                  Legal & Financial Risk Assessment:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedClause.riskExplanation}
                </p>
              </div>

              <div className="p-3 bg-[#091528] rounded border border-[#1E3A68]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Statutory Rule Reference:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  GFR 2017 Rule 173 & Public Procurement Guidelines. Liquidated damages should not exceed 10% of total contract value.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#001D3D] rounded border border-[#0284C7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Official Pre-Bid Clarification Draft (GeM / CPPP Format)
                </span>
                <button
                  onClick={() => handleCopyMitigation(selectedClause.recommendedMitigation, selectedClause.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#002855] hover:bg-[#003875] text-cyan-300 text-[11px] font-semibold border border-[#0284C7] transition-all"
                >
                  {copiedId === selectedClause.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Representation</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-200 font-mono leading-relaxed bg-[#051124] p-3 rounded border border-[#1E3A68]">
                {selectedClause.recommendedMitigation}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-[#1E3A68]">
              <span>Verified against GeM Standard Terms & Conditions (STC v4.0)</span>
              <button
                onClick={handleDownloadRepresentation}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Representation (.TXT)</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};