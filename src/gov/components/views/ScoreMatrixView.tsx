import React, { useState, useMemo } from 'react';
import { Calculator, Trophy, Unlock, Lock, Sliders, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MaskedSubmission, Tender, UserRole } from '../../types/procurement';

interface ScoreMatrixViewProps {
  tender: Tender;
  submissions: MaskedSubmission[];
  currentRole: UserRole;
  isVaultUnmasked: boolean;
  setIsVaultUnmasked: (val: boolean) => void;
}

export const ScoreMatrixView: React.FC<ScoreMatrixViewProps> = ({
  tender,
  submissions,
  currentRole,
  isVaultUnmasked,
  setIsVaultUnmasked,
}) => {
  const [weights, setWeights] = useState(tender.weights);

  // Dynamically compute composite scores based on custom weights
  const rankedSubmissions = useMemo(() => {
    return submissions.map(sub => {
      const techMarks = sub.officerReviews[0]?.totalTechnicalMarks ?? 0;
      const statScore = sub.statutory.overallHealthScore;
      const aiScore = sub.aiScorecard.complianceScore;
      const miiScore = sub.miiAudit.verifiedPercentage;

      const techWeighted = (techMarks * weights.technical) / 100;
      const statWeighted = (statScore * weights.statutory) / 100;
      const aiWeighted = (aiScore * weights.aiCompliance) / 100;
      const miiWeighted = (miiScore * weights.miiLocalContent) / 100;

      const composite = techWeighted + statWeighted + aiWeighted + miiWeighted;

      return {
        ...sub,
        computed: {
          techMarks,
          techWeighted,
          statScore,
          statWeighted,
          aiScore,
          aiWeighted,
          miiScore,
          miiWeighted,
          composite: Number(composite.toFixed(2))
        }
      };
    }).sort((a, b) => b.computed.composite - a.computed.composite);
  }, [submissions, weights]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calculator size={26} color="var(--accent-blue)" />
            Consolidation & Weighted Automated Score Matrix
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Merges Technical Marks, Sovereign Registry Health, AI Scorecards, and MII Local Content into an automated QCBS ranking matrix.
          </p>
        </div>

        {currentRole === 'BUYER_AUTHORITY' && (
          <button
            onClick={() => setIsVaultUnmasked(!isVaultUnmasked)}
            className={`btn ${isVaultUnmasked ? 'btn-danger' : 'btn-primary'}`}
          >
            {isVaultUnmasked ? <Lock size={16} /> : <Unlock size={16} />}
            <span>{isVaultUnmasked ? 'Re-Seal Vault (Double-Blind)' : 'Authorize Commercial Bid Unmasking'}</span>
          </button>
        )}
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(14, 23, 48, 0.95), rgba(19, 32, 66, 0.9))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Dynamic QCBS Weight Distribution Simulator
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Formula: Score = (w_tech × S_tech) + (w_stat × S_stat) + (w_ai × S_ai) + (w_mii × S_mii)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Technical Evaluation Weight</span>
              <span style={{ color: 'var(--accent-blue)' }}>{weights.technical}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.technical}
              onChange={(e) => setWeights({ ...weights, technical: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#38bdf8' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Make in India Local Content</span>
              <span style={{ color: 'var(--saffron)' }}>{weights.miiLocalContent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.miiLocalContent}
              onChange={(e) => setWeights({ ...weights, miiLocalContent: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#ff9933' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Statutory Health Registry</span>
              <span style={{ color: 'var(--accent-emerald)' }}>{weights.statutory}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.statutory}
              onChange={(e) => setWeights({ ...weights, statutory: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#10b981' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>AI Pre-Check Score</span>
              <span style={{ color: 'var(--accent-purple)' }}>{weights.aiCompliance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.aiCompliance}
              onChange={(e) => setWeights({ ...weights, aiCompliance: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#a855f7' }}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Candidate / Pseudonym</th>
                <th>TEC Technical ({weights.technical}%)</th>
                <th>MII Local ({weights.miiLocalContent}%)</th>
                <th>Statutory ({weights.statutory}%)</th>
                <th>AI Compliance ({weights.aiCompliance}%)</th>
                <th>Final Composite Score</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {rankedSubmissions.map((sub, idx) => {
                const isWinner = idx === 0;

                return (
                  <tr key={sub.id} style={{ background: isWinner ? 'rgba(56, 189, 248, 0.08)' : 'transparent' }}>
                    
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isWinner ? (
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #d97706, #fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: '0.85rem' }}>
                            T1
                          </div>
                        ) : (
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.85rem', border: '1px solid var(--border-subtle)' }}>
                            T{idx + 1}
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: isWinner ? '#38bdf8' : '#ffffff', fontFamily: 'var(--font-mono)' }}>
                          {sub.maskedVendorId}
                        </div>
                        {isVaultUnmasked && sub.actualVendorNameHidden ? (
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#34d399', marginTop: '2px' }}>
                            {sub.actualVendorNameHidden}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            Token: {sub.vaultCipherToken.slice(0, 12)}...
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                          {sub.computed.techWeighted.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {' '}({sub.computed.techMarks}/100)
                        </span>
                      </div>
                    </td>

                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: '#ffaa55' }}>
                          {sub.computed.miiWeighted.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {' '}({sub.computed.miiScore}%)
                        </span>
                      </div>
                    </td>

                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: '#34d399' }}>
                          {sub.computed.statWeighted.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {' '}({sub.computed.statScore}%)
                        </span>
                      </div>
                    </td>

                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: '#c084fc' }}>
                          {sub.computed.aiWeighted.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {' '}({sub.computed.aiScore}%)
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isWinner ? '#38bdf8' : '#ffffff' }}>
                        {sub.computed.composite}
                      </div>
                    </td>

                    <td>
                      {isWinner ? (
                        <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                          RECOMMENDED (T1)
                        </span>
                      ) : sub.statutory.flags.length > 0 ? (
                        <span className="badge badge-danger">AUDIT FLAGGED</span>
                      ) : (
                        <span className="badge badge-info">QUALIFIED (T{idx + 1})</span>
                      )}
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