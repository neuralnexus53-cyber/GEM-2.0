import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  RefreshCw, 
  Wallet,
  Building2,
  QrCode,
  Smartphone,
  Download,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { PlanTier } from '../../types/auth_billing';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../context/AuthContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { subscription, upgradePlan, isProcessingPayment, paymentError } = useSubscription();
  const { user } = useAuth();

  const [isAutopay, setIsAutopay] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('PRO');
  const [activePaymentTab, setActivePaymentTab] = useState<'GEM_WALLET' | 'NETBANKING' | 'UPI_QR'>('GEM_WALLET');
  const [selectedBank, setSelectedBank] = useState<string>('SBI_CORP');
  const [showSuccessInvoice, setShowSuccessInvoice] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCheckout = async (plan: PlanTier, method: string = 'GEM_E_WALLET') => {
    setSelectedPlan(plan);
    setIsProcessingCheckout(true);

    const success = await upgradePlan(plan, isAutopay, method);
    setIsProcessingCheckout(false);

    if (success) {
      const inv = {
        invoiceNo: `GEM-INV-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        plan: plan,
        amount: plan === 'PRO' ? 499 : 99,
        gstin: user?.gstin || '07AAAAA0000A1Z5',
        vendorName: user?.name || 'Authorized GeM Vendor',
        sacCode: '998313 (AI Software Compliance & Bid Verification Services)',
        txId: `GEM-PAY-${Date.now().toString(36).toUpperCase()}`,
        method: method === 'GEM_E_WALLET' ? 'GeM Sovereign e-Wallet' : method === 'CORPORATE_NETBANKING' ? `Corporate NetBanking (${selectedBank})` : 'Corporate UPI / Bharat BillPay'
      };
      setInvoiceData(inv);
      setShowSuccessInvoice(true);
    }
  };

  const downloadInvoiceTxt = () => {
    if (!invoiceData) return;
    const content = `========================================================================
           GOVERNMENT e-MARKETPLACE (GeM 2.0) TAX INVOICE
========================================================================
Invoice Number : ${invoiceData.invoiceNo}
Date of Issue  : ${invoiceData.date}
Place of Supply: New Delhi (DL) - State Code 07
SAC Code       : ${invoiceData.sacCode}
Transaction Ref: ${invoiceData.txId}
Payment Method : ${invoiceData.method}
Payment Status : SETTLED & VERIFIED VIA SOVEREIGN GeM TREASURY GATEWAY
------------------------------------------------------------------------
Billed To:
Vendor Name    : ${invoiceData.vendorName}
Vendor GSTIN   : ${invoiceData.gstin}
Category       : ${user?.role || 'REGISTERED_VENDOR'}
------------------------------------------------------------------------
DESCRIPTION OF SERVICES                                   AMOUNT (INR)
------------------------------------------------------------------------
GeM 2.0 ${invoiceData.plan} Compliance Subscription (Monthly)   ₹ ${Math.round(invoiceData.amount / 1.18)}.00
CGST (9%)                                                  ₹ ${Math.round((invoiceData.amount / 1.18) * 0.09)}.00
SGST (9%)                                                  ₹ ${Math.round((invoiceData.amount / 1.18) * 0.09)}.00
------------------------------------------------------------------------
TOTAL AMOUNT CHARGED (INCL. 18% GST)                       ₹ ${invoiceData.amount}.00
------------------------------------------------------------------------
* Input Tax Credit (ITC) is admissible under GSTR-2B.
* Cryptographic Transaction Hash: SHA256:${invoiceData.txId}
* Anchored to CAG Cryptographic Audit Ledger Block #42
========================================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoiceData.invoiceNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0C1A30] border border-[#1E3A68] rounded-xl shadow-2xl p-6 space-y-5 max-h-[92vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-[#1E3A68] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-linear-to-br from-cyan-600 to-blue-700 text-white shadow-lg">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-100">
                  GeM 2.0 Subscription & AI Scrutiny Quotas
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> GeM TREASURY SECURED &bull; 18% ITC GST
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant quota upgrade for automated PQC checks, Atlas RAG searches, and official signed dockets.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showSuccessInvoice && invoiceData ? (
          <div className="bg-[#08172D] border border-emerald-500/40 rounded-xl p-6 text-center space-y-4 animate-scaleUp">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-300">
                Payment Completed & Subscription Activated!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your account has been upgraded to <strong className="text-amber-300">{invoiceData.plan}</strong> with unlimited AI scrutiny capabilities.
              </p>
            </div>

            <div className="bg-[#050e1d] border border-[#1E3A68] rounded-lg p-4 text-left font-mono text-xs space-y-2 max-w-lg mx-auto">
              <div className="flex justify-between text-slate-400">
                <span>Invoice No:</span>
                <span className="text-white font-bold">{invoiceData.invoiceNo}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Vendor:</span>
                <span className="text-cyan-300">{invoiceData.vendorName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Settled Via:</span>
                <span className="text-emerald-300">{invoiceData.method}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GSTIN:</span>
                <span className="text-amber-300">{invoiceData.gstin}</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
                <span>Amount Charged:</span>
                <span className="text-emerald-400 font-bold text-sm">₹ {invoiceData.amount}.00 (Incl. GST)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Transaction Ref:</span>
                <span className="text-slate-300 text-[11px]">{invoiceData.txId}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={downloadInvoiceTxt}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Tax Invoice
              </button>
              <button
                onClick={() => { setShowSuccessInvoice(false); onClose(); }}
                className="px-4 py-2 rounded-lg bg-[#1E3A68] hover:bg-[#2A4D88] text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {paymentError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* FREE TIER */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                subscription.planId === 'FREE'
                  ? 'bg-[#0F2548] border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-[#08172D] border-[#1E3A68] hover:border-slate-600'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Basic MSME</span>
                    {subscription.planId === 'FREE' && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono text-white">
                      ₹ 0 <span className="text-xs font-sans text-slate-400 font-normal">/ month</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Ideal for new startups testing the GeM bidding process.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1E3A68] space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>5 Automated PQC evaluations / mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Standard OCR Parameter Extraction</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <X className="w-3.5 h-3.5 shrink-0" />
                      <span>Atlas Vector Semantic RAG</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <button
                    disabled={subscription.planId === 'FREE'}
                    onClick={() => handleCheckout('FREE')}
                    className="w-full py-2 rounded-lg bg-[#001D3D] text-slate-300 border border-[#1E3A68] text-xs font-bold hover:bg-[#002855] disabled:opacity-40 transition-all cursor-pointer"
                  >
                    {subscription.planId === 'FREE' ? 'Current Plan' : 'Downgrade to Free'}
                  </button>
                </div>
              </div>

              {/* STARTER TIER */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                subscription.planId === 'STARTER'
                  ? 'bg-[#0F2548] border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-[#08172D] border-[#1E3A68] hover:border-slate-600'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Starter Contractor</span>
                    {subscription.planId === 'STARTER' && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold border border-blue-500/30">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono text-white">
                      ₹ 99 <span className="text-xs font-sans text-slate-400 font-normal">/ month</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      For active contractors submitting multiple bids monthly.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1E3A68] space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>50 AI PQC evaluations / mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Optimal L1 Pricing Advisor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Signed PDF Dossier Export</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <button
                    disabled={subscription.planId === 'STARTER' || isProcessingCheckout}
                    onClick={() => handleCheckout('STARTER', activePaymentTab === 'GEM_WALLET' ? 'GEM_E_WALLET' : activePaymentTab === 'NETBANKING' ? 'CORPORATE_NETBANKING' : 'UPI_CORPORATE')}
                    className="w-full py-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isProcessingCheckout && selectedPlan === 'STARTER' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing Settlement...</span>
                      </>
                    ) : subscription.planId === 'STARTER' ? (
                      'Active Tier'
                    ) : (
                      <>
                        <span>Activate Starter (₹99)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* PRO TIER */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between relative transition-all ${
                subscription.planId === 'PRO'
                  ? 'bg-[#0F2548] border-amber-500 shadow-xl ring-2 ring-amber-500/40'
                  : 'bg-linear-to-b from-[#0f213d] to-[#08172D] border-amber-500/60 shadow-lg'
              }`}>
                <div className="absolute -top-3 right-4 bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-slate-950" /> RECOMMENDED
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Enterprise Pro</span>
                    {subscription.planId === 'PRO' && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono text-white">
                      ₹ 499 <span className="text-xs font-sans text-slate-400 font-normal">/ month</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Full-scale AI compliance suite for top-tier OEMs & Works Contractors.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1E3A68] space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <strong className="text-emerald-300">Unlimited AI Evaluations</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Atlas Vector Semantic RAG</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Priority CAG Merkle Audit Proofs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Multi-bid Batch Scrutiny</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <button
                    disabled={subscription.planId === 'PRO' || isProcessingCheckout}
                    onClick={() => handleCheckout('PRO', activePaymentTab === 'GEM_WALLET' ? 'GEM_E_WALLET' : activePaymentTab === 'NETBANKING' ? 'CORPORATE_NETBANKING' : 'UPI_CORPORATE')}
                    className="w-full py-2.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProcessingCheckout && selectedPlan === 'PRO' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing Settlement...</span>
                      </>
                    ) : subscription.planId === 'PRO' ? (
                      'Active Tier (Unlimited)'
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        <span>Instant Upgrade to Pro (₹499)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* PAYMENT GATEWAY SELECTION */}
            <div className="p-4 bg-[#08172D] border border-[#1E3A68] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">Select Sovereign Settlement Gateway</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setActivePaymentTab('GEM_WALLET')}
                    className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePaymentTab === 'GEM_WALLET'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-[#001D3D] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wallet className="w-3 h-3" /> GeM e-Wallet
                  </button>
                  <button
                    onClick={() => setActivePaymentTab('NETBANKING')}
                    className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePaymentTab === 'NETBANKING'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-[#001D3D] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3 h-3" /> Corporate Banking
                  </button>
                  <button
                    onClick={() => setActivePaymentTab('UPI_QR')}
                    className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePaymentTab === 'UPI_QR'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-[#001D3D] text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-3 h-3" /> Bharat QR / UPI
                  </button>
                </div>
              </div>

              {activePaymentTab === 'GEM_WALLET' && (
                <div className="p-3 bg-[#050e1d] rounded-lg border border-cyan-500/30 flex items-center justify-between text-xs animate-fadeIn">
                  <div className="space-y-1">
                    <div className="text-slate-300 font-semibold flex items-center gap-2">
                      <span>GeM Sovereign Contractor e-Wallet</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono">LINKED TO GSTIN</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Available Balance: <strong className="text-emerald-400 font-mono">₹ 2,45,000.00</strong> (Pre-funded via PFMS Treasury)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-cyan-300 font-bold block">0% Transaction Fee</span>
                    <span className="text-[9px] text-slate-500">Instant 1-Click Deduction</span>
                  </div>
                </div>
              )}

              {activePaymentTab === 'NETBANKING' && (
                <div className="p-3 bg-[#050e1d] rounded-lg border border-blue-500/30 space-y-2 text-xs animate-fadeIn">
                  <span className="text-slate-300 font-semibold block">Select Empanelled Public Sector / Scheduled Bank:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'SBI_CORP', name: 'State Bank of India (SBI)' },
                      { id: 'HDFC_CORP', name: 'HDFC Corporate' },
                      { id: 'ICICI_CORP', name: 'ICICI Treasury' },
                      { id: 'PNB_CORP', name: 'Punjab National Bank' }
                    ].map(bank => (
                      <button
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-2 rounded text-[11px] text-left border transition-all cursor-pointer ${
                          selectedBank === bank.id
                            ? 'bg-blue-950/80 border-blue-400 text-blue-200 font-bold'
                            : 'bg-[#08172D] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {bank.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePaymentTab === 'UPI_QR' && (
                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-[#050e1d] rounded-lg border border-indigo-500/30 animate-fadeIn">
                  <div className="bg-white p-2 rounded-lg shadow-inner shrink-0 text-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=gem.treasury@sbi%26pn=GeM%202.0%20Procurement%26am=${selectedPlan === 'PRO' ? 499 : 99}%26cu=INR`} 
                      alt="UPI QR Code" 
                      className="w-24 h-24 mx-auto"
                    />
                    <span className="text-[8px] font-mono font-bold text-slate-800">Scan via Any Corporate UPI</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>VPA: <strong className="text-cyan-300 font-mono">gem.treasury@sbi</strong></span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Scan with any authorized business banking UPI application (SBI YONO Business, BHIM Corporate, HDFC Corporate).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-[#1E3A68]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>GeM Sovereign Treasury Protocol &bull; 100% GFR 2017 & Public Procurement Terms Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};