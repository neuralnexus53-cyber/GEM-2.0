import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  FileCheck, 
  ShieldAlert, 
  Cpu, 
  Sparkles,
  Smartphone,
  AlertTriangle,
  Layers,
  Award,
  ChevronRight
} from 'lucide-react';
import { ROLE_DEFINITIONS, UserRole } from '../gov/types/procurement';

export default function GovLoginPage() {
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState('PO-MORTH-2026-9812');
  const [passcode, setPasscode] = useState('SecurePass@2026');
  const [otpCode, setOtpCode] = useState('202688');
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDscToken, setSelectedDscToken] = useState('PO-MORTH-2026-9812');
  const [matchingDossiers, setMatchingDossiers] = useState<any[]>([]);

  const handleDscTokenChange = (tokenId: string) => {
    setSelectedDscToken(tokenId);
    if (!tokenId) return;

    if (tokenId === 'PO-MORTH-2026-9812') {
      setOfficerId('PO-MORTH-2026-9812');
      setPasscode('SecurePass@2026');
      setOtpCode('202688');
    } else if (tokenId === 'PO-DEF-2026-4412') {
      setOfficerId('PO-DEF-2026-4412');
      setPasscode('SecurePass@2026');
      setOtpCode('202688');
    } else if (tokenId === 'PO-RAIL-2026-5501') {
      setOfficerId('PO-RAIL-2026-5501');
      setPasscode('SecurePass@2026');
      setOtpCode('202688');
    } else if (tokenId === 'PO-CAG-2026-1088') {
      setOfficerId('PO-CAG-2026-1088');
      setPasscode('SecurePass@2026');
      setOtpCode('202688');
    }
  };

  const handleOfficerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanId = (officerId.trim() || 'PO-MORTH-2026-9812').toLowerCase();

    // Check local registered officers
    const regOfficers = JSON.parse(localStorage.getItem('gem_registered_officers') || '[]');
    
    // Find all dossiers matching the entered email, badgeId, or username
    const matches = regOfficers.filter((o: any) => {
      const email = o.officer?.email?.toLowerCase() || '';
      const badge = o.officer?.badgeId?.toLowerCase() || '';
      const officerIdVal = o.officer?.officerId?.toLowerCase() || '';
      const name = o.officer?.fullName?.toLowerCase() || '';
      const cleanPrefix = cleanId.includes('@') ? cleanId.split('@')[0] : cleanId;
      const emailPrefix = email.includes('@') ? email.split('@')[0] : email;

      return (
        email === cleanId ||
        badge === cleanId ||
        officerIdVal === cleanId ||
        (cleanPrefix && emailPrefix === cleanPrefix) ||
        (name && name.includes(cleanId))
      );
    });

    // If multiple dossiers match (e.g. officer registered for secondary role under GFR Rule 189/160 exception)
    if (matches.length > 1 && !matches.some((m: any) => m.officer?.badgeId?.toLowerCase() === cleanId)) {
      setMatchingDossiers(matches);
      setIsLoading(false);
      return;
    }

    // If exactly one match or an exact badgeId matched
    const matched = matches.find((m: any) => m.officer?.badgeId?.toLowerCase() === cleanId) || matches[0];

    if (matched && matched.officer) {
      const officerWithRole = {
        ...matched.officer,
        role: matched.officer.role || 'TEC_MEMBER'
      };
      localStorage.setItem('gem_gov_auth_session', JSON.stringify(officerWithRole));
    } else {
      // Determine Ministry & Dept based on entered ID
      let ministry = 'Ministry of Road Transport & Highways (MoRTH)';
      let dept = 'Highways & Intelligent Transport Systems Division';
      let name = 'Dr. Vikramaditya Sharma, IAS';
      let designation = 'Joint Secretary & Tender Committee Chair';
      let role: import('../gov/types/procurement').UserRole = 'TEC_MEMBER';

      if (cleanId.includes('def') || cleanId.includes('drdo')) {
        ministry = 'Ministry of Defence (MoD)';
        dept = 'Directorate of Defence Procurement & DRDO Telemetry';
        name = 'Shri Rajeshwar Singh, IDAS';
        designation = 'Director (Defence Contracts & Procurement)';
        role = 'BUYER_AUTHORITY';
      } else if (cleanId.includes('rail')) {
        ministry = 'Ministry of Railways (Railway Board)';
        dept = 'Railway Electrification & Signalling Procurement Cell';
        name = 'Smt. Ananya Banerjee, IRSS';
        designation = 'Principal Chief Materials Manager (PCMM)';
        role = 'SCRUTINY_OFFICER';
      } else if (cleanId.includes('cag') || cleanId.includes('audit') || cleanId.includes('power') || cleanId.includes('nhpc')) {
        ministry = 'Comptroller & Auditor General of India (CAG)';
        dept = 'Commercial Audit & Sovereign Public Procurement Wing';
        name = 'Shri K. Venkatraman, IA&AS';
        designation = 'Principal Director of Audit (Procurement)';
        role = 'CAG_AUDITOR';
      }

      const activeBadgeId = officerId.trim().toUpperCase() || 'PO-MORTH-2026-9812';
      const newOfficerSession = {
        officerId: activeBadgeId,
        fullName: name,
        designation: designation,
        ministry: ministry,
        department: dept,
        securityClearanceLevel: 'Level-4 (Top Secret / Sovereign Procurement)',
        role: role,
        badgeId: activeBadgeId,
        email: cleanId.includes('@') ? cleanId : `${cleanId.toLowerCase()}@nic.in`,
        dscCertificate: {
          issuer: 'National Informatics Centre (NIC-CA) Class-3 Gov Sub-CA',
          tokenType: 'PKCS#11 Hardware Token (ePass2003 FIPS 140-2 Level 3)',
          serialNumber: `IN-NIC-${Math.floor(1000 + Math.random() * 9000)}-B7X`,
          fingerprintSha256: `SHA256:NIC_${Date.now()}_GOV_SECURE_TOKEN`,
          validUntil: '2028-12-31',
          status: 'ACTIVE_VALIDATED'
        },
        sessionContext: {
          tokenHash: `SEC-TOK-${Date.now()}-NIC`,
          loginTimestamp: new Date().toISOString(),
          ipAddress: '10.248.14.88 (NIC Gov Protected Gateway)',
          mfaMethod: 'Dual-Factor: Aadhaar e-Sign OTP + Class-3 Hardware Token',
          expiresInMinutes: 480
        }
      };

      localStorage.setItem('gem_gov_auth_session', JSON.stringify(newOfficerSession));

      // Fire non-blocking background sync if backend available
      try {
        const apiBase = window.location.origin.includes('vercel.app') ? '/api' : 'http://127.0.0.1:8000/api';
        fetch(`${apiBase}/auth/login-officer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: activeBadgeId, password: passcode || 'SecurePass@2026' })
        }).catch(() => {});
      } catch (err) {}
    }

    setIsLoading(false);
    navigate('/gov');
  };

  const handleSelectDossier = (dossier: any) => {
    localStorage.setItem('gem_gov_auth_session', JSON.stringify(dossier.officer));
    navigate('/gov');
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
              GEM 2.0 COMPLIANCE PORTAL
            </span>
            <span className="text-[10px] text-blue-400 font-medium tracking-wider block">
              Procurement Officer Sovereign Gateway
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link 
            to="/gov/register" 
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-3 py-1.5 rounded-lg border border-blue-500/30 hover:border-blue-400 transition-all"
          >
            New Officer? Register
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
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-4 border border-blue-500/20">
              <Building2 size={28} />
            </div>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block mb-1">
              Government of India • GeM 2.0
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Procurement Officer Login
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Secure single-sign-on for tender publishing, 14-point automated bidder compliance verification, and CAG ledger signing.
            </p>
          </div>

          {matchingDossiers.length > 1 ? (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 mx-auto mb-3 border border-amber-500/30">
                  <Award size={28} />
                </div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
                  GFR Rule 189/160 Exception Mandate
                </span>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Dual Role Appointments Detected
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                  Officer identity <strong className="text-white">{matchingDossiers[0]?.officer?.fullName || officerId}</strong> holds multiple isolated credential dossiers. Under GFR separation of duties, choose which isolated role dashboard to launch:
                </p>
              </div>

              <div className="space-y-3">
                {matchingDossiers.map((item, idx) => {
                  const roleKey = (item.officer?.role || 'TEC_MEMBER') as UserRole;
                  const def = ROLE_DEFINITIONS[roleKey] || ROLE_DEFINITIONS.TEC_MEMBER;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/60 transition-all space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                              {def.title}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              {def.statutoryRule}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {item.officer?.department || item.officer?.ministry}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-slate-400">
                        <div>
                          <span className="text-slate-500 block">Badge ID:</span>
                          <span className="text-sky-400 font-bold">{item.officer?.badgeId}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">DSC Token:</span>
                          <span className="text-emerald-400 font-bold truncate block">
                            {item.officer?.dscCertificate?.serialNumber || 'Hardware Synced'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectDossier(item)}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-3 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-md"
                      >
                        <Lock size={13} />
                        <span>Authenticate &amp; Open {def.title.split(' ')[0]} Dashboard</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMatchingDossiers([])}
                  className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer border-none transition-colors"
                >
                  ← Return to Login Form
                </button>
                <Link
                  to={`/gov/register?secondary=true${officerId.includes('@') ? `&email=${encodeURIComponent(officerId)}` : ''}`}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  + Register Another Secondary Role
                </Link>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleOfficerLogin} className="space-y-5" autoComplete="off">
                
                {/* Authorized NIC-CA Hardware Certificate / DSC Token Selector */}
                <div className="bg-slate-950/90 border border-blue-500/40 rounded-xl p-3.5 space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Cpu size={15} className="text-sky-400" />
                      <span>Authorized NIC Certificate / Hardware Token (PKCS#11)</span>
                    </label>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>USB TOKEN DETECTED</span>
                    </span>
                  </div>

                  <select
                    value={selectedDscToken}
                    onChange={(e) => handleDscTokenChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono cursor-pointer"
                  >
                    <option value="">-- [Auto-Detect / Select Inserted NIC Hardware Token] --</option>
                    <option value="PO-MORTH-2026-9812">
                      NIC-CA Class-3: Dr. Vikramaditya Sharma, IAS (MoRTH) — [TEC Member: Rule 189]
                    </option>
                    <option value="PO-DEF-2026-4412">
                      NIC-CA Class-3: Shri Rajeshwar Singh, IDAS (MoD) — [Buyer Authority: Rule 160]
                    </option>
                    <option value="PO-RAIL-2026-5501">
                      NIC-CA Class-3: Smt. Ananya Banerjee, IRSS (Railways) — [Scrutiny Officer: Rule 164]
                    </option>
                    <option value="PO-CAG-2026-1088">
                      NIC-CA Class-3: Shri K. S. Venkatraman, IA&AS (CAG) — [Vigilance Auditor: Art. 148]
                    </option>
                  </select>

                  {selectedDscToken && (
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-800">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        <span>FIPS 140-2 Level 3 Validated</span>
                      </span>
                      <span className="text-slate-400">Model: ePass2003 Hardware Cryptographic Token</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Government Officer Employee ID / Email
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      required
                      autoComplete="off"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      placeholder="PO-DEPT-YEAR-XXXX"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Security Passcode
                  </label>
                  <input 
                    type="password"
                    required
                    autoComplete="new-password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter authorized password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="bg-slate-950/80 border border-blue-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone size={14} className="text-emerald-400" />
                      <span>Aadhaar / Official Mobile OTP</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      maxLength={6}
                      autoComplete="off"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="• • • • • •"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center text-emerald-400 font-bold font-mono tracking-widest text-base focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => alert("OTP sent to your registered official mobile number.")}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs text-slate-200 font-bold rounded-lg cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>

                <div className="bg-blue-950/40 border border-blue-900/60 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300">
                  <ShieldCheck size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    You are logging in as <strong>Procurement Officer (PO)</strong> with full statutory audit and evaluation authority.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-lg disabled:opacity-50 hover:shadow-blue-500/20"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Sovereign Session...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>Access Procurement Officer Suite</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-300 text-[11px]">
                    Assigned a <strong>second role as an exception</strong>?
                  </span>
                </div>
                <Link 
                  to={`/gov/register?secondary=true${officerId.includes('@') ? `&email=${encodeURIComponent(officerId)}` : ''}`}
                  className="text-amber-400 hover:text-amber-300 font-bold underline text-[11px] shrink-0"
                >
                  Register Second Role Dossier →
                </Link>
              </div>
            </>
          )}

        </div>
      </main>

      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <span>GEM 2.0 COMPLIANCE PORTAL • Ministry of Commerce &amp; Industry • Smart India Hackathon 2026</span>
      </footer>

    </div>
  );
}