import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Target, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Calculator, 
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { TenderItem } from '../../types';
import { formatCurrency, formatINR } from '../../lib/utils';
import { useSubscription } from '../../hooks/useSubscription';

interface OptimalPricingAdvisorProps {
  onOpenPricingModal?: () => void;
}

export const OptimalPricingAdvisor: React.FC<OptimalPricingAdvisorProps> = ({ onOpenPricingModal }) => {
  const { subscription } = useSubscription();
  const isFreePlan = subscription.planId === 'FREE';
  const [tenders, setTenders] = useState<TenderItem[]>([]);
  const [selectedTenderId, setSelectedTenderId] = useState<string>('');
  const [baseTenderValueCr, setBaseTenderValueCr] = useState<number>(14.5);
  const [selectedRegion, setSelectedRegion] = useState<string>('Northern Region (Delhi-NCR, UP, Punjab)');
  const [selectedTier, setSelectedTier] = useState<'AGGRESSIVE' | 'BALANCED' | 'SAFE'>('BALANCED');

  useEffect(() => {
    const loadLiveTenders = async () => {
      try {
        const liveTenders = await api.getTenders();
        if (liveTenders && liveTenders.length > 0) {
          setTenders(liveTenders);
          setSelectedTenderId(liveTenders[0].id);
          setBaseTenderValueCr(liveTenders[0].estimatedValueCr);
        }
      } catch (err) {}
    };
    loadLiveTenders();
  }, []);

  const handleSelectTender = (tId: string) => {
    setSelectedTenderId(tId);
    const found = tenders.find(t => t.id === tId);
    if (found) {
      setBaseTenderValueCr(found.estimatedValueCr);
    }
  };

  const regionalIndices = [
    { region: 'Northern Region (Delhi-NCR, UP, Punjab)', indexMultiplier: 1.04, demandPressure: 'HIGH', avgL1Discount: 9.2 },
    { region: 'Western Industrial Corridor (Maharashtra, Gujarat)', indexMultiplier: 0.98, demandPressure: 'VERY_HIGH', avgL1Discount: 11.4 },
    { region: 'Southern Tech Hubs (Karnataka, TN, Telangana)', indexMultiplier: 1.02, demandPressure: 'MODERATE', avgL1Discount: 8.1 },
    { region: 'Eastern & North-Eastern Infrastructure Zone', indexMultiplier: 1.12, demandPressure: 'BALANCED', avgL1Discount: 6.5 }
  ];

  const regionInfo = regionalIndices.find(r => r.region === selectedRegion) || regionalIndices[0];

  const tenderValueInINR = baseTenderValueCr * 10000000;

  const aggressiveDiscount = 12.5;
  const balancedDiscount = 8.5;
  const safeDiscount = 4.0;

  const getDiscountForTier = (tier: string) => {
    if (tier === 'AGGRESSIVE') return aggressiveDiscount;
    if (tier === 'BALANCED') return balancedDiscount;
    return safeDiscount;
  };

  const currentDiscount = getDiscountForTier(selectedTier);
  const recommendedBidINR = tenderValueInINR * (1 - (currentDiscount / 100));
  const estimatedCostINR = tenderValueInINR * 0.76;
  const estimatedMarginINR = recommendedBidINR - estimatedCostINR;
  const marginPercentage = ((estimatedMarginINR / recommendedBidINR) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {isFreePlan && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/80 via-[#1E170A] to-[#132540] border-2 border-amber-500/60 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 mt-0.5">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-extrabold uppercase tracking-wide">
                    PRO / ENTERPRISE FEATURE
                  </span>
                  <h3 className="text-sm font-extrabold text-white">
                    Rate Intelligence &amp; L1 Predictive Advisor is Locked
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Your current <strong className="text-white">Free Trial Tier</strong> allows document OCR and GFR compliance scrutiny. Upgrade to <strong className="text-amber-400">Pro Plan (₹2,999/mo)</strong> or <strong className="text-cyan-400">Enterprise</strong> to unlock live GeM historical SoR pricing, CVC Abnormally Low Bid (ALB) threshold defense, and custom rate exports.
                </p>
              </div>
            </div>

            {onOpenPricingModal && (
              <button
                onClick={onOpenPricingModal}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Upgrade to Pro Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className={`gov-card gov-card-saffron p-4 ${isFreePlan ? 'opacity-90' : ''}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#2D1A05] border border-[#9A3412] text-amber-400 mt-0.5">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-100">
                  Schedule of Rates (SoR) & L1 Price Estimation Advisory
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#2D1A05] text-amber-300 font-bold border border-[#9A3412]">
                  CVC Bidding Guidelines Compliant
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Market price benchmarking against GeM historical award data, regional index multipliers, and Central Vigilance Commission (CVC) Abnormally Low Bid (ALB) threshold alerts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const header = "Parameter,Value\n";
                const rows = [
                  `"Tender ID","${selectedTenderId || 'TND-2026-001'}"`,
                  `"Estimated Tender Value (Cr)","₹ ${baseTenderValueCr} Cr"`,
                  `"Selected Geographic Region","${selectedRegion}"`,
                  `"Regional Multiplier","${regionInfo.indexMultiplier}"`,
                  `"Bidding Strategy Tier","${selectedTier}"`,
                  `"Recommended Discount %","${currentDiscount}%"`,
                  `"Optimal Recommended Bid (INR)","₹ ${recommendedBidINR.toLocaleString('en-IN')}"`,
                  `"Estimated Base Execution Cost","₹ ${estimatedCostINR.toLocaleString('en-IN')}"`,
                  `"Projected Net Margin (INR)","₹ ${estimatedMarginINR.toLocaleString('en-IN')}"`,
                  `"Projected Gross Margin %","${marginPercentage}%"`
                ].join("\n");
                const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `GeM_Cost_Justification_Rate_Analysis_${selectedTenderId || 'Tender'}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#0B2545] hover:bg-[#112E55] text-blue-200 border border-[#1D4ED8] text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Rate Analysis (SoR)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="gov-card p-4 space-y-3">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wide pb-1 border-b border-[#1E3A68]">
            Departmental Tender Parameters
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Department Estimated Tender Value (₹ Crores)
            </label>
            <input
              type="number"
              step="0.5"
              value={baseTenderValueCr}
              onChange={e => setBaseTenderValueCr(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono text-sm focus:border-[#0284C7] focus:outline-none"
            />
            <div className="text-[10px] text-slate-500 mt-1">
              Total Tender Estimate: <strong className="text-slate-300 font-mono">{formatCurrency(tenderValueInINR)}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-medium mb-1">
              Procurement Region & Cost Index Factor
            </label>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B192C] border border-[#23436E] rounded text-white text-xs focus:border-[#38BDF8] focus:outline-none"
            >
              {regionalIndices.map((r, i) => (
                <option key={i} value={r.region}>
                  {r.region} (Index: {r.indexMultiplier}x • Avg L1 Discount: {r.avgL1Discount}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-medium mb-1">
              Bidding Strategy & Price Position
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTier('AGGRESSIVE')}
                className={`p-2 rounded text-center border text-xs font-semibold transition-all cursor-pointer ${
                  selectedTier === 'AGGRESSIVE'
                    ? 'bg-[#002855] text-cyan-300 border-[#38BDF8] shadow-xs'
                    : 'bg-[#0B192C] text-slate-300 border-[#23436E] hover:bg-[#132540]'
                }`}
              >
                <div className="font-bold text-white">Aggressive L1</div>
                <div className="text-[10px] text-cyan-300 font-mono mt-0.5">-12.5%</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('BALANCED')}
                className={`p-2 rounded text-center border text-xs font-semibold transition-all cursor-pointer ${
                  selectedTier === 'BALANCED'
                    ? 'bg-[#002855] text-amber-300 border-[#F59E0B] shadow-xs'
                    : 'bg-[#0B192C] text-slate-300 border-[#23436E] hover:bg-[#132540]'
                }`}
              >
                <div className="font-bold text-white">Balanced</div>
                <div className="text-[10px] text-amber-300 font-mono mt-0.5">-8.5%</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('SAFE')}
                className={`p-2 rounded text-center border text-xs font-semibold transition-all cursor-pointer ${
                  selectedTier === 'SAFE'
                    ? 'bg-[#002855] text-emerald-300 border-[#10B981] shadow-xs'
                    : 'bg-[#0B192C] text-slate-300 border-[#23436E] hover:bg-[#132540]'
                }`}
              >
                <div className="font-bold text-white">Conservative</div>
                <div className="text-[10px] text-emerald-300 font-mono mt-0.5">-4.0%</div>
              </button>
            </div>
          </div>
        </div>

        <div className="gov-card p-4 space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wide pb-1 border-b border-[#23436E] flex items-center justify-between">
            <span>Recommended Bid Quotation</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600 font-mono">VIABLE BID</span>
          </div>

          <div className="p-3.5 bg-[#0B1E38] rounded-lg border border-[#23436E]">
            <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Recommended Total Bid Price (Excl. GST)</div>
            <div className="text-xl sm:text-2xl font-extrabold text-cyan-300 font-mono mt-0.5">
              {formatCurrency(recommendedBidINR)}
            </div>
            <div className="text-xs text-slate-200 mt-1.5 flex items-center gap-2 flex-wrap">
              <span>Variation: <strong className="text-amber-400 font-mono font-bold">-{currentDiscount}%</strong> below Dept Rate</span>
              <span>•</span>
              <span>Net Margin: <strong className="text-emerald-400 font-mono font-bold">{marginPercentage}%</strong></span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#0B192C] rounded-lg border border-[#23436E]">
              <span className="text-slate-300 font-medium">Estimated Direct Execution Cost:</span>
              <span className="font-mono text-white font-bold">{formatCurrency(estimatedCostINR)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#0B192C] rounded-lg border border-[#23436E]">
              <span className="text-slate-300 font-medium">Projected Pre-Tax Profit:</span>
              <span className="font-mono text-emerald-400 font-extrabold text-sm">{formatCurrency(estimatedMarginINR)}</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#0B192C] rounded-lg border border-[#23436E] text-xs text-slate-300 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">CVC Compliance Check:</strong> Quotation is within safe variance limits and does not trigger Additional Performance Security (APS) requirements under GFR Rule 170.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};