import { 
  Tender, 
  MaskedSubmission, 
  AuditLedgerBlock, 
  OfficerProfile, 
  UpstreamIntakeDocket 
} from '../types/procurement';

export const CURRENT_OFFICER: OfficerProfile = {
  officerId: 'GEM-OFF-9041',
  fullName: 'Shri Rajesh Sharma',
  designation: 'Director (Procurement & Evaluation)',
  ministry: 'Ministry of Electronics & Information Technology (MeitY)',
  department: 'Public Procurement & GeM Governance Division',
  securityClearanceLevel: 'Level-4 (Top Secret / Sovereign Procurement)',
  badgeId: 'GEM-OFF-9041',
  dscCertificate: {
    issuer: 'National Informatics Centre (NIC-CA) Class-3 Gov Sub-CA',
    tokenType: 'PKCS#11 Hardware Token (ePass2003 FIPS 140-2 Level 3)',
    serialNumber: 'IN-NIC-8942-0199-B7X',
    fingerprintSha256: 'SHA256:7B8F9A01C2945DF8812456AE3290FE19823467AB908123479B0E1F',
    validUntil: '2028-12-31',
    status: 'ACTIVE_VALIDATED'
  },
  sessionContext: {
    tokenHash: 'SEC-TOK-9941-8AF20B-NIC',
    loginTimestamp: new Date().toISOString(),
    ipAddress: '10.248.14.88 (NIC Gov Protected Gateway)',
    mfaMethod: 'Dual-Factor: Aadhaar e-Sign OTP + Class-3 Hardware Token',
    expiresInMinutes: 480
  }
};

export const UPSTREAM_INTAKE_DOCKETS: UpstreamIntakeDocket[] = [
  {
    intakeId: 'INTAKE-2026-901',
    vendorName: 'Bharat Quantum Systems Ltd',
    panNumber: 'AAACB1234K',
    gstinNumber: '07AAACB1234K1Z5',
    tenderNumber: 'GEM/2026/B/894210',
    submittedAt: '2026-08-30T14:22:10Z',
    docketSizeMb: 48.5,
    digilockerHash: 'SHA256:4f8e91a0c8b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
    turnoverDeclaredCr: 28.5,
    localContentDeclared: 68.4,
    category: 'High Performance Compute'
  },
  {
    intakeId: 'INTAKE-2026-902',
    vendorName: 'Indo-Nordic Defense Tech Pvt Ltd',
    panNumber: 'AACCI5678M',
    gstinNumber: '29AACCI5678M1Z2',
    tenderNumber: 'GEM/2026/B/894210',
    submittedAt: '2026-08-30T15:45:00Z',
    docketSizeMb: 62.1,
    digilockerHash: 'SHA256:91a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    turnoverDeclaredCr: 41.2,
    localContentDeclared: 42.0,
    category: 'Quantum Cryptographic Hardware'
  },
  {
    intakeId: 'INTAKE-2026-903',
    vendorName: 'Vanguard Cyber Infra Corp',
    panNumber: 'AABCV9988P',
    gstinNumber: '27AABCV9988P1Z8',
    tenderNumber: 'GEM/2026/B/894210',
    submittedAt: '2026-08-30T16:10:30Z',
    docketSizeMb: 35.8,
    digilockerHash: 'SHA256:7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    turnoverDeclaredCr: 12.4,
    localContentDeclared: 82.5,
    category: 'HSM Cryptographic Core'
  }
];

