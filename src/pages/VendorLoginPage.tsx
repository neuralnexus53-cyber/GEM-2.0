import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthProvider } from '../vendor/context/AuthContext';
import { VendorAuthGateway } from '../vendor/components/auth/VendorAuthGateway';

function VendorLoginBody() {
  const navigate = useNavigate();

  return (
    <VendorAuthGateway 
      onClose={() => navigate('/vendor')} 
    />
  );
}

export default function VendorLoginPage() {
  return (
    <AuthProvider>
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
              <span className="text-[10px] text-amber-400 font-medium tracking-wider block">
                Vendor Compliance &amp; Bidding Suite
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link 
              to="/vendor/register" 
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold px-3 py-1.5 rounded-lg border border-amber-500/30 hover:border-amber-400 transition-all"
            >
              New Seller? Register
            </Link>
            <Link 
              to="/" 
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-4xl">
            <VendorLoginBody />
          </div>
        </main>

        <footer className="bg-slate-900/60 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
          <span>GEM 2.0 COMPLIANCE PORTAL • Ministry of Commerce &amp; Industry • Smart India Hackathon 2026</span>
        </footer>

      </div>
    </AuthProvider>
  );
}