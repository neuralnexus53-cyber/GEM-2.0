import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { TenderManagementView } from './components/views/TenderManagementView';
import { EvaluationQueueView } from './components/views/EvaluationQueueView';
import { StatutoryRegistryView } from './components/views/StatutoryRegistryView';
import { AIScorecardView } from './components/views/AIScorecardView';
import { MIIAuditView } from './components/views/MIIAuditView';
import { ScoreMatrixView } from './components/views/ScoreMatrixView';
import { CAGLedgerView } from './components/views/CAGLedgerView';
import { BlindGradingModal } from './components/views/BlindGradingModal';
import { CAGExportModal } from './components/views/CAGExportModal';
import { OfficerProfileModal } from './components/views/OfficerProfileModal';
import { GovOfficerProfileView } from './components/views/GovOfficerProfileView';
import { DiscrepancyInspectorModal } from './components/views/DiscrepancyInspectorModal';
import { VendorIntakeSimulatorModal } from './components/views/VendorIntakeSimulatorModal';
import { GovHeaderStats } from './components/GovHeaderStats';
import { GovFooter } from './components/GovFooter';

import { 
  UserRole, 
  Tender, 
  MaskedSubmission, 
  AuditLedgerBlock, 
  OfficerScoreEntry,
  OfficerProfile,
  UpstreamIntakeDocket
} from './types/procurement';
import { 
  INITIAL_TENDERS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_AUDIT_LEDGER,
  CURRENT_OFFICER
} from './services/mockData';
import { createCAGAuditBlock } from './services/cryptoEngine';
import { govApi } from './services/api';

