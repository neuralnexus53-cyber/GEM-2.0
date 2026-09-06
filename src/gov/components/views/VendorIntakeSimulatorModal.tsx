import React, { useState } from 'react';
import { 
  ArrowDownToLine, 
  Building, 
  CheckCircle, 
  ShieldCheck, 
  HelpCircle
} from 'lucide-react';
import { UpstreamIntakeDocket } from '../../types/procurement';
import { UPSTREAM_INTAKE_DOCKETS } from '../../services/mockData';

interface VendorIntakeSimulatorModalProps {
  onClose: () => void;
  onIngestDocket: (docket: UpstreamIntakeDocket) => void;
}

export const VendorIntakeSimulatorModal: React.FC<VendorIntakeSimulatorModalProps> = ({
  onClose,
  onIngestDocket,
}) => {
  const [dockets, setDockets] = useState<UpstreamIntakeDocket[]>(UPSTREAM_INTAKE_DOCKETS);
  const [ingestingId, setIngestingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleIngest = (docket: UpstreamIntakeDocket) => {
    setIngestingId(docket.intakeId);
    
    setTimeout(() => {
      onIngestDocket(docket);
      setIngestingId(null);
      setSuccessId(docket.intakeId);

      setTimeout(() => {
        setDockets(prev => prev.filter(d => d.intakeId !== docket.intakeId));
        setSuccessId(null);
      }, 1200);
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              background: '#e0f2fe',
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowDownToLine size={20} color="#005691" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Receive New Bidder Applications
                </h3>
                <span className="badge badge-info">Live Submissions</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Import submitted bidder applications directly into your officer evaluation desk
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm">✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={18} color="#005691" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.75rem', color: '#334155', lineHeight: '1.4' }}>
              <strong>Automatic Protection:</strong> When you click <strong>"Import Application"</strong>, the portal immediately seals the company name (assigning a private code like <em>VEN-ANON-9041</em>) and runs background checks with GST and the Income Tax portal so you can review without bias.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Applications Ready for Officer Review ({dockets.length})
            </h4>

            {dockets.length === 0 ? (
              <div className="card" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                <CheckCircle size={28} color="#15803d" style={{ margin: '0 auto 8px auto' }} />
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  All Available Applications Have Been Received
                </p>
                <p style={{ fontSize: '0.725rem', marginTop: '2px' }}>
                  All current submissions are already active in your evaluation queue.
                </p>
              </div>
            ) : (
              dockets.map((docket) => {
                const isCurrentIngesting = ingestingId === docket.intakeId;
                const isCurrentSuccess = successId === docket.intakeId;

                return (
                  <div 
                    key={docket.intakeId}
                    className="card"
                    style={{
                      padding: '14px',
                      background: '#ffffff',
                      border: isCurrentSuccess ? '1px solid #15803d' : '1px solid #cbd5e1',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building size={15} color="#005691" />
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                            {docket.vendorName}
                          </span>
                          <span className="badge badge-info" style={{ fontSize: '0.625rem' }}>
                            ID: {docket.intakeId}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <span>PAN: <strong style={{ color: '#0f172a' }}>{docket.panNumber}</strong></span>
                          <span>GSTIN: <strong style={{ color: '#0f172a' }}>{docket.gstinNumber}</strong></span>
                          <span>Turnover: <strong style={{ color: '#15803d' }}>₹{docket.turnoverDeclaredCr} Cr</strong></span>
                          <span>Local Content: <strong style={{ color: '#b45309' }}>{docket.localContentDeclared}%</strong></span>
                        </div>

                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={12} color="#15803d" />
                          <span>Category: {docket.category} • DigiLocker Hash: {docket.digilockerHash.slice(0, 16)}...</span>
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => handleIngest(docket)}
                          disabled={isCurrentIngesting || isCurrentSuccess}
                          className="btn btn-primary btn-sm"
                          style={{
                            padding: '6px 14px',
                            background: isCurrentSuccess ? '#15803d' : undefined,
                            borderColor: isCurrentSuccess ? '#15803d' : undefined
                          }}
                        >
                          {isCurrentIngesting ? (
                            <span>Importing...</span>
                          ) : isCurrentSuccess ? (
                            <span>✓ Received!</span>
                          ) : (
                            <>
                              <ArrowDownToLine size={13} />
                              <span>Import Application</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            )}

          </div>

        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Done
          </button>
        </div>

      </div>
    </div>
  );
};