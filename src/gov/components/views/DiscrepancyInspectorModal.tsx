import React, { useState } from 'react';
import { 
  FileSearch, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ShieldAlert, 
  ExternalLink,
  ArrowRightLeft,
  Info
} from 'lucide-react';
import { MaskedSubmission } from '../../types/procurement';

interface DiscrepancyInspectorModalProps {
  submission: MaskedSubmission;
  onClose: () => void;
}

export const DiscrepancyInspectorModal: React.FC<DiscrepancyInspectorModalProps> = ({
  submission,
  onClose,
}) => {
  const [selectedDiscrepancyId, setSelectedDiscrepancyId] = useState<string>(
    submission.aiScorecard.discrepancies.length > 0 
      ? submission.aiScorecard.discrepancies[0].id 
      : 'ALL'
  );

  const discrepancies = submission.aiScorecard.discrepancies;
  const activeDiscrepancy = discrepancies.find(d => d.id === selectedDiscrepancyId) || discrepancies[0];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="badge badge-danger">CRITICAL MISMATCH</span>;
      case 'HIGH':
        return <span className="badge badge-saffron">HIGH PRIORITY CHECK</span>;
      case 'MEDIUM':
        return <span className="badge badge-warning">REVISE CAREFULLY</span>;
      default:
        return <span className="badge badge-info">OBSERVATION</span>;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '1050px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              background: '#f3e8ff',
              border: '1px solid #e9d5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileSearch size={20} color="#7e22ce" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Document Verification & Mismatch Checker
                </h3>
                <span className="badge badge-purple">Automatic Check</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Side-by-side comparison of bidder's uploaded documents against official government records
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm">✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Bidder Code:</span>
                <div style={{ fontWeight: 800, color: '#005691', fontFamily: 'var(--font-mono)' }}>
                  {submission.maskedVendorId}
                </div>
              </div>
              <div style={{ height: '24px', width: '1px', background: '#cbd5e1' }} />
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Document Match Accuracy:</span>
                <div style={{ fontWeight: 700, color: '#15803d' }}>
                  {submission.aiScorecard.confidenceRate}% Verified
                </div>
              </div>
              <div style={{ height: '24px', width: '1px', background: '#cbd5e1' }} />
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Differences Found:</span>
                <div style={{ fontWeight: 700, color: discrepancies.length > 0 ? '#dc2626' : '#15803d' }}>
                  {discrepancies.length} Mismatch Item(s)
                </div>
              </div>
            </div>

            {discrepancies.length > 0 && (
              <div style={{ display: 'flex', gap: '6px' }}>
                {discrepancies.map((d, index) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDiscrepancyId(d.id)}
                    className="btn btn-sm"
                    style={{
                      background: selectedDiscrepancyId === d.id ? '#0c2340' : '#ffffff',
                      color: selectedDiscrepancyId === d.id ? '#ffffff' : '#334155',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.725rem'
                    }}
                  >
                    Mismatch #{index + 1}: {d.docParameter.slice(0, 16)}...
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeDiscrepancy ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '14px' }}>
              
              <div className="card" style={{ padding: '14px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={15} color="#005691" />
                    <span style={{ fontWeight: 700, fontSize: '0.825rem', color: '#0f172a' }}>
                      Bidder Uploaded Document (Page {activeDiscrepancy.pageNumber})
                    </span>
                  </div>
                  <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                    {activeDiscrepancy.docName}
                  </span>
                </div>

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '12px',
                  fontSize: '0.775rem',
                  lineHeight: '1.5',
                  color: '#334155'
                }}>
                  <div style={{ fontSize: '0.675rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                    [Extracted from Bidder File: {activeDiscrepancy.docName}]
                  </div>

                  <p style={{ margin: '0 0 8px 0' }}>
                    "...This is to certify that the accounts of the bidder have been audited for the previous financial years..."
                  </p>

                  <div style={{
                    background: '#fee2e2',
                    borderLeft: '4px solid #dc2626',
                    padding: '8px 10px',
                    margin: '6px 0',
                    color: '#991b1b',
                    borderRadius: '0 4px 4px 0',
                    fontWeight: 500
                  }}>
                    <span style={{ fontWeight: 700 }}>Highlighted Text: </span>
                    "{activeDiscrepancy.citationSnippet}"
                  </div>
                </div>

                <div style={{ background: '#f0fdf4', padding: '8px 12px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '0.675rem', color: '#166534' }}>
                    Value Claimed by Bidder:
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#15803d', marginTop: '2px' }}>
                    {activeDiscrepancy.declaredValue}
                  </div>
                </div>

              </div>

              <div className="card" style={{ padding: '14px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ArrowRightLeft size={15} color="#7e22ce" />
                    <span style={{ fontWeight: 700, fontSize: '0.825rem', color: '#0f172a' }}>
                      Official Government Record Value
                    </span>
                  </div>
                  {getSeverityBadge(activeDiscrepancy.severity)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Requirement:</span>
                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0f172a' }}>{activeDiscrepancy.docParameter}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: '#f3e8ff', borderRadius: '4px', border: '1px solid #e9d5ff' }}>
                    <span style={{ fontSize: '0.725rem', color: '#6b21a8' }}>Scanned Document Number:</span>
                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#581c87' }}>{activeDiscrepancy.llama3ExtractedValue}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: '#fee2e2', borderRadius: '4px', border: '1px solid #fecaca' }}>
                    <span style={{ fontSize: '0.725rem', color: '#991b1b' }}>Official Income Tax / GST Record:</span>
                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#7f1d1d' }}>{activeDiscrepancy.registryValue}</span>
                  </div>
                </div>

                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', padding: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#92400e', fontWeight: 700, fontSize: '0.75rem', marginBottom: '2px' }}>
                    <AlertTriangle size={14} />
                    <span>Why This Was Flagged:</span>
                  </div>
                  <p style={{ fontSize: '0.725rem', color: '#78350f', lineHeight: '1.4', margin: 0 }}>
                    {activeDiscrepancy.explanation}
                  </p>
                </div>

              </div>

            </div>
          ) : (
            <div className="card" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={26} color="#15803d" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                No Document Differences Found
              </h3>
              <p style={{ fontSize: '0.775rem', color: '#64748b' }}>
                All figures in the bidder's uploaded documents match 100% with the official records from the Income Tax Department and GST Network.
              </p>
            </div>
          )}

        </div>

        <div className="modal-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.725rem', color: '#64748b' }}>
            <Info size={13} color="#005691" />
            <span>This verification report is automatically saved to the official tender audit file.</span>
          </div>

          <button onClick={onClose} className="btn btn-primary">
            <span>Close Review</span>
          </button>
        </div>

      </div>
    </div>
  );
};