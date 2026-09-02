import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  User, 
  Check, 
  Rocket, 
  HardHat,
  Upload,
  Camera,
  Landmark,
  MapPin,
  CreditCard
} from 'lucide-react';
import { AuthProvider, useAuth } from '../vendor/context/AuthContext';

const PRESET_AVATARS = [
  { label: 'Industrial Tech', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80' },
  { label: 'Green Energy', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=200&auto=format&fit=crop&q=80' },
  { label: 'Executive Director', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80' },
  { label: 'Infrastructure OEM', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&auto=format&fit=crop&q=80' }
];

function VendorRegisterForm() {
  const navigate = useNavigate();
  const { registerVendor } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80');

  // Form data
  const [formData, setFormData] = useState({
    businessName: '',
    authorizedSignatory: '',
    role: 'OEM_SELLER' as 'OEM_SELLER' | 'MSME_STARTUP' | 'WORKS_CONTRACTOR',
    gstin: '',
    pan: '',
    udyamNumber: '',
    dpiitRegistered: false,
    contractorClass: '',
    brandName: '',
    turnoverCr: '15.5',
    experienceYears: '5',
    miiPercentage: '75',
    contactEmail: '',
    contactPhone: '',
    address: 'Plot 42, Okhla Industrial Area Phase-III',
    state: 'Delhi',
    pincode: '110020',
    bankName: 'State Bank of India',
    bankAccount: '00003891024589',
    ifscCode: 'SBIN0001824',
    password: '',
    agreeTerms: true
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerVendor({
        companyName: formData.businessName,
        fullName: formData.authorizedSignatory || formData.businessName,
        email: formData.contactEmail,
        password: formData.password,
        role: formData.role,
        gstin: formData.gstin,
        pan: formData.pan,
        turnoverCr: parseFloat(formData.turnoverCr) || 5.0,
        experienceYears: parseInt(formData.experienceYears) || 3,
        udyamNumber: formData.udyamNumber,
        dpiitRegistered: formData.dpiitRegistered,
        contractorClass: formData.contractorClass,
        brandName: formData.brandName || formData.businessName.split(' ')[0] + '™',
        profilePhotoUrl: photoPreview,
        contactPhone: formData.contactPhone,
        authorizedSignatory: formData.authorizedSignatory,
        address: formData.address,
        state: formData.state,
        pincode: formData.pincode,
        bankName: formData.bankName,
        bankAccount: formData.bankAccount,
        ifscCode: formData.ifscCode,
        miiPercentage: parseInt(formData.miiPercentage) || 75
      });

      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/vendor');
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      navigate('/vendor');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)' }} />

      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline text-white">
          <img 
            src="./images/logoclone1.png" 
            alt="GeM Logo" 
            className="h-8 w-auto object-contain"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          <div>
            <span className="font-extrabold text-sm sm:text-base text-white tracking-tight block">
              GEM 2.0 COMPLIANCE PORTAL
            </span>
            <span className="text-[10px] text-amber-400 font-medium tracking-wider block">
              Vendor Statutory Registration Gateway
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link 
            to="/vendor/login" 
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
          >
            Already Registered? Login
          </Link>
          <Link 
            to="/" 
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 transition-colors"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          
          <div className="mb-8 text-center">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
              GeM 2.0 Compliance Onboarding
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Seller &amp; Bidder Registration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
              Automated verification with GSTN, Income Tax CBDT, MSME Udyam, and DPIIT Start-up registries.
            </p>

            <div className="flex items-center justify-center gap-4 mt-6">
              {[
                { num: 1, label: 'Role & Entity' },
                { num: 2, label: 'Statutory IDs' },
                { num: 3, label: 'MII & Security' }
              ].map(s => (
                <div key={s.num} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    step === s.num ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20' : 
                    step > s.num ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {step > s.num ? <Check size={14} /> : s.num}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-white' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                  {s.num < 3 && <div className="w-8 h-0.5 bg-slate-800 hidden sm:block" />}
                </div>
              ))}
            </div>
          </div>

          {success ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Registration Successful!</h2>
              <p className="text-sm text-slate-400 mb-6">
                Your statutory compliance profile has been created and verified. Redirecting to Vendor Dashboard...
              </p>
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Select Primary Vendor Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'OEM_SELLER', title: 'OEM Seller', desc: 'Original Equipment Manufacturer', icon: Building2 },
                        { id: 'MSME_STARTUP', title: 'MSME / Startup', desc: 'Micro, Small Enterprise or DPIIT', icon: Rocket },
                        { id: 'WORKS_CONTRACTOR', title: 'Works Contractor', desc: 'EPC, Infrastructure & Civil Works', icon: HardHat }
                      ].map(r => {
                        const Icon = r.icon;
                        const isSelected = formData.role === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, role: r.id as any }))}
                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg' 
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <Icon size={20} className={isSelected ? 'text-amber-400' : 'text-slate-500'} />
                            <div className="font-bold text-sm text-white mt-2">{r.title}</div>
                            <div className="text-[11px] text-slate-400 mt-1 leading-tight">{r.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Enterprise Logo / Signatory Profile Photo *
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative group">
                        <img 
                          src={photoPreview} 
                          alt="Preview" 
                          className="w-20 h-20 rounded-xl object-cover border-2 border-amber-500 shadow-md bg-slate-900"
                        />
                        <label className="absolute inset-0 bg-slate-950/70 rounded-xl flex flex-col items-center justify-center text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                          <Camera size={18} className="mb-1" />
                          <span>Change</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handlePhotoUpload} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          {PRESET_AVATARS.map((av, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPhotoPreview(av.url)}
                              className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                                photoPreview === av.url 
                                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                              }`}
                            >
                              {av.label}
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Upload your corporate seal, logo, or director photograph for GeM 2.0 digital verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Registered Business / Enterprise Name *
                      </label>
                      <input 
                        type="text"
                        name="businessName"
                        required
                        placeholder="e.g. Apex Dynamic Instruments & Power Ltd."
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Authorized Signatory Full Name *
                      </label>
                      <input 
                        type="text"
                        name="authorizedSignatory"
                        required
                        placeholder="e.g. Rajesh Kumar Sharma (Director)"
                        value={formData.authorizedSignatory}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Official Contact Email *
                      </label>
                      <input 
                        type="email"
                        name="contactEmail"
                        required
                        placeholder="compliance@enterprise.com"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Mobile Number (for OTP) *
                      </label>
                      <input 
                        type="tel"
                        name="contactPhone"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-none"
                    >
                      Continue to Statutory IDs <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        GSTIN Number (15 Digits) *
                      </label>
                      <input 
                        type="text"
                        name="gstin"
                        required
                        placeholder="e.g. 07AAACA4952J1ZM"
                        value={formData.gstin}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white uppercase focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <span className="text-[10px] text-emerald-400 mt-1 block">✓ Auto-checked with GSTN Network</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        PAN Card Number (10 Digits) *
                      </label>
                      <input 
                        type="text"
                        name="pan"
                        required
                        placeholder="e.g. AAACA4952J"
                        value={formData.pan}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white uppercase focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <span className="text-[10px] text-emerald-400 mt-1 block">✓ Auto-checked with CBDT Database</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        MSME Udyam Number (Optional for Large OEMs)
                      </label>
                      <input 
                        type="text"
                        name="udyamNumber"
                        placeholder="UDYAM-MH-03-0098412"
                        value={formData.udyamNumber}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Annual Turnover (₹ in Crores) *
                      </label>
                      <input 
                        type="number"
                        step="0.1"
                        name="turnoverCr"
                        required
                        value={formData.turnoverCr}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Relevant Experience (in Years) *
                      </label>
                      <input 
                        type="number"
                        name="experienceYears"
                        required
                        value={formData.experienceYears}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Brand / Trade Name
                      </label>
                      <input 
                        type="text"
                        name="brandName"
                        placeholder="e.g. ApexPower™"
                        value={formData.brandName}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <input 
                      type="checkbox"
                      id="dpiit"
                      name="dpiitRegistered"
                      checked={formData.dpiitRegistered}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="dpiit" className="text-xs text-slate-300 cursor-pointer">
                      Enterprise is recognized under <strong>DPIIT Startup India initiative</strong> (Exemption from Prior Experience & Turnover)
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer border-none"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-none"
                    >
                      Continue to Bank & Security <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Make-in-India (MII) Local Content Percentage (%) *
                    </label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        name="miiPercentage"
                        value={formData.miiPercentage}
                        onChange={handleChange}
                        className="flex-1 accent-amber-500 cursor-pointer"
                      />
                      <span className="font-extrabold text-lg text-amber-400 font-mono w-16 text-right">
                        {formData.miiPercentage}%
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {parseInt(formData.miiPercentage) >= 50 
                        ? '🟢 Qualifies as Class-I Local Supplier (>= 50% purchase preference)' 
                        : parseInt(formData.miiPercentage) >= 20 
                        ? '🟡 Qualifies as Class-II Local Supplier (20-50%)' 
                        : '🔴 Non-Local Supplier (< 20%)'}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <Landmark size={15} />
                      <span>Registered Banking & Settlement Vault</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Bank Name</label>
                        <input 
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleChange}
                          placeholder="State Bank of India"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Account Number</label>
                        <input 
                          type="text"
                          name="bankAccount"
                          value={formData.bankAccount}
                          onChange={handleChange}
                          placeholder="00003891024589"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">IFSC Code</label>
                        <input 
                          type="text"
                          name="ifscCode"
                          value={formData.ifscCode}
                          onChange={handleChange}
                          placeholder="SBIN0001824"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-slate-400 mb-1">Registered Enterprise Address</label>
                        <input 
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Plot 42, Okhla Industrial Area Phase-III"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">State / Pincode</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="Delhi"
                            className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                          />
                          <input 
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="110020"
                            className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Create Secure Portal Password *
                    </label>
                    <input 
                      type="password"
                      name="password"
                      required
                      placeholder="Minimum 8 characters with letters & numbers"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
                    />
                  </div>

                  <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <input 
                      type="checkbox"
                      id="terms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer mt-0.5"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-300 cursor-pointer">
                      I declare that all submitted GSTIN, PAN, Bank Details, and MII local content details are truthful and acknowledge that any discrepancy will trigger immediate blacklisting under GFR Rule 175.
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer border-none"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-none disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Verifying & Syncing with Supabase...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          <span>Complete Registration & Save</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>
      </main>

      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <span>GEM 2.0 COMPLIANCE PORTAL • Ministry of Commerce & Industry • Smart India Hackathon 2026</span>
      </footer>

    </div>
  );
}

export default function VendorRegisterPage() {
  return (
    <AuthProvider>
      <VendorRegisterForm />
    </AuthProvider>
  );
}