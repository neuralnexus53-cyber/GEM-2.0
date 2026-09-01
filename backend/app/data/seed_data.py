from typing import Dict, List, Any

# Vendor Profiles
PROFILES_DB: Dict[str, Dict[str, Any]] = {
    "OEM_SELLER": {
        "id": "VEND-OEM-8902",
        "name": "Apex Dynamics & Energy Systems Ltd.",
        "role": "OEM_SELLER",
        "gstin": "07AAACA4952J1ZM",
        "pan": "AAACA4952J",
        "turnoverCr": 48.5,
        "experienceYears": 9,
        "brandName": "ApexPower™",
        "oemCertifications": ["BIS IS-16221", "ISO 9001:2015", "CE Certified", "BEE 5-Star Rating", "RoHS Compliant"],
        "miiPercentage": 74,
        "complianceScore": 96,
        "verifiedDocsCount": 14,
        "totalDocsCount": 14
    },
    "MSME_STARTUP": {
        "id": "VEND-MSME-3412",
        "name": "Novavolt Instruments & Automation Pvt Ltd",
        "role": "MSME_STARTUP",
        "gstin": "27AABCN8712P1ZL",
        "pan": "AABCN8712P",
        "turnoverCr": 4.2,
        "experienceYears": 3,
        "udyamNumber": "UDYAM-MH-03-0098412",
        "dpiitRegistered": True,
        "brandName": "NovaSense™",
        "oemCertifications": ["ISO 9001:2015", "DPIIT Startup India ID: DIPP98214"],
        "miiPercentage": 88,
        "complianceScore": 92,
        "verifiedDocsCount": 11,
        "totalDocsCount": 12
    },
    "WORKS_CONTRACTOR": {
        "id": "VEND-WORKS-7105",
        "name": "Bharat Infra-Tech & EPC Solutions",
        "role": "WORKS_CONTRACTOR",
        "gstin": "29AAGCB5541Q1ZP",
        "pan": "AAGCB5541Q",
        "turnoverCr": 32.8,
        "experienceYears": 12,
        "contractorClass": "Class-1 Super (Unlimited EPC)",
        "oemCertifications": ["ISO 14001", "OHSAS 18001 Safety", "CPWD Class-1 Enlistment", "NHAI Pre-Qualified"],
        "miiPercentage": 92,
        "complianceScore": 89,
        "verifiedDocsCount": 18,
        "totalDocsCount": 20
    }
}

