import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Eye, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertTriangle, 
  Cpu, 
  Building2, 
  Flag,
  FileCheck,
  ShieldCheck,
  ArrowDownToLine,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  EyeOff
} from 'lucide-react';
import { MaskedSubmission, SubmissionStatus, UserRole } from '../../types/procurement';

interface EvaluationQueueViewProps {
  submissions: MaskedSubmission[];
  currentRole: UserRole;
  isVaultUnmasked: boolean;
  onOpenGradingModal: (submission: MaskedSubmission) => void;
  onOpenDiscrepancyInspector?: (submission: MaskedSubmission) => void;
  onOpenVendorIntake?: () => void;
}

export const EvaluationQueueView: React.FC<EvaluationQueueViewProps> = ({
  submissions,
  currentRole,
  isVaultUnmasked,
  onOpenGradingModal,
  onOpenDiscrepancyInspector,
  onOpenVendorIntake,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubmissions = submissions.filter(sub => {
    const matchesFilter = filterStatus === 'ALL' || sub.status === filterStatus;
    const matchesSearch = sub.maskedVendorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isVaultUnmasked && sub.actualVendorNameHidden && sub.actualVendorNameHidden.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'EVALUATION_APPROVED':
        return <span className="badge badge-success">QUALIFIED (PASSED)</span>;
      case 'TEC_BLIND_EVAL':
        return <span className="badge badge-info">PENDING YOUR REVIEW</span>;
      case 'STATUTORY_FLAGGED':
        return <span className="badge badge-danger">DATABASE ALERT</span>;
      case 'PENDING_SCRUTINY':
        return <span className="badge badge-warning">INITIAL CHECK</span>;
      case 'FINANCIAL_UNMASKED':
        return <span className="badge badge-purple">FINANCIAL STAGE</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={24} color="#38bdf8" />
            Bidder Applications for Technical Evaluation
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.825rem', marginTop: '4px' }}>
            Evaluate bidder proposals on merit. Bidder company names are protected to ensure 100% fair and unbiased evaluation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {onOpenVendorIntake && (
            <button
              onClick={onOpenVendorIntake}
              className="btn btn-outline"
              style={{ borderColor: '#0284c7', color: '#38bdf8', background: 'rgba(2, 132, 199, 0.12)' }}
            >
              <ArrowDownToLine size={15} />
              <span>Receive New Bids</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isVaultUnmasked ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)', border: `1px solid ${isVaultUnmasked ? '#f43f5e' : '#10b981'}`, padding: '6px 12px', borderRadius: '6px' }}>
            {isVaultUnmasked ? (
              <>
                <Eye size={16} color="#fb7185" />
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#fb7185' }}>FINANCIAL STAGE ACTIVE</div>
                  <div style={{ fontSize: '0.625rem', color: '#94a3b8' }}>Company names unsealed for commercial bid opening</div>
                </div>
              </>
            ) : (
              <>
                <EyeOff size={16} color="#34d399" />
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#34d399' }}>ZERO-BIAS PROTECTION ACTIVE</div>
                  <div style={{ fontSize: '0.625rem', color: '#94a3b8' }}>Names sealed under GFR guidelines until financial opening</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(56, 189, 248, 0.06)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <HelpCircle size={20} color="#38bdf8" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.775rem', color: '#e0f2fe', lineHeight: 1.4 }}>
          <strong>How to Evaluate:</strong> Click <strong>"Grade & Review"</strong> on any bidder row to inspect their submitted documents, verify their Make in India declaration, and enter your technical marks. Government database checks have already been automatically verified below.
        </div>
      </div>

      <div className="card" style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            className="form-input"
            style={{ padding: '7px 12px' }}
            placeholder="Search by Bidder Code (e.g. VEN-ANON-9041)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} color="#94a3b8" />
          <span style={{ fontSize: '0.775rem', color: '#94a3b8', fontWeight: 600 }}>Filter:</span>
          <select 
            className="form-select"
            style={{ width: 'auto', padding: '5px 10px', fontSize: '0.775rem' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Applications ({submissions.length})</option>
            <option value="TEC_BLIND_EVAL">Pending My Review</option>
            <option value="EVALUATION_APPROVED">Passed Technical Check</option>
            <option value="STATUTORY_FLAGGED">Requires Special Attention</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Bidder ID</th>
                <th>Govt Database Checks (GST / EPF / Blacklist)</th>
                <th>Rule Compliance Check</th>
                <th>Make in India (Local %)</th>
                <th>Officer Marks (Out of 100)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((sub, idx) => {
                const hasDiscrepancies = sub.aiScorecard.discrepancies.length > 0;
                const latestReview = sub.officerReviews[sub.officerReviews.length - 1];

                return (
                  <tr key={sub.id}>
                    
                    <td>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                            {sub.maskedVendorId}
                          </span>
                          {!isVaultUnmasked && <Lock size={12} color="#94a3b8" />}
                        </div>
                        {isVaultUnmasked && sub.actualVendorNameHidden ? (
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                            {sub.actualVendorNameHidden}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.675rem', color: '#94a3b8' }}>
                            Company Name Sealed
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '50%',
                          background: sub.statutory.overallHealthScore >= 80 ? '#10b981' : '#f43f5e'
                        }} />
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                          {sub.statutory.overallHealthScore}% Verified
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span>GST: <strong style={{ color: '#34d399' }}>{sub.statutory.gstn.status}</strong></span>
                        <span>Blacklist: <strong style={{ color: sub.statutory.cpppDebarment.status === 'CLEAR' ? '#34d399' : '#fb7185' }}>{sub.statutory.cpppDebarment.status === 'CLEAR' ? 'Clear' : 'Notice'}</strong></span>
                        <span>Tax 26AS: <strong style={{ color: sub.statutory.itr26as.status === 'CONSISTENT' ? '#34d399' : '#f59e0b' }}>{sub.statutory.itr26as.status === 'CONSISTENT' ? 'Matched' : 'Check'}</strong></span>
                      </div>
                      {sub.statutory.flags.length > 0 && (
                        <div style={{ fontSize: '0.65rem', color: '#fb7185', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={11} />
                          <span>{sub.statutory.flags[0].slice(0, 36)}...</span>
                        </div>
                      )}
                    </td>

                    <td>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Cpu size={14} color="#c084fc" />
                          <span style={{ fontWeight: 700, color: sub.aiScorecard.complianceScore >= 80 ? '#c084fc' : '#fbbf24' }}>
                            {sub.aiScorecard.complianceScore}% Compliant
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            ({sub.aiScorecard.clausesPassed}/{sub.aiScorecard.clausesTotal} Rules Met)
                          </span>
                        </div>

                        {hasDiscrepancies ? (
                          <div style={{ marginTop: '4px' }}>
                            <button
                              onClick={() => onOpenDiscrepancyInspector && onOpenDiscrepancyInspector(sub)}
                              className="btn btn-sm"
                              style={{
                                background: 'rgba(244, 63, 94, 0.15)',
                                color: '#fb7185',
                                border: '1px solid rgba(244, 63, 94, 0.4)',
                                fontSize: '0.65rem',
                                padding: '2px 6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <ShieldAlert size={10} />
                              <span>{sub.aiScorecard.discrepancies.length} Parameter Mismatch</span>
                            </button>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.65rem', color: '#34d399', marginTop: '2px' }}>
                            ✓ All Certificates Verified
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div>
                        <span className={`badge ${sub.miiAudit.supplierClass === 'Class-I' ? 'badge-saffron' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                          {sub.miiAudit.supplierClass} ({sub.miiAudit.verifiedPercentage}%)
                        </span>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                          {sub.miiAudit.purchasePreferenceEligible ? '✓ Purchase Preference' : 'No Purchase Preference'}
                        </div>
                      </div>
                    </td>

                    <td>
                      {latestReview ? (
                        <div>
                          <span style={{ fontWeight: 800, color: '#34d399', fontSize: '0.9rem' }}>
                            {latestReview.totalTechnicalMarks} / 100
                          </span>
                          <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                            Signed by {latestReview.officerId}
                          </div>
                          {latestReview.gfrJustification && (
                            <span className="badge badge-saffron" style={{ fontSize: '0.6rem', marginTop: '2px' }}>
                              Note Logged
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                          Awaiting Your Score
                        </span>
                      )}
                    </td>

                    <td>
                      {getStatusBadge(sub.status)}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => onOpenGradingModal(sub)}
                          className="btn btn-primary btn-sm"
                        >
                          <FileCheck size={14} />
                          <span>{latestReview ? 'Review Score' : 'Grade & Review'}</span>
                        </button>
                        {hasDiscrepancies && onOpenDiscrepancyInspector && (
                          <button
                            onClick={() => onOpenDiscrepancyInspector(sub)}
                            className="btn btn-outline btn-sm"
                            title="Inspect Document Differences"
                            style={{ padding: '5px 8px' }}
                          >
                            <Eye size={13} color="#c084fc" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};