import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Smartphone, 
  KeyRound, 
  FileCheck, 
  ExternalLink, 
  RefreshCw, 
  Download, 
  AlertTriangle,
  Building2,
  Landmark,
  Scale,
  Award,
  Hash,
  X
} from 'lucide-react';
import { DigiLockerDocument, VendorProfile } from '../../types';
import { mockDigiLockerDocs } from '../../data/mockData';

interface DigiLockerModalProps {
  profile: VendorProfile;
  isOpen: boolean;
  onClose: () => void;
  onDocumentsPulled: (documents: DigiLockerDocument[]) => void;
}

export const DigiLockerModal: React.FC<DigiLockerModalProps> = ({
  profile,
  isOpen,
  onClose,
  onDocumentsPulled
}) => {
  const [authStep, setAuthStep] = useState<'LOGIN' | 'OTP' | 'SELECT_DOCS' | 'PULLING' | 'SUCCESS'>('SELECT_DOCS');
  const [mobileNumber, setMobileNumber] = useState('9810XXXX24');
  const [otpValue, setOtpValue] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(
    mockDigiLockerDocs.map(d => d.id)
  );
  const [pulledDocs, setPulledDocs] = useState<DigiLockerDocument[]>(mockDigiLockerDocs);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'TAX_CORP' | 'MSME_QUALITY' | 'FINANCIAL_WORKS' | 'IDENTITY'>('ALL');
  const [pullProgress, setPullProgress] = useState(0);

  if (!isOpen) return null;

  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === filteredDocs.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(filteredDocs.map(d => d.id));
    }
  };

  const handleStartPull = () => {
    setAuthStep('PULLING');
    setPullProgress(10);

    const interval = setInterval(() => {
      setPullProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setPullProgress(100);
      const newlyPulled = mockDigiLockerDocs
        .filter(d => selectedDocIds.includes(d.id))
        .map(d => ({ ...d, isPulled: true }));
      
      setPulledDocs(newlyPulled);
      onDocumentsPulled(newlyPulled);
      setAuthStep('SUCCESS');
    }, 1200);
  };

  const filteredDocs = activeCategory === 'ALL' 
    ? mockDigiLockerDocs 
    : mockDigiLockerDocs.filter(d => d.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Tiranga Accent */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)' }} />

        {/* Modal Header */}
        <div className="bg-[#002855] text-white p-4 sm:p-5 flex items-center justify-between border-b border-sky-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm shrink-0">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/2/23/DigiLocker_logo.png" 
                alt="DigiLocker Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-[#002855] font-extrabold text-xs">DL</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  National Digital Locker System
                </span>
                <span className="text-[10px] text-sky-200">MeitY &bull; Government of India</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                Direct DigiLocker Sovereign Document Access &bull; GFR Vault
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border-none cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-slate-50 space-y-5">
          
          {/* Status Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Linked Account: {profile.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                    AADHAAR VERIFIED
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  GSTIN: {profile.gstin} &bull; DigiLocker Account ID: DL-IN-88914-VEND
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Security protocol:</span>
              <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                SHA-256 + PKI
              </span>
            </div>
          </div>

          {authStep === 'SELECT_DOCS' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Category Filter Tabs & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                  {[
                    { id: 'ALL', label: 'All Documents', count: mockDigiLockerDocs.length },
                    { id: 'TAX_CORP', label: 'Tax & Corporate', count: mockDigiLockerDocs.filter(d => d.category === 'TAX_CORP').length },
                    { id: 'MSME_QUALITY', label: 'MSME & Quality', count: mockDigiLockerDocs.filter(d => d.category === 'MSME_QUALITY').length },
                    { id: 'FINANCIAL_WORKS', label: 'Financial & Works', count: mockDigiLockerDocs.filter(d => d.category === 'FINANCIAL_WORKS').length },
                    { id: 'IDENTITY', label: 'e-KYC & Signatory', count: mockDigiLockerDocs.filter(d => d.category === 'IDENTITY').length }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                        activeCategory === cat.id
                          ? 'bg-[#002855] text-white border-[#002855]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label} ({cat.count})
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSelectAll}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg cursor-pointer transition-colors shrink-0 shadow-2xs"
                >
                  {selectedDocIds.length === filteredDocs.length ? 'Deselect All' : 'Select All Filtered'}
                </button>
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredDocs.map((doc) => {
                  const isSelected = selectedDocIds.includes(doc.id);

                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleSelectDoc(doc.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-sky-600 ring-2 ring-sky-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectDoc(doc.id)}
                              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {doc.issuerOrgId}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> XML SIGNED
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 leading-snug">
                          {doc.title}
                        </h4>
                        
                        <div className="text-[11px] text-slate-500 mb-2">
                          Issuer: <strong className="text-slate-800">{doc.issuer}</strong>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[10px] space-y-1 font-mono text-slate-600">
                          <div className="flex justify-between">
                            <span>Doc No:</span>
                            <strong className="text-slate-900">{doc.docNumber}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Issued On:</span>
                            <span>{doc.issueDate}</span>
                          </div>
                          <div className="flex justify-between truncate">
                            <span>Digital Signer:</span>
                            <span className="text-sky-800 truncate">{doc.digitalSigner}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-mono text-slate-400">SHA256: {doc.sha256Hash.slice(0, 10)}...</span>
                        <span className="font-semibold text-slate-700">{doc.fileSize}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {authStep === 'PULLING' && (
            <div className="p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Fetching &amp; Authenticating Documents from DigiLocker...
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Verifying PKI digital signatures directly against National Informatics Centre (NIC) and respective Department Certifying Authorities.
              </p>

              <div className="max-w-md mx-auto space-y-1.5 pt-2">
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-[#002855] h-2.5 transition-all duration-300 rounded-full"
                    style={{ width: `${pullProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>{selectedDocIds.length} Certificates Queued</span>
                  <span>{pullProgress}% Completed</span>
                </div>
              </div>
            </div>
          )}

          {authStep === 'SUCCESS' && (
            <div className="p-6 sm:p-8 bg-white rounded-2xl border border-emerald-200 space-y-5 animate-fadeIn">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-300">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950">
                    {selectedDocIds.length} Verified Documents Successfully Pulled &amp; Linked to GFR Vault
                  </h4>
                  <p className="text-xs text-emerald-800">
                    All statutory certificates are cryptographically bound to your vendor PAN and available for instant 1-click bid submissions.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="gov-table text-xs">
                  <thead>
                    <tr>
                      <th>Document Title</th>
                      <th>Issuer Authority</th>
                      <th>Document Number</th>
                      <th>Verification Seal</th>
                      <th>Vault Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pulledDocs.map((doc) => (
                      <tr key={doc.id}>
                        <td className="font-semibold text-slate-900">{doc.title}</td>
                        <td className="text-slate-600">{doc.issuer}</td>
                        <td className="font-mono text-slate-800 font-bold">{doc.docNumber}</td>
                        <td>
                          <span className="badge badge-success text-[10px]">
                            {doc.xmlSignatureStatus} &bull; PKI
                          </span>
                        </td>
                        <td className="font-mono text-emerald-700 font-bold">READY IN VAULT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-200 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>MeitY DigiLocker Sovereign Gateway Active</span>
          </div>

          <div className="flex items-center gap-2">
            {authStep === 'SELECT_DOCS' && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors border border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartPull}
                  disabled={selectedDocIds.length === 0}
                  className="px-5 py-2 bg-[#002855] hover:bg-[#003875] disabled:opacity-50 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Pull {selectedDocIds.length} Verified Documents</span>
                </button>
              </>
            )}

            {authStep === 'SUCCESS' && (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Done &bull; View In GFR Vault</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
