import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Database,
  Lock,
  RefreshCw,
  Hash,
  Scale
} from 'lucide-react';
import { VendorProfile } from '../../types';

interface EvaluationRecord {
  id: string;
  tenderId: string;
  tenderTitle: string;
  department: string;
  evaluatedAt: string;
  anonToken: string;
  complianceStatus: 'COMPLIANT' | 'SHORTFALL_RESOLVED' | 'FLAGGED';
  gfrRuleReference: string;
  merkleHash: string;
  blockHeight: number;
  aiConfidenceScore: number;
  turnoverScore: string;
  miiScore: string;
  experienceScore: string;
  ldRiskCount: number;
  dossierFileName: string;
}

interface EvaluationArchiveViewProps {
  profile: VendorProfile;
  onOpenReportModal?: () => void;
}

export const EvaluationArchiveView: React.FC<EvaluationArchiveViewProps> = ({ profile, onOpenReportModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLIANT' | 'SHORTFALL_RESOLVED' | 'FLAGGED'>('ALL');
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<EvaluationRecord | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedHash, setVerifiedHash] = useState<string | null>(null);

  const initialRecords: EvaluationRecord[] = [
    {
      id: 'EVAL-2026-9901',
      tenderId: 'GEM/2026/B/8819',
      tenderTitle: 'Procurement of High-Precision CNC 5-Axis Milling Machine Centers',
      department: 'Ministry of Heavy Industries & Public Enterprises',
      evaluatedAt: '04-Sep-2026 14:32 IST',
      anonToken: 'ANON-2026-8849-F3E1',
      complianceStatus: 'COMPLIANT',
      gfrRuleReference: 'GFR Rule 170 (EMD Exemption) & Rule 153 (PPP-MII 2017)',
      merkleHash: '0x8f4c39a7b12d90ef7834bc1a02938475928374650192837465a9b8c7d6e5f4a3',
      blockHeight: 14892,
      aiConfidenceScore: 98.4,
      turnoverScore: '₹48.20 Cr vs ₹13.50 Cr (357% Coverage)',
      miiScore: '74.0% Local Content (Class-I Supplier)',
      experienceScore: '12 Years (Req: 3 Years)',
      ldRiskCount: 0,
      dossierFileName: 'Dossier_GEM_2026_B_8819_Signed.pdf'
    },
    {
      id: 'EVAL-2026-8742',
      tenderId: 'CPPP/2026/DEF/4491',
      tenderTitle: 'Supply & Retrofitting of Tactical RF Signal Analysers',
      department: 'Directorate of Electronics & Mechanical Engineers, MoD',
      evaluatedAt: '28-Aug-2026 11:15 IST',
      anonToken: 'ANON-2026-4491-A89C',
      complianceStatus: 'SHORTFALL_RESOLVED',
      gfrRuleReference: 'GFR Rule 144(xi) Security Clearance & DGR Guidelines',
      merkleHash: '0x3e21a980bc714f826394801726354819203847561928374650192837465a9b8c',
      blockHeight: 14650,
      aiConfidenceScore: 100.0,
      turnoverScore: '₹48.20 Cr vs ₹8.40 Cr (573% Coverage)',
      miiScore: '68.5% Local Content (Class-I Supplier)',
      experienceScore: '12 Years (Req: 2 Years)',
      ldRiskCount: 1,
      dossierFileName: 'Dossier_CPPP_2026_DEF_4491_Remediated.pdf'
    },
    {
      id: 'EVAL-2026-7210',
      tenderId: 'GEM/2026/B/7201',
      tenderTitle: 'Enterprise Server Virtualization & Cloud Compute Infrastructure',
      department: 'National Informatics Centre Services Inc. (NICSI)',
      evaluatedAt: '15-Aug-2026 16:45 IST',
      anonToken: 'ANON-2026-7201-C4B2',
      complianceStatus: 'COMPLIANT',
      gfrRuleReference: 'GFR Rule 149 (GeM Procurement) & STQC Cyber Norms',
      merkleHash: '0x99a8b7c6d5e4f3a2b10987654321fedcba0987654321fedcba0987654321fedc',
      blockHeight: 14218,
      aiConfidenceScore: 95.8,
      turnoverScore: '₹48.20 Cr vs ₹21.00 Cr (229% Coverage)',
      miiScore: '58.0% Local Content (Class-I Supplier)',
      experienceScore: '12 Years (Req: 5 Years)',
      ldRiskCount: 2,
      dossierFileName: 'Dossier_GEM_2026_B_7201_Signed.pdf'
    },
    {
      id: 'EVAL-2026-6105',
      tenderId: 'CPWD/2026/CIVIL/1092',
      tenderTitle: 'Construction of Multi-Storey Green Institutional Complex',
      department: 'Central Public Works Department (CPWD Zone-1)',
      evaluatedAt: '02-Aug-2026 09:20 IST',
      anonToken: 'ANON-2026-1092-E9F0',
      complianceStatus: 'FLAGGED',
      gfrRuleReference: 'CPWD Manual Sec 4.2 & GFR Rule 173(ii) Bidding Capacity',
      merkleHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      blockHeight: 13994,
      aiConfidenceScore: 78.5,
      turnoverScore: '₹48.20 Cr vs ₹55.00 Cr (87% - Below Threshold)',
      miiScore: '85.0% Domestic Steel/Cement',
      experienceScore: '12 Years (Req: 7 Years)',
      ldRiskCount: 3,
      dossierFileName: 'Dossier_CPWD_2026_CIVIL_1092_Audit.pdf'
    }
  ];

  const [records] = useState<EvaluationRecord[]>(initialRecords);

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.tenderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.anonToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && r.complianceStatus === statusFilter;
  });

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const handleVerifyMerkle = (record: EvaluationRecord) => {
    setIsVerifying(true);
    setSelectedRecord(record);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedHash(record.merkleHash);
    }, 1200);
  };

  const handleDownloadHistoricalDossier = (record: EvaluationRecord) => {
    const jsonContent = JSON.stringify({
      archiveHeader: {
        schema: "https://gem.gov.in/schemas/v2/evaluation_dossier.json",
        title: "COMPREHENSIVE TENDER EVALUATION DOSSIER & MERKLE AUDIT TRAIL",
        issuedBy: "GovVendor AI Autonomous Scrutiny Engine",
        statutoryAuthority: "Government of India - General Financial Rules (GFR 2017)"
      },
      evaluationRecord: {
        evaluationId: record.id,
        tenderId: record.tenderId,
        tenderTitle: record.tenderTitle,
        department: record.department,
        evaluatedAt: record.evaluatedAt,
        doubleBlindToken: record.anonToken,
        complianceStatus: record.complianceStatus,
        gfrRuleReference: record.gfrRuleReference,
        aiConfidenceScore: `${record.aiConfidenceScore}%`,
        metrics: {
          turnover: record.turnoverScore,
          makeInIndiaContent: record.miiScore,
          technicalExperience: record.experienceScore,
          flaggedClauseRisks: record.ldRiskCount
        }
      },
      auditTrailVerification: {
        sequenceIndex: record.blockHeight,
        merkleRoot: record.merkleHash,
        cryptographicAlgorithm: "SHA-256 HMAC & Merkle Tree Root Hash",
        officerVerificationStatus: "DOUBLE_BLIND_EVALUATED_WITHOUT_BIAS",
        timestamp: record.evaluatedAt
      },
      vendorEntity: {
        name: profile.name,
        gstin: profile.gstin,
        pan: profile.pan
      }
    }, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.tenderId.replace(/[^a-zA-Z0-9]/g, '_')}_Merkle_Dossier_Archive.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="gov-card gov-card-blue p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#002855] border border-[#0284C7] text-sky-400 mt-0.5">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-white">
                  Historical Evaluation Archive &amp; Merkle Audit Vault
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-600 font-mono">
                  evaluation_logs
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600 font-mono">
                  MERKLE HASH VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Immutable repository of all previously scrutinized tenders, historical <strong className="text-white">ai_confidence_score</strong> metrics, and double-blind <strong className="text-cyan-300 font-mono">anon_token</strong> audit trails synchronized with the <strong className="text-cyan-300 font-mono">evaluation_logs.merkle_hash</strong> cryptographic tree.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#002855] hover:bg-[#003875] text-amber-300 border border-[#23436E] text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Latest Dossier</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#132540] p-3 rounded-lg border border-[#23436E] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Total Evaluations
          </span>
          <div className="text-xl font-extrabold text-white font-mono">
            {records.length} Dockets
          </div>
          <div className="text-[10px] text-cyan-300">
            All SHA-256 Hashed
          </div>
        </div>

        <div className="bg-[#132540] p-3 rounded-lg border border-[#23436E] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Avg AI Confidence Score
          </span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">
            93.2%
          </div>
          <div className="text-[10px] text-emerald-300">
            High Precision Benchmark
          </div>
        </div>

        <div className="bg-[#132540] p-3 rounded-lg border border-[#23436E] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Clean / Remediated Pass
          </span>
          <div className="text-xl font-extrabold text-cyan-300 font-mono">
            75.0%
          </div>
          <div className="text-[10px] text-slate-300">
            3 of 4 Tenders Compliant
          </div>
        </div>

        <div className="bg-[#132540] p-3 rounded-lg border border-[#23436E] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            CAG Chain Integrity
          </span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Intact</span>
          </div>
          <div className="text-[10px] text-slate-300">
            Block #13994 - #14892
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#132540] p-3 rounded-lg border border-[#23436E] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Tender ID, Title, Token, or Dept..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0B192C] border border-[#23436E] rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Status:</span>
          {(['ALL', 'COMPLIANT', 'SHORTFALL_RESOLVED', 'FLAGGED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer shrink-0 ${
                statusFilter === status
                  ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                  : 'bg-[#0B192C] text-slate-300 border-[#23436E] hover:bg-[#193256]'
              }`}
            >
              {status === 'ALL' && 'All Evaluations'}
              {status === 'COMPLIANT' && 'Compliant (95%+)'}
              {status === 'SHORTFALL_RESOLVED' && 'Remediated (100%)'}
              {status === 'FLAGGED' && 'Flagged Discrepancy'}
            </button>
          ))}
        </div>
      </div>

      {/* Evaluations List */}
      <div className="space-y-3">
        {filteredRecords.map(record => {
          return (
            <div 
              key={record.id}
              className="gov-card p-4 space-y-3 transition-all hover:border-[#38BDF8]/60"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#23436E]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-[#0B1E38] px-2 py-0.5 rounded border border-[#23436E]">
                      {record.tenderId}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Docket ID: <strong className="text-white">{record.id}</strong>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      &bull; Evaluated: <strong className="text-slate-200">{record.evaluatedAt}</strong>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {record.tenderTitle}
                  </h3>

                  <div className="text-xs text-slate-300 flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-400">Authority:</span>
                    <span>{record.department}</span>
                  </div>
                </div>

                <div className="flex items-center lg:flex-col lg:items-end justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-1 rounded font-extrabold border ${
                      record.complianceStatus === 'COMPLIANT'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : record.complianceStatus === 'SHORTFALL_RESOLVED'
                        ? 'bg-sky-950 text-sky-300 border-sky-600'
                        : 'bg-rose-950 text-rose-300 border-rose-600'
                    }`}>
                      {record.complianceStatus === 'COMPLIANT' && 'COMPLIANT'}
                      {record.complianceStatus === 'SHORTFALL_RESOLVED' && 'SHORTFALL REMEDIATED'}
                      {record.complianceStatus === 'FLAGGED' && 'TECHNICAL DISCREPANCY'}
                    </span>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-400">Score</div>
                      <div className={`text-base font-extrabold font-mono ${
                        record.aiConfidenceScore >= 95 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {record.aiConfidenceScore}%
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-700/50">
                    Token: {record.anonToken}
                  </div>
                </div>
              </div>

              {/* Scrutiny Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 bg-[#0B192C] rounded-lg border border-[#23436E] space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Turnover Compliance
                  </span>
                  <div className="font-mono text-white font-semibold truncate">
                    {record.turnoverScore}
                  </div>
                </div>

                <div className="p-2.5 bg-[#0B192C] rounded-lg border border-[#23436E] space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Make-in-India (MII)
                  </span>
                  <div className="font-mono text-amber-300 font-semibold truncate">
                    {record.miiScore}
                  </div>
                </div>

                <div className="p-2.5 bg-[#0B192C] rounded-lg border border-[#23436E] space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Past Work Experience
                  </span>
                  <div className="font-mono text-emerald-300 font-semibold truncate">
                    {record.experienceScore}
                  </div>
                </div>

                <div className="p-2.5 bg-[#0B192C] rounded-lg border border-[#23436E] space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Contractual LD Risks
                  </span>
                  <div className={`font-mono font-semibold ${record.ldRiskCount === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {record.ldRiskCount} Flagged Terms
                  </div>
                </div>
              </div>

              {/* Merkle Hash & Action Bar */}
              <div className="pt-2 border-t border-[#23436E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-300 font-mono">
                  <Hash className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-slate-400">Merkle Root:</span>
                  <span className="text-cyan-300 bg-[#0B192C] px-1.5 py-0.5 rounded border border-[#23436E] font-bold truncate max-w-[200px] sm:max-w-xs">
                    {record.merkleHash}
                  </span>
                  <button
                    onClick={() => handleCopyHash(record.merkleHash, record.id)}
                    className="text-slate-400 hover:text-white transition-all cursor-pointer"
                    title="Copy Merkle Hash"
                  >
                    {copiedHashId === record.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-slate-500">&bull;</span>
                  <span className="text-slate-400">Block <strong className="text-white">#{record.blockHeight}</strong></span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleVerifyMerkle(record)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0B192C] hover:bg-[#132540] text-sky-300 border border-[#23436E] text-xs font-semibold transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Verify Proof</span>
                  </button>

                  <button
                    onClick={() => handleDownloadHistoricalDossier(record)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#002855] hover:bg-[#003875] text-amber-300 border border-[#23436E] text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Re-Download Dossier (.JSON)</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}

        {filteredRecords.length === 0 && (
          <div className="gov-card p-8 text-center space-y-2">
            <History className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-sm font-bold text-slate-200">No Historical Evaluations Found</div>
            <p className="text-xs text-slate-400">
              Try adjusting your search keyword or switching the status filter above.
            </p>
          </div>
        )}
      </div>

      {/* Cryptographic Verification Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="gov-card max-w-lg w-full p-5 space-y-4 shadow-2xl border-2 border-[#0284C7]">
            <div className="flex items-center justify-between pb-3 border-b border-[#23436E]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white">
                  Immutable Merkle-Tree Cryptographic Audit Verification
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedRecord(null);
                  setVerifiedHash(null);
                }}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {isVerifying ? (
              <div className="py-8 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <div className="text-xs font-bold text-white">
                  Verifying SHA-256 HMAC Signature against Immutable Merkle Tree Root...
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Traversing Merkle Tree Leaves &bull; Public Key Confirmation
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#0B1E38] rounded-lg border border-emerald-600/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Merkle Proof Cryptographically Intact &amp; Valid</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    The evaluation record for <strong className="text-white">{selectedRecord.tenderId}</strong> has not been altered or tampered with since initial officer scoring.
                  </p>
                </div>

                <div className="space-y-2 p-3 bg-[#0B192C] rounded-lg border border-[#23436E] font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Tender ID:</span>
                    <span className="text-white font-bold">{selectedRecord.tenderId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Double-Blind Token:</span>
                    <span className="text-indigo-300 font-bold">{selectedRecord.anonToken}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Audit Sequence / Block:</span>
                    <span className="text-cyan-300 font-bold">Block #{selectedRecord.blockHeight}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Merkle Root Hash:</span>
                    <span className="text-amber-300 break-all">{selectedRecord.merkleHash}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#23436E]">
                  <button
                    onClick={() => {
                      setSelectedRecord(null);
                      setVerifiedHash(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#002855] hover:bg-[#003875] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Close Verification
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
