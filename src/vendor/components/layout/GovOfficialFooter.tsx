import React from 'react';
import { ShieldCheck, Phone, Mail, ExternalLink, FileCheck, CheckCircle2 } from 'lucide-react';
import { VendorProfile } from '../../types';

interface GovOfficialFooterProps {
  profile: VendorProfile;
}

export const GovOfficialFooter: React.FC<GovOfficialFooterProps> = ({ profile }) => {
  return (
    <footer className="mt-auto border-t-2 border-[#E65100] bg-[#051124] text-slate-300 text-xs">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-[#1E3A68]">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm text-slate-100">GeM 2.0 & CPPP Portal</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Official public procurement facilitation portal for GeM (Government e-Marketplace) and Central Public Procurement Portal (CPPP), adhering strictly to GFR 2017.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#001833] text-cyan-300 border border-[#1E3A68] text-[10px] font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>NIC & STQC Security Audited</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wider block">
              Official Public Portals
            </span>
            <ul className="space-y-1 text-[11px]">
              <li><a href="https://gem.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1 text-slate-400 hover:underline">GeM Portal (gem.gov.in) <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li><a href="https://eprocure.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1 text-slate-400 hover:underline">CPPP eProcurement (eprocure.gov.in) <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li><a href="https://udyamregistration.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1 text-slate-400 hover:underline">MSME Udyam Registration <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li><a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1 text-slate-400 hover:underline">National Portal of India <ExternalLink className="w-2.5 h-2.5" /></a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wider block">
              Statutory Procurement Orders
            </span>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>
                <a href="https://doe.gov.in/files/gfr-2017" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1 text-slate-400 hover:underline">
                  General Financial Rules (GFR), 2017 <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a href="http://dcmsme.gov.in/publications/circulars/PPP2012.pdf" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1 text-slate-400 hover:underline">
                  Public Procurement Policy for MSEs, 2012 <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a href="https://dpiit.gov.in/public-procurements" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1 text-slate-400 hover:underline">
                  PPP-MII (Make in India) Order, 2017 <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a href="https://rti.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1 text-slate-400 hover:underline">
                  Right to Information (RTI Act 2005) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wider block">
              National Procurement Helpdesk
            </span>
            <div className="text-[11px] space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono">
                <Phone className="w-3.5 h-3.5" />
                <span>Toll-Free: 1800-419-3436 / 1800-102-3436</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-3.5 h-3.5" />
                <span>helpdesk-gem@gov.in</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-0.5">
                Support Hours: Mon – Sat (09:00 to 18:00 hrs IST)
              </p>
            </div>
          </div>

        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            &copy; 2026 Government of India &bull; Ministry of Commerce and Industry. All Rights Reserved.
          </div>
          <div className="text-slate-400">
            Authenticated Enterprise: <strong className="text-slate-200">{profile.name}</strong> (GSTIN: <span className="font-mono text-amber-300">{profile.gstin}</span>)
          </div>
        </div>
      </div>

    </footer>
  );
};