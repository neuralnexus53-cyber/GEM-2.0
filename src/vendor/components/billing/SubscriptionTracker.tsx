import React, { useState } from 'react';
import { 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  ArrowUpRight, 
  Download, 
  FileText, 
  Lock, 
  Zap,
  TrendingUp,
  RefreshCw,
  Clock,
  Layers,
  Check
} from 'lucide-react';
import { SubscriptionState, PlanTier } from '../../types/auth_billing';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../context/AuthContext';

interface SubscriptionTrackerProps {
  subscription: SubscriptionState;
  onOpenPricingModal: () => void;
}

export const SubscriptionTracker: React.FC<SubscriptionTrackerProps> = ({ 
  subscription, 
  onOpenPricingModal 
}) => {
  const { user } = useAuth();
  const { upgradePlan, isProcessingPayment } = useSubscription();
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  const isUnlimited = subscription.evaluationsLimit === -1;
  const used = subscription.evaluationsUsed || 0;
  const limit = isUnlimited ? 999 : (subscription.evaluationsLimit || 5);
  const percentage = isUnlimited ? 100 : Math.min(100, Math.round((used / limit) * 100));

  const renewalDate = new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const transactionHistory = [
    {
      id: 'TXN-2026-8941',
      date: '01 Mar 2026',
      description: subscription.planId === 'PRO' ? 'Sovereign Pro Plan (Monthly Subscription)' : 'Free Starter Tier Activation',
      amount: subscription.planId === 'PRO' ? '₹ 499 + GST' : '₹ 0',
      status: 'PAID',
      method: 'GeM Corporate e-Wallet',
      invoiceNo: 'GEM-INV-2026-8941'
    },
    {
      id: 'TXN-2026-7120',
      date: '01 Feb 2026',
      description: 'Monthly Compliance Quota Allocation',
      amount: '₹ 0',
      status: 'COMPLETED',
      method: 'System Allocation',
      invoiceNo: 'GEM-INV-2026-7120'
    }
  ];

  const handleDownloadInvoice = (invNo: string) => {
    setDownloadingInvoice(invNo);
    setTimeout(() => {
      const csvContent = [
        "Invoice Number,Date,Vendor Name,GSTIN,Plan,Amount,Payment Method,Status",
        `"${invNo}","${renewalDate}","${user?.name || 'Verified Vendor'}","${user?.gstin || '07AAAAA0000A1Z5'}","${subscription.planId}","${subscription.planId === 'PRO' ? '₹ 499' : '₹ 0'}","GeM Sovereign e-Wallet","SUCCESS"`
      ].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `GeM_Invoice_${invNo}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadingInvoice(null);
    }, 600);
  };

  return (
    <div className="space-y-4 text-slate-100">
      
      {/* Header Overview Card */}
      <div className="gov-card gov-card-saffron p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#2D1A05] border border-[#9A3412] text-amber-400 mt-0.5">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  SaaS Subscription &amp; AI Evaluation Quota Tracker
                </h2>
                <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold border ${
                  subscription.planId === 'PRO'
                    ? 'bg-amber-950 text-amber-300 border-amber-600'
                    : subscription.planId === 'ENTERPRISE'
                    ? 'bg-purple-950 text-purple-300 border-purple-600'
                    : 'bg-sky-950 text-sky-300 border-sky-700'
                }`}>
                  {subscription.planId} TIER ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                Real-time usage meter for AI Scrutiny OCR runs, Schedule of Rates (SoR) simulations, and Merkle-signed dossier generation. Upgrade anytime for unlimited scrutiny and unlocked market pricing models.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenPricingModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{subscription.planId === 'FREE' ? 'Upgrade to Pro Plan' : 'Manage Subscription'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quota & Feature Entitlement Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Usage Gauge Card */}
        <div className="gov-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#23436E]">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Monthly Evaluation Meter
            </span>
            <span className="text-[11px] font-mono text-cyan-300">
              Renews: {renewalDate}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {used}
                </span>
                <span className="text-xs text-slate-400 font-mono ml-1.5">
                  / {isUnlimited ? '∞ Unlimited' : `${limit} Scans`}
                </span>
              </div>
              <span className="text-xs font-bold text-amber-400 font-mono">
                {isUnlimited ? '100% UNLOCKED' : `${limit - used} Remaining`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-[#0B192C] rounded-full overflow-hidden border border-[#23436E] p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  percentage > 85 ? 'bg-rose-500' : percentage > 60 ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${isUnlimited ? 100 : percentage}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-[#0B192C] rounded-lg border border-[#23436E] space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span>Auto-Debit / Mandate:</span>
              <span className="font-bold text-emerald-400">{subscription.isAutopayEnabled ? 'Active (Auto-Renew)' : 'Manual Recharge'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Current Plan Status:</span>
              <span className="font-bold text-sky-400 uppercase">{subscription.status}</span>
            </div>
          </div>

          {subscription.planId === 'FREE' && (
            <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-700/60 text-xs text-amber-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Free Plan Limit Warning</span>
              </div>
              <p className="text-[11px] text-amber-300/90 leading-tight">
                You are on the Free Starter Tier (5 evaluations/month). Upgrade to Pro for unlimited AI scans and unlocked Pricing Advisor.
              </p>
            </div>
          )}
        </div>

        {/* Feature Entitlements Checklist */}
        <div className="lg:col-span-2 gov-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#23436E]">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Active Plan Feature Entitlements
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#0B192C] text-slate-300 border border-[#23436E]">
              Tier: <strong className="text-white">{subscription.planId}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <div className="p-3 bg-[#0B192C] rounded-lg border border-[#23436E] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">NIT PDF OCR Scrutiny</span>
                <span className="text-[11px] text-slate-300">Deterministic statutory 14-point rule checking engine</span>
              </div>
            </div>

            <div className="p-3 bg-[#0B192C] rounded-lg border border-[#23436E] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">GFR 170 / 173 Exemption Desks</span>
                <span className="text-[11px] text-slate-300">MSME EMD waiver claims &amp; OEM MAF form generation</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border flex items-start gap-2.5 ${
              subscription.hasVectorRag ? 'bg-[#0B192C] border-[#23436E]' : 'bg-[#071322] border-[#1E3A68] opacity-75'
            }`}>
              {subscription.hasVectorRag ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">Clause Risk Vector RAG</span>
                  {!subscription.hasVectorRag && <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300 font-bold border border-amber-700">PRO</span>}
                </div>
                <span className="text-[11px] text-slate-300">Deep semantic vector search for Liquidated Damages risks</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border flex items-start gap-2.5 ${
              subscription.hasPricingAdvisor ? 'bg-[#0B192C] border-[#23436E]' : 'bg-[#071322] border-[#1E3A68] opacity-75'
            }`}>
              {subscription.hasPricingAdvisor ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">SoR &amp; L1 Pricing Advisor</span>
                  {!subscription.hasPricingAdvisor && <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300 font-bold border border-amber-700">PRO</span>}
                </div>
                <span className="text-[11px] text-slate-300">Market intelligence &amp; CVC-compliant rate benchmarking</span>
              </div>
            </div>

          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-slate-400">Need customized volume quotas for enterprise tender portfolios?</span>
            <button
              onClick={onOpenPricingModal}
              className="text-xs font-bold text-cyan-300 hover:text-white underline cursor-pointer"
            >
              Compare All Tiers &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Transaction & Invoicing History */}
      <div className="gov-card p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#23436E]">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Billing &amp; Payment Receipts (GST Invoices)
          </span>
          <span className="text-[10px] text-slate-400 font-mono">SAC: 998313</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#23436E]">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Billing Date</th>
                <th>Description</th>
                <th>Amount (INR)</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th className="text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map(txn => (
                <tr key={txn.id}>
                  <td className="font-mono font-bold text-cyan-300">{txn.invoiceNo}</td>
                  <td className="text-slate-300">{txn.date}</td>
                  <td className="font-medium text-white">{txn.description}</td>
                  <td className="font-mono font-bold text-amber-400">{txn.amount}</td>
                  <td className="text-slate-300">{txn.method}</td>
                  <td>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600">
                      {txn.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleDownloadInvoice(txn.invoiceNo)}
                      disabled={downloadingInvoice === txn.invoiceNo}
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadingInvoice === txn.invoiceNo ? 'Downloading...' : 'Tax Invoice'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
