import React, { useState } from 'react';
import { Download, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';
import { Tender, MaskedSubmission, AuditLedgerBlock } from '../../types/procurement';
import { exportCAGComplianceDossier } from '../../services/cryptoEngine';

interface CAGExportModalProps {
  tender: Tender;
  submissions: MaskedSubmission[];
  ledgerBlocks: AuditLedgerBlock[];
  onClose: () => void;
}

export const CAGExportModal: React.FC<CAGExportModalProps> = ({
  tender,
  submissions,
  ledgerBlocks,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const { cagPackageJson, filename } = exportCAGComplianceDossier(
    tender,
    submissions,
    ledgerBlocks
  );

  const handleDownload = () => {
    const blob = new Blob([cagPackageJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cagPackageJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="#15803d" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                CAG Audit Trail File Export
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Compliant with Comptroller and Auditor General (CAG) & GFR 2017 Audit Directives
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm">✕</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '10px 0' }}>
          
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#15803d" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#166534' }}>
                Official Audit Trail Formatted & Non-Repudiation Verified
              </span>
            </div>
            <span className="badge badge-success">READY FOR AUDIT</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Included Compliance Records:
            </h4>
            <ul style={{ fontSize: '0.775rem', color: '#334155', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Tender & PQC Rulebook:</strong> Locked criteria, budgets, and evaluation weights.</li>
              <li><strong>Zero-Bias Masking Records:</strong> Anonymized IDs with sealed company names.</li>
              <li><strong>Government Database Verification:</strong> Raw responses from GST, EPFO, MCA, and MSME.</li>
              <li><strong>Make in India Local Content:</strong> Domestic supplier calculations and declared BoM.</li>
              <li><strong>Permanent Officer Audit Log:</strong> Time-stamped decisions signed with Digital Signature.</li>
            </ul>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Audit Log Preview:</span>
              <button onClick={handleCopy} className="btn btn-outline btn-sm" style={{ padding: '3px 8px', fontSize: '0.7rem' }}>
                {copied ? <Check size={11} color="#15803d" /> : <Copy size={11} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '10px 12px',
              fontSize: '0.7rem',
              color: '#0f172a',
              maxHeight: '130px',
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)'
            }}>
              {cagPackageJson.slice(0, 1000)}...
            </pre>
          </div>

        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={handleDownload} className="btn btn-primary">
            <Download size={14} />
            <span>Download Official File (.json)</span>
          </button>
        </div>

      </div>
    </div>
  );
};