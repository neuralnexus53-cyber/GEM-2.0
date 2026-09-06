import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const GovFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#051124] border-t border-[#1E3A68] py-3.5 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shadow-inner">
      <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#002855] border border-[#FF9933]/60 flex items-center justify-center text-[10px] font-black text-[#FF9933]">
            GeM
          </div>
          <span className="font-bold text-white text-xs">
            Government e-Marketplace (GeM 2.0)
          </span>
        </div>
        <span className="text-slate-600 hidden md:inline">•</span>
        <span className="text-[11px] text-slate-300 hidden md:inline">
          Ministry of Commerce and Industry, Government of India
        </span>
      </div>

      <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CERT-In Empanelled</span>
        </div>

        <div className="flex items-center gap-1.5 text-amber-300">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>GFR 2017 &amp; PPP-MII</span>
        </div>

        <div className="flex items-center gap-1.5 text-sky-400">
          <Lock className="w-3.5 h-3.5" />
          <span>NIC Sovereign Cloud Gate-4</span>
        </div>
      </div>
    </footer>
  );
};