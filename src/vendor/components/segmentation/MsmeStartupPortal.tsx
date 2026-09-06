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
  const [activeSubTab, setActiveSubTab] = useState<'MAF_VALIDATION' | 'EXEMPTIONS' | 'BSD_GENERATOR'>('MAF_VALIDATION');
  const [mafCode, setMafCode] = useState('MAF-APX-2026-8891');
  const [oemBrand, setOemBrand] = useState('ApexPower™ (Apex Dynamics Ltd)');
  const [mafValidUntil, setMafValidUntil] = useState('31-Dec-2026');
  const [isVerifyingMaf, setIsVerifyingMaf] = useState(false);
  const [mafStatus, setMafStatus] = useState<'VALID' | 'PENDING' | 'INVALID'>('VALID');

  const handleGenerateBsd = () => {
    setActiveSubTab('BSD_GENERATOR');
  };

  const handleVerifyMaf = () => {
    setIsVerifyingMaf(true);
    setTimeout(() => {
      setIsVerifyingMaf(false);
      setMafStatus('VALID');
    }, 600);
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
                Authorized GeM Reseller &amp; MSME Exemption Desk
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2D1A05] text-amber-300 font-bold border border-[#9A3412]">
                GeM Reseller Active &bull; Udyam: {profile.udyamNumber || 'UDYAM-MH-03-0098412'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Pair OEM Manufacturer Authorization Forms (MAF), validate back-to-back warranty, and enforce statutory procurement exemptions under MSE Policy Order 2012.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleGenerateBsd}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#E65100] hover:bg-[#C2410C] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate EMD Waiver Form</span>
          </button>
        </div>
      </div>

      <div className="bg-[#0E2038] border border-[#23436E] rounded-xl p-3 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#23436E] text-xs shadow-md">
        <div className="px-3 py-1.5 flex items-center justify-between">
          <span className="text-slate-300">Reseller Status:</span>
          <span className="font-mono text-emerald-400 font-bold">Authorized (MAF Verified)</span>
        </div>
        <div className="px-3 py-1.5 flex items-center justify-between">
          <span className="text-slate-300">Udyam No:</span>
          <span className="font-mono text-amber-300 font-bold">{profile.udyamNumber || 'UDYAM-MH-03-0098412'}</span>
        </div>
        <div className="px-3 py-1.5 flex items-center justify-between">
          <span className="text-slate-300">MSE Quota:</span>
          <span className="font-mono text-cyan-300 font-bold">25% Reserved Band (L1 + 15%)</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-[#23436E] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('MAF_VALIDATION')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeSubTab === 'MAF_VALIDATION'
              ? 'bg-[#002855] text-white border-[#0284C7] shadow-xs'
              : 'bg-[#132540] text-slate-300 border-[#23436E] hover:bg-[#1A3459] hover:text-white'
          }`}
        >
          1. OEM Brand Pairing &amp; MAF Ingestion
        </button>

        <button
          onClick={() => setActiveSubTab('EXEMPTIONS')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeSubTab === 'EXEMPTIONS'
              ? 'bg-[#002855] text-white border-[#0284C7] shadow-xs'
              : 'bg-[#132540] text-slate-300 border-[#23436E] hover:bg-[#1A3459] hover:text-white'
          }`}
        >
          2. Statutory Exemption Rights (5 Active)
        </button>

        <button
          onClick={() => setActiveSubTab('BSD_GENERATOR')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeSubTab === 'BSD_GENERATOR'
              ? 'bg-[#002855] text-white border-[#0284C7] shadow-xs'
              : 'bg-[#132540] text-slate-300 border-[#23436E] hover:bg-[#1A3459] hover:text-white'
          }`}
        >
          3. Bid Security Declaration (EMD Waiver)
        </button>
      </div>

      {activeSubTab === 'MAF_VALIDATION' && (
        <div className="gov-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#23436E]">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                GeM Reseller OEM Authorization (MAF) Ingestion &amp; Verification
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Authorized Resellers must hold a valid Manufacturer Authorization Form (MAF) from the OEM to bid on GeM product categories.
              </p>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600 font-mono">
              MAF STATUS: {mafStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">OEM Manufacturer Brand *</label>
              <input 
                type="text"
                value={oemBrand}
                onChange={e => setOemBrand(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B192C] border border-[#23436E] rounded-lg text-white font-mono focus:border-[#38BDF8] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">OEM MAF Reference Code *</label>
              <input 
                type="text"
                value={mafCode}
                onChange={e => setMafCode(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B192C] border border-[#23436E] rounded-lg text-white font-mono focus:border-[#38BDF8] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">MAF Authorization Validity *</label>
              <input 
                type="text"
                value={mafValidUntil}
                onChange={e => setMafValidUntil(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B192C] border border-[#23436E] rounded-lg text-white font-mono focus:border-[#38BDF8] focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#09172A] border border-[#23436E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Back-to-Back OEM Warranty Guaranteed:</span>
                <span className="text-slate-300 ml-1">Apex Dynamics guarantees 3-Year comprehensive on-site warranty for this Reseller.</span>
              </div>
            </div>

            <button
              onClick={handleVerifyMaf}
              disabled={isVerifyingMaf}
              className="px-3.5 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isVerifyingMaf ? 'Verifying with OEM...' : 'Re-verify with OEM Engine'}
            </button>
          </div>
        </div>
      )}

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
              onClick={() => {
                const bsdText = `FORM OF BID SECURITY DECLARATION (IN LIEU OF EMD)
(Under Ministry of Finance OM No. F.9/4/2020-PPD and GFR 2017 Rule 170)
Date: ${new Date().toLocaleDateString('en-IN')}

To:
The Tender Inviting Authority (TIA),
Government of India / GeM SPV

1. We, ${profile.name} (GSTIN: ${profile.gstin}), declare that we are registered as a Micro/Small Enterprise under Udyam Registration No. ${profile.udyamNumber || 'UDYAM-MH-03-0098412'} and are therefore exempted from payment of Earnest Money Deposit (EMD).
2. We understand that if we withdraw or modify our bid during the period of validity, or fail to sign the contract when called upon, we will be debarred from participating in any government procurement tenders for a period of two (2) years.

Authorized Signatory:
For ${profile.name}
(Official Digital Seal & Sign)`;
                const blob = new Blob([bsdText], { type: 'text/plain;charset=utf-8;' });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `Bid_Security_Declaration_${profile.udyamNumber || 'MSME'}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
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