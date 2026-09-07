import React, { useState } from 'react';

interface ComplianceTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  defaultTenderId?: string;
  initialTab?: 'raise' | 'track';
}

const CATEGORIES = [
  { id: 'GFR_RULES', label: 'GFR 2017 & Statutory Rules', desc: 'Rule 144, 149, 160 or statutory procurement guidelines' },
  { id: 'MSME_EXEMPTION', label: 'MSME 25% Quota & Waivers', desc: 'EMD waivers, turnover exemption, or 25% purchase preference' },
  { id: 'MAKE_IN_INDIA', label: 'Make in India (PPP-MII)', desc: 'Class-I / Class-II local content declaration or price preference' },
  { id: 'TAX_DISCREPANCY', label: 'GSTN / MCA / CBDT Discrepancy', desc: 'Automated data verification mismatch or tax certificate issue' },
  { id: 'DOUBLE_BLIND', label: 'Double-Blind Vault & Scoring', desc: 'Anonymity questions, technical evaluation or score appeal' },
  { id: 'CAG_AUDIT', label: 'CAG Ledger & Audit Trail', desc: 'SHA-256 Merkle block proof or statutory auditor verification' },
  { id: 'OTHER', label: 'Other Compliance Inquiry', desc: 'General statutory procedure or platform policy clarification' },
];

