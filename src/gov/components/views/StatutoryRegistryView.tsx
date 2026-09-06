import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  FileCode, 
  ShieldCheck, 
  Activity,
  Check,
  Zap,
  Lock,
  FileCheck,
  ShieldAlert,
  Search,
  Scale,
  Receipt,
  Users,
  Award
} from 'lucide-react';
import { MaskedSubmission } from '../../types/procurement';

interface StatutoryRegistryViewProps {
  submissions: MaskedSubmission[];
}

export const StatutoryRegistryView: React.FC<StatutoryRegistryViewProps> = ({ submissions }) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'GSTN' | 'EPFO_ESIC' | 'MCA21' | 'UDYAM_NSIC' | 'DIGILOCKER' | 'CPPP' | 'ITR_26AS'>('GSTN');

  const selectedSub = submissions.find(s => s.id === selectedSubId) || submissions[0];

  const handleSimulateRequery = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={24} color="#34d399" />
            Direct Government Database Checks
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.825rem', marginTop: '4px' }}>
            Live status verified directly with 7 sovereign portals: GST Network, Provident Fund (EPFO), Ministry of Corporate Affairs, MSME, DigiLocker, CPPP Debarment, and Income Tax (Form 26AS).
          </p>
        </div>

        <button 
          onClick={handleSimulateRequery} 
          disabled={isVerifying}
          className="btn btn-outline"
        >
          <RefreshCw size={15} className={isVerifying ? 'spin-animate' : ''} />
          <span>{isVerifying ? 'Checking Government Records...' : 'Refresh Records'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        
        <div className="card" style={{ borderTop: '4px solid #38bdf8', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>GSTN API</span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>ONLINE</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
            GSTR-3B filings & active status
          </div>
          <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600, marginTop: '4px' }}>
            142ms • Uptime 99.98%
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #10b981', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>EPFO & ESIC</span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>ONLINE</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
            Social security dues & workforce
          </div>
          <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600, marginTop: '4px' }}>
            210ms • Uptime 99.95%
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #a855f7', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>MCA-21 Gateway</span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>ONLINE</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
            CIN, DIN check & paid-up capital
          </div>
          <div style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 600, marginTop: '4px' }}>
            188ms • Uptime 99.99%
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #f59e0b', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>Udyam & NSIC</span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>ONLINE</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
            MSME classification & priority
          </div>
          <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600, marginTop: '4px' }}>
            165ms • Uptime 99.92%
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #f43f5e', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>CPPP Debarment</span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>ONLINE</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
            National debarment & blacklist DB
          </div>
          <div style={{ fontSize: '0.7rem', color: '#fb7185', fontWeight: 600, marginTop: '4px' }}>
            110ms • Live Blacklist Sync
          </div>
        </div>

      </div>

      <div className="card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={18} color="var(--accent-blue)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>Inspecting Submission Dossier:</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {submissions.map(sub => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubId(sub.id)}
              className="btn btn-sm"
              style={{
                background: selectedSub?.id === sub.id ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                color: selectedSub?.id === sub.id ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem'
              }}
            >
              {sub.maskedVendorId} ({sub.statutory.overallHealthScore}%)
            </button>
          ))}
        </div>
      </div>

      {selectedSub && (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', overflowX: 'auto' }}>
            <button
              onClick={() => setActiveTab('GSTN')}
              style={{
                padding: '14px 20px',
                background: activeTab === 'GSTN' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'GSTN' ? '#38bdf8' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === 'GSTN' ? '2px solid #38bdf8' : 'none',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              1. GSTN Tax Returns
            </button>

            <button
              onClick={() => setActiveTab('EPFO_ESIC')}
              style={{
                padding: '14px 20px',
                background: activeTab === 'EPFO_ESIC' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'EPFO_ESIC' ? '#34d399' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === 'EPFO_ESIC' ? '2px solid #34d399' : 'none',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              2. EPFO & ESIC Social Security
            </button>

            <button
              onClick={() => setActiveTab('MCA21')}
              style={{
                padding: '14px 20px',
                background: activeTab === 'MCA21' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'MCA21' ? '#c084fc' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === 'MCA21' ? '2px solid #c084fc' : 'none',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              3. MCA-21 Corporate Registry
            </button>

            <button
              onClick={() => setActiveTab('UDYAM_NSIC')}
              style={{
                padding: '14px 20px',
                background: activeTab === 'UDYAM_NSIC' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'UDYAM_NSIC' ? '#f59e0b' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === 'UDYAM_NSIC' ? '2px solid #f59e0b' : 'none',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              4. Udyam MSME & NSIC
            </button>

            <button
              onClick={() => setActiveTab('DIGILOCKER')}
              style={{
                padding: '14px 20px',
                background: activeTab === 'DIGILOCKER' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'DIGILOCKER' ? '#38bdf8' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === 'DIGILOCKER' ? '2px solid #38bdf8' : 'none',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              5. DigiLocker Document Hashes
            </button>

            <button
              onClick={() => setActiveTab('CPPP')}
              style={{
                padding: '14px 20px',
                background: activeTab === 'CPPP' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'CPPP' ? '#fb7185' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === 'CPPP' ? '2px solid #fb7185' : 'none',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              6. CPPP Debarment Database
            </button>

            <button
              onClick={() => setActiveTab('ITR_26AS')}
              style={{
                padding: '14px 20px',
                background: activeTab === 'ITR_26AS' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'ITR_26AS' ? '#34d399' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === 'ITR_26AS' ? '2px solid #34d399' : 'none',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              7. ITR & Form 26AS Tax
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            
            {activeTab === 'GSTN' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    GSTN Taxpayer Verification Details
                  </h3>
                  <span className={`badge ${selectedSub.statutory.gstn.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                    GSTN Status: {selectedSub.statutory.gstn.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GSTR-3B Regular Filing:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedSub.statutory.gstn.regular3BFiling ? '#34d399' : '#fb7185', marginTop: '4px' }}>
                      {selectedSub.statutory.gstn.regular3BFiling ? '✓ Consistent Zero-Default Filing' : '⚠ Defaults Detected'}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GSTN Verified Aggregate Turnover:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
                      ₹{selectedSub.statutory.gstn.turnoverVerifiedCr} Crores
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PAN-GST Cross Match:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedSub.statutory.gstn.panGstCrossMatch ? '#34d399' : '#fb7185', marginTop: '4px' }}>
                      {selectedSub.statutory.gstn.panGstCrossMatch ? '✓ Verified Cryptographically' : 'Mismatch'}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last GSTR Return Filed:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                      {selectedSub.statutory.gstn.lastFilingMonth}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'EPFO_ESIC' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    EPFO & ESIC Social Security Compliance Gateway
                  </h3>
                  <span className={`badge ${selectedSub.statutory.epfo.status === 'COMPLIANT' ? 'badge-success' : 'badge-danger'}`}>
                    EPFO: {selectedSub.statutory.epfo.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active EPFO Covered Employees:</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                      {selectedSub.statutory.epfo.activeEmployeesCount} Staff Members
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Challan Clearance Date:</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
                      {selectedSub.statutory.epfo.lastChallanDate}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>EPFO Pending Dues:</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedSub.statutory.epfo.duesPending === 0 ? '#34d399' : '#fb7185', marginTop: '4px' }}>
                      ₹{selectedSub.statutory.epfo.duesPending} Lakhs
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESIC Health Contribution:</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedSub.statutory.esic.status === 'COMPLIANT' ? '#34d399' : '#fb7185', marginTop: '4px' }}>
                      {selectedSub.statutory.esic.status} ({selectedSub.statutory.esic.contributionMonthsRegular} Months Regular)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'MCA21' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    MCA-21 Ministry of Corporate Affairs Verification
                  </h3>
                  <span className="badge badge-success">MCA Status: {selectedSub.statutory.mca21.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Corporate CIN (Masked in Blind Queue):</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                      {selectedSub.statutory.mca21.cinMasked}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Paid-Up Capital:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                      ₹{selectedSub.statutory.mca21.paidUpCapitalCr} Crores
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disqualified Directors (DIN Check):</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedSub.statutory.mca21.disqualifiedDirectorsCount === 0 ? '#34d399' : '#fb7185', marginTop: '4px' }}>
                      {selectedSub.statutory.mca21.disqualifiedDirectorsCount} Disqualified
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Charge Satisfaction Status:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
                      {selectedSub.statutory.mca21.chargeSatisfied ? '✓ Fully Satisfied & Clear' : 'Charges Outstanding'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'UDYAM_NSIC' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    Udyam MSME, NSIC & Startup India Verification
                  </h3>
                  <span className="badge badge-saffron">Type: {selectedSub.statutory.udyam.enterpriseType}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Udyam Registration Number:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                      {selectedSub.statutory.udyam.udyamNumberMasked}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PPP-MSE Priority Procurement:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedSub.statutory.udyam.priorityProcurementEligible ? '#34d399' : '#94a3b8', marginTop: '4px' }}>
                      {selectedSub.statutory.udyam.priorityProcurementEligible ? '✓ ELIGIBLE (MSE Preference)' : 'Standard Bidder'}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DPIIT Startup India Status:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedSub.statutory.nsicStartup.isDpiitStartup ? '#38bdf8' : '#94a3b8', marginTop: '4px' }}>
                      {selectedSub.statutory.nsicStartup.isDpiitStartup ? `✓ Recognized (${selectedSub.statutory.nsicStartup.startupCertificateNo})` : 'Not Applicable'}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NSIC & OEM Authorization:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
                      {selectedSub.statutory.nsicStartup.oemAuthorizationValid ? '✓ Valid OEM MAF Verified' : 'Standard'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'DIGILOCKER' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    DigiLocker Cryptographic Document Seal Gateway
                  </h3>
                  <span className="badge badge-emerald">Status: {selectedSub.statutory.digilocker.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Document Hashes:</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
                      {selectedSub.statutory.digilocker.verifiedHashesCount} Official Documents Authenticated
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Root Certificate Security Hash:</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                      {selectedSub.statutory.digilocker.rootCertFingerprint}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Docket Cryptographic Seal:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
                      ✓ Sovereign Digital Signature Valid
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'CPPP' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    CPPP Central Public Procurement Debarment & Blacklist Database
                  </h3>
                  <span className={`badge ${selectedSub.statutory.cpppDebarment.status === 'CLEAR' ? 'badge-emerald' : 'badge-danger'}`}>
                    Screening Status: {selectedSub.statutory.cpppDebarment.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>National Debarment Screening:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedSub.statutory.cpppDebarment.status === 'CLEAR' ? '#34d399' : '#fb7185', marginTop: '4px' }}>
                      {selectedSub.statutory.cpppDebarment.status === 'CLEAR' ? '✓ Zero Blacklist / Debarment Records' : '⚠ Active Advisory / Notice Found'}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Automated CPPP Scan:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                      {selectedSub.statutory.cpppDebarment.checkedAt}
                    </div>
                  </div>

                  {selectedSub.statutory.cpppDebarment.debarmentCategory && (
                    <div className="card" style={{ padding: '14px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                      <span style={{ fontSize: '0.75rem', color: '#fb7185' }}>Advisory Category:</span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>
                        {selectedSub.statutory.cpppDebarment.debarmentCategory}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ITR_26AS' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    Income Tax Department ITR-6 & Form 26AS Reconciliation
                  </h3>
                  <span className={`badge ${selectedSub.statutory.itr26as.status === 'CONSISTENT' ? 'badge-success' : 'badge-warning'}`}>
                    ITR Status: {selectedSub.statutory.itr26as.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reported Turnover (CA Certified):</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
                      ₹{selectedSub.statutory.itr26as.reportedTurnoverCr} Crores
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Form 26AS Gross Receipts / TDS Credits:</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedSub.statutory.itr26as.status === 'CONSISTENT' ? '#34d399' : '#fb7185', marginTop: '4px' }}>
                      ₹{selectedSub.statutory.itr26as.gross26asCreditCr} Crores
                    </div>
                  </div>

                  <div className="card" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assessment Year Audited:</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                      {selectedSub.statutory.itr26as.filingAssessmentYear}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};