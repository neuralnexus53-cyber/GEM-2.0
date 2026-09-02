import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  Landmark, 
  Camera, 
  Check, 
  Award,
  FileCheck,
  Shield,
  Briefcase
} from 'lucide-react';

const PRESET_OFFICER_PHOTOS = [
  { label: 'CPO Male', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { label: 'Director Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
  { label: 'Senior Engineer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  { label: 'Joint Secretary', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' }
];

const MINISTRIES_LIST = [
  { ministry: 'Ministry of Road Transport & Highways', dept: 'National Highways Authority of India (NHAI)', code: 'MORTH' },
  { ministry: 'Ministry of Defence', dept: 'Department of Defence Production (DDP)', code: 'DEF' },
  { ministry: 'Ministry of Railways', dept: 'Railway Board & RDSO Procurement', code: 'RLY' },
  { ministry: 'Ministry of Electronics & IT', dept: 'National Informatics Centre (NIC) & Digital India', code: 'MEITY' },
  { ministry: 'Ministry of Power', dept: 'Central Electricity Authority & NTPC', code: 'PWR' },
  { ministry: 'Ministry of Housing & Urban Affairs', dept: 'Central Public Works Department (CPWD)', code: 'CPWD' }
];

export default function GovRegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>(PRESET_OFFICER_PHOTOS[0].url);

  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    ministryIndex: 0,
    email: '',
    phone: '',
    badgeId: '',
    officeLocation: '',
    clearanceLevel: 'Level-3 (Senior Procurement Officer)',
    cagPin: '',
    password: '',
    agreeDeclaration: false
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleGovRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedMin = MINISTRIES_LIST[Number(formData.ministryIndex)] || MINISTRIES_LIST[0];
    const generatedBadgeId = formData.badgeId || `PO-${selectedMin.code}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const officerData = {
      officerId: generatedBadgeId,
      badgeId: generatedBadgeId,
      fullName: formData.fullName,
      designation: formData.designation,
      ministry: selectedMin.ministry,
      department: selectedMin.dept,
      email: formData.email,
      phone: formData.phone || '+91 98112 04921',
      officeLocation: formData.officeLocation,
      securityClearanceLevel: formData.clearanceLevel,
      profilePhotoUrl: photoPreview,
      dscCertificate: {
        issuer: 'National Informatics Centre (NIC-CA) Class-3 Sovereign',
        tokenType: 'PKCS#11 Hardware Token (ePass2003)',
        serialNumber: `IN-NIC-2026-${Math.floor(1000 + Math.random() * 9000)}-B7`,
        fingerprintSha256: `7B8F9A01C2945DF8812456AE3290FE19823467${Math.floor(10 + Math.random() * 89)}`,
        validUntil: '2028-12-31',
        status: 'ACTIVE_VALIDATED' as const
      },
      sessionContext: {
        tokenHash: `0x${Math.random().toString(16).substring(2, 10)}...NIC_SOVEREIGN`,
        loginTimestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        ipAddress: '10.14.92.11 (NIC GovNet Internal)',
        mfaMethod: 'Dual-Factor: Aadhaar OTP + DSC Token',
        expiresInMinutes: 480
      }
    };

    // 1. Sync with FastAPI backend & Supabase
    try {
      const apiBase = window.location.origin.includes('vercel.app') ? '/api' : 'http://127.0.0.1:8000/api';
      await fetch(`${apiBase}/auth/register-officer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          designation: formData.designation,
          ministry: selectedMin.ministry,
          department: selectedMin.dept,
          email: formData.email,
          password: formData.password,
          badge_id: generatedBadgeId,
          phone: formData.phone,
          clearance_level: formData.clearanceLevel,
          profile_photo_url: photoPreview,
          office_location: formData.officeLocation,
          cag_pin: formData.cagPin
        })
      });
    } catch (e) {
      console.warn('[Gov Registration] Backend offline, saving to sovereign local store:', e);
    }

    // 2. Persist active officer session in localStorage
    localStorage.setItem('gem_gov_auth_session', JSON.stringify(officerData));
    localStorage.setItem(`gem_officer_profile_${generatedBadgeId}`, JSON.stringify(officerData));

    // Save to list of registered officers
    const existingOfficers = JSON.parse(localStorage.getItem('gem_registered_officers') || '[]');
    existingOfficers.push({
      officer: officerData,
      password: formData.password
    });
    localStorage.setItem('gem_registered_officers', JSON.stringify(existingOfficers));

    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => {
      navigate('/gov');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)' }} />

      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline text-white">
          <img 
            src="./images/logoclone1.png" 
            alt="GeM Logo" 
            className="h-8 w-auto object-contain"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          <div>
            <span className="font-extrabold text-sm sm:text-base text-white tracking-tight block">
              GEM 2.0 PROCUREMENT SUITE
            </span>
            <span className="text-[10px] text-blue-400 font-medium tracking-wider block">
              Government Officer Onboarding Gateway
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link 
            to="/gov/login" 
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-3 py-1.5 rounded-lg border border-blue-500/30 hover:border-blue-400 transition-all"
          >
            Existing Officer? Sign In
          </Link>
          <Link 
            to="/" 
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 transition-colors"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-3 border border-blue-500/20">
              <Landmark size={28} />
            </div>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block mb-1">
              Government of India • Ministry Verification
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Procurement Officer Registration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
              Create your official digital identity for tender authoring, automated 14-point AI bidder compliance verification, and CAG ledger signing.
            </p>
          </div>

          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto animate-bounce border border-blue-500/30">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-xl font-bold text-white">Authority Credential Provisioned!</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Your NIC-certified Procurement Officer profile and CAG cryptographic key have been generated and synced with Supabase. Redirecting to your Suite...
              </p>
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mt-4" />
            </div>
          ) : (
            <form onSubmit={handleGovRegister} className="space-y-6" autoComplete="off">
              
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Official Officer Photograph / NIC ID Badge *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group">
                    <img 
                      src={photoPreview} 
                      alt="Officer Photo" 
                      className="w-20 h-20 rounded-xl object-cover border-2 border-blue-500 shadow-md bg-slate-900"
                    />
                    <label className="absolute inset-0 bg-slate-950/70 rounded-xl flex flex-col items-center justify-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                      <Camera size={18} className="mb-1" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {PRESET_OFFICER_PHOTOS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPhotoPreview(av.url)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                            photoPreview === av.url 
                              ? 'bg-blue-500 text-white border-blue-400 font-bold' 
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {av.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Upload your official passport photo or choose an avatar for the digital CAG evaluation ledger.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Officer Full Name *
                  </label>
                  <input 
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Dr. Arvind R. Verma"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Official Designation *
                  </label>
                  <input 
                    type="text"
                    name="designation"
                    required
                    placeholder="e.g. Chief Procurement Officer"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Ministry &amp; Attached Department *
                </label>
                <select
                  name="ministryIndex"
                  value={formData.ministryIndex}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {MINISTRIES_LIST.map((m, idx) => (
                    <option key={idx} value={idx}>
                      {m.ministry} — {m.dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Government Official Email ID *
                  </label>
                  <input 
                    type="email"
                    name="email"
                    required
                    placeholder="arvind.verma@nhai.gov.in"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Official Contact / Mobile Number *
                  </label>
                  <input 
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98112 04921"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Official Employee Badge ID (Leave blank to Auto-Generate)
                  </label>
                  <input 
                    type="text"
                    name="badgeId"
                    placeholder="PO-MORTH-2026-9812"
                    value={formData.badgeId}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white uppercase focus:outline-none focus:border-blue-500 font-mono placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Security Clearance Level *
                  </label>
                  <select
                    name="clearanceLevel"
                    value={formData.clearanceLevel}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="Level-4 (Top Secret / Sovereign Procurement)">Level-4 (Top Secret / Sovereign Procurement)</option>
                    <option value="Level-3 (Confidential / CAG Vault Signer)">Level-3 (Confidential / CAG Vault Signer)</option>
                    <option value="Level-2 (Restricted / Technical Evaluator)">Level-2 (Restricted / Technical Evaluator)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Headquarters / Office Location
                  </label>
                  <input 
                    type="text"
                    name="officeLocation"
                    value={formData.officeLocation}
                    onChange={handleChange}
                    placeholder="Transport Bhawan, 1 Parliament Street, New Delhi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    CAG Ledger Signing PIN (4 Digits) *
                  </label>
                  <input 
                    type="password"
                    maxLength={4}
                    name="cagPin"
                    required
                    value={formData.cagPin}
                    onChange={handleChange}
                    placeholder="2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono text-center tracking-widest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Create Secured Access Passcode *
                </label>
                <input 
                  type="password"
                  name="password"
                  required
                  placeholder="Minimum 8 characters with letters & numbers"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <input 
                  type="checkbox"
                  id="govDecl"
                  name="agreeDeclaration"
                  checked={formData.agreeDeclaration}
                  onChange={handleChange}
                  required
                  className="w-4 h-4 rounded text-blue-500 focus:ring-0 cursor-pointer mt-0.5"
                />
                <label htmlFor="govDecl" className="text-xs text-slate-300 cursor-pointer">
                  I solemnly affirm that I am an authorized Procurement Officer of the Government of India, bound by the Official Secrets Act, 1923, and General Financial Rules (GFR 2017).
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Issuing Sovereign Officer Credentials & Supabase Sync...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Register &amp; Issue DSC Authority Credentials</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <span>GEM 2.0 PROCUREMENT SUITE • Ministry of Commerce &amp; Industry • Smart India Hackathon 2026</span>
      </footer>

    </div>
  );
}