export const INITIAL_TENDERS: Tender[] = [
  {
    id: 'TND-2026-001',
    tenderNumber: 'GEM/2026/B/894210',
    title: 'Procurement of Enterprise Cloud AI Compute Cluster & Quantum-Safe HSM Array',
    department: 'Ministry of Electronics and Information Technology (MeitY)',
    gemCategory: 'High Performance Compute & Cryptographic Hardware',
    estimatedBudget: 42.5, // 42.5 Cr
    emdAmount: 85.0, // 85 Lakhs
    publishedDate: '2026-08-10T10:00:00Z',
    closingDate: '2026-09-15T17:00:00Z',
    status: 'TECHNICAL_EVALUATION',
    evaluationMode: 'QCBS',
    weights: {
      technical: 50,
      statutory: 15,
      aiCompliance: 15,
      miiLocalContent: 20
    },
    pqcCriteria: [
      {
        id: 'PQC-1',
        clauseNumber: 'Clause 4.1.1',
        description: 'Average Annual Turnover of at least ₹15 Cr in last 3 audited financial years (CA Certified).',
        mandatory: true,
        minThreshold: '₹15.00 Cr',
        category: 'FINANCIAL'
      },
      {
        id: 'PQC-2',
        clauseNumber: 'Clause 4.2.3',
        description: 'Past successful deployment of 2 or more tier-3 AI GPU infrastructure clusters in PSU/Defense.',
        mandatory: true,
        minThreshold: '2 Completed Deployments',
        category: 'TECHNICAL'
      },
      {
        id: 'PQC-3',
        clauseNumber: 'Clause 4.3.1',
        description: 'Valid GSTN active status with zero defaults in GSTR-3B and EPFO active compliance.',
        mandatory: true,
        minThreshold: '100% Statutory Health',
        category: 'STATUTORY'
      },
      {
        id: 'PQC-4',
        clauseNumber: 'Clause 4.4.2',
        description: 'Make in India Class-I Local Supplier (Minimum 50% Domestic Value Addition) under DPIIT PPP-MII.',
        mandatory: true,
        minThreshold: '>= 50% Local Content',
        category: 'ESG_MII'
      }
    ]
  },
  {
    id: 'TND-2026-002',
    tenderNumber: 'GEM/2026/B/771042',
    title: 'Automated Toll & Expressway LiDAR Traffic Analytics Edge Sensor Network',
    department: 'National Highways Authority of India (NHAI)',
    gemCategory: 'Intelligent Transportation Systems (ITS)',
    estimatedBudget: 18.2,
    emdAmount: 36.4,
    publishedDate: '2026-08-14T09:30:00Z',
    closingDate: '2026-09-20T18:00:00Z',
    status: 'TECHNICAL_EVALUATION',
    evaluationMode: 'QCBS',
    weights: {
      technical: 40,
      statutory: 20,
      aiCompliance: 20,
      miiLocalContent: 20
    },
    pqcCriteria: [
      {
        id: 'PQC-11',
        clauseNumber: 'Clause 3.1.2',
        description: 'Minimum 5 years OEM experience in edge sensory telemetry with ISO 9001/27001 certifications.',
        mandatory: true,
        minThreshold: '5 Years OEM',
        category: 'TECHNICAL'
      },
      {
        id: 'PQC-12',
        clauseNumber: 'Clause 3.3.0',
        description: 'Minimum 50% Make in India domestic component assembly in accordance with MII Order 2017.',
        mandatory: true,
        minThreshold: '>= 50%',
        category: 'ESG_MII'
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS: MaskedSubmission[] = [
  {
    id: 'SUB-001',
    tenderId: 'TND-2026-001',
    maskedVendorId: 'VEN-ANON-9041',
    vaultCipherToken: 'AES256-GCM-CIPHER-0x9F4B3C8120A1-KMS',
    actualVendorNameHidden: 'Bharat Quantum Systems Ltd',
    actualPanHidden: 'AAACB1234K',
    actualGstinHidden: '07AAACB1234K1Z5',
    submittedAt: '2026-08-20T14:22:10Z',
    status: 'TEC_BLIND_EVAL',
    statutory: {
      gstn: {
        status: 'ACTIVE',
        regular3BFiling: true,
        turnoverVerifiedCr: 28.45,
        panGstCrossMatch: true,
        lastFilingMonth: 'July 2026'
      },
      epfo: {
        status: 'COMPLIANT',
        activeEmployeesCount: 142,
        lastChallanDate: '2026-08-15',
        duesPending: 0.0
      },
      esic: {
        status: 'COMPLIANT',
        contributionMonthsRegular: 24,
        lastContributionDate: '2026-08-12',
        employeeCount: 118
      },
      mca21: {
        status: 'ACTIVE',
        cinMasked: 'U72900DL2018PLC33****',
        paidUpCapitalCr: 12.0,
        disqualifiedDirectorsCount: 0,
        chargeSatisfied: true
      },
      udyam: {
        status: 'VERIFIED',
        udyamNumberMasked: 'UDYAM-DL-03-001****',
        enterpriseType: 'MEDIUM',
        priorityProcurementEligible: true,
        womenOwned: false,
        scStOwned: false
      },
      digilocker: {
        status: 'AUTHENTICATED',
        verifiedHashesCount: 6,
        rootCertFingerprint: 'SHA256:9F8120AC8841B903E7',
        docketSealVerified: true
      },
      cpppDebarment: {
        status: 'CLEAR',
        checkedAt: '2026-08-30T10:00:00Z'
      },
      itr26as: {
        status: 'CONSISTENT',
        reportedTurnoverCr: 28.45,
        gross26asCreditCr: 28.60,
        filingAssessmentYear: 'AY 2025-26'
      },
      nsicStartup: {
        isDpiitStartup: false,
        nsicRegistered: true,
        oemAuthorizationValid: true
      },
      overallHealthScore: 98,
      flags: []
    },
    aiScorecard: {
      complianceScore: 94,
      confidenceRate: 97.5,
      clausesPassed: 4,
      clausesTotal: 4,
      redFlags: [],
      anomaliesDetected: [],
      citations: [
        {
          clauseId: 'PQC-1',
          clauseTitle: 'Annual Financial Turnover',
          status: 'COMPLIANT',
          confidenceScore: 98,
          pageRef: 12,
          sourceDoc: 'Audited_Financials_FY24-25.pdf',
          extractedSnippet: 'Average turnover over preceding 3 FYs stands at ₹28.45 Cr as certified by statutory CA.',
          aiExplanation: 'Exceeds minimum requirement of ₹15 Cr. Cross-verified with GSTN return data.'
        },
        {
          clauseId: 'PQC-2',
          clauseTitle: 'Past Technical Experience',
          status: 'COMPLIANT',
          confidenceScore: 96,
          pageRef: 24,
          sourceDoc: 'Past_Performance_Dossier.pdf',
          extractedSnippet: 'Delivered 32-node H100 AI Compute Cluster for DRDO Lab in Oct 2024 and 16-node cluster for BEL.',
          aiExplanation: '2 high-performance deployments in defense PSU fully documented with client completion certificates.'
        },
        {
          clauseId: 'PQC-3',
          clauseTitle: 'Statutory Health & Tax Returns',
          status: 'COMPLIANT',
          confidenceScore: 99,
          pageRef: 5,
          sourceDoc: 'Statutory_Declaration_Seal.pdf',
          extractedSnippet: 'GSTR-3B filings up to July 2026 validated without default penalties.',
          aiExplanation: 'Real-time GSTN & EPFO query verified continuous regular compliance.'
        },
        {
          clauseId: 'PQC-4',
          clauseTitle: 'Make in India Class-I Local Content',
          status: 'COMPLIANT',
          confidenceScore: 95,
          pageRef: 31,
          sourceDoc: 'MII_BoM_CA_Certificate.pdf',
          extractedSnippet: 'Verified local value addition calculated at 68.4% domestic component sourcing.',
          aiExplanation: 'Meets Class-I threshold (>= 50%). Verified through BoM itemization check.'
        }
      ],
      discrepancies: []
    },
    miiAudit: {
      supplierClass: 'Class-I',
      declaredPercentage: 68.4,
      verifiedPercentage: 68.4,
      auditorCertificateHash: 'SHA256:7b8e91a0c8b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
      auditorCertValid: true,
      purchasePreferenceEligible: true,
      marginOfPreference: 20,
      bomItems: [
        {
          componentName: 'Cryptographic HSM ASIC Board & Chassis',
          countryOfOrigin: 'India (Noida Fab)',
          localContentPercent: 82.0,
          costWeight: 35.0,
          domesticValueAdditionInr: 12150000
        },
        {
          componentName: 'Power Distribution & Liquid Cooling Unit',
          countryOfOrigin: 'India (Bengaluru)',
          localContentPercent: 78.5,
          costWeight: 25.0,
          domesticValueAdditionInr: 8320000
        },
        {
          componentName: 'High-Bandwidth Interconnect Fabric',
          countryOfOrigin: 'Taiwan',
          localContentPercent: 15.0,
          costWeight: 40.0,
          domesticValueAdditionInr: 2540000
        }
      ]
    },
    officerReviews: []
  },
  {
    id: 'SUB-002',
    tenderId: 'TND-2026-001',
    maskedVendorId: 'VEN-ANON-8F92',
    vaultCipherToken: 'AES256-GCM-CIPHER-0x7C104AE9901B-KMS',
    actualVendorNameHidden: 'Indo-Nordic Defense Tech Pvt Ltd',
    actualPanHidden: 'AACCI5678M',
    actualGstinHidden: '29AACCI5678M1Z2',
    submittedAt: '2026-08-21T09:15:40Z',
    status: 'STATUTORY_FLAGGED',
    statutory: {
      gstn: {
        status: 'ACTIVE',
        regular3BFiling: true,
        turnoverVerifiedCr: 41.2,
        panGstCrossMatch: true,
        lastFilingMonth: 'June 2026'
      },
      epfo: {
        status: 'DEFAULT_DETECTED',
        activeEmployeesCount: 88,
        lastChallanDate: '2026-05-10',
        duesPending: 4.85
      },
      esic: {
        status: 'DEFAULT',
        contributionMonthsRegular: 18,
        lastContributionDate: '2026-05-14',
        employeeCount: 65
      },
      mca21: {
        status: 'ACTIVE',
        cinMasked: 'U74999KA2016PTC09****',
        paidUpCapitalCr: 8.5,
        disqualifiedDirectorsCount: 0,
        chargeSatisfied: true
      },
      udyam: {
        status: 'NOT_APPLICABLE',
        udyamNumberMasked: 'NOT_REGISTERED',
        enterpriseType: 'LARGE',
        priorityProcurementEligible: false,
        womenOwned: false,
        scStOwned: false
      },
      digilocker: {
        status: 'AUTHENTICATED',
        verifiedHashesCount: 4,
        rootCertFingerprint: 'SHA256:4C982001AC7F104',
        docketSealVerified: true
      },
      cpppDebarment: {
        status: 'FLAGGED',
        debarmentCategory: 'Show-Cause Issued by State PSU (Karnataka PWD)',
        blacklistingAuthority: 'State Tech Directorate',
        checkedAt: '2026-08-30T10:00:00Z'
      },
      itr26as: {
        status: 'MISMATCH',
        reportedTurnoverCr: 41.2,
        gross26asCreditCr: 31.5,
        filingAssessmentYear: 'AY 2025-26'
      },
      nsicStartup: {
        isDpiitStartup: false,
        nsicRegistered: false,
        oemAuthorizationValid: true
      },
      overallHealthScore: 62,
      flags: [
        'EPFO Alert: Challan default for June/July 2026 (₹4.85L dues pending)',
        'Form 26AS Mismatch: Declared ₹41.2 Cr vs 26AS Gross Credit ₹31.5 Cr',
        'CPPP Advisory: State PSU show-cause notice active on entity PAN'
      ]
    },
    aiScorecard: {
      complianceScore: 71,
      confidenceRate: 91.2,
      clausesPassed: 3,
      clausesTotal: 4,
      redFlags: [
        'Form 26AS mismatch against audited balance sheet turnover declaration',
        'Statutory EPFO default detected on live sovereign gateway'
      ],
      anomaliesDetected: [
        'Mismatch: Document stated Local Content is 58% but Bill of Material calculations yield 42.0%'
      ],
      citations: [
        {
          clauseId: 'PQC-1',
          clauseTitle: 'Annual Financial Turnover',
          status: 'PARTIAL',
          confidenceScore: 78,
          pageRef: 8,
          sourceDoc: 'Turnover_CA_Statement.pdf',
          extractedSnippet: 'Certified turnover ₹41.2 Cr reported by CA firm.',
          aiExplanation: 'Mismatch flagged: Form 26AS gross receipt reflects only ₹31.5 Cr. Discrepancy of ₹9.7 Cr needs reconciliation.'
        },
        {
          clauseId: 'PQC-2',
          clauseTitle: 'Past Technical Experience',
          status: 'COMPLIANT',
          confidenceScore: 94,
          pageRef: 18,
          sourceDoc: 'Tech_Execution_History.pdf',
          extractedSnippet: 'Delivered Edge AI cluster at ISRO Telemetry Centre.',
          aiExplanation: 'Satisfies technical clause requirement with verified client sign-off.'
        },
        {
          clauseId: 'PQC-3',
          clauseTitle: 'Statutory Health',
          status: 'NON_COMPLIANT',
          confidenceScore: 99,
          pageRef: 3,
          sourceDoc: 'EPFO_Declaration.pdf',
          extractedSnippet: 'Claimed zero default status across all social security bodies.',
          aiExplanation: 'Failed: Live EPFO portal returns default with pending dues of ₹4.85 Lakhs.'
        },
        {
          clauseId: 'PQC-4',
          clauseTitle: 'Make in India Class-I Local Content',
          status: 'NON_COMPLIANT',
          confidenceScore: 88,
          pageRef: 42,
          sourceDoc: 'BoM_Origin_Breakdown.pdf',
          extractedSnippet: 'Declared 58.0% local content, but imported components aggregate to 58.0% (Local = 42.0%).',
          aiExplanation: 'Class-II supplier (42.0%), not Class-I as mandated in Clause 4.4.2.'
        }
      ],
      discrepancies: [
        {
          id: 'DISC-01',
          docName: 'Audited_Balance_Sheet_FY25.pdf',
          pageNumber: 8,
          docParameter: 'Gross Turnover FY2024-25',
          declaredValue: '₹41.20 Crores',
          llama3ExtractedValue: '₹31.50 Crores (Net Operating)',
          registryValue: '₹31.50 Crores (ITR-6 / 26AS)',
          discrepancyType: 'TURNOVER_MISMATCH',
          severity: 'CRITICAL',
          explanation: 'Llama 3 parser identified revenue inflation of ₹9.70 Cr. Cross-checked with Form 26AS and GSTN gross turnover.',
          citationSnippet: 'Turnover certified as Rs. 41,20,00,000/- while Schedule III notes indicate Rs. 9.7 Cr trading pass-through.'
        },
        {
          id: 'DISC-02',
          docName: 'BoM_Origin_Breakdown.pdf',
          pageNumber: 42,
          docParameter: 'Make in India Local Content %',
          declaredValue: '58.0% (Class-I)',
          llama3ExtractedValue: '42.0% (Class-II)',
          registryValue: '42.0% (DPIIT BoM Auditor Check)',
          discrepancyType: 'CLAUSE_NON_COMPLIANCE',
          severity: 'HIGH',
          explanation: 'Imported server blade subassemblies from Sweden were miscategorized as domestic value add.',
          citationSnippet: 'Item 4: Dual-socket compute blades imported in CBU form from Kista, Sweden.'
        }
      ]
    },
    miiAudit: {
      supplierClass: 'Class-II',
      declaredPercentage: 58.0,
      verifiedPercentage: 42.0,
      auditorCertificateHash: 'SHA256:3a9f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
      auditorCertValid: false,
      purchasePreferenceEligible: false,
      marginOfPreference: 0,
      bomItems: [
        {
          componentName: 'Compute Blade Subassemblies (Imported)',
          countryOfOrigin: 'Sweden',
          localContentPercent: 0.0,
          costWeight: 58.0,
          domesticValueAdditionInr: 0
        },
        {
          componentName: 'Server Enclosure & Thermal System',
          countryOfOrigin: 'India (Pune)',
          localContentPercent: 100.0,
          costWeight: 42.0,
          domesticValueAdditionInr: 12200000
        }
      ]
    },
    officerReviews: []
  },
  {
    id: 'SUB-003',
    tenderId: 'TND-2026-001',
    maskedVendorId: 'VEN-ANON-4C1B',
    vaultCipherToken: 'AES256-GCM-CIPHER-0x1A2B3C4D5E6F-KMS',
    actualVendorNameHidden: 'Vanguard Cyber Infra Corp',
    actualPanHidden: 'AABCV9988P',
    actualGstinHidden: '27AABCV9988P1Z8',
    submittedAt: '2026-08-22T11:04:12Z',
    status: 'EVALUATION_APPROVED',
    statutory: {
      gstn: {
        status: 'ACTIVE',
        regular3BFiling: true,
        turnoverVerifiedCr: 19.8,
        panGstCrossMatch: true,
        lastFilingMonth: 'July 2026'
      },
      epfo: {
        status: 'COMPLIANT',
        activeEmployeesCount: 94,
        lastChallanDate: '2026-08-14',
        duesPending: 0.0
      },
      esic: {
        status: 'COMPLIANT',
        contributionMonthsRegular: 24,
        lastContributionDate: '2026-08-11',
        employeeCount: 82
      },
      mca21: {
        status: 'ACTIVE',
        cinMasked: 'U72200MH2019PTC32****',
        paidUpCapitalCr: 6.0,
        disqualifiedDirectorsCount: 0,
        chargeSatisfied: true
      },
      udyam: {
        status: 'VERIFIED',
        udyamNumberMasked: 'UDYAM-MH-19-002****',
        enterpriseType: 'SMALL',
        priorityProcurementEligible: true,
        womenOwned: true,
        scStOwned: false
      },
      digilocker: {
        status: 'AUTHENTICATED',
        verifiedHashesCount: 5,
        rootCertFingerprint: 'SHA256:7B8F9A01C2945D',
        docketSealVerified: true
      },
      cpppDebarment: {
        status: 'CLEAR',
        checkedAt: '2026-08-30T10:00:00Z'
      },
      itr26as: {
        status: 'CONSISTENT',
        reportedTurnoverCr: 19.8,
        gross26asCreditCr: 19.9,
        filingAssessmentYear: 'AY 2025-26'
      },
      nsicStartup: {
        isDpiitStartup: true,
        startupCertificateNo: 'DPIIT-STP-2021-9981',
        nsicRegistered: true,
        oemAuthorizationValid: true
      },
      overallHealthScore: 100,
      flags: []
    },
    aiScorecard: {
      complianceScore: 91,
      confidenceRate: 96.0,
      clausesPassed: 4,
      clausesTotal: 4,
      redFlags: [],
      anomaliesDetected: [],
      citations: [
        {
          clauseId: 'PQC-1',
          clauseTitle: 'Annual Financial Turnover',
          status: 'COMPLIANT',
          confidenceScore: 97,
          pageRef: 10,
          sourceDoc: 'Financial_Statements.pdf',
          extractedSnippet: '3-year average turnover verified at ₹19.8 Cr (Exceeds ₹15 Cr threshold).',
          aiExplanation: 'Compliant with PQC clause 4.1.1.'
        },
        {
          clauseId: 'PQC-2',
          clauseTitle: 'Past Technical Experience',
          status: 'COMPLIANT',
          confidenceScore: 92,
          pageRef: 19,
          sourceDoc: 'Client_Completion_Certs.pdf',
          extractedSnippet: 'Deployed HPC cluster at C-DAC Pune and Indian Railways Data Centre.',
          aiExplanation: '2 PSU projects validated with satisfactory completion notes.'
        },
        {
          clauseId: 'PQC-3',
          clauseTitle: 'Statutory Health',
          status: 'COMPLIANT',
          confidenceScore: 99,
          pageRef: 4,
          sourceDoc: 'Statutory_Self_Declaration.pdf',
          extractedSnippet: 'Clean compliance record with zero tax defaults.',
          aiExplanation: 'All 4 registry APIs returned clean compliance.'
        },
        {
          clauseId: 'PQC-4',
          clauseTitle: 'Make in India Class-I Local Content',
          status: 'COMPLIANT',
          confidenceScore: 94,
          pageRef: 28,
          sourceDoc: 'Local_Content_Auditor_Cert.pdf',
          extractedSnippet: 'Verified domestic value addition at 82.5%.',
          aiExplanation: 'Qualified as Class-I supplier with high domestic value addition.'
        }
      ],
      discrepancies: []
    },
    miiAudit: {
      supplierClass: 'Class-I',
      declaredPercentage: 82.5,
      verifiedPercentage: 82.5,
      auditorCertificateHash: 'SHA256:8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d',
      auditorCertValid: true,
      purchasePreferenceEligible: true,
      marginOfPreference: 20,
      bomItems: [
        {
          componentName: 'Indigenous Microkernel & Cryptographic Middleware',
          countryOfOrigin: 'India (Hyderabad R&D)',
          localContentPercent: 95.0,
          costWeight: 45.0,
          domesticValueAdditionInr: 15400000
        },
        {
          componentName: 'Server Chassis & Assembly',
          countryOfOrigin: 'India (Mumbai)',
          localContentPercent: 85.0,
          costWeight: 35.0,
          domesticValueAdditionInr: 10700000
        },
        {
          componentName: 'Flash Memory Modules',
          countryOfOrigin: 'South Korea',
          localContentPercent: 10.0,
          costWeight: 20.0,
          domesticValueAdditionInr: 720000
        }
      ]
    },
    officerReviews: [
      {
        officerId: 'GEM-OFF-9041',
        officerName: 'Shri Rajesh Sharma (Director)',
        role: 'TEC_MEMBER',
        timestamp: '2026-08-28T16:30:00Z',
        scores: {
          technicalCapability: 38,
          pastExperience: 24,
          methodologyWorkplan: 19,
          keyPersonnel: 14
        },
        totalTechnicalMarks: 95,
        remarks: 'Exemplary technical architecture with high indigenous IP. Past execution track record in C-DAC confirmed.',
        flagRaised: 'NONE',
        dscSignature: 'DSC_X509_PKCS11_8941_9F2B81'
      }
    ]
  }
];

export const INITIAL_AUDIT_LEDGER: AuditLedgerBlock[] = [
  {
    blockHeight: 101,
    blockHash: '0x3a9f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
    previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    timestamp: '2026-08-10T10:00:00Z',
    tenderId: 'GEM/2026/B/894210',
    maskedVendorId: 'SYSTEM_GENESIS',
    officerContext: {
      officerId: 'GEM-OFF-9041',
      officerRole: 'BUYER_AUTHORITY',
      dscFingerprint: 'SHA256:7B8F9A01C2945DF8812456AE3290FE19823467AB'
    },
    action: 'PUBLISH_TENDER_SPECIFICATIONS',
    evaluationPayload: {
      tenderNumber: 'GEM/2026/B/894210',
      budgetCr: 42.5,
      pqcClausesCount: 4,
      evaluationScheme: 'QCBS (50:15:15:20)'
    },
    merkleRoot: '0x91a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    signature: 'MEQCIG7X9W...1QYIQD8Z0V...NIC_CLASS3',
    verified: true
  },
  {
    blockHeight: 102,
    blockHash: '0x8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d',
    previousHash: '0x3a9f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
    timestamp: '2026-08-20T14:22:10Z',
    tenderId: 'GEM/2026/B/894210',
    maskedVendorId: 'VEN-ANON-9041',
    officerContext: {
      officerId: 'SYSTEM_ZK_GATEWAY',
      officerRole: 'INGESTION_CONTROLLER',
      dscFingerprint: 'SHA256:GATEWAY_HARDWARE_FINGERPRINT'
    },
    action: 'DOUBLE_BLIND_TOKEN_GENERATION',
    evaluationPayload: {
      pseudonymAssigned: 'VEN-ANON-9041',
      kmsVaultEnvelope: 'AES256-GCM-CIPHER-0x9F4B3C8120A1-KMS',
      registryAutoQueriesTriggered: ['GSTN', 'EPFO', 'ESIC', 'MCA21', 'UDYAM', 'DIGILOCKER', 'CPPP', 'ITR26AS']
    },
    merkleRoot: '0x89a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    signature: 'MEQCID4K1L...2RYJQE9Z1W...ZK_GATEWAY',
    verified: true
  },
  {
    blockHeight: 103,
    blockHash: '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    previousHash: '0x8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d',
    timestamp: '2026-08-28T16:30:00Z',
    tenderId: 'GEM/2026/B/894210',
    maskedVendorId: 'VEN-ANON-4C1B',
    officerContext: {
      officerId: 'GEM-OFF-9041',
      officerRole: 'TEC_MEMBER',
      dscFingerprint: 'SHA256:7B8F9A01C2945DF8812456AE3290FE19823467AB'
    },
    action: 'RECORD_BLIND_EVALUATION_SCORE',
    evaluationPayload: {
      technicalMarks: 95,
      scoresBreakdown: {
        technicalCapability: 38,
        pastExperience: 24,
        methodologyWorkplan: 19,
        keyPersonnel: 14
      },
      flagType: 'NONE',
      remarks: 'Exemplary technical architecture with high indigenous IP.'
    },
    merkleRoot: '0x7b8f9a01c2945df8812456ae3290fe19823467ab908123479b0e1f42a188bc99',
    signature: 'MEQCIG7X9W...DSC_X509_PKCS11_8941_9F2B81',
    verified: true
  }
];