# OCR Ingested Documents
DOCUMENTS_DB: List[Dict[str, Any]] = [
    {
        "id": "DOC-001",
        "vendorId": "VEND-OEM-8902",
        "vendor_id": "VEND-OEM-8902",
        "name": "GSTIN Registration & 3B Filing 2025-26",
        "type": "GSTIN",
        "fileName": "GST_Certificate_Apex_07AAACA.pdf",
        "uploadDate": "2026-08-15",
        "fileSize": "1.8 MB",
        "status": "VERIFIED",
        "confidence": 99.4,
        "extractedFields": [
            { "label": "Legal Name", "value": "Apex Dynamics & Energy Systems Ltd.", "confidence": 99.8, "verified": True },
            { "label": "GSTIN Number", "value": "07AAACA4952J1ZM", "confidence": 99.9, "verified": True },
            { "label": "State & Jurisdiction", "value": "Delhi - Ward 42", "confidence": 98.7, "verified": True },
            { "label": "Taxpayer Type", "value": "Regular / Active", "confidence": 99.2, "verified": True },
            { "label": "Filing Status", "value": "Up-to-date (GSTR-3B filed July 2026)", "confidence": 99.1, "verified": True }
        ],
        "highlightText": "GSTIN 07AAACA4952J1ZM verified against GST Portal API sandbox.",
        "parsedSummary": "Valid active GST registration certificate. No overdue tax compliance flags."
    },
    {
        "id": "DOC-002",
        "vendorId": "VEND-OEM-8902",
        "vendor_id": "VEND-OEM-8902",
        "name": "CA Audited Balance Sheet & Financial Turnover (FY 23-26)",
        "type": "TURNOVER_CA",
        "fileName": "CA_Audited_Turnover_Certificate_UDIN.pdf",
        "uploadDate": "2026-08-18",
        "fileSize": "3.4 MB",
        "status": "VERIFIED",
        "confidence": 98.1,
        "extractedFields": [
            { "label": "CA Firm Name", "value": "R. K. Singhal & Associates (FRN: 014298N)", "confidence": 98.6, "verified": True },
            { "label": "CA UDIN Number", "value": "26049521BKJLP8912", "confidence": 99.7, "verified": True },
            { "label": "Average Annual Turnover (3 Yrs)", "value": "₹ 48.50 Crores", "confidence": 98.9, "verified": True },
            { "label": "Net Worth (FY 25-26)", "value": "₹ 19.80 Crores (Positive)", "confidence": 97.4, "verified": True },
            { "label": "Working Capital Ratio", "value": "2.14", "confidence": 96.2, "verified": True }
        ],
        "highlightText": "Average 3-year turnover exceeds standard high-value PQC requirements.",
        "parsedSummary": "CA certificate validated with active UDIN verification against ICAI portal."
    },
    {
        "id": "DOC-003",
        "vendorId": "VEND-MSME-3412",
        "vendor_id": "VEND-MSME-3412",
        "name": "Udyam Registration Certificate (MSME)",
        "type": "UDYAM",
        "fileName": "Udyam_Registration_Novavolt_MH03.pdf",
        "uploadDate": "2026-08-20",
        "fileSize": "1.2 MB",
        "status": "VERIFIED",
        "confidence": 99.6,
        "extractedFields": [
            { "label": "Enterprise Type", "value": "Small Enterprise (Manufacturing & R&D)", "confidence": 99.9, "verified": True },
            { "label": "Udyam Registration No.", "value": "UDYAM-MH-03-0098412", "confidence": 99.8, "verified": True },
            { "label": "Major Activity", "value": "NIC 2651 - Precision Measurement & Sensors", "confidence": 98.5, "verified": True },
            { "label": "DPIIT Startup ID", "value": "DIPP98214 (Recognized Valid till 2030)", "confidence": 99.4, "verified": True },
            { "label": "Govt Preference Eligibility", "value": "EMD Waiver + Prior Exp Relaxation Eligible", "confidence": 99.5, "verified": True }
        ],
        "highlightText": "Full exemption eligible for Earnest Money Deposit (EMD) and Tender Fee on all Central/State tenders.",
        "parsedSummary": "Verified Udyam + DPIIT credentials with 100% entitlement to Public Procurement Policy benefits."
    },
    {
        "id": "DOC-004",
        "vendorId": "VEND-WORKS-7105",
        "vendor_id": "VEND-WORKS-7105",
        "name": "PQC Past Work Completion Certificate (Metro Rail Project)",
        "type": "PQC_EXPERIENCE",
        "fileName": "DMRC_Phase4_SCADA_Work_Completion.pdf",
        "uploadDate": "2026-08-22",
        "fileSize": "4.1 MB",
        "status": "VERIFIED",
        "confidence": 96.8,
        "extractedFields": [
            { "label": "Client / Issuing Authority", "value": "Delhi Metro Rail Corporation (DMRC)", "confidence": 97.5, "verified": True },
            { "label": "Work Order Value", "value": "₹ 21.40 Crores", "confidence": 98.2, "verified": True },
            { "label": "Scope of Work", "value": "Design, Supply, Testing & Commissioning of Telemetry Systems", "confidence": 96.1, "verified": True },
            { "label": "Execution Period", "value": "24 Months (Completed without LD / Penalties)", "confidence": 95.8, "verified": True },
            { "label": "Performance Rating", "value": "Satisfactory / Grade A+", "confidence": 98.0, "verified": True }
        ],
        "highlightText": "Qualifies as 1 single work of >= 40% value for tenders up to ₹53.5 Crores.",
        "parsedSummary": "Institutional government client completion certificate parsed and indexed for automatic PQC scoring."
    }
]

