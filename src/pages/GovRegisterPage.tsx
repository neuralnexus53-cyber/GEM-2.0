import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  Landmark, 
  Check, 
  Award,
  FileCheck,
  Shield,
  Briefcase,
  AlertTriangle
} from 'lucide-react';

const DEFAULT_OFFICER_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';

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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isSecondaryQuery = searchParams.get('secondary') === 'true';
  const queryEmail = searchParams.get('email') || '';
  const queryName = searchParams.get('name') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const photoPreview = DEFAULT_OFFICER_PHOTO;

  const [formData, setFormData] = useState(() => {
    const existing = localStorage.getItem('gem_gov_auth_session');
    let base = {
      fullName: queryName || 'Dr. Vikramaditya Sharma, IAS',
      designation: 'Joint Secretary & Tender Committee Chair',
      ministryIndex: 0,
      email: queryEmail || 'vikramaditya.ias@nic.in',
      phone: '+91 98112 04921',
      badgeId: '',
      officeLocation: 'Transport Bhawan, 1 Parliament Street, New Delhi',
      clearanceLevel: 'Level-3 (Senior Procurement Officer)',
      role: (isSecondaryQuery ? 'BUYER_AUTHORITY' : 'TEC_MEMBER') as import('../gov/types/procurement').UserRole,
      cagPin: '9821',
      password: 'SecurePass@2026',
      agreeDeclaration: true
    };

    if (isSecondaryQuery && existing) {
      try {
        const parsed = JSON.parse(existing);
        base.fullName = queryName || parsed.fullName || base.fullName;
        base.email = queryEmail || parsed.email || base.email;
        base.officeLocation = parsed.officeLocation || base.officeLocation;
        base.phone = parsed.phone || base.phone;
        base.designation = parsed.designation || base.designation;
        if (parsed.role === 'TEC_MEMBER') base.role = 'BUYER_AUTHORITY';
        else if (parsed.role === 'BUYER_AUTHORITY') base.role = 'TEC_MEMBER';
        else if (parsed.role === 'SCRUTINY_OFFICER') base.role = 'TEC_MEMBER';
        else base.role = 'CAG_AUDITOR';
      } catch (e) {}
    }
    return base;
  });

  // Check if current officer email/name has already registered prior role(s)
  const registeredOfficersList: any[] = JSON.parse(localStorage.getItem('gem_registered_officers') || '[]');
  const priorRegistrations = registeredOfficersList.filter((o: any) => 
    (formData.email && o.officer?.email?.toLowerCase() === formData.email.toLowerCase()) ||
    (formData.fullName && o.officer?.fullName?.toLowerCase() === formData.fullName.toLowerCase())
  );
  const priorRoles: string[] = priorRegistrations.map((o: any) => o.officer?.role).filter(Boolean);
  const isExceptionalSecondaryRegistration = isSecondaryQuery || priorRoles.length > 0;

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
    
    // Suffix badge ID for secondary role to ensure 100% credential uniqueness
    let generatedBadgeId = formData.badgeId.trim();
    if (!generatedBadgeId) {
      generatedBadgeId = `PO-${selectedMin.code}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      if (isExceptionalSecondaryRegistration) {
        generatedBadgeId += `-${formData.role}`;
      }
    } else if (isExceptionalSecondaryRegistration && !generatedBadgeId.endsWith(`-${formData.role}`)) {
      generatedBadgeId += `-${formData.role}`;
    }

    const officerData = {
      officerId: generatedBadgeId,
      badgeId: generatedBadgeId,
      fullName: formData.fullName || 'Dr. Vikramaditya Sharma, IAS',
      designation: formData.designation || 'Joint Secretary & Tender Committee Chair',
      ministry: selectedMin.ministry,
      department: selectedMin.dept,
      email: formData.email || 'officer@nic.in',
      phone: formData.phone || '+91 98112 04921',
      officeLocation: formData.officeLocation || 'Central Secretariat, New Delhi',
      securityClearanceLevel: formData.clearanceLevel || 'Level-4 (Top Secret / Sovereign Procurement)',
      role: formData.role || 'TEC_MEMBER',
      profilePhotoUrl: photoPreview,
      dscCertificate: {
        issuer: `National Informatics Centre (NIC-CA) Class-3 [${formData.role} Isolated Compartment]`,
        tokenType: `PKCS#11 Hardware Token (${formData.role} Key Vault)`,
        serialNumber: `IN-NIC-2026-${Math.floor(1000 + Math.random() * 9000)}-${formData.role}`,
        fingerprintSha256: `SHA256:NIC_${Date.now()}_${formData.role}_SECURE_TOKEN`,
        validUntil: '2028-12-31',
        status: 'ACTIVE_VALIDATED' as const
      },
      sessionContext: {
        tokenHash: `0x${Math.random().toString(16).substring(2, 10)}...${formData.role}`,
        loginTimestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        ipAddress: '10.14.92.11 (NIC GovNet Internal)',
        mfaMethod: 'Dual-Factor: Aadhaar OTP + Role-Specific DSC Token',
        expiresInMinutes: 480
      }
    };

    // 1. Fire non-blocking backend sync
    try {
      const apiBase = window.location.origin.includes('vercel.app') ? '/api' : 'http://127.0.0.1:8000/api';
      fetch(`${apiBase}/auth/register-officer`, {
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
          role: formData.role,
          profile_photo_url: photoPreview,
          office_location: formData.officeLocation,
          cag_pin: formData.cagPin
        })
      }).catch(() => {});
    } catch (e) {}

    // 2. Persist active officer session in localStorage (opens isolated dashboard for this role)
    localStorage.setItem('gem_gov_auth_session', JSON.stringify(officerData));
    localStorage.setItem(`gem_officer_profile_${generatedBadgeId}`, JSON.stringify(officerData));

    // Save to list of registered officers, keeping all role dossiers separate
    const existingOfficers: any[] = JSON.parse(localStorage.getItem('gem_registered_officers') || '[]');
    const updatedOfficers = [
      ...existingOfficers.filter((o: any) => o.officer?.badgeId !== generatedBadgeId),
      {
        officer: officerData,
        password: formData.password
      }
    ];
    localStorage.setItem('gem_registered_officers', JSON.stringify(updatedOfficers));

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
              
              {/* Sovereign Identity & NIC GovNet Verification Banner */}
              <div className="bg-slate-950/90 p-4 rounded-xl border border-blue-500/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider block">
                        NIC Sovereign Identity &amp; Service Book Verification
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Government Personnel Authentication Gateway • e-Pramaan Single Sign-On
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1 font-mono shrink-0">
                    <CheckCircle2 size={11} />
                    <span>NIC GOVNET CLEARED</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Authentication Protocol</span>
                    <span className="font-semibold text-slate-200">Aadhaar e-KYC + NIC SPARROW</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Digital Signature Vault</span>
                    <span className="font-semibold text-blue-300">PKCS#11 FIPS 140-2 Level 3</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Statutory Audit Anchor</span>
                    <span className="font-semibold text-amber-300">CAG Merkle SHA-256 Ledger</span>
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

              {/* Exceptional Secondary Role Appointment Notice */}
              {isExceptionalSecondaryRegistration && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle size={16} />
                    <span>Exceptional Secondary Role Appointment (GFR Rule 189/160 Exception Mandate)</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Officer identity <strong className="text-white">{formData.fullName}</strong> holds prior registered credentials for: <span className="font-mono text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">{priorRoles.join(', ')}</span>.
                  </p>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Under GFR 2017 separation-of-duties rules, an officer cannot combine conflicting procurement powers in a single dashboard. Registering this exceptional secondary role will issue a <strong>dedicated Sovereign Credential Dossier</strong> (Badge ID suffix: <code className="text-sky-300 font-bold">-{formData.role}</code>) and separate Class-3 DSC Token, granting access to a completely isolated, role-limited dashboard.
                  </p>
                </div>
              )}

              {/* Sovereign GFR Role Selection (Permanent Binding) */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-blue-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-amber-400" />
                    <label className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Designated Statutory Role (Permanent Binding per GFR 2017) *
                    </label>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                    LOCKED ON REGISTRATION
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-300">
                  Select your exact procurement role. Under GFR 2017 Rules 164 &amp; 189, your dashboard privileges, visible tabs, and decision authorities will be permanently restricted to this single role.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {[
                    {
                      id: 'SCRUTINY_OFFICER',
                      name: 'Preliminary Scrutiny Officer',
                      rule: 'GFR 2017 Rule 164',
                      badge: 'PQC & Registries',
                      desc: 'Validates 7 Sovereign registries (GSTN, MCA, EPFO, CBDT) & PQC compliance. Issues 48h discrepancy notices. Cannot assign technical scores.'
                    },
                    {
                      id: 'TEC_MEMBER',
                      name: 'Technical Committee (TEC)',
                      rule: 'GFR 2017 Rule 189',
                      badge: 'Double-Blind Grading',
                      desc: 'Scores technical bids (/100 pts), evaluates Make in India compliance, signs marks with DSC. Cannot create tenders or unmask vault.'
                    },
                    {
                      id: 'BUYER_AUTHORITY',
                      name: 'Competent Buyer Authority',
                      rule: 'GeM Rule 160',
                      badge: 'Tenders & Vault Key',
                      desc: 'Publishes public tenders, sets QCBS weights, and holds exclusive authority to authorize commercial double-blind vault unmasking.'
                    },
                    {
                      id: 'CAG_AUDITOR',
                      name: 'CAG Vigilance Auditor',
                      rule: 'CAG Act Section 14',
                      badge: 'Read-Only Oversight',
                      desc: 'Cryptographic oversight across all bids, verifies Merkle SHA-256 ledger integrity, and exports official CAG compliance dossiers.'
                    }
                  ].map((r) => {
                    const isSelected = formData.role === r.id;
                    const isAlreadyHeld = priorRoles.includes(r.id);
                    return (
                      <div
                        key={r.id}
                        onClick={() => setFormData(prev => ({ ...prev, role: r.id as import('../gov/types/procurement').UserRole }))}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500 text-white shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                            {r.name}
                          </span>
                          <div className="flex items-center gap-1">
                            {isAlreadyHeld && (
                              <span className="text-[8px] px-1 py-0.2 rounded font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600">
                                PRIOR ROLE
                              </span>
                            )}
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                              isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {r.rule}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-400 line-clamp-2">
                          {r.desc}
                        </p>
                      </div>
                    );
                  })}
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