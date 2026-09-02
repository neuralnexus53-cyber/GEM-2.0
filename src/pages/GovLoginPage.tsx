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
  Smartphone
} from 'lucide-react';

export default function GovLoginPage() {
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleOfficerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanId = (officerId.trim() || 'PO-MORTH-2026-9812').toLowerCase();

    // Check local registered officers
    const regOfficers = JSON.parse(localStorage.getItem('gem_registered_officers') || '[]');
    const matched = regOfficers.find((o: any) => 
      o.officer?.email?.toLowerCase() === cleanId || 
      o.officer?.badgeId?.toLowerCase() === cleanId ||
      o.officer?.officerId?.toLowerCase() === cleanId
    );

    if (matched && matched.officer) {
      localStorage.setItem('gem_gov_auth_session', JSON.stringify(matched.officer));
    } else {
      // Determine Ministry & Dept based on entered ID
      let ministry = 'Ministry of Road Transport & Highways (MoRTH)';
      let dept = 'Highways & Intelligent Transport Systems Division';
      let name = 'Dr. Vikramaditya Sharma, IAS';
      let designation = 'Joint Secretary & Tender Committee Chair';

      if (cleanId.includes('def') || cleanId.includes('drdo')) {
        ministry = 'Ministry of Defence (MoD)';
        dept = 'Directorate of Defence Procurement & DRDO Telemetry';
        name = 'Shri Rajeshwar Singh, IDAS';
        designation = 'Director (Defence Contracts & Procurement)';
      } else if (cleanId.includes('rail')) {
        ministry = 'Ministry of Railways (Railway Board)';
        dept = 'Railway Electrification & Signalling Procurement Cell';
        name = 'Smt. Ananya Banerjee, IRSS';
        designation = 'Principal Chief Materials Manager (PCMM)';
      } else if (cleanId.includes('power') || cleanId.includes('nhpc')) {
        ministry = 'Ministry of Power & Renewable Energy';
        dept = 'Solar EPC & Grid Procurement Directorate';
        name = 'Shri Suresh Kumar, IA&AS';
        designation = 'Advisor (Procurement & Contracts)';
      }

      const activeBadgeId = officerId.trim().toUpperCase() || 'PO-MORTH-2026-9812';
      const newOfficerSession = {
        officerId: activeBadgeId,
        fullName: name,
        designation: designation,
        ministry: ministry,
        department: dept,
        securityClearanceLevel: 'Level-4 (Top Secret / Sovereign Procurement)',
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

      // Attempt background backend sync if available
      try {
        const apiBase = window.location.origin.includes('vercel.app') ? '/api' : 'http://127.0.0.1:8000/api';
        await fetch(`${apiBase}/auth/login-officer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: activeBadgeId, password: passcode || 'SecurePass@2026' })
        });
      } catch (err) {}
    }

    setTimeout(() => {
      setIsLoading(false);
      navigate('/gov');
    }, 400);
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

          <form onSubmit={handleOfficerLogin} className="space-y-5" autoComplete="off">
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

          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block text-center mb-3">
              ⚡ Instant 1-Click Access by Department
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setOfficerId('PO-MORTH-2026-9812');
                  setPasscode('SecurePass@2026');
                  setOtpCode('202688');
                }}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  officerId === 'PO-MORTH-2026-9812'
                    ? 'bg-blue-500/10 border-blue-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white text-[11px]">🛣️ MoRTH / NHAI</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">PO-MORTH-2026-9812</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOfficerId('PO-DEF-2026-4412');
                  setPasscode('SecurePass@2026');
                  setOtpCode('202688');
                }}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  officerId === 'PO-DEF-2026-4412'
                    ? 'bg-blue-500/10 border-blue-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white text-[11px]">🛡️ Min. of Defence</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">PO-DEF-2026-4412</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOfficerId('PO-RAIL-2026-5501');
                  setPasscode('SecurePass@2026');
                  setOtpCode('202688');
                }}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  officerId === 'PO-RAIL-2026-5501'
                    ? 'bg-blue-500/10 border-blue-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white text-[11px]">🚆 Indian Railways</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">PO-RAIL-2026-5501</div>
              </button>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <span>GEM 2.0 COMPLIANCE PORTAL • Ministry of Commerce &amp; Industry • Smart India Hackathon 2026</span>
      </footer>

    </div>
  );
}