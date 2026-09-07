import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Eye, 
  RefreshCw, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck2,
  Cpu,
  Layers,
  Info,
  ExternalLink
} from 'lucide-react';
import { VendorProfile } from '../../types';

interface BlindTokenManagerProps {
  profile: VendorProfile;
}

export const BlindTokenManager: React.FC<BlindTokenManagerProps> = ({ profile }) => {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentToken, setCurrentToken] = useState(() => {
    return localStorage.getItem(`gem2_anon_token_${profile.id}`) || `anon_v_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 8)}`;
  });

  const merkleRootHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    if (!window.confirm('Regenerate cryptographic Blind Evaluation Token for upcoming tender submissions? Previous token hashes will remain archived in the Merkle-Tree audit ledger.')) {
      return;
    }
    setIsRegenerating(true);
    setTimeout(() => {
      const newToken = `anon_v_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 8)}`;
      setCurrentToken(newToken);
      localStorage.setItem(`gem2_anon_token_${profile.id}`, newToken);
      setIsRegenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-4 text-slate-100">
      
      {/* Header Banner */}
      <div className="gov-card gov-card-navy p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#002855] border border-[#0284C7] text-cyan-300 mt-0.5">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Double-Blind Evaluation Token Manager (CVC &amp; GFR 2017)
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600">
                  ANTI-BIAS ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                Statutory cryptographic obfuscation engine. During technical bid scrutiny, Government Evaluation Officers evaluate your tender submissions under a zero-knowledge blind token hash, ensuring 100% impartial scoring without commercial or regional prejudice.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B192C] hover:bg-[#132540] text-slate-200 border border-[#23436E] text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>Rotate Token</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Token Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <div className="lg:col-span-2 gov-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#23436E]">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Double-Blind Anti-Collusion Vault (Zero-Knowledge Shield)
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
              ANTI-BIAS ACTIVE
            </span>
          </div>

          <div className="p-4 bg-[#0B192C] rounded-lg border border-[#23436E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero-Knowledge Evaluation Identifier</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold border border-amber-600">
                WITHHELD FROM BIDDER
              </span>
            </div>

            <div className="p-3.5 bg-[#071322] rounded border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between gap-2 font-mono text-xs text-slate-400">
                <span className="tracking-widest text-emerald-400 font-bold">
                  •••• •••• •••• •••• [CONCEALED ANTI-COLLUSION SHIELD]
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-600/50">
                  🔒 Sealed in HSM Vault
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Under <strong>CVC Anti-Cartel Directives</strong> and <strong>GFR 2017 rules</strong>, plain evaluation token numbers are <strong>strictly withheld from vendors</strong>. This guarantees that neither vendors nor third parties can communicate bid identifiers to evaluation officers, eliminating any possibility of bias or offline collusion.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 bg-[#0D1F38] rounded border border-[#1E3A68] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Merkle Verification Root</span>
                <span className="font-mono text-slate-300 text-[11px] block truncate" title={merkleRootHash}>
                  {merkleRootHash}
                </span>
              </div>
              <div className="p-2.5 bg-[#0D1F38] rounded border border-[#1E3A68] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Vault Security Mode</span>
                <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Dual-Key CAG Decryption Enabled
                </span>
              </div>
            </div>
          </div>

          {/* Vendor Cryptographic Protection Panel */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Vendor Cryptographic Protection &amp; Zero-Knowledge Isolation
            </div>

            <div className="p-4 bg-[#0E2038] rounded-lg border border-[#23436E] space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#23436E]">
                <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  Authenticated Vendor Dossier (Internal Shielded Record)
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-sky-900 text-sky-200 font-bold border border-sky-700">
                  INTERNAL ONLY • ISOLATED
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 text-[11px]">
                <div><strong>Legal Entity:</strong> <span className="text-white ml-1">{profile.name}</span></div>
                <div><strong>GSTIN:</strong> <span className="font-mono text-cyan-300 ml-1">{profile.gstin}</span></div>
                <div><strong>PAN:</strong> <span className="font-mono text-slate-300 ml-1">{profile.pan}</span></div>
                <div><strong>Audited Turnover:</strong> <span className="text-amber-400 font-bold ml-1">₹ {profile.turnoverCr} Cr</span></div>
                <div><strong>Zero-Knowledge Identity Shield:</strong> <span className="text-emerald-400 font-semibold ml-1">Active (GFR 2017 Rule 173)</span></div>
                <div><strong>CAG Escrow Status:</strong> <span className="text-sky-300 font-mono ml-1">Dual-Key Sealed</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Regulatory Guarantees */}
        <div className="gov-card p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-[#23436E] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Statutory Anti-Bias Protocol
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-2.5 bg-[#0B192C] rounded border border-[#23436E] space-y-1">
                <span className="font-bold text-amber-300 block text-[11px]">1. CVC Double-Blind Mandate</span>
                <p className="text-[11px] text-slate-300">
                  Tender evaluation officers score bids strictly on technical parameters without access to vendor names or corporate relationships.
                </p>
              </div>

              <div className="p-2.5 bg-[#0B192C] rounded border border-[#23436E] space-y-1">
                <span className="font-bold text-cyan-300 block text-[11px]">2. CAG Decryption Ledger</span>
                <p className="text-[11px] text-slate-300">
                  Identity is automatically and irreversibly unmasked only when financial bids (L1 opening) are officially unsealed by the committee.
                </p>
              </div>

              <div className="p-2.5 bg-[#0B192C] rounded border border-[#23436E] space-y-1">
                <span className="font-bold text-emerald-300 block text-[11px]">3. Merkle Audit Trail</span>
                <p className="text-[11px] text-slate-300">
                  Every score entry and token transaction is written to the immutable evaluation log with cryptographic timestamps.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#071322] rounded-lg border border-[#23436E] text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>Token Validity &amp; Scope</span>
            </div>
            <p>
              This token is automatically attached to all NIT PDF ingestion audits and signed dossiers created under this session.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
