import React, { useState } from 'react';
import { X, Lock, Mail, Building2, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, loginAsDemoVendor, user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await login(email, password, false);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.error || 'Authentication failed');
      }
    } catch (e) {
      setErrorMsg('Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setLoading(true);
    await loginAsDemoVendor(role, false);
    setLoading(false);
    onClose();
  };

  const handleSignOut = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0F1D36] border border-[#1E3A8A] rounded-2xl shadow-2xl p-6 space-y-5 overflow-hidden text-slate-100">
        
        <div className="flex items-center justify-between border-b border-[#1E3A8A] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#002855] text-amber-400 border border-[#004080]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Switch Vendor Session
              </h3>
              <p className="text-xs text-slate-400">
                GeM-SSO Encrypted Security Gateway
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {user && (
          <div className="p-3 rounded-xl bg-[#08101E] border border-[#1E3A8A] space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Logged-in Entity:</span>
              <span className="text-emerald-400 font-bold font-mono">{user.vendorId}</span>
            </div>
            <div className="font-bold text-white text-sm truncate">
              {user.companyName}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>GSTIN: {user.gstin}</span>
              <button
                onClick={handleSignOut}
                className="text-rose-400 hover:underline font-bold"
              >
                Sign Out / Lock Session &rarr;
              </button>
            </div>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-[#08101E] border border-[#1E3A8A] space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono block">
            Instant Switch to Verified Account:
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('OEM_SELLER')}
              className="p-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 font-bold transition-all text-center"
            >
              Apex OEM
              <span className="block text-[9px] text-cyan-400 font-mono font-normal">Pro Tier</span>
            </button>
            <button
              onClick={() => handleQuickLogin('MSME_STARTUP')}
              className="p-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 font-bold transition-all text-center"
            >
              Novavolt MSME
              <span className="block text-[9px] text-amber-400 font-mono font-normal">Free Tier</span>
            </button>
            <button
              onClick={() => handleQuickLogin('WORKS_CONTRACTOR')}
              className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-bold transition-all text-center"
            >
              Bharat Works
              <span className="block text-[9px] text-emerald-400 font-mono font-normal">Starter Tier</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-bold">Seller ID or Registered Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. oem@apexpower.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl pl-9 pr-3 py-2 text-white focus:border-[#FF9933] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#08101E] border border-[#1E3A8A] rounded-xl pl-9 pr-3 py-2 text-white focus:border-[#FF9933] focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#E65100] hover:from-[#F57C00] hover:to-[#D84315] text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In with Credentials'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};