export const ComplianceTicketModal: React.FC<ComplianceTicketModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'GFR_RULES',
  defaultTenderId = '',
  initialTab = 'raise',
}) => {
  const [activeTab, setActiveTab] = useState<'raise' | 'track'>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Form State
  const [category, setCategory] = useState(defaultCategory);
  const [userRole, setUserRole] = useState<'VENDOR' | 'OFFICER' | 'CITIZEN'>('VENDOR');
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tenderId, setTenderId] = useState(defaultTenderId);
  const [priority, setPriority] = useState<'STANDARD' | 'URGENT'>('STANDARD');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    createdAt: string;
    sla: string;
    category: string;
    tenderId: string;
    org: string;
    email: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Tracking state
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !contactName.trim() || !email.trim() || !description.trim()) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const generatedId = `GEM-CC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      setSubmittedTicket({
        id: generatedId,
        createdAt: now,
        sla: priority === 'URGENT' ? '24 Hours (Urgent Active Tender Window)' : '48 Hours (Standard Statutory SLA)',
        category: CATEGORIES.find(c => c.id === category)?.label || category,
        tenderId: tenderId.trim() || 'General Policy Query',
        org: orgName,
        email: email,
      });
      setSubmitting(false);
    }, 850);
  };

  const handleCopyId = () => {
    if (submittedTicket?.id) {
      navigator.clipboard.writeText(submittedTicket.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackQuery.trim().toUpperCase();
    if (!query) return;

    if (submittedTicket && query === submittedTicket.id) {
      setTrackResult({
        id: submittedTicket.id,
        category: submittedTicket.category,
        tender: submittedTicket.tenderId,
        submittedAt: submittedTicket.createdAt,
        status: 'DISPATCHED_TO_COMMITTEE',
        statusLabel: 'Under Statutory Committee Review',
        assignedOfficer: 'Shri R. K. Varma, IA&AS (Addl. Director Compliance)',
        expectedResolution: submittedTicket.sla,
        progress: 35,
        steps: [
          { name: 'Ticket Registered & Cryptographically Anchored', done: true, time: submittedTicket.createdAt },
          { name: 'Sovereign Database Cross-Check Initiated', done: true, time: '10 mins ago' },
          { name: 'Under Review by GeM 2.0 Compliance Officer', done: false, time: 'Pending' },
          { name: 'Final Statutory Determination & Corrigendum', done: false, time: 'Estimated < 24h' },
        ],
      });
    } else {
      setTrackResult({
        id: query.startsWith('GEM-') ? query : `GEM-CC-2026-784102`,
        category: 'GFR 2017 & Statutory Procurement Rules',
        tender: 'GEM/2026/B/881290',
        submittedAt: 'Today, 10:15 AM',
        status: 'IN_REVIEW',
        statusLabel: 'Statutory Review In Progress',
        assignedOfficer: 'Dr. Anita Sengupta (Director, Legal & Procurement Ethics)',
        expectedResolution: 'Within 24 Hours',
        progress: 60,
        steps: [
          { name: 'Ticket Registered & SHA-256 Hash Generated', done: true, time: 'Today 10:15 AM' },
          { name: 'Automated 14-Point Discrepancy Cross-Check', done: true, time: 'Today 10:16 AM' },
          { name: 'Legal Officer Scrutiny & Pre-Bid Dossier Mapping', done: true, time: 'Today 12:45 PM' },
          { name: 'Final Regulatory Resolution Published on Portal', done: false, time: 'Estimated 5:00 PM' },
        ],
      });
    }
  };

  const resetForm = () => {
    setSubmittedTicket(null);
    setOrgName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setTenderId('');
    setSubject('');
    setDescription('');
    setAttachedFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tiranga Top Bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)' }} />

        {/* Modal Header */}
        <div className="bg-[#002855] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-sky-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <i className="fa-solid fa-headset text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Statutory Redressal Cell
                </span>
                <span className="text-[10px] text-slate-300">GFR 2017 &bull; Rule 173(iv)</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                Raise a Compliance Clarification Ticket
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border-none cursor-pointer flex items-center justify-center"
            aria-label="Close Modal"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Tabs: Raise Ticket vs Track Existing */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('raise')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                activeTab === 'raise'
                  ? 'bg-[#002855] text-white border-[#002855] shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <i className="fa-solid fa-pen-to-square mr-1.5" />
              New Clarification Ticket
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                activeTab === 'track'
                  ? 'bg-[#002855] text-white border-[#002855] shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <i className="fa-solid fa-magnifying-glass mr-1.5" />
              Track Ticket Status
            </button>
          </div>

          <span className="hidden sm:inline text-[11px] text-slate-500 font-medium">
            ⚡ Resolution Window: <strong>24–48 Hours</strong>
          </span>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-slate-800">
          
          {activeTab === 'raise' ? (
            submittedTicket ? (
              /* Success Confirmation Card */
              <div className="space-y-6 animate-fadeIn py-2">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center relative overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-2xl mb-4 shadow-md">
                    <i className="fa-solid fa-check" />
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-2">
                    Ticket Successfully Registered
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                    Official Reference: {submittedTicket.id}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
                    Your statutory compliance clarification ticket has been dispatched to the <strong>GeM 2.0 Central Technical &amp; Legal Scrutiny Cell</strong>. An automated confirmation and tracking receipt have been dispatched to <strong>{submittedTicket.email}</strong>.
                  </p>

                  {/* Copy Reference */}
                  <div className="mt-5 inline-flex items-center gap-2">
                    <button
                      onClick={handleCopyId}
                      className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <i className="fa-solid fa-copy text-amber-600" />
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Ticket Reference ID'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setTrackQuery(submittedTicket.id);
                        setActiveTab('track');
                        handleTrackSearch(new Event('submit') as any);
                      }}
                      className="bg-[#002855] hover:bg-[#003875] text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer border-none"
                    >
                      <i className="fa-solid fa-gauge-high text-amber-400" />
                      <span>Track Live Status</span>
                    </button>
                  </div>
                </div>

                {/* Ticket Details Summary Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs">
                  <h5 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-receipt text-blue-600" />
                    Statutory Ticket Acknowledgement Summary
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                    <div><strong>Registered Entity:</strong> {submittedTicket.org}</div>
                    <div><strong>Submission Timestamp:</strong> {submittedTicket.createdAt}</div>
                    <div><strong>Clarification Domain:</strong> {submittedTicket.category}</div>
                    <div><strong>Tender / Bid Reference:</strong> {submittedTicket.tenderId}</div>
                    <div><strong>Guaranteed SLA Window:</strong> <span className="text-emerald-700 font-semibold">{submittedTicket.sla}</span></div>
                    <div><strong>Statutory Authority:</strong> GFR 2017 Rule 173(iv) • Ministry of Commerce</div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={resetForm}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-5 py-2.5 rounded-lg text-xs cursor-pointer border-none transition-colors"
                  >
                    Submit Another Query
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-[#002855] hover:bg-[#003875] text-white font-bold px-5 py-2.5 rounded-lg text-xs cursor-pointer border-none transition-colors"
                  >
                    Done &bull; Close
                  </button>
                </div>
              </div>
            ) : (
              /* Ticket Creation Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Notice Callout */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-3.5 rounded-r-lg text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
                  <i className="fa-solid fa-shield-halved text-blue-600 text-base shrink-0 mt-0.5" />
                  <div>
                    <strong>Official Statutory Guidance:</strong> Use this ticket system to seek binding clarifications from the Procurement Authority regarding GFR 2017 rules, MSME 25% purchase quota exemptions, Make-in-India content thresholds, or to contest automated verification discrepancies before tender closing.
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    I am submitting this clarification as: *
                  </label>
                  <div className="grid grid-cols-3 gap-2.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setUserRole('VENDOR')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        userRole === 'VENDOR'
                          ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-400/40'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <i className="fa-solid fa-store block text-base mb-1 text-amber-600" />
                      <span>Vendor / Bidder</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserRole('OFFICER')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        userRole === 'OFFICER'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-400/40'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <i className="fa-solid fa-building-columns block text-base mb-1 text-blue-600" />
                      <span>Procurement Officer (Buyer)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserRole('CITIZEN')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        userRole === 'CITIZEN'
                          ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-400/40'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <i className="fa-solid fa-user-check block text-base mb-1 text-purple-600" />
                      <span>Statutory Auditor / Citizen</span>
                    </button>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Clarification Domain / Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label} — {cat.desc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Entity & Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company / Department Name *
                    </label>
                    <div className="relative">
                      <i className="fa-solid fa-building absolute left-3 top-3 text-slate-400 text-xs" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bharat Tech Solutions Pvt Ltd"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Person Full Name *
                    </label>
                    <div className="relative">
                      <i className="fa-solid fa-user absolute left-3 top-3 text-slate-400 text-xs" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Kumar"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Email ID *
                    </label>
                    <div className="relative">
                      <i className="fa-solid fa-envelope absolute left-3 top-3 text-slate-400 text-xs" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. rajesh@bharattech.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Phone / Mobile (Optional)
                    </label>
                    <div className="relative">
                      <i className="fa-solid fa-phone absolute left-3 top-3 text-slate-400 text-xs" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Tender ID & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      GeM Tender / Bid Number (if applicable)
                    </label>
                    <div className="relative">
                      <i className="fa-solid fa-hashtag absolute left-3 top-3 text-slate-400 text-xs" />
                      <input
                        type="text"
                        placeholder="e.g. GEM/2026/B/894210"
                        value={tenderId}
                        onChange={(e) => setTenderId(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Urgency / SLA Window *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPriority('STANDARD')}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          priority === 'STANDARD'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        Standard (48h)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority('URGENT')}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          priority === 'URGENT'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        Urgent (&lt;24h)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject / Summary of Clarification *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Request for clarification on MSME exemption under clause 4.2 of tender"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detailed Clarification / Grievance Narrative *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please specify exact GFR clause, tender parameter, or document verification discrepancy. Quote tender section numbers where applicable..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
                  />
                </div>

                {/* Simulated File Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supporting Documents / Certificates (PDF / DOCX / JPG)
                  </label>
                  {attachedFile ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs">
                      <div className="flex items-center gap-2 text-slate-800 font-semibold">
                        <i className="fa-solid fa-file-pdf text-rose-600 text-base" />
                        <span>{attachedFile}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer font-bold text-xs"
                      >
                        <i className="fa-solid fa-trash mr-1" /> Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAttachedFile('MSME_Udyam_Representation_Cert.pdf')}
                      className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-4 text-center text-xs text-slate-500 hover:text-blue-700 transition-colors cursor-pointer bg-slate-50 hover:bg-blue-50/50"
                    >
                      <i className="fa-solid fa-cloud-arrow-up text-lg block mb-1 text-slate-400" />
                      <span>Click to attach statutory proof / representation letter (Simulated PDF)</span>
                    </button>
                  )}
                </div>

                {/* Submit Actions */}
                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500">
                    <i className="fa-solid fa-lock text-emerald-600 mr-1" /> All queries are logged on the immutable audit ledger
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer border-none transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto bg-[#002855] hover:bg-[#003875] text-white font-bold px-6 py-2 rounded-xl text-xs cursor-pointer border-none transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <i className="fa-solid fa-spinner animate-spin" />
                          <span>Anchoring to Ledger...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane text-amber-400" />
                          <span>Submit Clarification Ticket</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            )
          ) : (
            /* Live Ticket Tracking View */
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs">
                <h4 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-magnifying-glass text-blue-600" />
                  Track Live Clarification Ticket
                </h4>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Enter your official GeM 2.0 Ticket Reference ID (e.g. <code>GEM-CC-2026-881204</code>) to inspect live statutory committee review stages and audit signatures.
                </p>

                <form onSubmit={handleTrackSearch} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter Ticket Reference ID..."
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-[#002855] hover:bg-[#003875] text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer border-none transition-all shadow-xs flex items-center gap-2"
                  >
                    <i className="fa-solid fa-search" /> Track
                  </button>
                </form>
              </div>

              {/* Simulated Tracking Telemetry Result */}
              {trackResult && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Ticket Reference</span>
                      <span className="text-base font-black text-slate-900 font-mono">{trackResult.id}</span>
                    </div>
                    <div className="text-right">
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full inline-block">
                        {trackResult.statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                    <div><strong>Domain:</strong> {trackResult.category}</div>
                    <div><strong>Target Tender:</strong> <code className="text-slate-900 font-bold">{trackResult.tender}</code></div>
                    <div><strong>Assigned Officer:</strong> {trackResult.assignedOfficer}</div>
                    <div><strong>SLA Delivery:</strong> <span className="text-emerald-700 font-bold">{trackResult.expectedResolution}</span></div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span>Statutory Redressal Progress</span>
                      <span>{trackResult.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${trackResult.progress}%` }} />
                    </div>
                  </div>

                  {/* Timeline Steps */}
                  <div className="space-y-2.5 pt-2">
                    {trackResult.steps.map((step: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                          step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          <i className={`fa-solid ${step.done ? 'fa-check' : 'fa-clock'}`} />
                        </div>
                        <div className="flex-1 flex justify-between">
                          <span className={step.done ? 'font-bold text-slate-900' : 'text-slate-500'}>
                            {step.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">{step.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
