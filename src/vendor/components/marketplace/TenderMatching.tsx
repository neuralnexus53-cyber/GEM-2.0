import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  RefreshCw,
  Layers, 
  CheckCircle2, 
  Filter,
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Download,
  AlertCircle,
  FileText,
  Send,
  Lock
} from 'lucide-react';
import { TenderItem, UserRole } from '../../types';
import { api } from '../../services/api';
import { formatINR } from '../../lib/utils';

interface TenderMatchingProps {
  currentRole: UserRole;
  onSelectTenderForCheck: (tenderId: string) => void;
}

export const TenderMatching: React.FC<TenderMatchingProps> = ({
  currentRole,
  onSelectTenderForCheck
}) => {
  const [tenders, setTenders] = useState<TenderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPortal, setSelectedPortal] = useState<string>('ALL');
  const [filterMsmeOnly, setFilterMsmeOnly] = useState<boolean>(false);
  const [filterMiiOnly, setFilterMiiOnly] = useState<boolean>(false);

  // Bid submission modal state
  const [biddingTender, setBiddingTender] = useState<TenderItem | null>(null);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [bidSuccessResult, setBidSuccessResult] = useState<any>(null);
  const [bidForm, setBidForm] = useState({
    vendorName: 'Apex Dynamics & Energy Systems Ltd.',
    pan: 'AAACA4952J',
    gstin: '07AAACA4952J1ZM',
    turnoverDeclaredCr: 48.5,
    localContentDeclared: 74,
    quotedAmountCr: 38.0,
    comments: 'Full compliance with PQC and Class-I Make in India guidelines.'
  });

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const data = await api.getTenders({
        category: selectedCategory,
        portal: selectedPortal,
        search: searchQuery
      });

      let filtered = data;
      if (filterMsmeOnly) {
        filtered = filtered.filter(t => t.hasMsmePreference);
      }
      if (filterMiiOnly) {
        filtered = filtered.filter(t => t.hasMiiPreference);
      }

      setTenders(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, [selectedCategory, selectedPortal, searchQuery, filterMsmeOnly, filterMiiOnly]);

  const handleOpenBidModal = (tender: TenderItem) => {
    setBiddingTender(tender);
    setBidSuccessResult(null);
    setBidForm(prev => ({
      ...prev,
      quotedAmountCr: Number((tender.estimatedValueCr * 0.92).toFixed(2))
    }));
  };

  const handleExecuteBidSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingTender) return;

    setIsSubmittingBid(true);
    try {
      const res = await api.submitBid(biddingTender.id, {
        vendorName: bidForm.vendorName,
        pan: bidForm.pan,
        gstin: bidForm.gstin,
        turnoverDeclaredCr: Number(bidForm.turnoverDeclaredCr),
        localContentDeclared: Number(bidForm.localContentDeclared),
        quotedAmountCr: Number(bidForm.quotedAmountCr),
        comments: bidForm.comments
      });
      setBidSuccessResult(res);
    } catch (err) {
      console.error('Bid submission error:', err);
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const handleDownloadNotice = (tender: TenderItem) => {
    const noticeSummary = `GOVERNMENT OF INDIA - PUBLIC PROCUREMENT TENDER NOTICE
Portal: ${tender.portal}
Bid / Reference Number: ${tender.tenderRefNumber || tender.id}
Tender Title: ${tender.title}
Procuring Department: ${tender.organization}
Location: ${tender.location}
Estimated Value: ₹ ${tender.estimatedValueCr} Crores
EMD Amount: ₹ ${tender.emdAmountLakhs} Lakhs (Exempt for MSEs under GFR 170)
Submission Deadline: ${tender.submissionDeadline}
PQC Criteria:
${tender.keyPqc.map((p, idx) => `  ${idx + 1}. ${p}`).join('\n')}
Make in India (MII) Preference: ${tender.hasMiiPreference ? 'Yes (Class-I Local)' : 'No'}
MSE Purchase Preference: ${tender.hasMsmePreference ? 'Yes (25% Quota)' : 'No'}

Downloaded via GeM 2.0 Vendor Facilitation Portal.`;

    const element = document.createElement("a");
    const file = new Blob([noticeSummary], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `NIT_Notice_${(tender.tenderRefNumber || tender.id).replace(/\//g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-4">
      
      <div className="gov-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-2 border-b border-[#1E3A68]">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Central Public Procurement Bulletin & GeM Bid Opportunities</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#002855] text-cyan-300 font-mono font-bold border border-[#1E3A68]">
                GeM + CPPP Live Feed
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Live tender notices from Central Ministries, State Governments, Defence (MES), and Public Sector Undertakings (PSUs).
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400 font-mono">
              Matching Bids: <strong className="text-amber-400 font-bold">{tenders.length}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by GeM Bid No, Ministry, or Keyword..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 text-xs focus:border-[#0284C7] focus:outline-none font-mono"
            />
          </div>

          <div>
            <select
              value={selectedPortal}
              onChange={e => setSelectedPortal(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-200 text-xs focus:border-[#0284C7] focus:outline-none"
            >
              <option value="ALL">All Procurement Portals (GeM + CPPP)</option>
              <option value="GeM">GeM 2.0 (Custom & BOQ Bids)</option>
              <option value="CPPP">CPPP (eprocure.gov.in)</option>
              <option value="State eProcurement">State e-Procurement Portals</option>
              <option value="Defense Proc">Defence Procurements (MES / MoD)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-200 text-xs focus:border-[#0284C7] focus:outline-none"
            >
              <option value="ALL">All Procurement Categories</option>
              <option value="Goods">Goods & Manufactured Equipment</option>
              <option value="Works">Civil & Infrastructure Works</option>
              <option value="Services">Services & Operations Maintenance</option>
            </select>
          </div>

          <div>
            <button
              onClick={fetchTenders}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#00244D] hover:bg-[#003366] border border-[#1E3A68] rounded text-slate-200 text-xs font-semibold transition-all"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh GeM Feed</span>
            </button>
          </div>

        </div>

        <div className="flex items-center gap-4 pt-1 text-xs text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={filterMsmeOnly}
              onChange={e => setFilterMsmeOnly(e.target.checked)}
              className="rounded border-[#1E3A68] text-[#0284C7] focus:ring-0"
            />
            <span>Show MSME Preference / Reserved Bids (25% Quota)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={filterMiiOnly}
              onChange={e => setFilterMiiOnly(e.target.checked)}
              className="rounded border-[#1E3A68] text-[#0284C7] focus:ring-0"
            />
            <span>Make-in-India (Class-I Local Only)</span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="gov-card p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Querying Central Public Procurement Portal & GeM database...</span>
        </div>
      ) : tenders.length === 0 ? (
        <div className="gov-card p-8 text-center text-slate-400 text-xs">
          No live tender notices found matching current query parameters.
        </div>
      ) : (
        <div className="space-y-3">
          {tenders.map(tender => (
            <div
              key={tender.id}
              className="gov-card p-4 hover:border-[#0284C7] transition-all space-y-3"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 pb-2 border-b border-[#1E3A68]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-amber-400 bg-[#001833] px-2 py-0.5 rounded border border-[#1E3A68]">
                    {tender.tenderRefNumber || tender.id}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#00244D] text-cyan-300 font-semibold border border-[#1E3A68]">
                    {tender.portal}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {tender.organization} &bull; {tender.location}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D] flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {tender.aiMatchScore}% PQC Match
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Due: <strong className="text-slate-200">{tender.submissionDeadline}</strong> ({tender.daysRemaining} days left)
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100 mb-1">
                  {tender.title}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {tender.keyPqc.map((pqc, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[#08172D] text-slate-300 border border-[#1E3A68]">
                      {pqc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1E3A68] text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Estimated Tender Value</span>
                  <span className="font-bold text-slate-100 font-mono">
                    ₹ {tender.estimatedValueCr} Crores
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">EMD Amount (धरोहर राशि)</span>
                  <span className="font-bold text-slate-200 font-mono">
                    {tender.emdAmountLakhs === 0 ? '₹ 0 (Exempt)' : `₹ ${tender.emdAmountLakhs} Lakhs`}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Statutory Preferences</span>
                  <span className="font-bold text-emerald-400">
                    {tender.hasMiiPreference ? 'MII Class-I' : 'Standard'} {tender.hasMsmePreference ? '& MSE 25%' : ''}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleDownloadNotice(tender)}
                    title="Download Tender Notice Summary"
                    className="p-1.5 rounded bg-[#08172D] hover:bg-[#0E203B] text-slate-300 border border-[#1E3A68] text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSelectTenderForCheck(tender.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#00244D] hover:bg-[#003366] text-cyan-300 border border-[#1E3A68] text-xs font-semibold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>PQC</span>
                  </button>
                  <button
                    onClick={() => handleOpenBidModal(tender)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply & Bid</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {biddingTender && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#051124] border border-[#1E3A68] rounded-lg max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E3A68] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#00244D] text-cyan-300">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    Double-Blind Bid Submission
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Sealed under Government Sovereign KMS Vault
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setBiddingTender(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {bidSuccessResult ? (
              <div className="space-y-3 py-2">
                <div className="p-3 bg-[#052410] border border-[#15803D] rounded text-emerald-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bid Successfully Sealed & Dispatched!</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80">
                    Your company identity has been cryptographically sealed. The Technical Evaluation Committee will review your bid under:
                  </p>
                  <div className="font-mono font-bold text-amber-300 bg-[#021307] p-2 rounded mt-1">
                    Pseudonym: {bidSuccessResult.maskedVendorId}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>• Vault Envelope: <span className="font-mono text-slate-200">{bidSuccessResult.vaultCipherToken}</span></p>
                  <p>• Tender: <span className="text-slate-200">{biddingTender.title}</span></p>
                  <p>• Status: <span className="text-cyan-300 font-bold">ACTIVE IN GOVERNMENT EVALUATION QUEUE</span></p>
                </div>

                <button
                  onClick={() => setBiddingTender(null)}
                  className="w-full py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold rounded"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleExecuteBidSubmission} className="space-y-3 text-xs">
                <div className="p-2.5 bg-[#001833] border border-[#1E3A68] rounded text-slate-300 text-[11px]">
                  <strong>Tender:</strong> {biddingTender.title} (Ref: {biddingTender.tenderRefNumber || biddingTender.id})
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Company Legal Name</label>
                    <input
                      type="text"
                      value={bidForm.vendorName}
                      onChange={e => setBidForm({...bidForm, vendorName: e.target.value})}
                      required
                      className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={bidForm.gstin}
                      onChange={e => setBidForm({...bidForm, gstin: e.target.value})}
                      required
                      className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">3-Year Turnover (₹ Cr)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={bidForm.turnoverDeclaredCr}
                      onChange={e => setBidForm({...bidForm, turnoverDeclaredCr: parseFloat(e.target.value) || 0})}
                      required
                      className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Local Content (%)</label>
                    <input
                      type="number"
                      value={bidForm.localContentDeclared}
                      onChange={e => setBidForm({...bidForm, localContentDeclared: parseFloat(e.target.value) || 0})}
                      required
                      className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Commercial Quote (₹ Crores)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={bidForm.quotedAmountCr}
                    onChange={e => setBidForm({...bidForm, quotedAmountCr: parseFloat(e.target.value) || 0})}
                    required
                    className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-emerald-400 font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Technical Undertaking Remarks</label>
                  <textarea
                    rows={2}
                    value={bidForm.comments}
                    onChange={e => setBidForm({...bidForm, comments: e.target.value})}
                    className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1E3A68]">
                  <button
                    type="button"
                    onClick={() => setBiddingTender(null)}
                    className="px-3 py-1.5 rounded border border-[#1E3A68] text-slate-300 hover:bg-[#0E203B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBid}
                    className="px-4 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {isSubmittingBid ? (
                      <span>Sealing & Encrypting...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Sealed Bid</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};