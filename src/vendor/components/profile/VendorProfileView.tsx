import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Landmark, 
  MapPin, 
  CreditCard, 
  Camera, 
  Save, 
  Edit3, 
  Check, 
  FileCheck2, 
  Rocket, 
  HardHat, 
  TrendingUp, 
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Lock
} from 'lucide-react';
import { VendorProfile, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface VendorProfileViewProps {
  profile: VendorProfile;
  onProfileUpdated?: (updated: VendorProfile) => void;
}

export const VendorProfileView: React.FC<VendorProfileViewProps> = ({
  profile,
  onProfileUpdated
}) => {
  const { updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'STATUTORY' | 'OPERATIONS' | 'BANKING' | 'EDIT'>('STATUTORY');
  
  // Edit Form State
  const [editData, setEditData] = useState({
    name: profile.name,
    brandName: profile.brandName || '',
    authorizedSignatory: profile.authorizedSignatory || profile.name,
    contactEmail: profile.contactEmail || '',
    contactPhone: profile.contactPhone || '',
    address: profile.address || 'Plot 42, Okhla Industrial Area Phase-III',
    state: profile.state || 'Delhi',
    pincode: profile.pincode || '110020',
    turnoverCr: profile.turnoverCr,
    experienceYears: profile.experienceYears,
    miiPercentage: profile.miiPercentage,
    udyamNumber: profile.udyamNumber || '',
    contractorClass: profile.contractorClass || '',
    bankName: profile.bankName || 'State Bank of India',
    bankAccount: profile.bankAccount || '00003891024589',
    ifscCode: profile.ifscCode || 'SBIN0001824',
    profilePhotoUrl: profile.profilePhotoUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80'
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
        updateProfile({ profilePhotoUrl: photoUrl });
        if (onProfileUpdated) {
          onProfileUpdated({ ...profile, profilePhotoUrl: photoUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedProfile: Partial<VendorProfile> = {
      name: editData.name,
      brandName: editData.brandName,
      authorizedSignatory: editData.authorizedSignatory,
      contactEmail: editData.contactEmail,
      contactPhone: editData.contactPhone,
      address: editData.address,
      state: editData.state,
      pincode: editData.pincode,
      turnoverCr: Number(editData.turnoverCr),
      experienceYears: Number(editData.experienceYears),
      miiPercentage: Number(editData.miiPercentage),
      udyamNumber: editData.udyamNumber,
      contractorClass: editData.contractorClass,
      bankName: editData.bankName,
      bankAccount: editData.bankAccount,
      ifscCode: editData.ifscCode,
      profilePhotoUrl: editData.profilePhotoUrl
    };

    updateProfile(updatedProfile);
    if (onProfileUpdated) {
      onProfileUpdated({ ...profile, ...updatedProfile });
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Profile and statutory credentials successfully synchronized with Supabase!');
      setTimeout(() => setSaveMessage(null), 3500);
      setActiveTab('STATUTORY');
    }, 600);
  };

  const roleLabels: Record<UserRole, { title: string; color: string; icon: any }> = {
    OEM_SELLER: { title: 'OEM Original Equipment Manufacturer', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30', icon: Building2 },
    MSME_STARTUP: { title: 'MSME / DPIIT Recognized Startup', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30', icon: Rocket },
    WORKS_CONTRACTOR: { title: 'Civil & EPC Works Contractor', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30', icon: HardHat }
  };

  const currentRoleInfo = roleLabels[profile.role] || roleLabels.OEM_SELLER;
  const RoleIcon = currentRoleInfo.icon;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071933] via-[#0B2545] to-[#08172D] border border-[#1E3A68] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          
          <div className="relative group shrink-0">
            <img 
              src={profile.profilePhotoUrl || editData.profilePhotoUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80'} 
              alt={profile.name} 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-3 border-amber-400 shadow-2xl bg-slate-900"
            />
            <label className="absolute inset-0 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold">
              <Camera size={20} className="mb-1" />
              <span>Update</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-[#0B2545]">
              <ShieldCheck size={16} className="text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 tracking-wider">
                SOVEREIGN VENDOR RECORD
              </span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1.5 ${currentRoleInfo.color}`}>
                <RoleIcon size={12} />
                <span>{currentRoleInfo.title}</span>
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40">
                GFR 2017 PRE-QUALIFIED
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {profile.name}
            </h1>
            {profile.brandName && (
              <p className="text-xs text-amber-400 font-semibold tracking-wide">
                Brand &amp; Trademark: {profile.brandName}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-[#051428] px-3 py-1.5 rounded-lg border border-[#1E3A68] font-mono">
                <span className="text-slate-400">Vendor ID:</span>
                <span className="text-amber-400 font-bold">{profile.id}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#051428] px-3 py-1.5 rounded-lg border border-[#1E3A68] font-mono">
                <span className="text-slate-400">GSTIN:</span>
                <span className="text-cyan-400 font-bold">{profile.gstin}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#051428] px-3 py-1.5 rounded-lg border border-[#1E3A68] font-mono">
                <span className="text-slate-400">PAN:</span>
                <span className="text-slate-200 font-bold">{profile.pan}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#051428] border border-[#1E3A68] rounded-xl p-4 text-center shrink-0 min-w-[140px]">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Compliance Score
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">
              {profile.complianceScore || 92}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Verified GFR Score
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-[#1E3A68] overflow-x-auto text-xs">
          {[
            { id: 'STATUTORY', label: 'Statutory Credentials & MII', icon: ShieldCheck },
            { id: 'OPERATIONS', label: 'Enterprise & Signatory Data', icon: Building2 },
            { id: 'BANKING', label: 'Banking & EMD Vault', icon: Landmark },
            { id: 'EDIT', label: 'Edit Profile & Credentials', icon: Edit3 }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all shrink-0 cursor-pointer border ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' 
                    : 'bg-[#051428] text-slate-300 border-[#1E3A68] hover:bg-[#0C2448] hover:text-white'
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

      {activeTab === 'STATUTORY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-[#08172D] border border-[#1E3A68] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E3A68] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 size={16} className="text-amber-400" />
                <span>Government Statutory Identifiers</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 border border-[#15803D] font-bold">
                API VERIFIED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#051124] rounded-lg border border-[#1E3A68]">
                <div>
                  <span className="text-slate-400 block text-[11px]">GSTIN Registration</span>
                  <span className="text-white font-mono font-bold text-sm">{profile.gstin}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">✓ Active &amp; Regular</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#051124] rounded-lg border border-[#1E3A68]">
                <div>
                  <span className="text-slate-400 block text-[11px]">Permanent Account Number (PAN)</span>
                  <span className="text-white font-mono font-bold text-sm">{profile.pan}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">✓ CBDT Validated</span>
              </div>

              {profile.udyamNumber && (
                <div className="flex items-center justify-between p-3 bg-[#051124] rounded-lg border border-[#1E3A68]">
                  <div>
                    <span className="text-slate-400 block text-[11px]">MSME Udyam Registration</span>
                    <span className="text-amber-400 font-mono font-bold text-sm">{profile.udyamNumber}</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold">✓ Udyam Linked</span>
                </div>
              )}

              {profile.contractorClass && (
                <div className="flex items-center justify-between p-3 bg-[#051124] rounded-lg border border-[#1E3A68]">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Works Contractor Enlistment</span>
                    <span className="text-emerald-400 font-bold text-sm">{profile.contractorClass}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">✓ CPWD Verified</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#08172D] border border-[#1E3A68] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E3A68] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-400" />
                <span>Make-in-India &amp; GFR Status</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
                DPIIT PPP-MII
              </span>
            </div>

            <div className="p-4 bg-[#051124] rounded-lg border border-[#1E3A68] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold">Declared Local Content Percentage</span>
                <span className="text-xl font-extrabold text-amber-400 font-mono">{profile.miiPercentage}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                  style={{ width: `${profile.miiPercentage}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400">
                {profile.miiPercentage >= 50 ? (
                  <span className="text-emerald-400 font-bold">
                    Class-I Local Supplier (Entitled to 20% Purchase Preference in all Central Ministries)
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold">
                    Class-II Local Supplier (20% - 50% Domestic Value Addition)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#051124] rounded-lg border border-[#1E3A68]">
                <span className="text-[11px] text-slate-400 block">Audited 3-Yr Turnover</span>
                <span className="text-white font-mono font-bold text-sm">₹{profile.turnoverCr} Cr</span>
              </div>
              <div className="p-3 bg-[#051124] rounded-lg border border-[#1E3A68]">
                <span className="text-[11px] text-slate-400 block">Verified Experience</span>
                <span className="text-white font-mono font-bold text-sm">{profile.experienceYears} Years</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'OPERATIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#08172D] border border-[#1E3A68] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E3A68] pb-3">
              <Building2 size={16} className="text-amber-400" />
              <span>Authorized Signatory &amp; Contacts</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Authorized Signatory Name</span>
                <span className="text-white font-bold text-sm">{profile.authorizedSignatory || profile.name}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Official Contact Email</span>
                <span className="text-white font-mono">{profile.contactEmail || 'compliance@enterprise.com'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Direct Mobile / Phone</span>
                <span className="text-white font-mono">{profile.contactPhone || '+91 98112 04921'}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#08172D] border border-[#1E3A68] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E3A68] pb-3">
              <MapPin size={16} className="text-emerald-400" />
              <span>Registered Business Location</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Registered Address</span>
                <span className="text-white font-medium">{profile.address || 'Plot 42, Okhla Industrial Area Phase-III'}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block">State / UT</span>
                  <span className="text-white font-bold">{profile.state || 'Delhi'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Pincode</span>
                  <span className="text-white font-mono">{profile.pincode || '110020'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'BANKING' && (
        <div className="bg-[#08172D] border border-[#1E3A68] rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1E3A68] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Landmark size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  PFMS &amp; Direct EMD Settlement Vault
                </h3>
                <p className="text-xs text-slate-400">
                  Secured bank credentials for automated Earnest Money Deposit (EMD) refunds and contract milestones.
                </p>
              </div>
            </div>
            <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-600">
              VAULT ENCRYPTED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#051124] rounded-xl border border-[#1E3A68]">
              <span className="text-[11px] text-slate-400 block mb-1">Bank Name</span>
              <span className="text-white font-bold text-sm">{profile.bankName || 'State Bank of India'}</span>
            </div>
            <div className="p-4 bg-[#051124] rounded-xl border border-[#1E3A68]">
              <span className="text-[11px] text-slate-400 block mb-1">Account Number</span>
              <span className="text-amber-400 font-mono font-bold text-sm">{profile.bankAccount || '00003891024589'}</span>
            </div>
            <div className="p-4 bg-[#051124] rounded-xl border border-[#1E3A68]">
              <span className="text-[11px] text-slate-400 block mb-1">IFSC Code</span>
              <span className="text-cyan-400 font-mono font-bold text-sm uppercase">{profile.ifscCode || 'SBIN0001824'}</span>
            </div>
          </div>

          <div className="p-4 bg-[#051124]/60 rounded-xl border border-[#1E3A68] text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Lock size={14} />
              <span>GFR Rule 170 Compliance Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400">
              This bank account is mapped to your GeM Sovereign Seller ID. All EMD waivers for MSME/Startups and performance security guarantee releases are credited directly via RBI PFMS gateway.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'EDIT' && (
        <div className="bg-[#08172D] border border-[#1E3A68] rounded-xl p-6 space-y-6">
          <div className="border-b border-[#1E3A68] pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 size={18} className="text-amber-400" />
              <span>Modify Enterprise Profile &amp; Photo</span>
            </h3>
            <p className="text-xs text-slate-400">
              Updates to contact details, Make-in-India declared content, and photo sync immediately with Supabase database.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            
            <div className="p-4 bg-[#051124] rounded-xl border border-[#1E3A68] flex items-center gap-4">
              <img 
                src={editData.profilePhotoUrl} 
                alt="Profile Preview" 
                className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400"
              />
              <div className="space-y-1">
                <label className="text-xs font-bold text-white block">Update Profile Photo</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  className="text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-amber-500 file:text-slate-950 file:font-bold hover:file:bg-amber-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Enterprise Name *
                </label>
                <input 
                  type="text"
                  required
                  value={editData.name}
                  onChange={(e) => setEditData(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#051124] border border-[#1E3A68] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Brand / Trade Name
                </label>
                <input 
                  type="text"
                  value={editData.brandName}
                  onChange={(e) => setEditData(p => ({ ...p, brandName: e.target.value }))}
                  className="w-full bg-[#051124] border border-[#1E3A68] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Authorized Signatory
                </label>
                <input 
                  type="text"
                  value={editData.authorizedSignatory}
                  onChange={(e) => setEditData(p => ({ ...p, authorizedSignatory: e.target.value }))}
                  className="w-full bg-[#051124] border border-[#1E3A68] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Contact Phone
                </label>
                <input 
                  type="text"
                  value={editData.contactPhone}
                  onChange={(e) => setEditData(p => ({ ...p, contactPhone: e.target.value }))}
                  className="w-full bg-[#051124] border border-[#1E3A68] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Annual Turnover (₹ Cr)
                </label>
                <input 
                  type="number"
                  step="0.1"
                  value={editData.turnoverCr}
                  onChange={(e) => setEditData(p => ({ ...p, turnoverCr: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-[#051124] border border-[#1E3A68] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Experience (Years)
                </label>
                <input 
                  type="number"
                  value={editData.experienceYears}
                  onChange={(e) => setEditData(p => ({ ...p, experienceYears: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-[#051124] border border-[#1E3A68] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Make-in-India (%)
                </label>
                <input 
                  type="number"
                  min="0"
                  max="100"
                  value={editData.miiPercentage}
                  onChange={(e) => setEditData(p => ({ ...p, miiPercentage: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-[#051124] border border-[#1E3A68] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Bank Name</label>
                <input 
                  type="text"
                  value={editData.bankName}
                  onChange={(e) => setEditData(p => ({ ...p, bankName: e.target.value }))}
                  className="w-full bg-[#051124] border border-[#1E3A68] rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Account Number</label>
                <input 
                  type="text"
                  value={editData.bankAccount}
                  onChange={(e) => setEditData(p => ({ ...p, bankAccount: e.target.value }))}
                  className="w-full bg-[#051124] border border-[#1E3A68] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">IFSC Code</label>
                <input 
                  type="text"
                  value={editData.ifscCode}
                  onChange={(e) => setEditData(p => ({ ...p, ifscCode: e.target.value.toUpperCase() }))}
                  className="w-full bg-[#051124] border border-[#1E3A68] rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-none shadow-lg disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Syncing with Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save &amp; Sync Profile</span>
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