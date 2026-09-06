import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Cpu, 
  Building2, 
  Flag, 
  AlertTriangle, 
  FileCheck, 
  KeyRound, 
  FileText, 
  Sliders, 
  CheckCircle, 
  ExternalLink, 
  ShieldAlert, 
  Scale, 
  Sparkles, 
  Info,
  HelpCircle
} from 'lucide-react';
import { MaskedSubmission, UserRole, OfficerScoreEntry, GFRJustification } from '../../types/procurement';

interface BlindGradingModalProps {
  submission: MaskedSubmission;
  currentRole: UserRole;
  isVaultUnmasked: boolean;
  onClose: () => void;
  onSubmitScore: (submissionId: string, review: OfficerScoreEntry) => void;
  onOpenDiscrepancyInspector?: (sub: MaskedSubmission) => void;
}

export const BlindGradingModal: React.FC<BlindGradingModalProps> = ({
  submission,
  currentRole,
  isVaultUnmasked,
  onClose,
  onSubmitScore,
  onOpenDiscrepancyInspector,
}) => {
  const [techCapability, setTechCapability] = useState(35);
  const [pastExp, setPastExp] = useState(22);
  const [methodology, setMethodology] = useState(18);
  const [keyPersonnel, setKeyPersonnel] = useState(13);
  const [remarks, setRemarks] = useState('Proposal satisfies all mandatory technical specifications and past project requirements.');
  const [flagType, setFlagType] = useState<'NONE' | 'REQUIRES_CLARIFICATION' | 'AUDIT_DISCREPANCY' | 'PQC_FAIL'>('NONE');
  
  // GFR 2017 Justification state
  const [gfrRule, setGfrRule] = useState('Rule 173(xxii) - Technical Clarification & Concurrence');
  const [gfrJustificationText, setGfrJustificationText] = useState('');
  const [gfrRiskAccepted, setGfrRiskAccepted] = useState(false);
  const [gfrError, setGfrError] = useState('');

  const [isSigning, setIsSigning] = useState(false);

  const totalScore = techCapability + pastExp + methodology + keyPersonnel;

  const hasStatutoryAlerts = submission.statutory.flags.length > 0;
  const hasLowAIScore = submission.aiScorecard.complianceScore < 75;
  const hasDiscrepancies = submission.aiScorecard.discrepancies.length > 0;
  
  const isOverridingAnomaly = (hasStatutoryAlerts || hasLowAIScore || hasDiscrepancies) && flagType === 'NONE';
  const isOverridingRejection = (!hasStatutoryAlerts && !hasLowAIScore && !hasDiscrepancies) && flagType === 'PQC_FAIL';
  const requiresGFRJustification = isOverridingAnomaly || isOverridingRejection;

  const handleSignAndSubmit = () => {
    if (requiresGFRJustification) {
      if (!gfrJustificationText.trim() || gfrJustificationText.trim().length < 25) {
        setGfrError('Please enter a brief official justification note (minimum 25 characters) to proceed.');
        return;
      }
      if (!gfrRiskAccepted) {
        setGfrError('Please confirm the GFR 2017 compliance confirmation checkbox.');
        return;
      }
    }

    setGfrError('');
    setIsSigning(true);

    setTimeout(() => {
      let gfrPayload: GFRJustification | undefined = undefined;
      if (requiresGFRJustification) {
        gfrPayload = {
          ruleCited: gfrRule,
          justificationText: gfrJustificationText,
          overturnedRecommendation: isOverridingAnomaly 
            ? 'Qualified despite automated database flag' 
            : 'Disqualified despite meeting initial automated check',
          statutoryRiskAccepted: gfrRiskAccepted,
          loggedAt: new Date().toISOString()
        };
      }

      const review: OfficerScoreEntry = {
        officerId: 'GEM-OFF-9041',
        officerName: 'Shri Rajesh Sharma (Director)',
        role: currentRole,
        timestamp: new Date().toISOString(),
        scores: {
          technicalCapability: techCapability,
          pastExperience: pastExp,
          methodologyWorkplan: methodology,
          keyPersonnel: keyPersonnel
        },
        totalTechnicalMarks: totalScore,
        remarks,
        flagRaised: flagType,
        dscSignature: `DSC_X509_PKCS11_NIC_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        gfrJustification: gfrPayload
      };

      onSubmitScore(submission.id, review);
      setIsSigning(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1050px', maxHeight: '92vh', overflowY: 'auto' }}>
        
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
              <FileCheck size={20} color="#005691" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Technical Evaluation: Bidder {submission.maskedVendorId}
                </h3>
                <span className="badge badge-info">Zero-Bias Active</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Evaluating Officer: <strong>Shri Rajesh Sharma (Director)</strong> • Authenticated with Class-3 Digital Signature (DSC)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm">✕</button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '18px', padding: '10px 0' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Bidder Identity Status
                </span>
                <span className="badge badge-success">Verified Application</span>
              </div>
              <div style={{ fontSize: '0.775rem', color: '#334155', marginTop: '4px' }}>
                Company identity is sealed to ensure impartial scoring as per GFR 2017 guidelines.
              </div>
              {isVaultUnmasked && submission.actualVendorNameHidden && (
                <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#991b1b' }}>UNMASKED COMPANY NAME (Financial Stage):</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{submission.actualVendorNameHidden}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>PAN: {submission.actualPanHidden} • GSTIN: {submission.actualGstinHidden}</div>
                </div>
              )}
            </div>

            {submission.aiScorecard.discrepancies.length > 0 && (
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '6px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} color="#e11d48" />
                  <div>
                    <div style={{ fontSize: '0.775rem', fontWeight: 800, color: '#9f1239' }}>
                      {submission.aiScorecard.discrepancies.length} Document Anomaly Flagged
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#be123c' }}>
                      Turnover or Make in India numbers differ from tax records
                    </div>
                  </div>
                </div>

                {onOpenDiscrepancyInspector && (
                  <button
                    onClick={() => onOpenDiscrepancyInspector(submission)}
                    className="btn btn-sm"
                    style={{ background: '#be123c', color: '#ffffff', border: 'none', fontSize: '0.7rem', padding: '4px 8px' }}
                  >
                    <ExternalLink size={12} />
                    <span>View Differences</span>
                  </button>
                )}
              </div>
            )}

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={15} color="#7e22ce" />
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Document Verification Findings</h4>
                </div>
                <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                  {submission.aiScorecard.complianceScore}% Score ({submission.aiScorecard.confidenceRate}% Match)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                {submission.aiScorecard.citations.map((c, idx) => (
                  <div key={idx} style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 700, color: '#005691' }}>{c.clauseId}: {c.clauseTitle}</span>
                      <span className={`badge ${c.status === 'COMPLIANT' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.6rem' }}>
                        {c.status === 'COMPLIANT' ? 'Passed' : 'Flagged'}
                      </span>
                    </div>
                    <div style={{ color: '#475569', fontStyle: 'italic', marginBottom: '2px', borderLeft: '2px solid #005691', paddingLeft: '6px' }}>
                      "{c.extractedSnippet}"
                    </div>
                    <div style={{ color: '#15803d', fontSize: '0.7rem' }}>
                      ✓ {c.aiExplanation} (Doc: {c.sourceDoc}, Page {c.pageRef})
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                  <Building2 size={14} color="#15803d" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Govt Databases</span>
                </div>
                <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div>GST Tax: <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>Active (₹{submission.statutory.gstn.turnoverVerifiedCr}Cr)</span></div>
                  <div>EPF Staff: <span className={`badge ${submission.statutory.epfo.status === 'COMPLIANT' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.6rem' }}>{submission.statutory.epfo.status === 'COMPLIANT' ? 'Compliant' : 'Default'}</span></div>
                  <div>Blacklist: <span className={`badge ${submission.statutory.cpppDebarment.status === 'CLEAR' ? 'badge-emerald' : 'badge-danger'}`} style={{ fontSize: '0.6rem' }}>{submission.statutory.cpppDebarment.status === 'CLEAR' ? 'Clear' : 'Notice'}</span></div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                  <Flag size={14} color="#d97706" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Make in India</span>
                </div>
                <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div>Class: <span className="badge badge-saffron" style={{ fontSize: '0.6rem' }}>{submission.miiAudit.supplierClass}</span></div>
                  <div>Local Content: <strong style={{ color: '#b45309' }}>{submission.miiAudit.verifiedPercentage}%</strong></div>
                  <div>Purchase Preference: <strong style={{ color: '#15803d' }}>{submission.miiAudit.purchasePreferenceEligible ? 'Eligible' : 'Not Eligible'}</strong></div>
                </div>
              </div>
            </div>

          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sliders size={16} color="#005691" />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Award Technical Marks</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.675rem', color: '#64748b' }}>Total Score</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: totalScore >= 75 ? '#15803d' : '#b45309' }}>
                    {totalScore} / 100
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>
                    <span>1. Technical Architecture (Max 40)</span>
                    <span style={{ color: '#005691', fontWeight: 700 }}>{techCapability} / 40</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={techCapability}
                    onChange={(e) => setTechCapability(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#005691' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>
                    <span>2. Past Experience (Max 25)</span>
                    <span style={{ color: '#005691', fontWeight: 700 }}>{pastExp} / 25</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={pastExp}
                    onChange={(e) => setPastExp(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#005691' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>
                    <span>3. Execution Methodology (Max 20)</span>
                    <span style={{ color: '#005691', fontWeight: 700 }}>{methodology} / 20</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={methodology}
                    onChange={(e) => setMethodology(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#005691' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>
                    <span>4. Key Personnel & Team (Max 15)</span>
                    <span style={{ color: '#005691', fontWeight: 700 }}>{keyPersonnel} / 15</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={keyPersonnel}
                    onChange={(e) => setKeyPersonnel(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#005691' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <label className="form-label" style={{ fontSize: '0.725rem' }}>Officer Remarks</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  style={{ fontSize: '0.75rem' }}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              <div style={{ marginTop: '8px' }}>
                <label className="form-label" style={{ fontSize: '0.725rem' }}>Your Official Decision</label>
                <select 
                  className="form-select"
                  value={flagType}
                  onChange={(e) => setFlagType(e.target.value as any)}
                  style={{ fontSize: '0.75rem' }}
                >
                  <option value="NONE">Qualify for Financial Stage (Passed)</option>
                  <option value="REQUIRES_CLARIFICATION">Request Bidder Clarification</option>
                  <option value="AUDIT_DISCREPANCY">Flag for Special Audit</option>
                  <option value="PQC_FAIL">Disqualify (Did Not Meet Rules)</option>
                </select>
              </div>

              {requiresGFRJustification && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px',
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '5px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                    <Scale size={14} color="#b45309" />
                    <span style={{ fontWeight: 800, fontSize: '0.725rem', color: '#92400e' }}>
                      Justification Note Required under GFR 2017
                    </span>
                  </div>

                  <p style={{ fontSize: '0.675rem', color: '#78350f', marginBottom: '6px' }}>
                    You are overriding an automated recommendation. Please select the rule and enter your reason.
                  </p>

                  <select
                    value={gfrRule}
                    onChange={(e) => setGfrRule(e.target.value)}
                    className="form-select"
                    style={{ fontSize: '0.7rem', marginBottom: '6px', padding: '4px 6px' }}
                  >
                    <option value="Rule 173(xxii) - Technical Clarification & Concurrence">Rule 173(xxii) - Technical Clarification & Concurrence</option>
                    <option value="Rule 144(xi) - Fundamental Principles of Public Buying">Rule 144(xi) - Fundamental Principles of Public Buying</option>
                    <option value="Rule 161 - Evaluation of Technical Bids">Rule 161 - Evaluation of Technical Bids</option>
                    <option value="Rule 153 - Public Procurement Policy for MSEs">Rule 153 - Public Procurement Policy for MSEs</option>
                  </select>

                  <textarea
                    value={gfrJustificationText}
                    onChange={(e) => setGfrJustificationText(e.target.value)}
                    className="form-textarea"
                    rows={2}
                    placeholder="Enter your justification note..."
                    style={{ fontSize: '0.7rem', marginBottom: '6px' }}
                  />

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.675rem', color: '#78350f', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={gfrRiskAccepted}
                      onChange={(e) => setGfrRiskAccepted(e.target.checked)}
                      style={{ accentColor: '#d97706' }}
                    />
                    <span>I confirm this decision complies with GFR 2017</span>
                  </label>
                </div>
              )}

              {gfrError && (
                <div style={{ color: '#dc2626', fontSize: '0.7rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={12} />
                  <span>{gfrError}</span>
                </div>
              )}

            </div>

            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.675rem', color: '#15803d', marginBottom: '6px' }}>
                <KeyRound size={12} />
                <span>Signing with Official Digital Signature (DSC e-Sign)</span>
              </div>
              <button
                onClick={handleSignAndSubmit}
                disabled={isSigning}
                className="btn btn-success"
                style={{ width: '100%', padding: '9px', fontSize: '0.825rem' }}
              >
                {isSigning ? (
                  <span>Signing & Submitting Decision...</span>
                ) : (
                  <>
                    <FileCheck size={15} />
                    <span>Approve & Sign Evaluation</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};