import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  UploadCloud, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Layers, 
  RefreshCw,
  FileSpreadsheet,
  Download,
  FileCode,
  Hash,
  Clock
} from 'lucide-react';
import { OcrDocument, VendorProfile } from '../../types';
import { api } from '../../services/api';

interface OcrScannerViewProps {
  profile?: VendorProfile;
}

export const OcrScannerView: React.FC<OcrScannerViewProps> = ({ profile }) => {
  const [documents, setDocuments] = useState<OcrDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<OcrDocument | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await api.getDocuments(profile?.id);
      setDocuments(data);
      if (data.length > 0) {
        setSelectedDoc(data[0]);
      } else {
        setSelectedDoc(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [profile?.id]);

  const handleSimulateUpload = (docType: string) => {
    setIsScanning(true);
    setUploadProgress(25);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(async () => {
      clearInterval(interval);
      setUploadProgress(100);

      const newDoc: OcrDocument = {
        id: `DOC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: `${docType} Specification Docket`,
        type: 'PQC_EXPERIENCE',
        fileName: `${docType}_GeM_NIT_Specification.pdf`,
        uploadDate: 'Just now',
        fileSize: '4.8 MB',
        status: 'VERIFIED',
        confidence: 99.2,
        extractedFields: [
          { label: 'Tender Bid Number', value: `GEM/2026/B/${Math.floor(1000000 + Math.random() * 9000000)}`, confidence: 99.8, verified: true },
          { label: 'Estimated Value', value: '₹ 12.50 Crores', confidence: 99.5, verified: true },
          { label: 'EMD Amount', value: '₹ 2,50,000 (Exempt for MSE)', confidence: 99.2, verified: true },
          { label: 'Make in India Local Content', value: '50% (Class-I Local)', confidence: 99.6, verified: true }
        ],
        parsedSummary: 'Verified public procurement tender specification. All GFR 2017 Pre-Qualification and MII parameters parsed successfully with zero discrepancies.'
      };

      setDocuments(prev => [newDoc, ...prev]);
      setSelectedDoc(newDoc);
      setIsScanning(false);
      setUploadProgress(0);
    }, 900);
  };

  return (
    <div className="space-y-4">
      
      <div className="gov-card gov-card-navy p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#00244D] border border-[#1E3A68] text-cyan-400 mt-0.5">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-100">
                  Automated Tender Document Scrutiny & Ingestion Docket
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
                  NIC-OCR Engine v4.2
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Automated optical character recognition (OCR) and parameter parsing for Notice Inviting Tenders (NIT), Schedule of Requirements, and Special Terms & Conditions (STC).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSimulateUpload('Tender_NIT')}
              disabled={isScanning}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#E65100] hover:bg-[#C2410C] text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{isScanning ? `Scrutinizing... ${uploadProgress}%` : 'Ingest Tender PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {isScanning && (
        <div className="gov-card p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              Ingesting & Parsing Bid Clauses (PDF & OCR)...
            </span>
            <span className="font-mono text-cyan-400">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-[#051124] h-2 rounded overflow-hidden border border-[#1E3A68]">
            <div 
              className="bg-gradient-to-r from-[#0284C7] to-[#138808] h-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              Scrutinized Tender Dockets ({documents.length})
            </span>
            <button 
              onClick={loadDocuments} 
              className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="space-y-2">
            {documents.map(doc => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0F2548] border-[#0284C7] shadow-xs'
                      : 'bg-[#0C1A30] border-[#1E3A68] hover:bg-[#0E203B]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-amber-400 bg-[#001833] px-1.5 py-0.5 rounded border border-[#1E3A68]">
                      {doc.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D] flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {doc.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">
                    {doc.fileName}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#1E3A68]/60 font-mono">
                    <span>{doc.fileSize}</span>
                    <span className="text-cyan-400 font-sans font-semibold">View Docket &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          {selectedDoc ? (
            <div className="gov-card p-4 space-y-4">
              
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1E3A68]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono bg-[#00244D] text-amber-300 px-2 py-0.5 rounded border border-[#1E3A68] font-bold">
                      {selectedDoc.id}
                    </span>
                    <span className="text-xs text-slate-400">
                      Type: {selectedDoc.type} &bull; {selectedDoc.fileSize}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">
                    {selectedDoc.fileName}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] px-2 py-1 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D] block">
                    OCR VERIFIED ({selectedDoc.confidence}%)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    {selectedDoc.uploadDate}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Extracted Mandatory Procurement Parameters:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedDoc.extractedFields.map((field, idx) => (
                    <div key={idx} className="p-2.5 bg-[#091528] rounded border border-[#1E3A68]">
                      <span className="text-[10px] text-slate-400 block">{field.label}</span>
                      <span className="text-xs font-bold text-slate-100 font-mono">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Document Summary & Scrutiny Remarks:
                </span>
                <div className="p-3 bg-[#051124] rounded border border-[#1E3A68] text-xs text-slate-300 font-mono leading-relaxed">
                  {selectedDoc.parsedSummary}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-[#1E3A68]">
                <span>Integrity Hash: <code className="text-slate-300 font-mono">SHA256:7f8a92b...</code></span>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(selectedDoc, null, 2)], { type: 'application/json;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `${selectedDoc.id}_OCR_Extracted.json`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Parsed Text (.JSON)</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="gov-card p-8 text-center text-slate-400 text-xs">
              Select a tender document from the register to view OCR extracted parameters.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};