export const App: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>(INITIAL_TENDERS);
  const [selectedTenderId, setSelectedTenderId] = useState<string>(INITIAL_TENDERS[0].id);
  const [submissions, setSubmissions] = useState<MaskedSubmission[]>(INITIAL_SUBMISSIONS);
  const [auditLedger, setAuditLedger] = useState<AuditLedgerBlock[]>(INITIAL_AUDIT_LEDGER);
  
  const [currentRole, setCurrentRole] = useState<UserRole>('TEC_MEMBER');
  const [activeTab, setActiveTab] = useState<ActiveTab>('EVAL_QUEUE');
  const [isVaultUnmasked, setIsVaultUnmasked] = useState<boolean>(false);
  const [officerProfile, setOfficerProfile] = useState<OfficerProfile>(() => {
    const saved = localStorage.getItem('gem_gov_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return CURRENT_OFFICER;
  });
  
  const [activeGradingSubmission, setActiveGradingSubmission] = useState<MaskedSubmission | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showOfficerProfileModal, setShowOfficerProfileModal] = useState<boolean>(false);
  const [activeDiscrepancySubmission, setActiveDiscrepancySubmission] = useState<MaskedSubmission | null>(null);
  const [showVendorIntakeModal, setShowVendorIntakeModal] = useState<boolean>(false);

  // Sync initial state from live FastAPI backend isolated by officer jurisdiction
  const refreshLiveState = async () => {
    try {
      const [liveTenders, liveSubmissions, liveLedger] = await Promise.all([
        govApi.getTenders(officerProfile.department, officerProfile.ministry, officerProfile.badgeId),
        govApi.getSubmissions(undefined, isVaultUnmasked),
        govApi.getAuditLedger()
      ]);

      if (liveTenders && liveTenders.length > 0) {
        setTenders(liveTenders);
      }
      if (liveSubmissions && liveSubmissions.length > 0) {
        setSubmissions(liveSubmissions);
      }
      if (liveLedger && liveLedger.length > 0) {
        setAuditLedger(liveLedger);
      }
    } catch (e) {
      console.warn('[Gov Portal] Local fallback state active:', e);
    }
  };

  useEffect(() => {
    refreshLiveState();
    const interval = setInterval(refreshLiveState, 8000);
    return () => clearInterval(interval);
  }, [isVaultUnmasked, officerProfile.badgeId, officerProfile.department]);

  const activeTender = tenders.find(t => t.id === selectedTenderId) || tenders[0];

  // Handler for creating new tender
  const handleCreateTender = async (newTender: Tender) => {
    const isolatedTender: Tender = {
      ...newTender,
      department: officerProfile.department || newTender.department,
      organization: officerProfile.ministry || newTender.organization
    };
    setTenders(prev => [isolatedTender, ...prev]);
    setSelectedTenderId(isolatedTender.id);

    try {
      await govApi.createTender(isolatedTender);
    } catch (e) {
      console.warn('[Gov Portal API] Error persisting tender to backend:', e);
    }

    // Append to local CAG ledger
    const lastBlock = auditLedger[auditLedger.length - 1];
    const newBlock = await createCAGAuditBlock(
      lastBlock,
      newTender.tenderNumber,
      'SYSTEM_GENESIS',
      officerProfile.badgeId,
      'BUYER_AUTHORITY',
      'PUBLISH_NEW_TENDER',
      {
        tenderNumber: newTender.tenderNumber,
        title: newTender.title,
        budgetCr: newTender.estimatedBudget,
        pqcCount: newTender.pqcCriteria.length
      }
    );
    setAuditLedger(prev => [...prev, newBlock]);
  };

  // Handler for submitting officer evaluation score
  const handleSubmitScore = async (submissionId: string, review: OfficerScoreEntry) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        const updatedReviews = [...sub.officerReviews.filter(r => r.officerId !== review.officerId), review];
        return {
          ...sub,
          officerReviews: updatedReviews,
          status: review.flagRaised === 'NONE' ? 'EVALUATION_APPROVED' : 'STATUTORY_FLAGGED'
        };
      }
      return sub;
    }));

    try {
      await govApi.submitOfficerScore(submissionId, review);
    } catch (e) {
      console.warn('[Gov Portal API] Error sending score to backend:', e);
    }

    // Find submission & anchor in local ledger
    const targetSub = submissions.find(s => s.id === submissionId);
    if (targetSub) {
      const lastBlock = auditLedger[auditLedger.length - 1];
      const newBlock = await createCAGAuditBlock(
        lastBlock,
        activeTender.tenderNumber,
        targetSub.maskedVendorId,
        review.officerId,
        review.role,
        'SUBMIT_BLIND_EVALUATION_SCORE',
        {
          technicalMarks: review.totalTechnicalMarks,
          scoresBreakdown: review.scores,
          remarks: review.remarks,
          flagType: review.flagRaised,
          dscSignature: review.dscSignature,
          gfrJustification: review.gfrJustification
        }
      );
      setAuditLedger(prev => [...prev, newBlock]);
    }
  };

  // Handler for ingesting upstream vendor submission from bridge
  const handleIngestUpstreamDocket = async (docket: UpstreamIntakeDocket) => {
    try {
      const ingested = await govApi.ingestDocket(docket);
      if (ingested) {
        setSubmissions(prev => [ingested, ...prev.filter(s => s.id !== ingested.id)]);
      }
    } catch (e) {
      console.warn('[Gov Portal API] Fallback ingestion:', e);
    }

    setTimeout(refreshLiveState, 500);
  };

  // Handler for Buyer Authority vault unmasking
  const handleToggleVaultUnmask = async (val: boolean) => {
    setIsVaultUnmasked(val);

    if (val) {
      try {
        const liveSubs = await govApi.getSubmissions(undefined, true);
        if (liveSubs) setSubmissions(liveSubs);
      } catch (e) {
        console.warn(e);
      }

      const lastBlock = auditLedger[auditLedger.length - 1];
      const newBlock = await createCAGAuditBlock(
        lastBlock,
        activeTender.tenderNumber,
        'ALL_VAULT_IDENTITIES',
        officerProfile.badgeId,
        'BUYER_AUTHORITY',
        'BUYER_AUTHORITY_VAULT_UNMASK',
        {
          officerBadgeId: officerProfile.badgeId,
          officerDesignation: officerProfile.designation,
          dscFingerprint: officerProfile.dscCertificate.fingerprintSha256,
          actionReason: 'Opening of Financial Stage for Technical Qualified Bidders',
          statutoryAuthorizationClause: 'GFR Rule 160(xiv) Financial Opening Authority'
        }
      );
      setAuditLedger(prev => [...prev, newBlock]);
    } else {
      try {
        const liveSubs = await govApi.getSubmissions(undefined, false);
        if (liveSubs) setSubmissions(liveSubs);
      } catch (e) {}
    }
  };

  // Count summaries for badges
  const pendingCount = submissions.filter(s => s.status === 'TEC_BLIND_EVAL' || s.status === 'PENDING_SCRUTINY').length;
  const flaggedCount = submissions.filter(s => s.status === 'STATUTORY_FLAGGED').length;
  const ledgerCount = auditLedger.length;

  // Render view router
  const renderActiveView = () => {
    switch (activeTab) {
      case 'TENDERS':
        return (
          <TenderManagementView 
            tenders={tenders}
            activeTender={activeTender}
            onSelectTender={(id) => setSelectedTenderId(id)}
            onCreateTender={handleCreateTender}
          />
        );
      case 'EVAL_QUEUE':
        return (
          <EvaluationQueueView 
            submissions={submissions.filter(s => s.tenderId === selectedTenderId || !s.tenderId)}
            currentRole={currentRole}
            isVaultUnmasked={isVaultUnmasked}
            onOpenGradingModal={(sub) => setActiveGradingSubmission(sub)}
            onOpenDiscrepancyInspector={(sub) => setActiveDiscrepancySubmission(sub)}
            onOpenVendorIntake={() => setShowVendorIntakeModal(true)}
          />
        );
      case 'STATUTORY':
        return (
          <StatutoryRegistryView 
            submissions={submissions.filter(s => s.tenderId === selectedTenderId || !s.tenderId)}
          />
        );
      case 'AI_SCORECARD':
        return (
          <AIScorecardView 
            submissions={submissions.filter(s => s.tenderId === selectedTenderId || !s.tenderId)}
          />
        );
      case 'MII_AUDIT':
        return (
          <MIIAuditView 
            submissions={submissions.filter(s => s.tenderId === selectedTenderId || !s.tenderId)}
          />
        );
      case 'COMPOSITE_MATRIX':
        return (
          <ScoreMatrixView 
            tender={activeTender}
            submissions={submissions.filter(s => s.tenderId === selectedTenderId || !s.tenderId)}
            currentRole={currentRole}
            isVaultUnmasked={isVaultUnmasked}
            setIsVaultUnmasked={handleToggleVaultUnmask}
          />
        );
      case 'CAG_LEDGER':
        return (
          <CAGLedgerView 
            ledgerBlocks={auditLedger}
            tender={activeTender}
            onOpenExportModal={() => setShowExportModal(true)}
          />
        );
      case 'OFFICER_PROFILE':
        return (
          <GovOfficerProfileView 
            profile={officerProfile}
            onProfileUpdated={(updated) => setOfficerProfile(updated)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070F1E] text-slate-100 font-sans">
      
      <Navbar 
        selectedTender={activeTender}
        allTenders={tenders}
        onSelectTender={(id) => setSelectedTenderId(id)}
        activeTab={activeTab}
        currentRole={currentRole}
        isVaultUnmasked={isVaultUnmasked}
        officerProfile={officerProfile}
        onOpenOfficerProfile={() => setShowOfficerProfileModal(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab)}
          pendingCount={pendingCount}
          flaggedCount={flaggedCount}
          ledgerCount={ledgerCount}
          openExportModal={() => setShowExportModal(true)}
          currentRole={currentRole}
          setCurrentRole={(role) => setCurrentRole(role)}
          selectedTender={activeTender}
          allTenders={tenders}
          setSelectedTenderId={(id) => setSelectedTenderId(id)}
          isVaultUnmasked={isVaultUnmasked}
          setIsVaultUnmasked={handleToggleVaultUnmask}
          officerProfile={officerProfile}
          onOpenOfficerProfile={() => setShowOfficerProfileModal(true)}
          onOpenVendorIntake={() => setShowVendorIntakeModal(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-80px)] space-y-5">
          
          <GovHeaderStats 
            tender={activeTender}
            currentRole={currentRole}
            officerProfile={officerProfile}
            submissionsCount={submissions.filter(s => s.tenderId === selectedTenderId || !s.tenderId).length}
            isVaultUnmasked={isVaultUnmasked}
            ledgerCount={ledgerCount}
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#0A192F] border border-[#1E3A68] rounded-xl p-3.5 shadow-md">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge badge-info text-xs">{activeTender.evaluationMode} Evaluation</span>
                <span className="text-sm font-extrabold text-slate-100">
                  {activeTender.title}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Ref: <strong className="text-amber-400 font-mono">{activeTender.tenderNumber}</strong> &bull; Budget: <strong className="text-emerald-400 font-mono">₹{activeTender.estimatedBudget} Cr</strong> &bull; EMD: <strong className="text-slate-200">₹{activeTender.emdAmount} Lakhs</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
              <button 
                onClick={refreshLiveState}
                className="px-3 py-1.5 rounded-lg bg-[#001D3D] hover:bg-[#002855] border border-[#1E3A68] text-sky-400 hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Synchronize live bids with shared database"
              >
                <span>🔄 Sync State</span>
              </button>

              <select 
                value={selectedTenderId} 
                onChange={(e) => setSelectedTenderId(e.target.value)}
                className="bg-[#091528] text-slate-200 border border-[#1E3A68] rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-sky-400"
              >
                {tenders.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.tenderNumber} - {t.title.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="animate-fadeIn">
            {renderActiveView()}
          </div>
        </main>
      </div>

      <GovFooter />

      {activeGradingSubmission && (
        <BlindGradingModal 
          submission={activeGradingSubmission}
          currentRole={currentRole}
          isVaultUnmasked={isVaultUnmasked}
          onClose={() => setActiveGradingSubmission(null)}
          onSubmitScore={handleSubmitScore}
          onOpenDiscrepancyInspector={(sub) => setActiveDiscrepancySubmission(sub)}
        />
      )}

      {activeDiscrepancySubmission && (
        <DiscrepancyInspectorModal 
          submission={activeDiscrepancySubmission}
          onClose={() => setActiveDiscrepancySubmission(null)}
        />
      )}

      {showVendorIntakeModal && (
        <VendorIntakeSimulatorModal 
          onClose={() => setShowVendorIntakeModal(false)}
          onIngestDocket={handleIngestUpstreamDocket}
        />
      )}

      {showExportModal && (
        <CAGExportModal 
          tender={activeTender}
          submissions={submissions}
          ledgerBlocks={auditLedger}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showOfficerProfileModal && (
        <OfficerProfileModal 
          profile={officerProfile}
          onClose={() => setShowOfficerProfileModal(false)}
          onLogout={() => setShowOfficerProfileModal(false)}
        />
      )}
    </div>
  );
};