# Live Government Tenders
TENDERS_DB: List[Dict[str, Any]] = [
    {
        "id": "TNDR-2026-8819",
        "tenderRefNumber": "GEM/2026/B/7719402",
        "title": "Supply, Installation & 5-Year AMC of High-Efficiency Smart Power Distribution Units & IoT Telemetry",
        "organization": "Ministry of Power / REC Power Distribution Co.",
        "portal": "GeM",
        "category": "Goods",
        "estimatedValueCr": 14.5,
        "emdAmountLakhs": 29.0,
        "submissionDeadline": "2026-09-15",
        "daysRemaining": 16,
        "aiMatchScore": 98,
        "suitableRoles": ["OEM_SELLER", "MSME_STARTUP"],
        "keyPqc": ["Annual Turnover >= ₹4.35 Cr (3 Yrs Avg)", "Similar Supply Experience >= ₹5.8 Cr", "BIS IS-16221 Certification", "MII Local Content >= 50%"],
        "location": "Pan-India (12 Regional Hubs)",
        "hasMsmePreference": True,
        "hasMiiPreference": True
    },
    {
        "id": "TNDR-2026-9042",
        "tenderRefNumber": "CPPP/2026/RAIL/SCADA/09",
        "title": "Comprehensive EPC Contract for Automated Track Inspection & Optical Sensor Network (Phase-III)",
        "organization": "Dedicated Freight Corridor Corp. (DFCCIL) / Indian Railways",
        "portal": "CPPP",
        "category": "Works",
        "estimatedValueCr": 38.2,
        "emdAmountLakhs": 76.4,
        "submissionDeadline": "2026-09-22",
        "daysRemaining": 23,
        "aiMatchScore": 94,
        "suitableRoles": ["WORKS_CONTRACTOR"],
        "keyPqc": ["Class-1 EPC Works Enlistment", "Past Single Railway/Metro Work >= ₹15.2 Cr", "Turnover >= ₹11.5 Cr", "Joint Venture Allowed up to 2 partners"],
        "location": "Western Corridor (Vadodara to JNPT)",
        "hasMsmePreference": False,
        "hasMiiPreference": True
    },
    {
        "id": "TNDR-2026-5120",
        "tenderRefNumber": "GEM/2026/B/8931201",
        "title": "Procurement of AI-Enabled Environmental Water Quality Monitoring Sensor Arrays & Cloud Telemetry",
        "organization": "National Mission for Clean Ganga (NMCG) / Ministry of Jal Shakti",
        "portal": "GeM",
        "category": "Goods",
        "estimatedValueCr": 5.8,
        "emdAmountLakhs": 11.6,
        "submissionDeadline": "2026-09-10",
        "daysRemaining": 11,
        "aiMatchScore": 96,
        "suitableRoles": ["MSME_STARTUP", "OEM_SELLER"],
        "keyPqc": ["DPIIT Startup or 1 Yr Prior Experience", "Udyam Exemption on EMD & Turnover", "CE/ISO Certified Sensor Probes"],
        "location": "Varanasi, Haridwar & Prayagraj",
        "hasMsmePreference": True,
        "hasMiiPreference": True
    },
    {
        "id": "TNDR-2026-3391",
        "tenderRefNumber": "STE/2026/PWD/BLD/441",
        "title": "Civil Construction, MEP Services, and Solar Rooftop Integration for District Multimodal Logistics Park",
        "organization": "State Infrastructure & Logistics Dev Corp",
        "portal": "State eProcurement",
        "category": "Works",
        "estimatedValueCr": 24.0,
        "emdAmountLakhs": 48.0,
        "submissionDeadline": "2026-09-18",
        "daysRemaining": 19,
        "aiMatchScore": 91,
        "suitableRoles": ["WORKS_CONTRACTOR"],
        "keyPqc": ["Civil Contractor Class-A", "Past similar logistics/industrial warehouse >= ₹9.6 Cr", "Valid GST and EPF/ESIC Registrations"],
        "location": "Bengaluru Rural Logistics Hub",
        "hasMsmePreference": False,
        "hasMiiPreference": True
    }
]

