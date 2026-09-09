import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SectorWiseFaq } from './SectorWiseFaq';

export interface OperationalArchitectureProps {
  onOpenFaqDossier?: (category?: string) => void;
}

interface StepItem {
  id: number;
  stepNumber: string;
  title: string;
  subtitle: string;
  actor: string;
  actorBadgeColor: string;
  actorIcon: string;
  image: string;
  imageAlt: string;
  simpleExplanation: string;
  whyItMatters: string;
  keyPoints: { title: string; desc: string; icon: string }[];
  example: string;
  outcomeBadge: string;
  statutoryRule: string;
  accentColor: string;
}

const OPERATIONAL_STEPS: StepItem[] = [
  {
    id: 1,
    stepNumber: '01',
    title: 'Tender Creation & Rule Setting',
    subtitle: 'The government buyer defines requirements and activates statutory rules',
    actor: 'Procurement Officer / Buyer',
    actorBadgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    actorIcon: 'fa-solid fa-building-columns',
    image: './images/operational/step1.jpg',
    imageAlt: 'Indian procurement officer creating tender on modern digital workstation',
    simpleExplanation:
      'A government department (such as Railways, Health, or Defense) creates a new procurement tender. Instead of drafting lengthy, ambiguous paperwork, the officer selects standardized items, sets delivery timelines, and turns ON priority rules—such as the mandatory 25% quota for MSMEs and local content preferences for Made-in-India products.',
    whyItMatters:
      'Eliminates hidden criteria or favoritism by locking tender specifications into standardized, transparent parameters from day one.',
    keyPoints: [
      {
        title: 'Standard Digital BoQ',
        desc: 'Every item is itemized with clear technical specifications, quantities, and quality standards.',
        icon: 'fa-solid fa-list-check',
      },
      {
        title: 'Automatic Rule Inclusion',
        desc: 'GFR 2017 Rule 149, 25% MSME preference, and Class-I local content mandates are baked in.',
        icon: 'fa-solid fa-shield-halved',
      },
      {
        title: 'Tamper-Proof Lock',
        desc: 'Once published, tender rules cannot be secretly modified without an official public addendum.',
        icon: 'fa-solid fa-lock',
      },
    ],
    example:
      'Example: AIIMS New Delhi publishes a ₹4.5 Crore tender for hospital monitors with 25% MSME quota and 50% Make-in-India minimum local content.',
    outcomeBadge: 'Outcome: 100% Standardized, Publicly Verifiable Tender Parameters',
    statutoryRule: 'GFR 2017 Rule 149 • PPP-MII Order 2017',
    accentColor: 'from-blue-600 to-sky-700',
  },
  {
    id: 2,
    stepNumber: '02',
    title: 'Vendor Document Vault & Instant AI Pre-Check',
    subtitle: 'Vendors upload business credentials once; AI pre-screens for errors',
    actor: 'Vendor / Registered Bidder',
    actorBadgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    actorIcon: 'fa-solid fa-store',
    image: './images/operational/step2.jpg',
    imageAlt: 'Business owner reviewing verified digital credentials and DigiLocker status',
    simpleExplanation:
      'Vendors do not need to courier stacks of paper certificates. They maintain their GST, PAN, MSME Udyam, tax returns, and audited balance sheets in a secure digital vault linked with DigiLocker. Before submitting a bid, the built-in AI automatically reads all documents via OCR and warns the vendor if any file is expired, missing, or falls short of the tender turnover threshold.',
    whyItMatters:
      'Prevents genuine vendors from being disqualified due to minor typographical errors or missing pages.',
    keyPoints: [
      {
        title: 'Zero Rejections for Minor Glitches',
        desc: 'The AI pre-checker flags missing attachments or expired certificates before final submission.',
        icon: 'fa-solid fa-wand-magic-sparkles',
      },
      {
        title: 'One-Click DigiLocker Sync',
        desc: 'Sovereign business certificates are imported directly from government registries.',
        icon: 'fa-solid fa-cloud-arrow-down',
      },
      {
        title: 'Automated OCR Reading',
        desc: 'Financial turnover numbers and validity dates are automatically parsed from PDF files.',
        icon: 'fa-solid fa-file-invoice-dollar',
      },
    ],
    example:
      'Example: A Pune-based manufacturing startup uploads its 3-year turnover and gets an instant green signal from the AI eligibility wizard in 10 seconds.',
    outcomeBadge: 'Outcome: Error-Free Bid Preparation with Zero Paperwork Overhead',
    statutoryRule: 'MSME Act 2006 • IT Act 2000 (Digital Signature)',
    accentColor: 'from-amber-600 to-orange-600',
  },
  {
    id: 3,
    stepNumber: '03',
    title: 'Double-Blind Encrypted Sealed Bid Vault',
    subtitle: 'Bids are locked with cryptographic keys and vendor identities are masked',
    actor: 'Cryptographic Security Engine',
    actorBadgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
    actorIcon: 'fa-solid fa-user-secret',
    image: './images/operational/step3.jpg',
    imageAlt: 'High-tech cryptographic vault with glowing SHA-256 keys and sealed server racks',
    simpleExplanation:
      'To prevent bribery, favoritism, or price collusion (cartels), each submitted bid is sealed inside an encrypted digital vault using SHA-256 asymmetric encryption. Crucially, the vendor\'s real company name is replaced with a randomized anonymous code (like VEN-ANON-7741). Evaluating officers cannot see who submitted which bid until the technical scoring is officially finalized.',
    whyItMatters:
      'Ensures complete fairness: government officers evaluate bids purely on product quality and technical merits, without knowing the vendor\'s brand name or political connections.',
    keyPoints: [
      {
        title: 'Anonymous Identity Masking',
        desc: 'Company names and director details are hidden behind cryptographic alias tokens.',
        icon: 'fa-solid fa-mask',
      },
      {
        title: 'Sealed Cryptographic Vault',
        desc: 'Bids are sealed with SHA-256 hashing; no one can peek at prices before official opening.',
        icon: 'fa-solid fa-vault',
      },
      {
        title: 'Anti-Cartel Defense',
        desc: 'Eliminates bid rigging and cartel agreements by making vendor participation secret.',
        icon: 'fa-solid fa-shield-virus',
      },
    ],
    example:
      'Example: Five competing sellers submit bids; officers only see "Candidate VEN-ANON-104" and "Candidate VEN-ANON-209", completely eliminating bias.',
    outcomeBadge: 'Outcome: 100% Unbiased, Anonymous Technical Evaluation',
    statutoryRule: 'CVC Anti-Cartel Directives • ISO 27001 Cryptographic Standard',
    accentColor: 'from-purple-600 to-indigo-700',
  },
  {
    id: 4,
    stepNumber: '04',
    title: 'Real-Time Sovereign Database Cross-Verification',
    subtitle: 'Direct API validation across 7+ central government databases in milliseconds',
    actor: 'Automated Sovereign API Gateway',
    actorBadgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    actorIcon: 'fa-solid fa-network-wired',
    image: './images/operational/step4.jpg',
    imageAlt: 'Government digital operations room monitoring real-time API integrations across sovereign registries',
    simpleExplanation:
      'In the past, officers spent weeks manually checking whether tax records or incorporation certificates were real or forged. GeM 2.0 connects directly via high-speed government APIs to 7+ sovereign databases. In under 50 milliseconds, the system verifies if the firm is active, taxes are paid, and whether it has ever been debarred or blacklisted.',
    whyItMatters:
      'Replaces weeks of slow manual paperwork with instant, 100% authentic government-to-government verification.',
    keyPoints: [
      {
        title: '7+ Live Sovereign Integrations',
        desc: 'Instant checks across GSTN, MCA-21 Company Registry, CBDT (PAN/ITR), and MSME Udyam.',
        icon: 'fa-solid fa-server',
      },
      {
        title: 'Instant Blacklist / Debarment Scan',
        desc: 'Cross-checks Central Vigilance Commission (CVC) and GeM debarment records automatically.',
        icon: 'fa-solid fa-ban',
      },
      {
        title: 'Sub-50ms Verification Speed',
        desc: 'Automated verification completes in seconds with a signed cryptographic timestamp.',
        icon: 'fa-solid fa-bolt',
      },
    ],
    example:
      'Example: A company claiming active Class-I status has its MCA-21 active status, GST filing history, and MSME validity verified simultaneously in 46 milliseconds.',
    outcomeBadge: 'Outcome: Zero Shell Companies, Zero Forged Certificates',
    statutoryRule: 'Digital India Interoperability Framework • MCA / GSTN API Directives',
    accentColor: 'from-emerald-600 to-teal-700',
  },
  {
    id: 5,
    stepNumber: '05',
    title: 'AI Discrepancy Detection & Risk Scoring',
    subtitle: 'The AI engine scans for mismatches, anomalies, and calculates a 0–100 Compliance Score',
    actor: 'FastAPI AI Compliance Engine',
    actorBadgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    actorIcon: 'fa-solid fa-microchip',
    image: './images/operational/step5.jpg',
    imageAlt: 'AI compliance scorecard dashboard with 98/100 score, fraud detection radar chart, and risk levels',
    simpleExplanation:
      'The smart AI engine compares every piece of data. It verifies whether the declared turnover matches the actual tax filings, checks if the manufacturing capacity matches the delivery timeline, and scans for suspicious connections between bidders. It then calculates a transparent 0–100 Compliance Score and assigns a clear Risk Level: Low, Medium, or High.',
    whyItMatters:
      'Gives procurement officers a clear, objective summary so they can make confident, fair evaluation decisions without getting buried in spreadsheets.',
    keyPoints: [
      {
        title: '14-Point Statutory Audit Matrix',
        desc: 'Scrutinizes past performance, turnover, OEM authorization, and local content percentage.',
        icon: 'fa-solid fa-chart-pie',
      },
      {
        title: 'Automatic Anomaly & Discrepancy Alerts',
        desc: 'Highlights mismatches between balance sheets and tax returns in an intuitive side-by-side view.',
        icon: 'fa-solid fa-triangle-exclamation',
      },
      {
        title: 'Objective 0–100 Compliance Score',
        desc: 'Provides a transparent rating (e.g., 98/100 • Low Risk) with itemized justifications.',
        icon: 'fa-solid fa-gauge-high',
      },
    ],
    example:
      'Example: If a bidder claims ₹20 Crore turnover but their tax record reflects ₹2 Crore, the AI immediately flags a critical mismatch for committee review.',
    outcomeBadge: 'Outcome: Objective, Data-Driven Risk Assessment in Seconds',
    statutoryRule: 'CVC Vigilance Guidelines • Rule 173 GFR 2017 (Transparency)',
    accentColor: 'from-cyan-600 to-blue-700',
  },
  {
    id: 6,
    stepNumber: '06',
    title: 'Commercial Vault Unsealing, CFA Award & CAG Audit Trail',
    subtitle: 'Commercial vault unsealed by Buyer Authority; final award decision signed under GFR Rule 160 & Merkle audit ledger',
    actor: 'Competent Financial Authority (CFA) & CAG Oversight',
    actorBadgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
    actorIcon: 'fa-solid fa-stamp',
    image: './images/operational/step6.jpg',
    imageAlt: 'Competent Financial Authority (CFA) approving final tender award with CAG cryptographic audit certificate',
    simpleExplanation:
      'Once technical evaluations are locked and recommended by the Tender Evaluation Committee (TEC), the Competent Financial Authority (CFA) / Buyer Authority unseals the commercial double-blind vault using the sovereign key. The CFA reviews composite QCBS/L1 rankings and takes the final statutory decision to sign and award the contract to the winning bidder. Every click, score, and award action is permanently chained into the tamper-proof CAG Merkle audit ledger.',
    whyItMatters:
      'Guarantees constitutional separation of powers: TEC only recommends, while the designated Competent Financial Authority makes the legally binding award decision.',
    keyPoints: [
      {
        title: 'CFA Statutory Award Authority',
        desc: 'Under GFR Rule 160 & DFPR, only the Competent Financial Authority can formally award the contract.',
        icon: 'fa-solid fa-gavel',
      },
      {
        title: 'Double-Blind Commercial Vault Unmasking',
        desc: 'Buyer Authority unmasks pricing only after all technical qualifications are irreversibly locked.',
        icon: 'fa-solid fa-key',
      },
      {
        title: 'Immutable SHA-256 Merkle Ledger',
        desc: 'Every bid hash, score, and award timestamp is mathematically sealed against retrospective tampering.',
        icon: 'fa-solid fa-link',
      },
    ],
    example:
      'Example: Joint Secretary (CFA) approves ₹4.5 Crore award to L1 bidder under certificate CAG/CAD/2026/0912; its Merkle hash verifies zero bid alterations.',
    outcomeBadge: 'Outcome: Legally Sound CFA Award with 100% Cryptographic Audit Integrity',
    statutoryRule: 'GFR Rule 160 & 173 • DFPR 1978 • Constitution Art. 148-151',
    accentColor: 'from-rose-600 to-slate-800',
  },
];

