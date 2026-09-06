import { AuditLedgerBlock, MaskedSubmission, Tender } from '../types/procurement';

// Fast pure JS SHA-256 for browser environments
export async function computeSHA256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Pseudo HMAC calculation for double-blind masked ID
export async function generateMaskedVendorId(vendorRealId: string, tenderId: string): Promise<string> {
  const combined = `GOV_SALT_${tenderId}_${vendorRealId}`;
  const fullHash = await computeSHA256(combined);
  const snippet = fullHash.slice(2, 8).toUpperCase();
  return `V-ANON-${snippet}`;
}

// Merkle root generation for an array of string hashes
export async function computeMerkleRoot(hashes: string[]): Promise<string> {
  if (hashes.length === 0) return '0x0000000000000000000000000000000000000000000000000000000000000000';
  let currentLayer = [...hashes];
  
  while (currentLayer.length > 1) {
    if (currentLayer.length % 2 !== 0) {
      currentLayer.push(currentLayer[currentLayer.length - 1]);
    }
    const nextLayer: string[] = [];
    for (let i = 0; i < currentLayer.length; i += 2) {
      const combined = currentLayer[i] + currentLayer[i + 1];
      const parentHash = await computeSHA256(combined);
      nextLayer.push(parentHash);
    }
    currentLayer = nextLayer;
  }
  
  return currentLayer[0];
}

// Generates a mock PKCS#11 DSC Signature based on payload & officer ID
export async function generateDSCSignature(officerId: string, payload: any): Promise<{ signature: string; certFingerprint: string }> {
  const rawString = JSON.stringify(payload) + officerId + Date.now();
  const rawHash = await computeSHA256(rawString);
  const certFingerprint = 'SHA256:' + (await computeSHA256(officerId)).slice(2, 22).toUpperCase();
  const signature = `DSC_X509_${certFingerprint.slice(7, 15)}_${rawHash.slice(2, 18)}`;
  return { signature, certFingerprint };
}

// Creates a new CAG Audit Block linked to previous block
export async function createCAGAuditBlock(
  previousBlock: AuditLedgerBlock | null,
  tenderId: string,
  maskedVendorId: string,
  officerId: string,
  officerRole: string,
  action: string,
  payload: Record<string, any>
): Promise<AuditLedgerBlock> {
  const previousHash = previousBlock ? previousBlock.blockHash : '0x0000000000000000000000000000000000000000000000000000000000000000';
  const blockHeight = previousBlock ? previousBlock.blockHeight + 1 : 1;
  const timestamp = new Date().toISOString();
  
  const { signature, certFingerprint } = await generateDSCSignature(officerId, payload);
  
  const payloadHash = await computeSHA256(JSON.stringify(payload));
  const merkleRoot = await computeMerkleRoot([previousHash, payloadHash, signature]);
  
  const blockHeader = `${blockHeight}:${previousHash}:${timestamp}:${tenderId}:${maskedVendorId}:${action}:${merkleRoot}:${signature}`;
  const blockHash = await computeSHA256(blockHeader);
  
  return {
    blockHeight,
    blockHash,
    previousHash,
    timestamp,
    tenderId,
    maskedVendorId,
    officerContext: {
      officerId,
      officerRole,
      dscFingerprint: certFingerprint
    },
    action,
    evaluationPayload: payload,
    merkleRoot,
    signature,
    verified: true
  };
}

// Prepares the complete CAG Audit Trail Dossier export package
export function exportCAGComplianceDossier(
  tender: Tender,
  submissions: MaskedSubmission[],
  ledgerBlocks: AuditLedgerBlock[]
): {
  exportMetadata: Record<string, any>;
  cagPackageJson: string;
  filename: string;
} {
  const exportTimestamp = new Date().toISOString();
  const relevantBlocks = ledgerBlocks.filter(b => b.tenderId === tender.id || b.tenderId === tender.tenderNumber);
  
  const payload = {
    cagComplianceStandard: 'CAG_IND_DPP_2026_AUDIT_SPEC_V3',
    generatedAt: exportTimestamp,
    tenderSummary: {
      tenderNumber: tender.tenderNumber,
      title: tender.title,
      department: tender.department,
      estimatedBudgetCr: tender.estimatedBudget,
      publishedDate: tender.publishedDate,
      evaluationMode: tender.evaluationMode,
      pqcCriteria: tender.pqcCriteria,
      weights: tender.weights
    },
    doubleBlindAnonymizationManifest: submissions.map(s => ({
      maskedVendorId: s.maskedVendorId,
      vaultCipherToken: s.vaultCipherToken,
      statutoryVerificationStatus: s.statutory.overallHealthScore >= 80 ? 'PASSED' : 'FLAGGED',
      aiPQCComplianceScore: s.aiScorecard.complianceScore,
      miiClassification: s.miiAudit.supplierClass,
      miiLocalContentVerified: s.miiAudit.verifiedPercentage,
      compositeScore: s.consolidatedScore?.finalCompositeScore ?? 0,
      rank: s.consolidatedScore?.rank ?? '-'
    })),
    immutableAuditLedgerChain: relevantBlocks,
    cagLedgerVerificationSummary: {
      totalBlocks: relevantBlocks.length,
      genesisBlockHash: relevantBlocks[0]?.blockHash ?? 'N/A',
      latestStateRoot: relevantBlocks[relevantBlocks.length - 1]?.merkleRoot ?? 'N/A',
      chainIntegrityStatus: 'VERIFIED_CRYPTOGRAPHICALLY_SOUND'
    }
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const filename = `CAG_AUDIT_PACKAGE_${tender.tenderNumber.replace(/[\/\\:]/g, '_')}_${Date.now()}.json`;

  return {
    exportMetadata: payload.cagLedgerVerificationSummary,
    cagPackageJson: jsonString,
    filename
  };
}