import React, { useState } from 'react';
import { Flag, CheckCircle, AlertTriangle, ShieldCheck, PieChart, Layers, HelpCircle } from 'lucide-react';
import { MaskedSubmission } from '../../types/procurement';

interface MIIAuditViewProps {
  submissions: MaskedSubmission[];
}

export const MIIAuditView: React.FC<MIIAuditViewProps> = ({ submissions }) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || '');
  const selectedSub = submissions.find(s => s.id === selectedSubId) || submissions[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Flag size={26} color="var(--saffron)" />
            Make in India (MII) Local Content & BoM Audit Engine
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Automated verification of DPIIT PPP-MII classification thresholds (Class-I vs Class-II) and Bill of Materials value addition.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Submission:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
            value={selectedSubId}
            onChange={(e) => setSelectedSubId(e.target.value)}
          >
            {submissions.map(s => (
              <option key={s.id} value={s.id}>
                {s.maskedVendorId} ({s.miiAudit.supplierClass} - {s.miiAudit.verifiedPercentage}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        <div className="card" style={{ borderLeft: '4px solid #ff9933' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, color: '#ff9933', fontSize: '0.95rem' }}>Class-I Local Supplier</span>
            <span className="badge badge-saffron">&gt;= 50% Local Content</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Full Purchase Preference: Eligible to match L1 bid within 20% margin of purchase preference.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.95rem' }}>Class-II Local Supplier</span>
            <span className="badge badge-info">20% to 50% Local Content</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Participation Allowed: Eligible to bid on standard terms, but no margin of purchase preference.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, color: '#fb7185', fontSize: '0.95rem' }}>Non-Local Supplier</span>
            <span className="badge badge-danger">&lt; 20% Local Content</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Restricted: Ineligible to participate in domestic tenders &lt; ₹200 Cr unless global tender enquiry approved.
          </p>
        </div>

      </div>

      {selectedSub && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ShieldCheck size={20} color="var(--saffron)" />
              <span>Local Content Audit for Masked ID: {selectedSub.maskedVendorId}</span>
            </div>
            <span className={`badge ${selectedSub.miiAudit.supplierClass === 'Class-I' ? 'badge-saffron' : 'badge-warning'}`}>
              Validated Status: {selectedSub.miiAudit.supplierClass}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            
            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Self-Declared Local Content</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                {selectedSub.miiAudit.declaredPercentage}%
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BoM Verified Local Content</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ff9933', marginTop: '4px' }}>
                {selectedSub.miiAudit.verifiedPercentage}%
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auditor / CA UDIN Certificate</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedSub.miiAudit.auditorCertValid ? '#34d399' : '#fb7185', marginTop: '6px' }}>
                {selectedSub.miiAudit.auditorCertValid ? '✓ Verified Valid' : '✕ Discrepancy Found'}
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PPP-MII Purchase Preference</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedSub.miiAudit.purchasePreferenceEligible ? '#34d399' : '#94a3b8', marginTop: '6px' }}>
                {selectedSub.miiAudit.purchasePreferenceEligible ? 'ELIGIBLE (L1 Margin 20%)' : 'NOT ELIGIBLE'}
              </div>
            </div>

          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
              Itemized Bill of Materials (BoM) Domestic Value-Addition Schedule
            </h3>

            <div className="table-container">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Component / Sub-Assembly</th>
                    <th>Country of Origin</th>
                    <th>Local Content (%)</th>
                    <th>BoM Cost Weight (%)</th>
                    <th>Domestic Value Addition (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSub.miiAudit.bomItems.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{item.componentName}</td>
                      <td>
                        <span className={`badge ${item.countryOfOrigin.includes('India') ? 'badge-success' : 'badge-info'}`}>
                          {item.countryOfOrigin}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: item.localContentPercent >= 50 ? '#34d399' : '#fbbf24' }}>
                        {item.localContentPercent}%
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.costWeight}%</td>
                      <td style={{ fontWeight: 600, color: '#38bdf8' }}>
                        ₹{item.domesticValueAdditionInr.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: '20px', background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Statutory Auditor Certificate Cryptographic Hash (SHA-256):
            </div>
            <div className="crypto-box">
              {selectedSub.miiAudit.auditorCertificateHash}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};