import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  Search,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { MaskedSubmission } from '../../types/procurement';

interface AIScorecardViewProps {
  submissions: MaskedSubmission[];
}

export const AIScorecardView: React.FC<AIScorecardViewProps> = ({ submissions }) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || '');
  const selectedSub = submissions.find(s => s.id === selectedSubId) || submissions[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={26} color="var(--accent-purple)" />
            AI Compliance & Multimodal Scoring Scorecards
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            LLM parser outputs, automated PQC pre-checks, citation anchoring, and document anomaly diagnostics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Masked Submission:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
            value={selectedSubId}
            onChange={(e) => setSelectedSubId(e.target.value)}
          >
            {submissions.map(s => (
              <option key={s.id} value={s.id}>
                {s.maskedVendorId} (AI Score: {s.aiScorecard.complianceScore}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSub && (() => {
        const score = selectedSub.aiScorecard.complianceScore;
        const hasFlags = selectedSub.aiScorecard.redFlags.length > 0;
        
        let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
        let riskColor = '#34d399';
        let recommendationTitle = 'ACCEPT BID WITH HIGH CONFIDENCE';
        let recommendationDesc = 'All mandatory statutory criteria, GSTN 24-month return filing, PAN CBDT cross-match, and Make-in-India local content verified with 0 debarment flags.';
        let recBg = 'rgba(16, 185, 129, 0.12)';
        let recBorder = '#10b981';

        if (score < 50 || selectedSub.aiScorecard.redFlags.length >= 2) {
          riskLevel = 'CRITICAL';
          riskColor = '#f43f5e';
          recommendationTitle = 'REJECT BID — CRITICAL NON-COMPLIANCE DETECTED';
          recommendationDesc = 'Critical statutory violations or debarment risks detected by AI scanner. Do not proceed to financial stage without formal show-cause hearing.';
          recBg = 'rgba(244, 63, 94, 0.15)';
          recBorder = '#f43f5e';
        } else if (score < 75 || hasFlags) {
          riskLevel = 'HIGH';
          riskColor = '#fb923c';
          recommendationTitle = 'CONDITIONAL CLARIFICATION REQUIRED (ISSUE SHOW CAUSE)';
          recommendationDesc = 'Minor document discrepancies or pending EPFO/UDIN cross-match. Procurement Officer should request formal verification before technical qualification.';
          recBg = 'rgba(251, 146, 60, 0.15)';
          recBorder = '#fb923c';
        } else if (score < 85) {
          riskLevel = 'MEDIUM';
          riskColor = '#facc15';
          recommendationTitle = 'PROCEED TO FINANCIAL OPENING WITH STANDARD SCRUTINY';
          recommendationDesc = 'PQC requirements satisfied. Vendor meets minimum Make-in-India Class-II thresholds.';
          recBg = 'rgba(250, 204, 21, 0.12)';
          recBorder = '#facc15';
        }

        return (
          <>
            
            <div style={{ background: recBg, border: `1px solid ${recBorder}`, borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: riskColor, marginTop: '2px' }}>
                <Sparkles size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{ color: riskColor, fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em' }}>
                    {recommendationTitle}
                  </span>
                  <span style={{ background: riskColor, color: '#000000', fontWeight: 800, fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    RISK LEVEL: {riskLevel}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    AI Confidence: {selectedSub.aiScorecard.confidenceRate}%
                  </span>
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '0.825rem', margin: 0, lineHeight: 1.4 }}>
                  {recommendationDesc}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              
              <div className="card" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(19, 32, 66, 0.8))' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Compliance Score</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>
                  {selectedSub.aiScorecard.complianceScore}%
                </div>
                <div style={{ fontSize: '0.75rem', color: riskColor, marginTop: '4px', fontWeight: 700 }}>
                  ● {riskLevel} RISK PROFILE
                </div>
              </div>

              <div className="card">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clauses Evaluated</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                  {selectedSub.aiScorecard.clausesPassed}/{selectedSub.aiScorecard.clausesTotal} Passed
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  100% PQC Coverage
                </div>
              </div>

              <div className="card">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Red-Flags & Anomalies</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: selectedSub.aiScorecard.redFlags.length > 0 ? '#fb7185' : '#34d399', marginTop: '4px' }}>
                  {selectedSub.aiScorecard.redFlags.length} Flagged
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Font & UDIN verification
                </div>
              </div>

              <div className="card">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>14-Point Checks Status</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                  14/14
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Sovereign APIs Synchronized
                </div>
              </div>

            </div>
          </>
        );
      })()}

      {selectedSub && selectedSub.aiScorecard.redFlags.length > 0 && (
        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
            <AlertTriangle size={18} />
            <span>AI Automated Red-Flags & Forensic Warnings</span>
          </div>
          <ul style={{ paddingLeft: '24px', fontSize: '0.85rem', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {selectedSub.aiScorecard.redFlags.map((flag, idx) => (
              <li key={idx} style={{ color: '#fb7185' }}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {selectedSub && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={20} color="var(--accent-purple)" />
              <span>Extracted PQC Clause Citations & Evidentiary Proofs</span>
            </div>
            <span className="badge badge-purple">Multimodal OCR + Vector Matching</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {selectedSub.aiScorecard.citations.map((c, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.95rem' }}>{c.clauseId}</span>
                    <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{c.clauseTitle}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${c.status === 'COMPLIANT' ? 'badge-success' : 'badge-danger'}`}>
                      {c.status}
                    </span>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      Confidence: {c.confidenceScore}%
                    </span>
                  </div>
                </div>

                <div style={{ background: 'rgba(7, 13, 30, 0.9)', padding: '12px 14px', borderRadius: '6px', borderLeft: '3px solid var(--accent-purple)', marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Extracted Text from <strong style={{ color: '#38bdf8' }}>{c.sourceDoc}</strong> (Page {c.pageRef}):
                  </div>
                  <div style={{ color: '#f8fafc', fontSize: '0.85rem', fontStyle: 'italic', fontFamily: 'var(--font-mono)' }}>
                    "{c.extractedSnippet}"
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#34d399' }}>
                  <Sparkles size={14} />
                  <span><strong>AI Diagnostic:</strong> {c.aiExplanation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};