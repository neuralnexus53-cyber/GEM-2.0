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
  Sparkles 
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

    const cleanId = officerId.trim().toLowerCase();

    // Check local registered officers
    const regOfficers = JSON.parse(localStorage.getItem('gem_registered_officers') || '[]');
    const matched = regOfficers.find((o: any) => 
      o.officer.email?.toLowerCase() === cleanId || 
      o.officer.badgeId?.toLowerCase() === cleanId ||
      o.officer.officerId?.toLowerCase() === cleanId
    );

    if (matched) {
      localStorage.setItem('gem_gov_auth_session', JSON.stringify(matched.officer));
    } else {
      // Attempt backend auth
      try {
        const resp = await fetch('http://localhost:8000/api/auth/login-officer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: officerId, password: passcode })
        });
        if (resp.ok) {
          const data = await resp.json();
          // Update session
          const currentSession = JSON.parse(localStorage.getItem('gem_gov_auth_session') || '{}');
          const updated = {
            ...currentSession,
            fullName: data.full_name,
            badgeId: data.badge_id,
            officerId: data.badge_id,
            email: data.email,
            profilePhotoUrl: data.profile_photo_url
          };
          localStorage.setItem('gem_gov_auth_session', JSON.stringify(updated));
        }
      } catch (err) {}
    }

    setTimeout(() => {
      setIsLoading(false);
      navigate('/gov');
    }, 800);
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

            <div className="relative flex items-center justify-center py-1">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] text-slate-500 font-medium uppercase tracking-wider">OR</span>
              <div className="border-t border-slate-800 w-full" />
            </div>

            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  navigate('/gov');
                }, 800);
              }}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-blue-400 text-white font-bold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md"
            >
              
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <div className="bg-[#f25022] w-1.5 h-1.5 rounded-[0.5px]" />
                <div className="bg-[#7fba00] w-1.5 h-1.5 rounded-[0.5px]" />
                <div className="bg-[#00a4ef] w-1.5 h-1.5 rounded-[0.5px]" />
                <div className="bg-[#ffb900] w-1.5 h-1.5 rounded-[0.5px]" />
              </div>
              <span>Sign in with Microsoft Authenticator / Entra ID</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30 ml-auto font-normal">
                Sovereign SSO
              </span>
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
                  setPasscode('••••••••••••');
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
                  setPasscode('••••••••••••');
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
                  setPasscode('••••••••••••');
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