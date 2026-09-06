import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  X,
  RefreshCw,
  Award,
  BellRing
} from 'lucide-react';
import { VendorProfile } from '../../types';

interface DocumentExpiryItem {
  id: string;
  name: string;
  type: string;
  docNumber: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'CRITICAL' | 'EXPIRING_SOON' | 'VALID';
  issuingAuthority: string;
  gfrImpact: string;
}

interface DocumentExpiryAlertsProps {
  profile: VendorProfile;
  onOpenProfile?: () => void;
}

export const DocumentExpiryAlerts: React.FC<DocumentExpiryAlertsProps> = ({ profile, onOpenProfile }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [uploadModalDoc, setUploadModalDoc] = useState<DocumentExpiryItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [docs, setDocs] = useState<DocumentExpiryItem[]>([
    {
      id: 'DOC-UDIN-01',
      name: 'CA Audited Turnover & Net Worth Certificate',
      type: 'CA_UDIN',
      docNumber: 'UDIN-2026-CA-992144',
      expiryDate: '17-Sep-2026',
      daysRemaining: 12,
      status: 'CRITICAL',
      issuingAuthority: 'Institute of Chartered Accountants of India (ICAI)',
      gfrImpact: 'Mandatory for PQC turnover validation under GFR Rule 173'
    },
    {
      id: 'DOC-NOC-02',
      name: 'State Pollution Control Board Factory Consent (SPCB NOC)',
      type: 'ENVIRONMENTAL_NOC',
      docNumber: 'SPCB-NOC-2025-019',
      expiryDate: '13-Sep-2026',
      daysRemaining: 8,
      status: 'CRITICAL',
      issuingAuthority: 'State Pollution Control Board / MoEFCC',
      gfrImpact: 'Pre-requisite for technical works and manufacturing bids'
    },
    {
      id: 'DOC-UDYAM-03',
      name: 'MSME Udyam Registration & Enterprise Certificate',
      type: 'UDYAM',
      docNumber: profile.udyamNumber || 'UDYAM-DL-03-0098412',
      expiryDate: '20-Oct-2026',
      daysRemaining: 45,
      status: 'EXPIRING_SOON',
      issuingAuthority: 'Ministry of Micro, Small and Medium Enterprises',
      gfrImpact: 'Required for GFR Rule 170 EMD waivers and 25% procurement quota'
    },
    {
      id: 'DOC-ISO-04',
      name: 'ISO 9001:2015 Quality Management System Certification',
      type: 'ISO_QMS',
      docNumber: 'QMS-IND-2023-884',
      expiryDate: '24-Dec-2026',
      daysRemaining: 110,
      status: 'VALID',
      issuingAuthority: 'National Accreditation Board for Certification Bodies (NABCB)',
      gfrImpact: 'Technical qualification requirement for high-value tenders'
    },
    {
      id: 'DOC-CPWD-05',
      name: 'CPWD Class-I Civil Contractor Enlistment Order',
      type: 'CONTRACTOR_ENLISTMENT',
      docNumber: 'CPWD/EE/2024/9912',
      expiryDate: '03-May-2027',
      daysRemaining: 240,
      status: 'VALID',
      issuingAuthority: 'Central Public Works Department (CPWD HQ)',
      gfrImpact: 'Determines bidding capacity formula multiplier'
    }
  ]);

  const criticalCount = docs.filter(d => d.status === 'CRITICAL').length;
  const expiringSoonCount = docs.filter(d => d.status === 'EXPIRING_SOON').length;

  const handleSimulateRenewal = (doc: DocumentExpiryItem) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setDocs(prev => prev.map(d => {
        if (d.id === doc.id) {
          return {
            ...d,
            expiryDate: '31-Dec-2027',
            daysRemaining: 480,
            status: 'VALID'
          };
        }
        return d;
      }));
      setTimeout(() => {
        setUploadSuccess(false);
        setUploadModalDoc(null);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-3">
      
      {/* Alert Header Banner */}
      <div className={`p-3.5 rounded-lg border transition-all ${
        criticalCount > 0
          ? 'bg-gradient-to-r from-rose-950/70 via-[#220B10] to-[#132540] border-rose-600/70'
          : expiringSoonCount > 0
          ? 'bg-gradient-to-r from-amber-950/70 via-[#1E170A] to-[#132540] border-amber-600/70'
          : 'bg-[#132540] border-[#23436E]'
      }`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${
              criticalCount > 0 ? 'bg-rose-900/60 text-rose-300' : 'bg-amber-900/60 text-amber-300'
            }`}>
              <BellRing className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white">
                  Statutory Document Expiry &amp; Compliance Risk Monitor
                </span>
                {criticalCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-extrabold border border-rose-600">
                    {criticalCount} CRITICAL EXPIRIES (&lt;15 DAYS)
                  </span>
                )}
                {expiringSoonCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-600">
                    {expiringSoonCount} Expiring Soon
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Tracks statutory credentials to prevent automatic technical disqualification during PQC scrutiny under GFR 2017.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0B192C] hover:bg-[#132540] text-slate-300 border border-[#23436E] text-xs font-semibold transition-all cursor-pointer"
            >
              <span>{isExpanded ? 'Collapse' : 'View Certificates'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Alert List */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {docs.map(doc => {
            return (
              <div
                key={doc.id}
                className={`p-3 rounded-lg border transition-all space-y-2 flex flex-col justify-between ${
                  doc.status === 'CRITICAL'
                    ? 'bg-[#180C14] border-rose-600/80 shadow-xs'
                    : doc.status === 'EXPIRING_SOON'
                    ? 'bg-[#18130B] border-amber-600/70 shadow-xs'
                    : 'bg-[#0B192C] border-[#23436E]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold text-slate-300 bg-[#071322] px-1.5 py-0.5 rounded border border-[#23436E]">
                      {doc.docNumber}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold border ${
                      doc.status === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                        : doc.status === 'EXPIRING_SOON'
                        ? 'bg-amber-950 text-amber-300 border-amber-600'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    }`}>
                      {doc.status === 'CRITICAL' && `${doc.daysRemaining} DAYS LEFT`}
                      {doc.status === 'EXPIRING_SOON' && `${doc.daysRemaining} DAYS LEFT`}
                      {doc.status === 'VALID' && 'VALID & ACTIVE'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                    {doc.name}
                  </h4>

                  <div className="text-[10px] text-slate-300 space-y-0.5">
                    <div>
                      <span className="text-slate-400">Valid Until:</span> <strong className="text-cyan-300 font-mono">{doc.expiryDate}</strong>
                    </div>
                    <div className="text-slate-400 line-clamp-1">
                      {doc.issuingAuthority}
                    </div>
                  </div>

                  <div className="p-1.5 bg-[#0B1424] rounded text-[10px] text-slate-300 leading-tight border border-[#1E3A68]">
                    <span className="text-amber-400 font-bold">GFR Rule:</span> {doc.gfrImpact}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#23436E] flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {doc.type}
                  </span>

                  <button
                    onClick={() => setUploadModalDoc(doc)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      doc.status === 'CRITICAL'
                        ? 'bg-rose-700 hover:bg-rose-800 text-white shadow-xs'
                        : doc.status === 'EXPIRING_SOON'
                        ? 'bg-amber-600 hover:bg-amber-700 text-slate-950'
                        : 'bg-[#132540] hover:bg-[#1E3A68] text-sky-300 border border-[#23436E]'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>{doc.status === 'VALID' ? 'Update' : 'Renew Now'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Renewal File Upload Modal */}
      {uploadModalDoc && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="gov-card max-w-md w-full p-5 space-y-4 shadow-2xl border-2 border-cyan-500">
            <div className="flex items-center justify-between pb-3 border-b border-[#23436E]">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-extrabold text-white">
                  Upload Renewed Statutory Certificate
                </h3>
              </div>
              <button
                onClick={() => setUploadModalDoc(null)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#0B192C] rounded-lg border border-[#23436E] space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Target Certificate</div>
                <div className="text-xs font-bold text-white">{uploadModalDoc.name}</div>
                <div className="text-[10px] text-cyan-300 font-mono">ID: {uploadModalDoc.docNumber}</div>
              </div>

              {uploadSuccess ? (
                <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-lg text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-sm font-bold text-white">Certificate Renewed Successfully!</div>
                  <p className="text-xs text-slate-300">
                    Validity extended to 31-Dec-2027. GFR compliance risk resolved.
                  </p>
                </div>
              ) : isUploading ? (
                <div className="p-6 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <div className="text-xs font-bold text-white">Parsing and validating renewed certificate...</div>
                  <div className="text-[10px] text-slate-400 font-mono">Extracting UDIN / QR Signature &amp; Issuance Date</div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-[#23436E] hover:border-cyan-400 rounded-xl p-6 text-center transition-all bg-[#071322]">
                    <FileCheck2 className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-white">Drop renewed PDF or click to browse</div>
                    <div className="text-[10px] text-slate-400 mt-1">Supports digitally signed PDFs up to 25 MB</div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#23436E]">
                    <button
                      onClick={() => setUploadModalDoc(null)}
                      className="px-3 py-1.5 rounded bg-[#0B192C] hover:bg-[#132540] text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSimulateRenewal(uploadModalDoc)}
                      className="px-4 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold cursor-pointer shadow-md"
                    >
                      Confirm &amp; Validate Renewal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
