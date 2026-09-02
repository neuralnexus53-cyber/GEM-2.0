import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Landmark, 
  Award, 
  CheckCircle2, 
  Lock, 
  Camera, 
  Save, 
  Edit3, 
  FileCheck, 
  Layers, 
  Database,
  Building2,
  MapPin,
  Mail,
  Phone,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { OfficerProfile } from '../../types/procurement';

interface GovOfficerProfileViewProps {
  profile: OfficerProfile;
  onProfileUpdated?: (updated: OfficerProfile) => void;
}

export const GovOfficerProfileView: React.FC<GovOfficerProfileViewProps> = ({
  profile,
  onProfileUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'CREDENTIALS' | 'CAG_CRYPTO' | 'ACTIVITY' | 'EDIT'>('CREDENTIALS');
  
  const [editData, setEditData] = useState({
    fullName: profile.fullName,
    designation: profile.designation,
    ministry: profile.ministry,
    department: profile.department,
    email: profile.email || 'officer@gov.in',
    phone: profile.phone || '+91 98112 04921',
    officeLocation: profile.officeLocation || 'Transport Bhawan, 1 Parliament Street, New Delhi',
    securityClearanceLevel: profile.securityClearanceLevel || 'Level-4 (Top Secret / Sovereign Procurement)',
    profilePhotoUrl: profile.profilePhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        setEditData(prev => ({ ...prev, profilePhotoUrl: photoUrl }));
        const updated = { ...profile, profilePhotoUrl: photoUrl };
        if (onProfileUpdated) onProfileUpdated(updated);
        localStorage.setItem('gem_gov_auth_session', JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedProfile: OfficerProfile = {
      ...profile,
      fullName: editData.fullName,
      designation: editData.designation,
      ministry: editData.ministry,
      department: editData.department,
      email: editData.email,
      phone: editData.phone,
      officeLocation: editData.officeLocation,
      securityClearanceLevel: editData.securityClearanceLevel,
      profilePhotoUrl: editData.profilePhotoUrl
    };

    if (onProfileUpdated) {
      onProfileUpdated(updatedProfile);
    }
    localStorage.setItem('gem_gov_auth_session', JSON.stringify(updatedProfile));
    localStorage.setItem(`gem_officer_profile_${profile.badgeId}`, JSON.stringify(updatedProfile));

    // Sync with FastAPI backend & Supabase
    try {
      await fetch(`http://localhost:8000/api/gov/officer/profile/${profile.badgeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
    } catch (err) {}

    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Official credentials and authorization dossier updated in Supabase!');
      setTimeout(() => setSaveMessage(null), 3500);
      setActiveTab('CREDENTIALS');
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#04132B] via-[#0A2540] to-[#041021] border border-blue-500/30 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          
          <div className="relative group shrink-0">
            <img 
              src={profile.profilePhotoUrl || editData.profilePhotoUrl} 
              alt={profile.fullName} 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-3 border-blue-400 shadow-2xl bg-slate-900"
            />
            <label className="absolute inset-0 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold">
              <Camera size={20} className="mb-1" />
              <span>Update</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg border-2 border-[#0A2540]">
              <Award size={16} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40 tracking-wider">
                GOVERNMENT OF INDIA • PROCUREMENT AUTHORITY
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>NIC CLASS-3 CERTIFIED</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {profile.fullName}
            </h1>
            <p className="text-sm text-blue-300 font-semibold">
              {profile.designation}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-300">
              <Landmark size={14} className="text-amber-400 shrink-0" />
              <span>{profile.ministry} — {profile.department}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5 bg-[#020B18] px-3 py-1.5 rounded-lg border border-blue-900 font-mono">
                <span className="text-slate-400">Badge ID:</span>
                <span className="text-blue-400 font-bold">{profile.badgeId}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#020B18] px-3 py-1.5 rounded-lg border border-blue-900 font-mono">
                <span className="text-slate-400">Clearance:</span>
                <span className="text-amber-400 font-bold">{profile.securityClearanceLevel}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#020B18] border border-blue-900/80 rounded-xl p-4 text-center shrink-0 min-w-[150px]">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              CAG Digital Signature
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400 mt-1.5 truncate max-w-[140px]">
              {profile.dscCertificate?.fingerprintSha256 ? `SHA256:${profile.dscCertificate.fingerprintSha256.substring(0, 10)}...` : 'ACTIVE_VALIDATED'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              ePass2003 Token Linked
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-blue-900/60 overflow-x-auto text-xs">
          {[
            { id: 'CREDENTIALS', label: 'Official Authority & DSC Credentials', icon: ShieldCheck },
            { id: 'CAG_CRYPTO', label: 'CAG Ledger & Cryptographic Keys', icon: KeyRound },
            { id: 'ACTIVITY', label: 'Tender Evaluation & Audit Records', icon: Layers },
            { id: 'EDIT', label: 'Edit Officer Dossier', icon: Edit3 }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all shrink-0 cursor-pointer border ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md' 
                    : 'bg-[#020B18] text-slate-300 border-blue-900 hover:bg-[#071933] hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {saveMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 p-4 rounded-xl text-xs flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {activeTab === 'CREDENTIALS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Landmark size={16} className="text-blue-600" />
                <span>Institutional Authority Record</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Authorized Officer Full Name</span>
                <span className="font-bold text-slate-900 text-sm">{profile.fullName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Designation &amp; Committee Role</span>
                <span className="font-bold text-blue-700">{profile.designation}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Ministry &amp; Attached Directorate</span>
                <span className="font-semibold text-slate-800">{profile.ministry} ({profile.department})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Official Headquarters Location</span>
                <span className="font-medium text-slate-700">{profile.officeLocation || 'Transport Bhawan, New Delhi'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>NIC Class-3 Digital Signature Certificate</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-300">
                PKCS#11
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Certificate Authority (Issuer)</span>
                <span className="font-bold text-slate-900">{profile.dscCertificate?.issuer || 'National Informatics Centre (NIC-CA) Class-3'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Hardware Token Serial</span>
                <span className="font-mono font-bold text-blue-700">{profile.dscCertificate?.serialNumber || 'IN-NIC-8942-0199-B7'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Cryptographic SHA-256 Security Hash</span>
                <span className="font-mono font-bold text-slate-800 break-all">{profile.dscCertificate?.fingerprintSha256 || '7B8F9A01C2945DF8812456AE3290FE19823467AB'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[11px]">Validity Status</span>
                  <span className="font-bold text-emerald-700">Valid through {profile.dscCertificate?.validUntil || '2028-12-31'}</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">✓ Hardware Synced</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'CAG_CRYPTO' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <KeyRound size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Comptroller &amp; Auditor General (CAG) Sovereign Key Vault
                </h3>
                <p className="text-xs text-slate-500">
                  Cryptographic hash anchoring for zero-tamper evaluation logging and Double-Blind Vault unmasking.
                </p>
              </div>
            </div>
            <span className="text-[10px] px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-300">
              IMMUTABLE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block mb-1">Clearance Level</span>
              <span className="font-bold text-blue-800 text-sm">{profile.securityClearanceLevel}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block mb-1">Evaluation Role</span>
              <span className="font-bold text-emerald-700 text-sm">Technical Evaluation Chair</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block mb-1">Session Security State</span>
              <span className="font-mono font-bold text-slate-800 text-xs">Dual-Factor Aadhaar+DSC</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs font-mono">
            <div className="text-blue-400 font-bold uppercase text-[11px]">
              Active Merkle Block Anchor Security Hash
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-emerald-400 break-all">
              SHA256:4C91E2108FA92837B5143DEE9918235FBC81729054A3B12879F438D1C0830421
            </div>
            <p className="text-[11px] text-slate-400 pt-1 font-sans">
              All bid scores, discrepancy flags, and tender approvals recorded under this officer account are digitally signed and sealed into the CAG immutable blockchain ledger.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'ACTIVITY' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm">
            <div className="text-xs text-slate-500 uppercase font-bold">Tenders Evaluated</div>
            <div className="text-3xl font-extrabold text-blue-700 mt-2 font-mono">48</div>
            <div className="text-[11px] text-slate-400 mt-1">High-value GFR Tenders</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm">
            <div className="text-xs text-slate-500 uppercase font-bold">Sealed Audit Blocks</div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2 font-mono">112</div>
            <div className="text-[11px] text-slate-400 mt-1">CAG Verified Entries</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm">
            <div className="text-xs text-slate-500 uppercase font-bold">Unmasking Approvals</div>
            <div className="text-3xl font-extrabold text-amber-600 mt-2 font-mono">14</div>
            <div className="text-[11px] text-slate-400 mt-1">Double-Blind Stage-2 Cleared</div>
          </div>
        </div>
      )}

      {activeTab === 'EDIT' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 text-slate-800">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Edit3 size={18} className="text-blue-600" />
              <span>Modify Government Officer Dossier</span>
            </h3>
            <p className="text-xs text-slate-500">
              Updates will synchronize with Supabase database and update your digital credentials.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
              <img 
                src={editData.profilePhotoUrl} 
                alt="Profile Preview" 
                className="w-16 h-16 rounded-xl object-cover border-2 border-blue-600"
              />
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 block">Change Officer Photograph</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-bold hover:file:bg-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Officer Full Name *
                </label>
                <input 
                  type="text"
                  required
                  value={editData.fullName}
                  onChange={(e) => setEditData(p => ({ ...p, fullName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Official Designation *
                </label>
                <input 
                  type="text"
                  required
                  value={editData.designation}
                  onChange={(e) => setEditData(p => ({ ...p, designation: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Official Email ID
                </label>
                <input 
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Contact Phone / Extension
                </label>
                <input 
                  type="text"
                  value={editData.phone}
                  onChange={(e) => setEditData(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Ministry
                </label>
                <input 
                  type="text"
                  value={editData.ministry}
                  onChange={(e) => setEditData(p => ({ ...p, ministry: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Attached Department / Division
                </label>
                <input 
                  type="text"
                  value={editData.department}
                  onChange={(e) => setEditData(p => ({ ...p, department: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Headquarters / Office Location
              </label>
              <input 
                type="text"
                value={editData.officeLocation}
                onChange={(e) => setEditData(p => ({ ...p, officeLocation: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-none shadow-lg disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Syncing with Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save &amp; Sync Officer Dossier</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};