# Atlas Vector Contract Risk Clauses
CONTRACT_CLAUSES_DB: List[Dict[str, Any]] = [
    {
        "id": "RISK-01",
        "clauseNumber": "Clause 24.2.1",
        "clauseTitle": "Liquidated Damages (LD) & Delay Penalties",
        "category": "LIQUIDATED_DAMAGES",
        "riskLevel": "CRITICAL",
        "originalText": "If the contractor fails to deliver any or all of the Goods or perform Services within the period specified, the Buyer shall deduct Liquidated Damages @ 1.0% per week or part thereof of the entire contract value, subject to a maximum cap of 15.0% of total contract value. Deductions shall be irrevocable and without proof of actual damage.",
        "vectorSimilarity": 94.2,
        "riskExplanation": "Industry standard LD is capped at 0.5% per week up to a maximum of 10%. This clause imposes 1.0%/week with an elevated 15% cap and specifies deduction from entire contract price rather than delayed portion.",
        "recommendedMitigation": "Submit Pre-Bid Clarification Request: Propose amendment to standard GeM GTC clause 17.2: 'LD capped at 0.5% per week of delayed supplies only, subject to a maximum of 10%'.",
        "impactScore": 9
    },
    {
        "id": "RISK-02",
        "clauseNumber": "Clause 31.4",
        "clauseTitle": "Performance Bank Guarantee (PBG) Forfeiture & Unilateral Invocation",
        "category": "BG_FORFEITURE",
        "riskLevel": "HIGH",
        "originalText": "The Buyer reserves the unconditional right to encash and forfeit the Performance Security BG (10% of contract value) within 48 hours of issuing a default notice, without requirement of arbitration or prior concurrence from the vendor.",
        "vectorSimilarity": 91.5,
        "riskExplanation": "High risk of unilateral encashment before dispute adjudication. Lack of mandatory cure period (14-30 days) creates extreme cash-flow vulnerability.",
        "recommendedMitigation": "Request standard 21-day Cure Period clause: 'Buyer shall provide written 21-day notice with specific defect rectification requirements before invoking PBG'.",
        "impactScore": 8
    },
    {
        "id": "RISK-03",
        "clauseNumber": "Clause 18.7",
        "clauseTitle": "Price Variation & Raw Material Escalation (PVC)",
        "category": "PRICE_VARIATION",
        "riskLevel": "HIGH",
        "originalText": "The contract price shall remain firm, fixed, and non-negotiable for the entire 24-month duration. No claims for escalation on account of increase in raw material costs, silicon components, foreign exchange fluctuation, or statutory taxes shall be entertained.",
        "vectorSimilarity": 88.7,
        "riskExplanation": "Fixed-price exposure on multi-year delivery. With global electronic component price volatility (copper/semiconductors), this poses 8-12% margin erosion risk.",
        "recommendedMitigation": "Factor 6.5% contingency buffer in quoted BoQ rates, or request RBI Wholesale Price Index (WPI) linked PVC formula for periods exceeding 12 months.",
        "impactScore": 7
    },
    {
        "id": "RISK-04",
        "clauseNumber": "Clause 42.1",
        "clauseTitle": "Dispute Resolution & Sole Arbitrator Appointment",
        "category": "ARBITRATION",
        "riskLevel": "MEDIUM",
        "originalText": "All disputes shall be referred to the Sole Arbitrator nominated exclusively by the Chairman / Managing Director of the Buyer. The venue of arbitration shall be New Delhi, and expenses shall be borne entirely by the Contractor.",
        "vectorSimilarity": 86.4,
        "riskExplanation": "Unilateral appointment of arbitrator violates Section 12(5) of Indian Arbitration & Conciliation (Amendment) Act 2015 (Perkins Eastman judgement).",
        "recommendedMitigation": "Request mutual agreement on Arbitrator from an empaneled panel of retired judges or DIAC (Delhi International Arbitration Centre).",
        "impactScore": 6
    }
]

