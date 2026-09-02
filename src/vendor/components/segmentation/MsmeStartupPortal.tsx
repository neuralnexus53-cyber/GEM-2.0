import React, { useState } from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  HelpCircle,
  ExternalLink,
  Award,
  Download,
  Building,
  Check,
  FileCheck
} from 'lucide-react';
import { VendorProfile } from '../../types';

interface MsmeStartupPortalProps {
  profile: VendorProfile;
}

export const MsmeStartupPortal: React.FC<MsmeStartupPortalProps> = ({ profile }) => {
  const [activeSubTab, setActiveSubTab] = useState<'EXEMPTIONS' | 'BSD_GENERATOR'>('EXEMPTIONS');

  const handleGenerateBsd = () => {
    setActiveSubTab('BSD_GENERATOR');
  };

  return (
    <div className="space-y-4">
      
      <div className="gov-card gov-card-saffron p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-[#2D1A05] border border-[#9A3412] text-amber-400 mt-0.5">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-100">
                MSME & DPIIT Startup Public Procurement Exemption Desk
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2D1A05] text-amber-300 font-bold border border-[#9A3412]">
                Udyam: {profile.udyamNumber || 'UDYAM-MH-03-0098412'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Statutory procurement exemptions under Public Procurement Policy for MSEs Order 2012 and Bid Security Declaration (BSD) generator.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleGenerateBsd}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#E65100] hover:bg-[#C2410C] text-white text-xs font-semibold transition-all shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate EMD Waiver Form</span>
          </button>
        </div>
      </div>

      <div className="bg-[#051124] border border-[#1E3A68] rounded p-2.5 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1E3A68] text-xs">
        <div className="px-3 py-1 flex items-center justify-between">
          <span className="text-slate-400">Udyam No:</span>
          <span className="font-mono text-amber-300 font-bold">{profile.udyamNumber || 'UDYAM-MH-03-0098412'}</span>
        </div>
        <div className="px-3 py-1 flex items-center justify-between">
          <span className="text-slate-400">DPIIT Status:</span>
          <span className="font-mono text-emerald-400 font-bold">DIPP-98214 (Recognized)</span>
        </div>
        <div className="px-3 py-1 flex items-center justify-between">
          <span className="text-slate-400">MSE Quota:</span>
          <span className="font-mono text-cyan-300 font-bold">25% Reserved Band (L1 + 15%)</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-b border-[#1E3A68] pb-2">
        <button
          onClick={() => setActiveSubTab('EXEMPTIONS')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
            activeSubTab === 'EXEMPTIONS'
              ? 'bg-[#002855] text-white border-[#0284C7]'
              : 'bg-[#08172D] text-slate-400 border-[#1E3A68] hover:bg-[#0E203B] hover:text-slate-200'
          }`}
        >
          1. Statutory Exemption Rights (5 Active)
        </button>

        <button
          onClick={() => setActiveSubTab('BSD_GENERATOR')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
            activeSubTab === 'BSD_GENERATOR'
              ? 'bg-[#002855] text-white border-[#0284C7]'
              : 'bg-[#08172D] text-slate-400 border-[#1E3A68] hover:bg-[#0E203B] hover:text-slate-200'
          }`}
        >
          2. Bid Security Declaration (EMD Waiver)
        </button>
      </div>

      {activeSubTab === 'EXEMPTIONS' && (
        <div className="gov-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E3A68]">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                Statutory Procurement Benefits (Rule 153 & MSE Policy Order 2012)
              </h3>
              <p className="text-[11px] text-slate-400">
                Government departments, Ministries, and CPSEs are legally required to grant these relaxations to Udyam registered enterprises.
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
              5/5 VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 bg-[#08172D] rounded border border-[#1E3A68] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">1. EMD Exemption (धरोहर राशि छूट)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">100% WAIVED</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Complete exemption from Earnest Money Deposit on all Central & State bids via Bid Security Declaration (GFR Rule 170).
              </p>
            </div>

            <div className="p-3 bg-[#08172D] rounded border border-[#1E3A68] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">2. Free Tender Document Fee</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">FREE COST</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Zero document fee charged on GeM and Central Public Procurement Portal (CPPP).
              </p>
            </div>

            <div className="p-3 bg-[#08172D] rounded border border-[#1E3A68] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">3. Prior Turnover Relaxation</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">RELAXED</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Turnover criteria relaxed under GFR 173(i) for DPIIT startups & MSEs meeting quality standards.
              </p>
            </div>

            <div className="p-3 bg-[#08172D] rounded border border-[#1E3A68] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">4. Prior Experience Waiver</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">RELAXED</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Prior experience criteria relaxed for goods manufactured in-house.
              </p>
            </div>

            <div className="p-3 bg-[#08172D] rounded border border-[#1E3A68] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">5. L1 + 15% Purchase Preference</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">ACTIVE</span>
              </div>
              <p className="text-[11px] text-slate-400">
                MSEs within L1 + 15% band are invited to match L1 price for up to 25% tender quantity.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'BSD_GENERATOR' && (
        <div className="gov-card p-4 space-y-3 bg-[#001D3D] border-[#E65100]">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E3A68]">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Statutory Bid Security Declaration (In Lieu of EMD under GFR Rule 170)
            </span>
            <button
              onClick={() => alert("Official Bid Security Declaration (BSD) downloaded in printable format.")}
              className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Download Signed BSD Form</span>
            </button>
          </div>

          <div className="p-3 bg-[#051124] rounded border border-[#1E3A68] text-xs text-slate-300 font-mono leading-relaxed space-y-2">
            <p><strong>FORM OF BID SECURITY DECLARATION</strong></p>
            <p>To: The Tender Inviting Authority (TIA), Government of India / GeM SPV</p>
            <p>
              We, the undersigned, declare that we are registered as a Micro/Small Enterprise under Udyam Registration No. <strong>{profile.udyamNumber || 'UDYAM-MH-03-0098412'}</strong> and are therefore exempted from payment of Earnest Money Deposit (EMD) as per Ministry of Finance OM No. F.9/4/2020-PPD and GFR 2017 Rule 170.
            </p>
            <p>
              We understand that if we withdraw or modify our bid during the period of validity, we will be suspended from bidding in any government tender for a period of two (2) years.
            </p>
            <p className="pt-2 text-slate-400">
              Authorized Signatory: <strong>{profile.name}</strong> &bull; Date: {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};