import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  User, 
  Building2, 
  Rocket, 
  HardHat, 
  ArrowRight, 
  RefreshCw, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  ShieldAlert, 
  FileCheck2, 
  Layers, 
  Info,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Award
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS_MAP, RegisterVendorPayload } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const VendorAuthGateway: React.FC = () => {
  const { 
    login, 
    loginAsDemoVendor, 
    pendingMfa, 
    verifyMfa, 
    cancelMfa, 
    registerVendor 
  } = useAuth();

  // Mode: 'LOGIN' | 'OTP_LOGIN' | 'DEMO_SELECT' | 'REGISTER' | 'DSC_LOGIN'
  const [authMode, setAuthMode] = useState<'LOGIN' | 'OTP_LOGIN' | 'DEMO_SELECT' | 'REGISTER' | 'DSC_LOGIN'>('LOGIN');

  // Form states
  const [identifier, setIdentifier] = useState('oem@apexpower.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [enableMfa, setEnableMfa] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // OTP Direct Login state
  const [otpTarget, setOtpTarget] = useState('+91 98112 04921');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('202688');
  const [otpTimer, setOtpTimer] = useState(30);

  // Captcha
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaValid, setCaptchaValid] = useState<boolean | null>(true);

  // OTP 2FA state
  const [otpInput, setOtpInput] = useState(['2', '0', '2', '6', '8', '8']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Registration form
  const [regForm, setRegForm] = useState<RegisterVendorPayload>({
    companyName: '',
    fullName: '',
    email: '',
    password: '',
    role: 'OEM_SELLER',
    gstin: '',
    pan: '',
    turnoverCr: 5.0,
    experienceYears: 3,
    udyamNumber: '',
    contractorClass: '',
    brandName: ''
  });

  // Generate random captcha and auto-fill for frictionless UX
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput(code); // Pre-fill for instant seamless login
    setCaptchaValid(true);
  };

  useEffect(() => {
    generateCaptcha();
  }, [authMode]);

  // Audio captcha speak
  const speakCaptcha = () => {
    if ('speechSynthesis' in window) {
      const spelled = captchaCode.split('').join(' ');
      const utterance = new SpeechSynthesisUtterance(`Security Code: ${spelled}`);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setCaptchaValid(true);

    setIsLoading(true);
    try {
      const res = await login(identifier, password, enableMfa);
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err: any) {
      setErrorMsg('Server authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await loginAsDemoVendor(role, enableMfa);
    } catch (err) {
      setErrorMsg('Demo sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

    // Move to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpInput.join('');
    const verified = verifyMfa(fullOtp);
    if (!verified) {
      setErrorMsg('Invalid OTP. Please enter the 6-digit security code (Demo code: 202688).');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setCaptchaValid(false);
      setErrorMsg('Incorrect Security Captcha code.');
      generateCaptcha();
      return;
    }

    if (!regForm.gstin || regForm.gstin.length < 15) {
      setErrorMsg('Please enter a valid 15-character GSTIN.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerVendor(regForm);
      if (!res.success) {
        setErrorMsg(res.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Registration error. Please check form values.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#070B14] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#001D3D_1px,transparent_1px),linear-gradient(to_bottom,#001D3D_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col justify-center relative z-10">
        
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F1D36] border border-[#1E3A8A] text-cyan-300 text-xs font-bold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Government e-Marketplace (GeM 2.0) &bull; Official Public Procurement Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Government Vendor & Seller <span className="text-[#FF9933]">Single Sign-On</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Log in with your official GeM Seller credentials, GSTIN, or Udyam number to access your enterprise's dedicated procurement dashboard.
          </p>
        </div>

        <div className="glass-panel border-2 border-[#1E3A8A] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#1E3A8A] bg-[#0A1224]/80 text-xs sm:text-sm font-bold">
            <button
              onClick={() => { setAuthMode('LOGIN'); setErrorMsg(null); }}
              className={`py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
                authMode === 'LOGIN'
                  ? 'border-[#FF9933] text-white bg-[#0F1D36]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0F1D36]/40'
              }`}
            >
              <KeyRound className="w-4 h-4 text-[#FF9933]" />
              <span>Vendor Sign In</span>
            </button>

            <button
              onClick={() => { setAuthMode('OTP_LOGIN'); setErrorMsg(null); }}
              className={`py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
                authMode === 'OTP_LOGIN'
                  ? 'border-emerald-400 text-white bg-[#0F1D36]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0F1D36]/40'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Login via OTP</span>
            </button>

            <button
              onClick={() => { setAuthMode('DEMO_SELECT'); setErrorMsg(null); }}
              className={`py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
                authMode === 'DEMO_SELECT'
                  ? 'border-cyan-400 text-white bg-[#0F1D36]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0F1D36]/40'
              }`}
            >
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Verified Accounts</span>
              <span className="hidden sm:inline text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-700/50">Demo</span>
            </button>

            <button
              onClick={() => { setAuthMode('DSC_LOGIN'); setErrorMsg(null); }}
              className={`py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
                authMode === 'DSC_LOGIN'
                  ? 'border-cyan-400 text-white bg-[#0F1D36]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0F1D36]/40'
              }`}
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>DSC e-Token</span>
            </button>

            <button
              onClick={() => { setAuthMode('REGISTER'); setErrorMsg(null); }}
              className={`py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
                authMode === 'REGISTER'
                  ? 'border-[#FF9933] text-white bg-[#0F1D36]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0F1D36]/40'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#FF9933]" />
              <span>New Registration</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 bg-[#0B1528]/90">
            
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-3 animate-fadeIn">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div className="flex-1 font-medium">{errorMsg}</div>
              </div>
            )}

            {authMode === 'LOGIN' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <form onSubmit={handleLoginSubmit} className="lg:col-span-7 space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      GeM Seller ID / Udyam No. / Registered Email <span className="text-[#FF9933]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. VEND-OEM-8902 or oem@apexpower.com"
                        className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Account Password <span className="text-[#FF9933]">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset link will be sent to the registered entity email.')}
                        className="text-xs text-[#FF9933] hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#08101E] border border-[#1E3A8A] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Security Captcha Verification
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={speakCaptcha}
                          className="p-1.5 rounded-lg bg-[#0F1D36] border border-[#1E3A8A] text-slate-300 hover:text-cyan-300 hover:bg-[#1E3A8A] transition-all"
                          title="Listen to Captcha"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className="p-1.5 rounded-lg bg-[#0F1D36] border border-[#1E3A8A] text-slate-300 hover:text-cyan-300 hover:bg-[#1E3A8A] transition-all"
                          title="Refresh Captcha"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div 
                        onClick={generateCaptcha}
                        className="flex-1 py-2 px-4 rounded-xl bg-[#001D3D] text-cyan-300 font-mono font-black text-lg tracking-widest text-center select-none shadow-inner border border-cyan-500/40 cursor-pointer"
                        title="Click to generate new captcha"
                      >
                        {captchaCode}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                          placeholder="Enter Captcha"
                          maxLength={6}
                          className="w-full bg-[#0F1D36] border border-[#1E3A8A] rounded-xl px-3 py-2 text-sm text-white font-mono uppercase tracking-widest text-center focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={enableMfa}
                        onChange={(e) => setEnableMfa(e.target.checked)}
                        className="rounded border-[#1E3A8A] bg-[#08101E] text-cyan-500 focus:ring-cyan-400 w-4 h-4"
                      />
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        Enable 2-Step OTP Security Verification (Recommended)
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="rounded border-[#1E3A8A] bg-[#08101E] text-cyan-500 focus:ring-cyan-400 w-4 h-4"
                      />
                      <span>Register this terminal as a verified business workstation</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Authenticating Session...</span>
                      </>
                    ) : (
                      <>
                        <span>Direct Login & Enter Dashboard</span>
                        <ArrowRight className="w-4 h-4 text-cyan-300" />
                      </>
                    )}
                  </button>

                  <div className="relative flex items-center justify-center py-2">
                    <div className="border-t border-slate-700 w-full" />
                    <span className="bg-[#0B1528] px-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider">OR</span>
                    <div className="border-t border-slate-700 w-full" />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        loginAsDemoVendor('OEM_SELLER');
                      }, 900);
                    }}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-[#1f293d] hover:bg-[#27354f] border border-slate-700 hover:border-blue-400 text-white font-bold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md group"
                  >
                    
                    <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                      <div className="bg-[#f25022] w-1.5 h-1.5 rounded-[0.5px]" />
                      <div className="bg-[#7fba00] w-1.5 h-1.5 rounded-[0.5px]" />
                      <div className="bg-[#00a4ef] w-1.5 h-1.5 rounded-[0.5px]" />
                      <div className="bg-[#ffb900] w-1.5 h-1.5 rounded-[0.5px]" />
                    </div>
                    <span>Sign in with Microsoft Authenticator</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30 ml-auto font-normal">
                      Passwordless
                    </span>
                  </button>

                </form>

                <div className="lg:col-span-5 space-y-4 bg-[#08101E] p-5 rounded-xl border border-[#1E3A8A]">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Government Portal Security Standards</span>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Strict Vendor Isolation:</strong> Once logged in, your session is isolated. You will only access your company's profile, private BoQ rates, bid evaluations, and sensitive compliance certificates.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Audit Trail Logging:</strong> IP Address, timestamp, and session hardware token are recorded as mandated by CERT-In security norms.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Role-Tailored Intelligence:</strong> OEM manufacturers get product catalogs & BIS rules; MSMEs get EMD exemptions & DPIIT waivers; Works contractors get CPWD enlistments & JV consortiums.
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1E3A8A]">
                    <span className="text-[11px] font-bold text-slate-400 block mb-2">
                      Need to test without entering credentials?
                    </span>
                    <button
                      type="button"
                      onClick={() => setAuthMode('DEMO_SELECT')}
                      className="w-full py-2 px-3 rounded-lg bg-[#0F1D36] hover:bg-[#1E3A8A] border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-between transition-all"
                    >
                      <span>Explore 3 Verified Enterprise Accounts</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {authMode === 'OTP_LOGIN' && (
              <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Vendor Direct OTP Verification
                  </h3>
                  <p className="text-xs text-slate-300">
                    Sign in seamlessly with a 6-digit One-Time Password sent to your registered mobile or email.
                  </p>
                </div>

                <div className="bg-[#08101E] border border-[#1E3A8A] rounded-xl p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Registered Mobile Number / GSTIN / Email
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otpTarget}
                        onChange={(e) => setOtpTarget(e.target.value)}
                        placeholder="+91 98112 04921 or vendor@enterprise.com"
                        className="flex-1 bg-[#0F1D36] border border-[#1E3A8A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(true);
                          setOtpTimer(30);
                        }}
                        className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap"
                      >
                        {otpSent ? 'Resend OTP' : 'Send OTP'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Enter 6-Digit OTP Code
                      </label>
                      <span className="text-[10px] text-emerald-400 font-semibold cursor-pointer" onClick={() => setOtpValue('202688')}>
                        ⚡ Click to Auto-fill Demo Code (202688)
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      placeholder="• • • • • •"
                      className="w-full bg-[#0F1D36] border border-emerald-500/50 rounded-xl px-4 py-3 text-center text-emerald-400 font-bold font-mono text-xl tracking-widest focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        loginAsDemoVendor('OEM_SELLER');
                      }, 700);
                    }}
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Validating OTP Code...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify OTP & Enter Vendor Dashboard</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {authMode === 'DEMO_SELECT' && (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-1">
                  <h3 className="text-lg font-extrabold text-white">
                    Select a Verified Enterprise Account
                  </h3>
                  <p className="text-xs text-slate-300">
                    Each account loads its own isolated dashboard with specific GSTIN, certificates, turnover, and specialized procurement workflows.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  <div className="bg-[#08101E] border border-cyan-500/40 rounded-xl p-5 flex flex-col justify-between hover:border-cyan-400 transition-all shadow-md group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-700/50">
                          OEM MANUFACTURER
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-violet-900/60 text-violet-200 font-extrabold border border-violet-500/40">
                          PRO TIER
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-white text-sm group-hover:text-cyan-300 transition-colors">
                          Apex Dynamics & Energy Systems
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          GeM ID: <strong className="text-slate-200">VEND-OEM-8902</strong>
                        </p>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-[#1E3A8A]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">GSTIN:</span>
                          <span className="font-mono text-white">07AAACA4952J1ZM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Turnover:</span>
                          <span className="font-bold text-emerald-400">₹ 48.50 Crores</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Compliance:</span>
                          <span className="text-cyan-300 font-semibold">96% Verified</span>
                        </div>
                        <div className="text-[11px] text-slate-400 pt-1">
                          &bull; BIS IS-16221 &bull; ISO 9001 &bull; 74% MII Local
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDemoLogin('OEM_SELLER')}
                      disabled={isLoading}
                      className="mt-5 w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Log In to OEM Dashboard</span>
                    </button>
                  </div>

                  <div className="bg-[#08101E] border border-amber-500/40 rounded-xl p-5 flex flex-col justify-between hover:border-amber-400 transition-all shadow-md group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-700/50">
                          MSME & DPIIT STARTUP
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-600">
                          FREE TIER
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors">
                          Novavolt Instruments & Automation
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          GeM ID: <strong className="text-slate-200">VEND-MSME-3412</strong>
                        </p>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-[#1E3A8A]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Udyam No:</span>
                          <span className="font-mono text-white text-[11px]">UDYAM-MH-03-0098412</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Turnover:</span>
                          <span className="font-bold text-emerald-400">₹ 4.20 Crores</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Benefits:</span>
                          <span className="text-amber-300 font-bold">100% EMD Waiver</span>
                        </div>
                        <div className="text-[11px] text-slate-400 pt-1">
                          &bull; DPIIT Recognized &bull; Prior Exp Relaxed
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDemoLogin('MSME_STARTUP')}
                      disabled={isLoading}
                      className="mt-5 w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>Log In to MSME Dashboard</span>
                    </button>
                  </div>

                  <div className="bg-[#08101E] border border-emerald-500/40 rounded-xl p-5 flex flex-col justify-between hover:border-emerald-400 transition-all shadow-md group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-700/50">
                          WORKS & CIVIL CONTRACTOR
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-200 font-bold border border-cyan-500/40">
                          STARTER
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-white text-sm group-hover:text-emerald-300 transition-colors">
                          Bharat Infra-Tech & EPC Solutions
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          GeM ID: <strong className="text-slate-200">VEND-WORKS-7105</strong>
                        </p>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-[#1E3A8A]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Enlistment:</span>
                          <span className="font-mono text-white text-[11px]">Class-1 Super (CPWD)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Turnover:</span>
                          <span className="font-bold text-emerald-400">₹ 32.80 Crores</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">JV Matching:</span>
                          <span className="text-emerald-300 font-bold">Consortium Ready</span>
                        </div>
                        <div className="text-[11px] text-slate-400 pt-1">
                          &bull; NHAI & PWD Qualified &bull; 12 Yrs Exp
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDemoLogin('WORKS_CONTRACTOR')}
                      disabled={isLoading}
                      className="mt-5 w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <HardHat className="w-3.5 h-3.5" />
                      <span>Log In to Works Dashboard</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

            {authMode === 'DSC_LOGIN' && (
              <div className="max-w-xl mx-auto space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-[#002855] text-cyan-400 border-2 border-cyan-500/50 flex items-center justify-center mx-auto shadow-lg shadow-cyan-900/30">
                  <KeyRound className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Digital Signature Certificate (DSC Class-3) e-Sign
                  </h3>
                  <p className="text-xs text-slate-300">
                    Mandatory for high-value tenders (&gt; ₹50 Lakhs) as per GeM & Central Public Procurement Guidelines.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#08101E] border border-[#1E3A8A] text-left space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Detected USB Cryptographic Token:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      ePass2003Auto (Valid)
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Certificate Holder:</span>
                    <strong className="text-white">Rajesh Sharma (Apex Dynamics Ltd)</strong>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Issuer CA:</span>
                    <span className="text-slate-300">e-Mudhra Sub-CA for Class 3 Individual</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Expiry Date:</span>
                    <span className="text-amber-300">31-Dec-2027 (Active)</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDemoLogin('OEM_SELLER')}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Verify DSC PIN & Enter Dashboard</span>
                </button>
              </div>
            )}

            {authMode === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="border-b border-[#1E3A8A] pb-3 mb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#FF9933]" />
                    <span>Register New Enterprise / GeM Seller Entity</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fill in your verified enterprise details to receive a dedicated, isolated dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Company / Entity Legal Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Tata Power Solar Systems Ltd"
                      value={regForm.companyName}
                      onChange={(e) => setRegForm({ ...regForm, companyName: e.target.value })}
                      className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl px-3 py-2.5 text-white focus:border-[#FF9933] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Enterprise Classification Category *</label>
                    <select
                      value={regForm.role}
                      onChange={(e) => setRegForm({ ...regForm, role: e.target.value as UserRole })}
                      className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl px-3 py-2.5 text-white focus:border-[#FF9933] focus:outline-none"
                    >
                      <option value="OEM_SELLER">OEM & Product Seller (Factory / Manufacturer)</option>
                      <option value="MSME_STARTUP">MSME & DPIIT Startup (Udyam Registered)</option>
                      <option value="WORKS_CONTRACTOR">Works & Civil Contractor (CPWD / PWD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">GSTIN Number (15 Digits) *</label>
                    <input
                      type="text"
                      placeholder="e.g. 27AABCT9921M1Z5"
                      maxLength={15}
                      value={regForm.gstin}
                      onChange={(e) => setRegForm({ ...regForm, gstin: e.target.value.toUpperCase() })}
                      className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl px-3 py-2.5 text-white uppercase font-mono focus:border-[#FF9933] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">PAN Number (10 Digits) *</label>
                    <input
                      type="text"
                      placeholder="e.g. AABCT9921M"
                      maxLength={10}
                      value={regForm.pan}
                      onChange={(e) => setRegForm({ ...regForm, pan: e.target.value.toUpperCase() })}
                      className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl px-3 py-2.5 text-white uppercase font-mono focus:border-[#FF9933] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Authorized Signatory Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Anand Kumar (Managing Director)"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl px-3 py-2.5 text-white focus:border-[#FF9933] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Official Business Email *</label>
                    <input
                      type="email"
                      placeholder="e.g. contact@tatapower.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl px-3 py-2.5 text-white focus:border-[#FF9933] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Annual Turnover (in ₹ Crores)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 15.5"
                      value={regForm.turnoverCr}
                      onChange={(e) => setRegForm({ ...regForm, turnoverCr: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl px-3 py-2.5 text-white focus:border-[#FF9933] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Account Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl px-3 py-2.5 text-white focus:border-[#FF9933] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#08101E] border border-[#1E3A8A] flex items-center justify-between gap-3 text-xs">
                  <div className="px-3 py-1.5 bg-slate-900 border border-[#38BDF8] rounded text-cyan-300 font-mono font-bold tracking-widest text-base">
                    {captchaCode}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter captcha code"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="bg-[#0F1D36] border border-[#1E3A8A] rounded-lg px-3 py-2 text-white uppercase font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Register Enterprise & Access Dedicated Dashboard</span>
                </button>
              </form>
            )}

          </div>

          <div className="px-6 py-3 bg-[#08101E] border-t border-[#1E3A8A]/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TLS 1.3 &bull; SHA-256 Encrypted &bull; ISO/IEC 27001 Certified Gateway</span>
            </div>

            <div className="flex items-center gap-3">
              <span>National Informatics Centre (NIC) Validated</span>
              <span>&bull;</span>
              <span>CERT-In Empanelled Security</span>
            </div>
          </div>

        </div>

        <div className="mt-4 text-center text-[10px] text-slate-400 leading-relaxed max-w-3xl mx-auto">
          <strong>LEGAL NOTICE:</strong> This is a secure Government of India e-Procurement single sign-on system. Unauthorised access, attempts to manipulate vendor bids, or submission of counterfeit certificates is an offence punishable under Sections 43, 66, and 70 of the Information Technology Act, 2000 and the Indian Penal Code.
        </div>

      </div>

      {pendingMfa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full bg-[#0F1D36] border-2 border-[#FF9933] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#002855] text-amber-400 border border-[#004080] flex items-center justify-center mx-auto shadow-md">
                <Smartphone className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-extrabold text-white">
                Two-Factor Security Verification
              </h3>

              <p className="text-xs text-slate-300">
                A 6-digit one-time password (OTP) has been sent to the registered mobile ending in <strong>•••• {pendingMfa.mobileLast4}</strong> and email <strong>{pendingMfa.email}</strong>.
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpInput.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpInputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-bold font-mono bg-[#08101E] border-2 border-[#1E3A8A] focus:border-[#FF9933] rounded-xl text-white focus:outline-none transition-all"
                  />
                ))}
              </div>

              <div className="text-center text-xs text-slate-400">
                <span>Demo Security Code: </span>
                <button
                  type="button"
                  onClick={() => setOtpInput(['2', '0', '2', '6', '8', '8'])}
                  className="font-mono font-bold text-amber-400 hover:underline"
                >
                  202688 (Click to Autofill)
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={cancelMfa}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#E65100] hover:from-[#F57C00] hover:to-[#D84315] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Enter</span>
                </button>
              </div>
            </form>

            <div className="text-center text-[10px] text-slate-400">
              Session Protected by GeM OTP Authentication Gateway &bull; Valid for 10 Minutes
            </div>

          </div>
        </div>
      )}

    </div>
  );
};