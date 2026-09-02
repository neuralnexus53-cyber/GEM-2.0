import React, { useState, useEffect } from 'react';
import { 
  HardHat, 
  Layers, 
  Calculator, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Download,
  RefreshCw,
  FileSpreadsheet,
  Building,
  Check
} from 'lucide-react';
import { VendorProfile, BoQItem, MilestoneItem } from '../../types';
import { api } from '../../services/api';
import { formatCurrency } from '../../lib/utils';

interface WorksContractorPortalProps {
  profile: VendorProfile;
}

export const WorksContractorPortal: React.FC<WorksContractorPortalProps> = ({ profile }) => {
  const [boqList, setBoqList] = useState<BoQItem[]>([]);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'BOQ' | 'MILESTONES' | 'BID_CAPACITY'>('BOQ');
  const [loading, setLoading] = useState(true);

  // CPWD Bidding Capacity State: A*N*2 - B
  const [bidCapacityState, setBidCapacityState] = useState({
    maxTurnoverA: profile.turnoverCr || 48.5,
    completionYearsN: 1.5,
    existingCommitmentsB: 35.0
  });

  const [newItem, setNewItem] = useState({
    itemCode: '',
    description: '',
    unit: 'Units',
    quantity: 100,
    estimatedRate: 5000,
    quotedRate: 4600,
    gstRate: 18
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [boqData, milestoneData] = await Promise.all([
        api.getBoQSchedule(),
        api.getMilestones()
      ]);
      setBoqList(boqData);
      setMilestones(milestoneData);
      setNewItem(prev => ({ ...prev, itemCode: `BOQ-0${boqData.length + 1}` }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.description || !newItem.itemCode) return;

    const item: BoQItem = {
      id: `BOQ-${Date.now()}`,
      itemCode: newItem.itemCode,
      description: newItem.description,
      unit: newItem.unit,
      quantity: Number(newItem.quantity),
      estimatedRate: Number(newItem.estimatedRate),
      quotedRate: Number(newItem.quotedRate),
      gstRate: Number(newItem.gstRate)
    };

    try {
      await api.addBoQItem(item);
      setBoqList(prev => [...prev, item]);
      setNewItem({
        itemCode: `BOQ-0${boqList.length + 2}`,
        description: '',
        unit: 'Units',
        quantity: 100,
        estimatedRate: 5000,
        quotedRate: 4600,
        gstRate: 18
      });
    } catch (e) {
      setBoqList(prev => [...prev, item]);
    }
  };

  // CPWD Bidding Capacity formula: Capacity = (A * N * 2) - B
  const availableBiddingCapacity = (
    bidCapacityState.maxTurnoverA * bidCapacityState.completionYearsN * 2 - bidCapacityState.existingCommitmentsB
  ).toFixed(2);

  const totalBoqEstimated = boqList.reduce((acc, curr) => acc + curr.quantity * curr.estimatedRate, 0);
  const totalBoqQuoted = boqList.reduce((acc, curr) => acc + curr.quantity * curr.quotedRate, 0);

  return (
    <div className="space-y-4">
      
      <div className="gov-card gov-card-green p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#052410] border border-[#15803D] text-emerald-400 mt-0.5">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-100">
                  Civil & Works Contractor Public Procurement Docket
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
                  CPWD / MES Class-I Registered
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Schedule of Rates (SoR), Bill of Quantities (BoQ) item rate comparative matrix, CPWD bidding capacity evaluation, and milestone billing schedules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const header = "Item Code,Description,Unit,Quantity,Estimated Rate (INR),Quoted Rate (INR),Total Quoted (INR),GST %\n";
                const rows = boqList.map(item => `"${item.itemCode}","${item.description.replace(/"/g, '""')}","${item.unit}",${item.quantity},${item.estimatedRate},${item.quotedRate},${item.quantity * item.quotedRate},${item.gstRate}`).join("\n");
                const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `CPWD_BoQ_Schedule_${Date.now()}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#0B2545] hover:bg-[#112E55] text-blue-200 border border-[#1D4ED8] text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export BoQ Schedule</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-b border-[#1E3A68] pb-2">
        <button
          onClick={() => setActiveSubTab('BOQ')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
            activeSubTab === 'BOQ'
              ? 'bg-[#002855] text-white border-[#0284C7]'
              : 'bg-[#08172D] text-slate-400 border-[#1E3A68] hover:bg-[#0E203B] hover:text-slate-200'
          }`}
        >
          1. BoQ & Schedule of Rates ({boqList.length} Items)
        </button>

        <button
          onClick={() => setActiveSubTab('MILESTONES')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
            activeSubTab === 'MILESTONES'
              ? 'bg-[#002855] text-white border-[#0284C7]'
              : 'bg-[#08172D] text-slate-400 border-[#1E3A68] hover:bg-[#0E203B] hover:text-slate-200'
          }`}
        >
          2. Milestone & Payment Retention Schedule
        </button>

        <button
          onClick={() => setActiveSubTab('BID_CAPACITY')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
            activeSubTab === 'BID_CAPACITY'
              ? 'bg-[#002855] text-white border-[#0284C7]'
              : 'bg-[#08172D] text-slate-400 border-[#1E3A68] hover:bg-[#0E203B] hover:text-slate-200'
          }`}
        >
          3. CPWD Bidding Capacity Evaluation
        </button>
      </div>

      {activeSubTab === 'BOQ' && (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="gov-card p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Department Estimated Value</span>
              <div className="text-sm font-bold text-slate-100 font-mono mt-0.5">
                {formatCurrency(totalBoqEstimated)}
              </div>
            </div>

            <div className="gov-card p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Contractor Total Quoted Value</span>
              <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">
                {formatCurrency(totalBoqQuoted)}
              </div>
            </div>

            <div className="gov-card p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Net Percentage Variation</span>
              <div className="text-sm font-bold font-mono mt-0.5 text-emerald-400">
                {totalBoqEstimated > 0 ? (((totalBoqQuoted - totalBoqEstimated) / totalBoqEstimated) * 100).toFixed(2) : '0.00'}% (Below Dept Rate)
              </div>
            </div>
          </div>

          <form onSubmit={handleAddItem} className="gov-card p-3.5 space-y-3 bg-[#001D3D] border-[#1E3A68]">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              Append Item to Schedule of Rates (BoQ Form B-01)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Item Code *</label>
                <input
                  type="text"
                  value={newItem.itemCode}
                  onChange={e => setNewItem({ ...newItem, itemCode: e.target.value })}
                  required
                  className="w-full px-2 py-1 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-slate-400 mb-1">Item Description / CPWD DSR Code *</label>
                <input
                  type="text"
                  value={newItem.description}
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="e.g. Earthwork in excavation in foundation trenches"
                  required
                  className="w-full px-2 py-1 bg-[#051124] border border-[#1E3A68] rounded text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Quantity *</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  required
                  className="w-full px-2 py-1 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Dept Rate (INR) *</label>
                <input
                  type="number"
                  value={newItem.estimatedRate}
                  onChange={e => setNewItem({ ...newItem, estimatedRate: Number(e.target.value) })}
                  required
                  className="w-full px-2 py-1 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Quoted Rate (INR) *</label>
                <input
                  type="number"
                  value={newItem.quotedRate}
                  onChange={e => setNewItem({ ...newItem, quotedRate: Number(e.target.value) })}
                  required
                  className="w-full px-2 py-1 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-xs"
              >
                + Insert BoQ Row
              </button>
            </div>
          </form>

          <div className="gov-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Schedule of Quantities & Rates Matrix
              </span>
              <span className="text-[10px] text-slate-400 font-mono">CPWD Works Manual 2022 Format</span>
            </div>

            <div className="overflow-x-auto rounded border border-[#1E3A68]">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th className="w-20">Item Code</th>
                    <th>Specification Description</th>
                    <th className="text-center">Qty / Unit</th>
                    <th className="text-right">Dept Rate (INR)</th>
                    <th className="text-right">Quoted Rate (INR)</th>
                    <th className="text-right">Total Quoted (INR)</th>
                    <th className="text-center">Variation</th>
                  </tr>
                </thead>
                <tbody>
                  {boqList.map(item => {
                    const totalQuoted = item.quantity * item.quotedRate;
                    const totalEstimated = item.quantity * item.estimatedRate;
                    const deviation = totalEstimated > 0 ? (((totalQuoted - totalEstimated) / totalEstimated) * 100).toFixed(2) : '0';
                    return (
                      <tr key={item.id}>
                        <td className="font-mono font-bold text-amber-400 bg-[#001833]">{item.itemCode}</td>
                        <td className="text-slate-200">{item.description}</td>
                        <td className="text-center font-mono text-slate-300">{item.quantity} {item.unit}</td>
                        <td className="text-right font-mono text-slate-300">{item.estimatedRate.toLocaleString('en-IN')}</td>
                        <td className="text-right font-mono text-cyan-300 font-semibold">{item.quotedRate.toLocaleString('en-IN')}</td>
                        <td className="text-right font-mono text-slate-100 font-bold">{totalQuoted.toLocaleString('en-IN')}</td>
                        <td className="text-center font-mono font-bold">
                          <span className={Number(deviation) <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {Number(deviation) > 0 ? `+${deviation}%` : `${deviation}%`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'MILESTONES' && (
        <div className="gov-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E3A68]">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                Statutory Milestones & Liquidated Damages (LD) Schedule
              </h3>
              <p className="text-[11px] text-slate-400">
                Milestone payments are subject to 5% security deposit retention and engineer inspection.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded border border-[#1E3A68]">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Milestone Name</th>
                  <th>Target Timeline</th>
                  <th className="text-center">Weightage %</th>
                  <th className="text-center">Payment %</th>
                  <th className="text-center">Retention %</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((m, idx) => (
                  <tr key={m.id || idx}>
                    <td className="font-semibold text-slate-200">{m.milestoneName}</td>
                    <td className="font-mono text-slate-300 text-[11px]">{m.targetDays} Days</td>
                    <td className="text-center font-mono text-cyan-300 font-bold">{m.weightagePercent}%</td>
                    <td className="text-center font-mono text-emerald-400 font-bold">{m.paymentPercent}%</td>
                    <td className="text-center font-mono text-amber-300">{m.retentionPercent}%</td>
                    <td className="text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                        m.status === 'COMPLETED'
                          ? 'bg-[#052410] text-emerald-300 border-[#15803D]'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-[#002855] text-cyan-300 border-[#0284C7]'
                          : 'bg-[#1E293B] text-slate-400 border-[#475569]'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'BID_CAPACITY' && (
        <div className="gov-card p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E3A68]">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                Available Bidding Capacity Assessment (CPWD Manual Clause 2.1)
              </h3>
              <p className="text-[11px] text-slate-400">
                Formula: Available Bidding Capacity = <strong className="text-amber-300 font-mono">(A &times; N &times; 2) &minus; B</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Available Bidding Capacity</span>
              <span className="text-base font-bold font-mono text-emerald-400">₹ {availableBiddingCapacity} Crores</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#08172D] rounded border border-[#1E3A68] space-y-1">
              <label className="block text-slate-400 font-semibold">A = Max Turnover in Last 5 Yrs (₹ Cr)</label>
              <input
                type="number"
                value={bidCapacityState.maxTurnoverA}
                onChange={e => setBidCapacityState({ ...bidCapacityState, maxTurnoverA: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
              />
              <p className="text-[10px] text-slate-500">Updated to current price level using 10% annual escalation.</p>
            </div>

            <div className="p-3 bg-[#08172D] rounded border border-[#1E3A68] space-y-1">
              <label className="block text-slate-400 font-semibold">N = Prescribed Work Period (Years)</label>
              <input
                type="number"
                step="0.1"
                value={bidCapacityState.completionYearsN}
                onChange={e => setBidCapacityState({ ...bidCapacityState, completionYearsN: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
              />
              <p className="text-[10px] text-slate-500">Specified time for completion of tender in years.</p>
            </div>

            <div className="p-3 bg-[#08172D] rounded border border-[#1E3A68] space-y-1">
              <label className="block text-slate-400 font-semibold">B = Value of Ongoing Works (₹ Cr)</label>
              <input
                type="number"
                value={bidCapacityState.existingCommitmentsB}
                onChange={e => setBidCapacityState({ ...bidCapacityState, existingCommitmentsB: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
              />
              <p className="text-[10px] text-slate-500">Value of existing commitments to be completed in period N.</p>
            </div>
          </div>

          <div className="p-3 bg-[#051124] rounded border border-[#1E3A68] text-xs text-slate-300 space-y-1 font-mono">
            <div>Calculation Breakdown:</div>
            <div>&bull; (A &times; N &times; 2) = ({bidCapacityState.maxTurnoverA} &times; {bidCapacityState.completionYearsN} &times; 2) = <strong>₹ {(bidCapacityState.maxTurnoverA * bidCapacityState.completionYearsN * 2).toFixed(2)} Cr</strong></div>
            <div>&bull; Less Existing Commitments (B) = <strong>₹ {bidCapacityState.existingCommitmentsB.toFixed(2)} Cr</strong></div>
            <div className="text-emerald-400 pt-1 font-bold">
              &bull; Net Qualified Bidding Limit = ₹ {availableBiddingCapacity} Crores (Eligible for tenders up to this value)
            </div>
          </div>
        </div>
      )}

    </div>
  );
};