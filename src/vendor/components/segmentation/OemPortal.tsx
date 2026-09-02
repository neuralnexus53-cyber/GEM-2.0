import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  FileBadge, 
  Layers, 
  Plus, 
  ExternalLink,
  Package,
  Award,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Check,
  FileText,
  UserCheck
} from 'lucide-react';
import { VendorProfile } from '../../types';

interface OemPortalProps {
  profile: VendorProfile;
}

interface ProductSKU {
  id: string;
  modelNumber: string;
  productName: string;
  category: string;
  gemCategory: string;
  bisStandard: string;
  localContentPct: number;
  oemAuthStatus: 'VALID' | 'PENDING' | 'RENEWAL_REQUIRED';
  stockReadinessDays: number;
}

export const OemPortal: React.FC<OemPortalProps> = ({ profile }) => {
  const [skus, setSkus] = useState<ProductSKU[]>([
    {
      id: 'SKU-01',
      modelNumber: 'APX-PDU-32A-01',
      productName: 'ApexPower Intelligent 3-Phase PDU with Remote SNMP Monitoring',
      category: 'Power Distribution',
      gemCategory: 'Power Distribution Units (PDU) - Version 2.0',
      bisStandard: 'IS-16221 : Part 2',
      localContentPct: 76.5,
      oemAuthStatus: 'VALID',
      stockReadinessDays: 7
    },
    {
      id: 'SKU-02',
      modelNumber: 'APX-UPS-10KVA-IND',
      productName: 'ApexPower Heavy Duty Online Double Conversion UPS 10kVA',
      category: 'Power Backup & Storage',
      gemCategory: 'Uninterruptible Power Supply (UPS) Systems',
      bisStandard: 'IS-16242 (Part 1)',
      localContentPct: 68.2,
      oemAuthStatus: 'VALID',
      stockReadinessDays: 14
    },
    {
      id: 'SKU-03',
      modelNumber: 'APX-IOT-GW-4G',
      productName: 'ApexSense Industrial Telemetry Gateway with Dual SIM Fallback',
      category: 'IoT & Telemetry',
      gemCategory: 'Telemetry & Supervisory Control Systems',
      bisStandard: 'TEC / RoHS Compliant',
      localContentPct: 82.0,
      oemAuthStatus: 'VALID',
      stockReadinessDays: 3
    }
  ]);

  const [activeTab, setActiveTab] = useState<'CATALOG' | 'MAF' | 'MII_WORKSHEET'>('CATALOG');

  // Manufacturer Authorization Form (MAF) State
  const [mafState, setMafState] = useState({
    resellerName: 'InfraTech Solutions Pvt Ltd',
    resellerGstin: '07AAACI8921K1ZN',
    tenderBidNumber: 'GEM/2026/B/891024',
    productModel: 'APX-PDU-32A-01',
    warrantyYears: 3,
    validUntil: '31-Dec-2026'
  });

  const [miiCalculator, setMiiCalculator] = useState({
    domesticMaterialCost: 32000,
    domesticLaborCost: 8500,
    domesticOverheadCost: 4500,
    importedComponentsCost: 11000
  });

  const [showAddSku, setShowAddSku] = useState(false);
  const [newSku, setNewSku] = useState({
    modelNumber: '',
    productName: '',
    category: 'Power Systems',
    gemCategory: 'General GeM Catalog',
    bisStandard: 'IS 16221',
    localContentPct: 70,
    stockReadinessDays: 5
  });

  // Calculate MII Local Content %
  const totalDomestic = miiCalculator.domesticMaterialCost + miiCalculator.domesticLaborCost + miiCalculator.domesticOverheadCost;
  const totalCost = totalDomestic + miiCalculator.importedComponentsCost;
  const calculatedLocalContent = totalCost > 0 ? ((totalDomestic / totalCost) * 100).toFixed(1) : '0';

  const handleAddSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku.modelNumber || !newSku.productName) return;

    const sku: ProductSKU = {
      id: `SKU-0${skus.length + 1}`,
      modelNumber: newSku.modelNumber,
      productName: newSku.productName,
      category: newSku.category,
      gemCategory: newSku.gemCategory,
      bisStandard: newSku.bisStandard,
      localContentPct: Number(newSku.localContentPct),
      oemAuthStatus: 'VALID',
      stockReadinessDays: Number(newSku.stockReadinessDays)
    };

    setSkus([...skus, sku]);
    setShowAddSku(false);
    setNewSku({
      modelNumber: '',
      productName: '',
      category: 'Power Systems',
      gemCategory: 'General GeM Catalog',
      bisStandard: 'IS 16221',
      localContentPct: 70,
      stockReadinessDays: 5
    });
  };

  const handleDownloadMaf = () => {
    const textContent = `MANUFACTURER AUTHORIZATION FORM (MAF)
(To be submitted in Bidder's Technical Docket on OEM Letterhead)
Ref No: OEM/MAF/${Date.now().toString().slice(-6)}
Date: ${new Date().toLocaleDateString('en-IN')}

To:
The Tender Inviting Authority (TIA),
Government of India / GeM SPV

Subject: Manufacturer Authorization for Tender Ref No: ${mafState.tenderBidNumber}

Dear Sir/Madam,

We, ${profile.name}, who are established and reputable Original Equipment Manufacturers (OEM) of ${profile.brandName || 'ApexPower™'} products, having manufacturing facilities located at Industrial Area, Phase-II, New Delhi-110020,

Do hereby authorize:
Authorized Reseller / Bidder: ${mafState.resellerName}
GSTIN: ${mafState.resellerGstin}

To submit a bid, negotiate and conclude the contract with you against Tender No. ${mafState.tenderBidNumber} for the supply of:
- Product Model: ${mafState.productModel}

We hereby extend our full OEM warranty and guarantee as per General Financial Rules (GFR) 2017 for a period of ${mafState.warrantyYears} Years from the date of final commissioning and supply of genuine spare parts for minimum 5 years.

Yours faithfully,
For and on behalf of ${profile.name}

(Authorized Signatory & Official Seal)
Designation: Head of Public Procurement & GeM Affairs`;

    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `OEM_MAF_${mafState.tenderBidNumber.replace(/\//g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-4">
      
      <div className="gov-card gov-card-navy p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-[#00244D] border border-[#1E3A68] text-cyan-400 mt-0.5">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-100">
                OEM Manufacturer Desk & Brand Catalog Registry
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
                Brand Registered on GeM
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Manage GeM product catalog SKUs, issue Manufacturer Authorization Forms (MAF) to resellers, and generate statutory Make-in-India (MII) local content certificates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddSku(!showAddSku)}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddSku ? 'Close Form' : 'Register New GeM SKU'}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#051124] border border-[#1E3A68] rounded p-2.5 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1E3A68] text-xs">
        <div className="px-3 py-1 flex items-center justify-between">
          <span className="text-slate-400">Registered Brand:</span>
          <span className="font-bold text-slate-200">{profile.brandName || 'ApexPower™'} (TM Verified)</span>
        </div>
        <div className="px-3 py-1 flex items-center justify-between">
          <span className="text-slate-400">Accreditations:</span>
          <span className="font-mono text-cyan-300">BIS IS-16221 &bull; ISO 9001:2015</span>
        </div>
        <div className="px-3 py-1 flex items-center justify-between">
          <span className="text-slate-400">MII Status:</span>
          <span className="font-mono text-amber-300 font-bold">{profile.miiPercentage}% (Class-I Local)</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-b border-[#1E3A68] pb-2">
        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
            activeTab === 'CATALOG'
              ? 'bg-[#002855] text-white border-[#0284C7]'
              : 'bg-[#08172D] text-slate-400 border-[#1E3A68] hover:bg-[#0E203B] hover:text-slate-200'
          }`}
        >
          1. GeM Catalog & Product SKUs ({skus.length})
        </button>

        <button
          onClick={() => setActiveTab('MAF')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
            activeTab === 'MAF'
              ? 'bg-[#002855] text-white border-[#0284C7]'
              : 'bg-[#08172D] text-slate-400 border-[#1E3A68] hover:bg-[#0E203B] hover:text-slate-200'
          }`}
        >
          2. Manufacturer Authorization (MAF) Generator
        </button>

        <button
          onClick={() => setActiveTab('MII_WORKSHEET')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
            activeTab === 'MII_WORKSHEET'
              ? 'bg-[#002855] text-white border-[#0284C7]'
              : 'bg-[#08172D] text-slate-400 border-[#1E3A68] hover:bg-[#0E203B] hover:text-slate-200'
          }`}
        >
          3. PPP-MII Local Content Worksheet
        </button>
      </div>

      {activeTab === 'CATALOG' && (
        <div className="space-y-4">
          
          {showAddSku && (
            <form onSubmit={handleAddSku} className="gov-card p-4 space-y-3 bg-[#001D3D] border-[#0284C7]">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E3A68]">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                  Official GeM Product Ingestion Form (Form G-04)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">All fields are mandatory</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Model / Part Number *</label>
                  <input
                    type="text"
                    value={newSku.modelNumber}
                    onChange={e => setNewSku({ ...newSku, modelNumber: e.target.value })}
                    placeholder="e.g. APX-PDU-64A"
                    required
                    className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Product Description *</label>
                  <input
                    type="text"
                    value={newSku.productName}
                    onChange={e => setNewSku({ ...newSku, productName: e.target.value })}
                    placeholder="e.g. ApexPower 64A Modular Rack PDU"
                    required
                    className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">GeM Catalog Category *</label>
                  <input
                    type="text"
                    value={newSku.gemCategory}
                    onChange={e => setNewSku({ ...newSku, gemCategory: e.target.value })}
                    required
                    className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">BIS Standard Reference *</label>
                  <input
                    type="text"
                    value={newSku.bisStandard}
                    onChange={e => setNewSku({ ...newSku, bisStandard: e.target.value })}
                    required
                    className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Local Content (%) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newSku.localContentPct}
                    onChange={e => setNewSku({ ...newSku, localContentPct: Number(e.target.value) })}
                    required
                    className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Delivery Lead Time (Days) *</label>
                  <input
                    type="number"
                    min="1"
                    value={newSku.stockReadinessDays}
                    onChange={e => setNewSku({ ...newSku, stockReadinessDays: Number(e.target.value) })}
                    required
                    className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono focus:border-[#0284C7] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSku(false)}
                  className="px-3 py-1.5 rounded bg-[#08172D] text-slate-300 border border-[#1E3A68] text-xs hover:bg-[#0E203B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-xs"
                >
                  Submit to GeM Catalog Registry
                </button>
              </div>
            </form>
          )}

          <div className="gov-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Verified Product Catalog & GeM SKU Registry ({skus.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Authority: GeM SPV Catalog Admin
              </span>
            </div>

            <div className="overflow-x-auto rounded border border-[#1E3A68]">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th className="w-20">SKU Code</th>
                    <th>Model / Part No.</th>
                    <th>Product Description</th>
                    <th>GeM Category</th>
                    <th>BIS Standard</th>
                    <th className="text-center">Local Content</th>
                    <th className="text-center">Lead Time</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {skus.map(sku => (
                    <tr key={sku.id}>
                      <td className="font-mono font-bold text-amber-400 bg-[#001833]">{sku.id}</td>
                      <td className="font-mono text-slate-200 font-semibold">{sku.modelNumber}</td>
                      <td className="text-slate-200">{sku.productName}</td>
                      <td className="text-slate-300">{sku.gemCategory}</td>
                      <td className="font-mono text-[11px] text-cyan-300">{sku.bisStandard}</td>
                      <td className="text-center font-mono font-bold text-emerald-400">{sku.localContentPct}%</td>
                      <td className="text-center font-mono text-slate-300">{sku.stockReadinessDays} Days</td>
                      <td className="text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold text-[10px] border border-[#15803D]">
                          <Check className="w-2.5 h-2.5" />
                          {sku.oemAuthStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MAF' && (
        <div className="gov-card p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E3A68]">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Issue Manufacturer Authorization Form (MAF) to Bidding Reseller</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Official OEM Authorization Certificate required by GeM & CPPP for non-OEM bidders.
              </p>
            </div>
            <button
              onClick={handleDownloadMaf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E65100] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Signed MAF (.TXT)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Authorized Reseller / Bidder Name *</label>
              <input
                type="text"
                value={mafState.resellerName}
                onChange={e => setMafState({ ...mafState, resellerName: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Reseller GSTIN *</label>
              <input
                type="text"
                value={mafState.resellerGstin}
                onChange={e => setMafState({ ...mafState, resellerGstin: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">GeM / Tender Bid Number *</label>
              <input
                type="text"
                value={mafState.tenderBidNumber}
                onChange={e => setMafState({ ...mafState, tenderBidNumber: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-amber-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Authorized Product SKU / Model *</label>
              <select
                value={mafState.productModel}
                onChange={e => setMafState({ ...mafState, productModel: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-200"
              >
                {skus.map(s => (
                  <option key={s.id} value={s.modelNumber}>{s.modelNumber} ({s.productName})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">OEM Warranty Period (Years) *</label>
              <input
                type="number"
                value={mafState.warrantyYears}
                onChange={e => setMafState({ ...mafState, warrantyYears: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Authorization Validity Date *</label>
              <input
                type="text"
                value={mafState.validUntil}
                onChange={e => setMafState({ ...mafState, validUntil: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-[#051124] rounded border border-[#1E3A68] text-xs text-slate-300 font-mono space-y-1">
            <div className="text-amber-400 font-bold text-[11px]">Preview of Formatted MAF Undertaking:</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              "We, {profile.name}, hereby confirm that {mafState.resellerName} (GSTIN: {mafState.resellerGstin}) is our authorized partner to quote our Model {mafState.productModel} against Tender No. {mafState.tenderBidNumber}. Full {mafState.warrantyYears}-year OEM warranty & spare support guaranteed."
            </p>
          </div>
        </div>
      )}

      {activeTab === 'MII_WORKSHEET' && (
        <div className="gov-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E3A68]">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                PPP-MII Local Content Calculation Worksheet (Rule 5 of PPP-MII Order 2017)
              </h3>
              <p className="text-[11px] text-slate-400">
                Formula: Local Content % = (Total Domestic Cost / Total Production Cost) &times; 100
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Calculated Local Content</span>
              <span className="text-base font-bold font-mono text-amber-300">{calculatedLocalContent}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Domestic Material (INR)</label>
              <input
                type="number"
                value={miiCalculator.domesticMaterialCost}
                onChange={e => setMiiCalculator({ ...miiCalculator, domesticMaterialCost: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Domestic Labor (INR)</label>
              <input
                type="number"
                value={miiCalculator.domesticLaborCost}
                onChange={e => setMiiCalculator({ ...miiCalculator, domesticLaborCost: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Domestic Overheads (INR)</label>
              <input
                type="number"
                value={miiCalculator.domesticOverheadCost}
                onChange={e => setMiiCalculator({ ...miiCalculator, domesticOverheadCost: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Imported Components (INR)</label>
              <input
                type="number"
                value={miiCalculator.importedComponentsCost}
                onChange={e => setMiiCalculator({ ...miiCalculator, importedComponentsCost: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-[#1E3A68]">
            <span>Classification: <strong className="text-emerald-400">{Number(calculatedLocalContent) >= 50 ? 'Class-I Local Supplier (>= 50%)' : 'Class-II Local Supplier (20% - 49%)'}</strong></span>
            <button
              onClick={() => alert(`Statutory MII Self-Declaration certificate generated for ${calculatedLocalContent}% Local Content.`)}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generate Statutory MII Self-Declaration</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};