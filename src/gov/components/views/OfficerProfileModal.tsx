import React from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Landmark, 
  Award, 
  CheckCircle2, 
  LogOut, 
  Lock
} from 'lucide-react';
import { OfficerProfile } from '../../types/procurement';

interface OfficerProfileModalProps {
  profile: OfficerProfile;
  onClose: () => void;
  onLogout: () => void;
}

export const OfficerProfileModal: React.FC<OfficerProfileModalProps> = ({
  profile,
  onClose,
  onLogout,
}) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '6px',
              background: '#0c2340',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={22} color="#f59e0b" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Officer Profile & Credentials
                </h3>
                <span className="badge badge-emerald">
                  <CheckCircle2 size={12} style={{ marginRight: '3px' }} />
                  Verified Officer
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Government e Marketplace • Authenticated Procurement Officer
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm">✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
          
          <div className="card" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                  Government Procurement Authority
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {profile.fullName}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#005691', fontWeight: 600, marginTop: '1px' }}>
                  {profile.designation}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', color: '#475569', marginTop: '4px' }}>
                  <Landmark size={13} color="#d97706" />
                  <span>{profile.ministry}</span>
                </div>
                <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px' }}>
                  {profile.department}
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '10px 16px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Officer Badge ID
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#005691', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {profile.badgeId}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#15803d', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <CheckCircle2 size={11} />
                  <span>Active Session</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            
            <div className="card" style={{ padding: '14px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <ShieldCheck size={16} color="#15803d" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  Official Clearance & Authority
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.775rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '4px' }}>
                  <span style={{ color: '#64748b' }}>Clearance Level:</span>
                  <span style={{ fontWeight: 700, color: '#15803d' }}>Level-4 (Strategic Tenders)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '4px' }}>
                  <span style={{ color: '#64748b' }}>Approval Scope:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Public & PSU Tenders</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '4px' }}>
                  <span style={{ color: '#64748b' }}>Audit Compliance:</span>
                  <span style={{ fontWeight: 600, color: '#b45309' }}>GFR 2017 & CVC Guidelines</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '14px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <KeyRound size={16} color="#005691" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  Digital Signature Certificate (DSC)
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.775rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '4px' }}>
                  <span style={{ color: '#64748b' }}>Certifying Authority:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>NIC-CA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '4px' }}>
                  <span style={{ color: '#64748b' }}>DSC Type:</span>
                  <span style={{ fontWeight: 600, color: '#005691' }}>Class-3 Signing & Encryption</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '4px' }}>
                  <span style={{ color: '#64748b' }}>Status:</span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.625rem' }}>
                    Active (Valid to 2028)
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        <div className="modal-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.725rem', color: '#64748b' }}>
            <Lock size={13} color="#15803d" />
            <span>Secure Official Session Protected</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onLogout} className="btn btn-outline" style={{ borderColor: '#fecaca', color: '#dc2626' }}>
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
            <button onClick={onClose} className="btn btn-primary">
              <span>Done</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};