import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  Check, 
  Save, 
  Database,
  Layers,
  Award,
  UserCheck
} from 'lucide-react';
import { VendorProfile } from '../../types';
import { api } from '../../services/api';

interface VendorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: VendorProfile;
  onProfileUpdated: (updated: VendorProfile) => void;
}

export const VendorProfileModal: React.FC<VendorProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated
}) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    gstin: profile.gstin,
    pan: profile.pan,
    turnoverCr: profile.turnoverCr,
    experienceYears: profile.experienceYears,
    brandName: profile.brandName || '',
    miiPercentage: profile.miiPercentage,
    udyamNumber: profile.udyamNumber || '',
    contractorClass: profile.contractorClass || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateVendorProfile({
        name: formData.name,
        gstin: formData.gstin,
        pan: formData.pan,
        turnoverCr: Number(formData.turnoverCr),
        experienceYears: Number(formData.experienceYears),
        brandName: formData.brandName,
        miiPercentage: Number(formData.miiPercentage),
        udyamNumber: formData.udyamNumber,
        contractorClass: formData.contractorClass
      });
      onProfileUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0C1A30] border border-[#1E3A68] rounded-lg shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-[#1E3A68] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#001D3D] text-amber-300 border border-[#1E3A68]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Vendor Master Profile & GSTIN Credentials</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#052410] text-emerald-300 font-bold border border-[#15803D]">
                  FORM V-01
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Official enterprise records used for GFR 2017 Pre-Qualification & tender evaluation.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#002855] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">
                Registered Legal Enterprise Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 focus:border-[#0284C7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                GSTIN (15 Digits) *
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                required
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-amber-300 font-mono focus:border-[#0284C7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Permanent Account Number (PAN) *
              </label>
              <input
                type="text"
                value={formData.pan}
                onChange={e => setFormData({ ...formData, pan: e.target.value })}
                required
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono focus:border-[#0284C7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                3-Year Average Turnover (₹ Crores) *
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.turnoverCr}
                onChange={e => setFormData({ ...formData, turnoverCr: Number(e.target.value) })}
                required
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono focus:border-[#0284C7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Years of Business Experience *
              </label>
              <input
                type="number"
                value={formData.experienceYears}
                onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                required
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono focus:border-[#0284C7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Make in India Local Content (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.miiPercentage}
                onChange={e => setFormData({ ...formData, miiPercentage: Number(e.target.value) })}
                required
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono focus:border-[#0284C7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Udyam Registration Number (If MSE)
              </label>
              <input
                type="text"
                value={formData.udyamNumber}
                onChange={e => setFormData({ ...formData, udyamNumber: e.target.value })}
                placeholder="e.g. UDYAM-DL-03-0029104"
                className="w-full px-2.5 py-1.5 bg-[#051124] border border-[#1E3A68] rounded text-slate-100 font-mono focus:border-[#0284C7] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1E3A68]">
            <span className="text-[10px] text-slate-400 font-mono">
              Updates sync to Supabase Database
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-[#08172D] text-slate-300 border border-[#1E3A68] hover:bg-[#0E203B]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold shadow-xs disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Updating...' : saveSuccess ? 'Record Saved!' : 'Update Master Record'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};