export const OperationalArchitecture: React.FC<OperationalArchitectureProps> = ({
  onOpenFaqDossier,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showFaq, setShowFaq] = useState<boolean>(false);
  const [faqCategory, setFaqCategory] = useState<string>('ALL');

  const openFaq = (category: string = 'ALL') => {
    setFaqCategory(category);
    if (onOpenFaqDossier) {
      onOpenFaqDossier(category);
    } else {
      setShowFaq(true);
    }
  };

  // ESC key to close local FAQ modal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showFaq) setShowFaq(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showFaq]);

  const currentStep = OPERATIONAL_STEPS.find((s) => s.id === activeStep) || OPERATIONAL_STEPS[0];

  return (
    <>
      <div className="w-full text-slate-800">
      {/* Top Section Header */}
      <div className="text-center max-w-4xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-widest bg-sky-100 px-4 py-1.5 rounded-full border border-sky-300 shadow-xs mb-3">
          <i className="fa-solid fa-diagram-project text-sky-600 text-sm" />
          <span>Operational Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          How It Works: In Simple Words &amp; Step-by-Step
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Public procurement can seem complicated with hundreds of rules. Here is the entire journey of GeM 2.0 broken down into <span className="font-semibold text-slate-900">6 simple, transparent steps</span>—from the moment a tender is posted to the final tamper-proof contract award.
        </p>
      </div>

      {/* Step Selector Ribbon */}
      <div className="mb-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {OPERATIONAL_STEPS.map((step) => {
            const isActive = step.id === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#002855] text-white border-[#002855] shadow-md scale-[1.02] ring-2 ring-amber-400/60'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Step {step.stepNumber}
                  </span>
                  <i
                    className={`${step.actorIcon} text-xs ${
                      isActive ? 'text-amber-300' : 'text-slate-400'
                    }`}
                  />
                </div>
                <div className="font-bold text-xs line-clamp-1 leading-snug">
                  {step.title}
                </div>
                <div
                  className={`text-[10px] line-clamp-1 mt-1 ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {step.actor}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Main Hero Card for Active Step */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all mb-12">
            
            {/* Top Step Banner Header */}
            <div className="bg-gradient-to-r from-slate-900 via-[#002855] to-slate-900 text-white px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-sm">
                  {currentStep.stepNumber}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                    Operational Phase {currentStep.id} of 6
                  </div>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight">
                    {currentStep.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/20">
                  <i className={currentStep.actorIcon} />
                  <span>{currentStep.actor}</span>
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-full font-mono bg-sky-950/80 text-sky-300 border border-sky-800">
                  {currentStep.statutoryRule}
                </span>
              </div>
            </div>

            {/* Split Content: Photo on Left / Simple Words Explanation on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Left Column: Photo & Real-World Example (5 cols) */}
              <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
                <div className="space-y-4">
                  {/* Photo Container */}
                  <div className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 aspect-video">
                    <img
                      src={currentStep.image}
                      alt={currentStep.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback to stylized placeholder if image is missing
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                      <div className="text-white text-xs font-medium drop-shadow-sm flex items-center gap-2">
                        <i className="fa-solid fa-camera text-amber-400" />
                        <span>{currentStep.imageAlt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Real World Example Box */}
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                      <i className="fa-solid fa-lightbulb text-amber-600" />
                      <span>Realistic Scenario:</span>
                    </div>
                    <p className="text-amber-900 leading-relaxed">
                      {currentStep.example}
                    </p>
                  </div>
                </div>

                {/* Outcome Badge at bottom of left column */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-full">
                    <i className="fa-solid fa-circle-check text-emerald-600 shrink-0" />
                    <span className="truncate">{currentStep.outcomeBadge}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: In Simple Words & Highlights (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                
                <div className="space-y-5">
                  {/* "In Simple Words" Banner */}
                  <div className="bg-sky-50/90 border-l-4 border-sky-600 p-4 rounded-r-xl">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-900 mb-1.5">
                      <i className="fa-solid fa-comments text-sky-600" />
                      <span>In Plain Words — What Happens Here?</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                      {currentStep.simpleExplanation}
                    </p>
                  </div>

                  {/* Why this matters */}
                  <div className="text-xs text-slate-600 bg-slate-100/80 px-3.5 py-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                    <i className="fa-solid fa-circle-info text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-slate-800">Why this matters: </strong>
                      {currentStep.whyItMatters}
                    </div>
                  </div>

                  {/* 3 Key Points */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Key Technical Protections in this Step:
                    </h4>
                    <div className="space-y-2.5">
                      {currentStep.keyPoints.map((pt, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-300 transition-colors shadow-xs"
                        >
                          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 text-sm">
                            <i className={pt.icon} />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900">
                              {pt.title}
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                              {pt.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step Switcher Navigation Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4 text-xs font-semibold">
                  <button
                    onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
                    disabled={activeStep === 1}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <i className="fa-solid fa-arrow-left text-[10px]" />
                    <span>Previous Step</span>
                  </button>

                  <span className="text-slate-400 text-xs">
                    Step {activeStep} of 6
                  </span>

                  <button
                    onClick={() => setActiveStep((s) => Math.min(6, s + 1))}
                    disabled={activeStep === 6}
                    className="px-4 py-2 rounded-lg bg-[#002855] text-white hover:bg-[#003B7A] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Next Step</span>
                    <i className="fa-solid fa-arrow-right text-[10px]" />
                  </button>
                </div>

              </div>

          </div>
        </div>
      </div>

      {/* Statutory Dossier & Regulatory FAQ Callout Banner */}
      <div id="faq" className="max-w-6xl mx-auto mt-10 scroll-mt-20">
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-[#002855] rounded-2xl p-6 sm:p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-6 border border-sky-900 shadow-xl relative overflow-hidden">
          <div className="space-y-3 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              <i className="fa-solid fa-book-bookmark text-amber-400" />
              <span>Statutory Compliance Library &amp; Legal Citations</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold tracking-tight">
              Looking for Sector-Wise Regulatory FAQs &amp; Legal Citations?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Access official GFR 2017 citations, 25% MSME quota policies, OEM authorization mandates, civil contractor capacity formulas, and CAG anti-cartel vigilance guidelines in our interactive legal dossier.
            </p>

            {/* Quick Sector Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <button
                type="button"
                onClick={() => openFaq('MSME')}
                className="bg-white/10 hover:bg-amber-400/20 text-slate-200 hover:text-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/20 hover:border-amber-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-building text-amber-400 text-[11px]" />
                <span>MSME 25% Quota</span>
              </button>
              <button
                type="button"
                onClick={() => openFaq('OEM')}
                className="bg-white/10 hover:bg-sky-400/20 text-slate-200 hover:text-sky-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/20 hover:border-sky-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-industry text-sky-400 text-[11px]" />
                <span>OEM &amp; Make-in-India</span>
              </button>
              <button
                type="button"
                onClick={() => openFaq('WORKS')}
                className="bg-white/10 hover:bg-emerald-400/20 text-slate-200 hover:text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/20 hover:border-emerald-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-helmet-safety text-emerald-400 text-[11px]" />
                <span>Civil &amp; Works</span>
              </button>
              <button
                type="button"
                onClick={() => openFaq('OFFICER')}
                className="bg-white/10 hover:bg-purple-400/20 text-slate-200 hover:text-purple-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/20 hover:border-purple-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-landmark text-purple-400 text-[11px]" />
                <span>GFR 160 &amp; CFA</span>
              </button>
              <button
                type="button"
                onClick={() => openFaq('AUDIT')}
                className="bg-white/10 hover:bg-rose-400/20 text-slate-200 hover:text-rose-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/20 hover:border-rose-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-shield-halved text-rose-400 text-[11px]" />
                <span>CAG &amp; Anti-Cartel</span>
              </button>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-2 relative z-10">
            <button
              type="button"
              onClick={() => openFaq('ALL')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <i className="fa-solid fa-folder-open text-sm" />
              <span>Open Full Legal Dossier</span>
              <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
            <span className="text-[10px] text-slate-400 font-mono">50+ Categorized Statutory FAQs</span>
          </div>
        </div>
      </div>
    </div>

    {/* Self-contained FAQ Modal via Portal — renders at document.body, no z-index issues */}
    {showFaq && createPortal(
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', background: 'rgba(2,8,23,0.92)', backdropFilter: 'blur(8px)' }}
        onClick={() => setShowFaq(false)}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: '1280px', width: '100%', margin: '24px auto', background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tiranga accent */}
          <div style={{ height: '4px', background: 'linear-gradient(90deg,#ff9933 33.3%,#fff 33.3%,#fff 66.6%,#138808 66.6%)' }} />
          {/* Header */}
          <div style={{ background: '#002855', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderBottom: '1px solid rgba(56,189,248,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-book-bookmark" style={{ color: '#fbbf24', fontSize: 18 }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sovereign Legal Dossier</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', marginTop: 2 }}>Public Procurement Regulatory FAQ &amp; Legal Knowledge Base</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>GFR 2017 • PPP-MII 2017 • MSMED Act 2006 • CVC Directives</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowFaq(false)}
              style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#cbd5e1', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <i className="fa-solid fa-xmark" /> Close (ESC)
            </button>
          </div>
          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>
            <SectorWiseFaq defaultCategory={faqCategory} layout="two-column" />
          </div>
          {/* Footer */}
          <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginRight: 6 }} />
              Official Regulatory Guidance • Binding Indian Public Procurement Law
            </div>
            <button
              type="button"
              onClick={() => setShowFaq(false)}
              style={{ padding: '8px 20px', background: '#e2e8f0', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};
