import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  FileText, 
  Building2, 
  Landmark, 
  Scale, 
  Award, 
  RefreshCw, 
  Eye, 
  Lock, 
  FileCheck2, 
  Sparkles,
  Search,
  X
} from 'lucide-react';
import { DigiLockerDocument, VendorProfile } from '../../types';
import { mockDigiLockerDocs } from '../../data/mockData';

interface DigiLockerVaultViewProps {
  profile: VendorProfile;
  onOpenDigiLockerModal: () => void;
  onOpenReportModal?: () => void;
}

export const DigiLockerVaultView: React.FC<DigiLockerVaultViewProps> = ({
  profile,
  onOpenDigiLockerModal,
  onOpenReportModal
}) => {
  const [documents, setDocuments] = useState<DigiLockerDocument[]>(mockDigiLockerDocs);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'TAX_CORP' | 'MSME_QUALITY' | 'FINANCIAL_WORKS' | 'IDENTITY'>('ALL');
  const [inspectingDoc, setInspectingDoc] = useState<DigiLockerDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* DigiLocker Sovereign Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#002855] text-white flex items-center justify-center p-2.5 shrink-0 shadow-md">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/2/23/DigiLocker_logo.png" 
                alt="DigiLocker Logo"
                className="w-full h-full object-contain brightness-0 invert"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-extrabold text-sm">DL</span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                  ● DIGILOCKER GATEWAY CONNECTED
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Issuer URI: <strong className="text-slate-800">in.gov.digilocker</strong>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                DigiLocker Sovereign GFR Document Vault
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Direct statutory bridge fetching authentic, digitally signed certificates from GSTN, Income Tax Dept (CBDT), Ministry of MSME, Ministry of Corporate Affairs (MCA-21), and CPWD.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end flex-wrap">
            <button
              onClick={onOpenDigiLockerModal}
              className="px-4 py-2.5 bg-[#002855] hover:bg-[#003875] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Fetch New Documents</span>
            </button>

            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-sky-700" />
                <span>Export GFR Dossier</span>
              </button>
            )}
          </div>

        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Verified Certificates</span>
            <span className="text-lg font-extrabold text-slate-900 font-mono mt-0.5 block">{documents.length} Records</span>
            <span className="text-[10px] text-emerald-700 font-semibold">100% PKI Authenticated</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Linked PAN / Entity</span>
            <span className="text-lg font-extrabold text-slate-900 font-mono mt-0.5 block">{profile.pan}</span>
            <span className="text-[10px] text-slate-500">CBDT Direct Link</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">MSME Udyam Verified</span>
            <span className="text-lg font-extrabold text-slate-900 font-mono mt-0.5 block">ACTIVE</span>
            <span className="text-[10px] text-amber-700 font-semibold">100% EMD Exemption Valid</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Audit Ready State</span>
            <span className="text-lg font-extrabold text-emerald-700 font-mono mt-0.5 block">CAG COMPLIANT</span>
            <span className="text-[10px] text-slate-500">SHA-256 Merkle Chained</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-thin">
          {[
            { id: 'ALL', label: 'All Certificates', count: documents.length },
            { id: 'TAX_CORP', label: 'Tax & Corporate', count: documents.filter(d => d.category === 'TAX_CORP').length },
            { id: 'MSME_QUALITY', label: 'MSME & Quality', count: documents.filter(d => d.category === 'MSME_QUALITY').length },
            { id: 'FINANCIAL_WORKS', label: 'Financial & CPWD', count: documents.filter(d => d.category === 'FINANCIAL_WORKS').length },
            { id: 'IDENTITY', label: 'e-KYC & Signatory', count: documents.filter(d => d.category === 'IDENTITY').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                selectedCategory === tab.id
                  ? 'bg-[#002855] text-white border-[#002855] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-semibold shrink-0">
          Showing {filteredDocs.length} of {documents.length} verified dockets
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 p-4.5 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {doc.issuerOrgId}
                </span>
                <span className="badge badge-success text-[10px] font-bold">
                  ● {doc.xmlSignatureStatus}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                {doc.title}
              </h3>

              <div className="text-[11px] text-slate-500 mb-3">
                Issuer: <strong className="text-slate-800">{doc.issuer}</strong>
              </div>

              {/* Certificate Metadata Card */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-[11px] font-mono text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Doc Number:</span>
                  <strong className="text-slate-900">{doc.docNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issue Date:</span>
                  <span>{doc.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Validity:</span>
                  <span className="font-semibold text-emerald-700">{doc.validUntil || 'VALID'}</span>
                </div>
              </div>

              {/* Extracted Key Parameters */}
              <div className="mt-3 pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                {Object.entries(doc.extractedData).slice(0, 2).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-[11px]">
                    <span className="capitalize text-slate-500">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <strong className="text-slate-800 truncate max-w-[150px]">{String(val)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setInspectingDoc(doc)}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300"
              >
                <Eye className="w-3.5 h-3.5 text-sky-700" />
                <span>View Certificate</span>
              </button>

              <button
                onClick={() => alert(`Certificate ${doc.docNumber} downloaded from DigiLocker Sovereign Cache.`)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                title="Download Authenticated PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Inspector Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div 
            className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tiranga Top */}
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)' }} />

            {/* Header */}
            <div className="bg-[#002855] text-white p-4 sm:p-5 flex items-center justify-between border-b border-sky-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    DigiLocker Authenticated Record
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 leading-tight">
                    {inspectingDoc.title}
                  </h3>
                </div>
              </div>

              <button 
                onClick={() => setInspectingDoc(null)}
                className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Body with Sovereign Watermark */}
            <div className="p-6 overflow-y-auto bg-slate-50 space-y-4 text-xs">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-xs relative overflow-hidden">
                <div className="text-center pb-3 border-b border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Government of India</span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">{inspectingDoc.issuer}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Issuer ID: {inspectingDoc.issuerOrgId}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Document Number:</span>
                    <strong className="text-slate-900 text-xs">{inspectingDoc.docNumber}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Date of Issue:</span>
                    <strong className="text-slate-900 text-xs">{inspectingDoc.issueDate}</strong>
                  </div>
                </div>

                {/* Extracted Certificate Key-Value Fields */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
                    Verified Certificate Data
                  </div>
                  {Object.entries(inspectingDoc.extractedData).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-1 border-b border-slate-50 text-xs">
                      <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                      <strong className="text-slate-900 font-mono">{String(v)}</strong>
                    </div>
                  ))}
                </div>

                {/* Digital Signature Stamp */}
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-950 text-xs block">
                      PKI Digital Signature Cryptographically Validated
                    </span>
                    <p className="text-[11px] text-emerald-800 font-mono mt-0.5">
                      Signer: {inspectingDoc.digitalSigner}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-mono mt-0.5 truncate">
                      SHA256: {inspectingDoc.sha256Hash}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">DigiLocker URI: {inspectingDoc.uri}</span>
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors border-none cursor-pointer"
              >
                Close Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
