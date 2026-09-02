import React, { useState } from 'react';
import { Plus, Check, Shield, FileText, Settings, AlertCircle, Sparkles, Scale } from 'lucide-react';
import { Tender, PQCItem } from '../../types/procurement';

interface TenderManagementViewProps {
  tenders: Tender[];
  activeTender: Tender;
  onSelectTender: (id: string) => void;
  onCreateTender: (tender: Tender) => void;
}

export const TenderManagementView: React.FC<TenderManagementViewProps> = ({
  tenders,
  activeTender,
  onSelectTender,
  onCreateTender,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Ministry of Road Transport and Highways (MoRTH)');
  const [newBudget, setNewBudget] = useState('25.0');
  const [newCategory, setNewCategory] = useState('Advanced Sensor Systems & Network Telemetry');
  const [newWeights, setNewWeights] = useState({
    technical: 50,
    statutory: 15,
    aiCompliance: 15,
    miiLocalContent: 20,
  });

  const handleSaveTender = () => {
    if (!newTitle) return;
    const newTenderObj: Tender = {
      id: `TND-2026-${String(tenders.length + 1).padStart(3, '0')}`,
      tenderNumber: `GEM/2026/B/${Math.floor(100000 + Math.random() * 900000)}`,
      title: newTitle,
      department: newDept,
      gemCategory: newCategory,
      estimatedBudget: parseFloat(newBudget) || 25.0,
      emdAmount: (parseFloat(newBudget) || 25.0) * 2, // 2% in lakhs
      publishedDate: new Date().toISOString(),
      closingDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      status: 'TECHNICAL_EVALUATION',
      evaluationMode: 'QCBS',
      weights: newWeights,
      pqcCriteria: [
        {
          id: 'PQC-NEW-1',
          clauseNumber: 'Clause 3.1.1',
          description: 'Minimum 3-Year Average Financial Turnover >= ₹10 Cr verified via CA UDIN certificate.',
          mandatory: true,
          minThreshold: '>= ₹10.00 Cr',
          category: 'FINANCIAL'
        },
        {
          id: 'PQC-NEW-2',
          clauseNumber: 'Clause 3.2.4',
          description: 'Make in India Class-I Local Supplier (>=50% local content) compliance certificate.',
          mandatory: true,
          minThreshold: '>= 50% Domestic BoM',
          category: 'ESG_MII'
        }
      ]
    };

    onCreateTender(newTenderObj);
    setShowCreateModal(false);
    setNewTitle('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            <span>Tender Creation &amp; Eligibility Criteria (PQC)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Buyer authority console to configure tender requirements, budget ceilings, and evaluation weights.
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)} 
          className="px-4 py-2 bg-[#E65100] hover:bg-[#C2410C] text-white rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md w-fit border-none"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Public Tender</span>
        </button>
      </div>

      <div className="gov-card p-5 border-l-4 border-l-[#0284C7]">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 mb-4 border-b border-[#1E3A68]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge badge-info">{activeTender.tenderNumber}</span>
            <span className="badge badge-saffron">GeM 2.0 Spec</span>
            <span className="badge badge-success">Status: {activeTender.status}</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Closing: {new Date(activeTender.closingDate).toLocaleDateString()}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-100 mb-1">
            {activeTender.title}
          </h2>
          <p className="text-xs text-sky-400 font-semibold">
            {activeTender.department} &bull; Category: {activeTender.gemCategory}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          <div className="bg-[#051124] p-3 rounded-lg border border-[#1E3A68]">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estimated Budget</div>
            <div className="text-lg font-bold text-sky-400 font-mono mt-0.5">₹{activeTender.estimatedBudget} Crores</div>
          </div>

          <div className="bg-[#051124] p-3 rounded-lg border border-[#1E3A68]">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">EMD Security</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">₹{activeTender.emdAmount} Lakhs</div>
          </div>

          <div className="bg-[#051124] p-3 rounded-lg border border-[#1E3A68]">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Evaluation Mode</div>
            <div className="text-base font-bold text-slate-100 mt-0.5">Quality &amp; Cost (QCBS)</div>
          </div>

          <div className="bg-[#051124] p-3 rounded-lg border border-[#1E3A68]">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Configured Weights</div>
            <div className="text-xs font-bold text-emerald-400 font-mono mt-1">
              Tech: {activeTender.weights.technical}% | MII: {activeTender.weights.miiLocalContent}% | Stat: {activeTender.weights.statutory}% | AI: {activeTender.weights.aiCompliance}%
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>Pre-Qualification Criteria (PQC) Clauses</span>
            </h3>
            <span className="text-xs text-slate-400">
              Total Clauses: {activeTender.pqcCriteria.length} (Mandatory: {activeTender.pqcCriteria.filter(p => p.mandatory).length})
            </span>
          </div>

          <div className="table-container">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Clause #</th>
                  <th>Category</th>
                  <th>Requirement Description</th>
                  <th>Threshold Value</th>
                  <th>Mandatory</th>
                </tr>
              </thead>
              <tbody>
                {activeTender.pqcCriteria.map(pqc => (
                  <tr key={pqc.id}>
                    <td className="font-bold text-sky-400 font-mono">{pqc.clauseNumber}</td>
                    <td>
                      <span className={`badge ${
                        pqc.category === 'FINANCIAL' ? 'badge-info' :
                        pqc.category === 'TECHNICAL' ? 'badge-purple' :
                        pqc.category === 'STATUTORY' ? 'badge-success' : 'badge-saffron'
                      }`}>
                        {pqc.category}
                      </span>
                    </td>
                    <td className="text-slate-200">{pqc.description}</td>
                    <td className="font-semibold text-amber-400 font-mono">{pqc.minThreshold}</td>
                    <td>
                      {pqc.mandatory ? (
                        <span className="badge badge-danger">MANDATORY</span>
                      ) : (
                        <span className="badge badge-info">OPTIONAL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="gov-card p-5">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#1E3A68]">
          <Scale className="w-5 h-5 text-sky-400" />
          <span className="text-base font-bold text-slate-100">All Managed Public Tenders</span>
        </div>

        <div className="table-container">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Tender Reference</th>
                <th>Title</th>
                <th>Department</th>
                <th>Budget (Cr)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map(t => (
                <tr key={t.id} className={t.id === activeTender.id ? 'bg-[#002855]/40' : ''}>
                  <td className="font-bold text-sky-400 font-mono">{t.tenderNumber}</td>
                  <td className="font-semibold text-slate-100">{t.title}</td>
                  <td className="text-slate-400 text-xs">{t.department}</td>
                  <td className="font-bold text-emerald-400 font-mono">₹{t.estimatedBudget} Cr</td>
                  <td>
                    <span className="badge badge-success">{t.status}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => onSelectTender(t.id)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer border ${
                        t.id === activeTender.id 
                          ? 'bg-[#002855] text-amber-400 border-[#0284C7]' 
                          : 'bg-[#0A192F] text-slate-300 border-[#1E3A68] hover:text-white'
                      }`}
                    >
                      {t.id === activeTender.id ? 'Active Focus' : 'Select Tender'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#0C1A30] border border-[#1E3A68] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3A68] bg-[#002855]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Publish New Public Tender (GeM 2.0 Spec)</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white bg-transparent border-none cursor-pointer text-base">✕</button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">Tender Title / Scope of Work</label>
                <input
                  type="text"
                  className="gov-input"
                  placeholder="e.g. AI-Powered Smart Surveillance & Drone Grid Implementation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">Procuring Ministry / Entity</label>
                  <select className="gov-input" value={newDept} onChange={(e) => setNewDept(e.target.value)}>
                    <option>Ministry of Electronics and Information Technology (MeitY)</option>
                    <option>Ministry of Defence / DRDO</option>
                    <option>National Highways Authority of India (NHAI)</option>
                    <option>Indian Railways / CRIS</option>
                    <option>Ministry of Power / NTPC</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">Estimated Budget (₹ in Crores)</label>
                  <input
                    type="number"
                    className="gov-input font-mono"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">GeM Category Classification</label>
                <input
                  type="text"
                  className="gov-input"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>

              <div className="bg-[#051124] p-4 rounded-xl border border-[#1E3A68] space-y-3">
                <div className="text-xs font-bold text-slate-200">
                  QCBS Weight Distribution (Must total 100%)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Technical ({newWeights.technical}%)</label>
                    <input
                      type="number"
                      className="gov-input font-mono text-center"
                      value={newWeights.technical}
                      onChange={(e) => setNewWeights({ ...newWeights, technical: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">MII Content ({newWeights.miiLocalContent}%)</label>
                    <input
                      type="number"
                      className="gov-input font-mono text-center"
                      value={newWeights.miiLocalContent}
                      onChange={(e) => setNewWeights({ ...newWeights, miiLocalContent: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Statutory ({newWeights.statutory}%)</label>
                    <input
                      type="number"
                      className="gov-input font-mono text-center"
                      value={newWeights.statutory}
                      onChange={(e) => setNewWeights({ ...newWeights, statutory: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">AI Score ({newWeights.aiCompliance}%)</label>
                    <input
                      type="number"
                      className="gov-input font-mono text-center"
                      value={newWeights.aiCompliance}
                      onChange={(e) => setNewWeights({ ...newWeights, aiCompliance: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 bg-[#051124] border-t border-[#1E3A68]">
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="px-4 py-2 rounded-lg bg-[#0A192F] hover:bg-[#0F2548] border border-[#1E3A68] text-slate-300 hover:text-white font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveTender} 
                className="px-4 py-2 rounded-lg bg-[#E65100] hover:bg-[#C2410C] text-white font-bold text-xs cursor-pointer border-none shadow-md"
              >
                Publish &amp; Lock PQC Criteria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};