# BoQ Line Items
BOQ_ITEMS_DB: List[Dict[str, Any]] = [
    {
        "id": "BOQ-101",
        "itemCode": "ITEM-01",
        "description": "Smart Intelligent Power Distribution Unit (iPDU) 32A 3-Phase, RS-485 Modbus & SNMP v3",
        "unit": "Sets",
        "quantity": 450,
        "estimatedRate": 48000,
        "quotedRate": 43500,
        "gstRate": 18,
        "notes": "OEM direct manufacturing rate, inclusive of 3-year standard warranty."
    },
    {
        "id": "BOQ-102",
        "itemCode": "ITEM-02",
        "description": "Industrial IoT Edge Gateway with 4G/5G Dual SIM Fallback & MQTT Broker Telemetry",
        "unit": "Units",
        "quantity": 120,
        "estimatedRate": 32000,
        "quotedRate": 28200,
        "gstRate": 18,
        "notes": "DPIIT startup indigenous gateway with secure hardware crypto engine."
    },
    {
        "id": "BOQ-103",
        "itemCode": "ITEM-03",
        "description": "Substation Cabling, Cable Trays, Fire-Retardant Conduit Laying & Termination",
        "unit": "Mtrs",
        "quantity": 14500,
        "estimatedRate": 450,
        "quotedRate": 395,
        "gstRate": 18,
        "notes": "CPWD DSR 2025 aligned rate with certified FRLS copper cables."
    }
]

# Milestones
MILESTONES_DB: List[Dict[str, Any]] = [
    {
        "id": "MS-1",
        "milestoneName": "Milestone 1: Submission & Approval of Detailed Engineering Design (DED) & Factory FAT",
        "targetDays": 45,
        "weightagePercent": 15,
        "paymentPercent": 15,
        "retentionPercent": 5,
        "slaCriteria": "Design freeze within 45 days of LOA with zero pending major non-conformities.",
        "status": "COMPLETED"
    },
    {
        "id": "MS-2",
        "milestoneName": "Milestone 2: Supply of 50% Hardware & Delivery at Regional Distribution Hubs",
        "targetDays": 90,
        "weightagePercent": 35,
        "paymentPercent": 30,
        "retentionPercent": 5,
        "slaCriteria": "Material Inspection Clearance Certificate (MICC) issued by designated agency.",
        "status": "IN_PROGRESS"
    },
    {
        "id": "MS-3",
        "milestoneName": "Milestone 3: Site Installation, SCADA Telemetry Integration & Initial Testing",
        "targetDays": 150,
        "weightagePercent": 30,
        "paymentPercent": 30,
        "retentionPercent": 5,
        "slaCriteria": "100% telemetry packet receipt rate on Central Control Command Center.",
        "status": "PENDING"
    }
]

# Competitor Benchmarks
COMPETITOR_BIDS_DB: List[Dict[str, Any]] = [
    { "name": "Your Proposed Quote", "bidAmountCr": 12.82, "variancePercentage": -11.5, "rank": "L1", "marketShare": 32 },
    { "name": "Voltech Engineering Infra", "bidAmountCr": 13.15, "variancePercentage": -9.3, "rank": "L2", "marketShare": 28 },
    { "name": "Schneider Partner Consortium", "bidAmountCr": 13.90, "variancePercentage": -4.1, "rank": "L3", "marketShare": 20 },
    { "name": "L&T Smart World Division", "bidAmountCr": 14.45, "variancePercentage": -0.3, "rank": "L4", "marketShare": 12 },
    { "name": "ABB Grid Systems Ltd.", "bidAmountCr": 15.20, "variancePercentage": 4.8, "rank": "L5", "marketShare": 8 }
]

REGIONAL_DEMAND_DB: List[Dict[str, Any]] = [
    { "region": "Northern Region (Delhi-NCR, UP, Punjab)", "demandIndex": 1.18, "logisticsCostFactor": "Normal", "activeTendersCount": 42 },
    { "region": "Western Region (Maharashtra, Gujarat)", "demandIndex": 1.25, "logisticsCostFactor": "Low (Port Proximity)", "activeTendersCount": 56 },
    { "region": "Southern Region (TN, Karnataka, Telangana)", "demandIndex": 1.12, "logisticsCostFactor": "Moderate", "activeTendersCount": 38 },
    { "region": "Eastern & North-East Region", "demandIndex": 1.34, "logisticsCostFactor": "High (+8% Freight)", "activeTendersCount": 29 },
    { "region": "Central Region (MP, Chhattisgarh)", "demandIndex": 1.05, "logisticsCostFactor": "Moderate", "activeTendersCount": 19 }
]
