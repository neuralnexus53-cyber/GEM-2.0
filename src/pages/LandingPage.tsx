import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NOTICES = [
  { tag: 'NOTICE', desc: 'GeM 2.0 portal maintenance scheduled for this Sunday from 2:00 AM to 6:00 AM IST.' },
  { tag: 'UPDATE', desc: 'New automated AI compliance verification guidelines active for all tenders under GFR Rule 144.' },
  { tag: 'ALERT',  desc: 'Class-I and Class-II local suppliers must upload Make-in-India self-declaration with audited local content.' },
  { tag: 'MSME',   desc: 'Udyam registration renewal & annual return filing compliance check enabled for FY 2025-26.' }
];

const BANNERS = [
  './images/banner1.jpg',
  './images/banner2.jpg',
  './images/banner3.jpg'
];

export default function LandingPage() {
  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Notice ticker state
  const [noticeIdx, setNoticeIdx] = useState(0);

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Live Stats Drawer state
  const [statsOpen, setStatsOpen] = useState(false);

  // About GeM Public Procurement Details Modal
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [aboutModalTab, setAboutModalTab] = useState<'overview' | 'gfr_rules' | 'procurement_modes' | 'msme_mii' | 'gem2_engine'>('overview');

  // Backend API status
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Search input
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-rotate notices
  useEffect(() => {
    const id = setInterval(() => {
      setNoticeIdx(i => (i + 1) % NOTICES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Auto-advance hero carousel
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide(s => (s + 1) % BANNERS.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  // Backend telemetry check
  useEffect(() => {
    const apiBase = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://127.0.0.1:8000';
    const check = async () => {
      try {
        const r = await fetch(`${apiBase}/`, { signal: AbortSignal.timeout(3000) });
        setApiStatus(r.ok ? 'online' : 'offline');
      } catch {
        setApiStatus('offline');
      }
    };
    check();
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, []);

  const currentNotice = NOTICES[noticeIdx];

  return (
    <div className="bg-gray-100 font-sans text-slate-800 relative min-h-screen">

      <div 
        className={`fixed top-0 left-0 w-full bg-slate-950/95 backdrop-blur-lg z-50 transition-transform duration-500 ease-in-out text-white shadow-2xl border-b border-slate-800 ${
          drawerOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-10 relative flex flex-col items-center">
          
          <button 
            onClick={() => setDrawerOpen(false)} 
            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent focus:outline-none"
            aria-label="Close Drawer"
          >
            <i className="fa-solid fa-xmark text-3xl" />
          </button>
          
          <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">Government of India • Ministry of Commerce & Industry</div>
          <h3 className="text-xl font-bold text-white mb-6">GeM 2.0 Compliance Portal Navigation</h3>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 text-center max-w-4xl">
            <Link to="/" onClick={() => setDrawerOpen(false)} className="hover:text-amber-400 transition-colors text-sm font-bold">Home</Link>
            <Link to="/vendor/login" onClick={() => setDrawerOpen(false)} className="hover:text-amber-400 transition-colors text-sm font-bold text-amber-400">Vendor Login</Link>
            <Link to="/vendor/register" onClick={() => setDrawerOpen(false)} className="hover:text-amber-400 transition-colors text-sm font-bold text-amber-400">Vendor Registration</Link>
            <Link to="/gov/login" onClick={() => setDrawerOpen(false)} className="hover:text-blue-400 transition-colors text-sm font-bold text-blue-400">Procurement Officer Portal</Link>
            <a href="#about" onClick={() => setDrawerOpen(false)} className="hover:text-amber-400 transition-colors text-sm font-bold">About Us</a>
            <a href="#gem2" onClick={() => setDrawerOpen(false)} className="hover:text-amber-400 transition-colors text-sm font-bold">GeM 2.0 Compliance Engine</a>
            <a href="#initiatives" onClick={() => setDrawerOpen(false)} className="hover:text-amber-400 transition-colors text-sm font-bold">Our Initiatives</a>
            <a href="#statistics" onClick={() => setDrawerOpen(false)} className="hover:text-amber-400 transition-colors text-sm font-bold">Live Statistics</a>
            <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors text-sm font-bold">API Documentation</a>
          </div>
        </div>
      </div>

      <header className="bg-slate-900 text-white w-full sticky top-0 z-40 shadow-lg">
        
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)' }} />

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 relative">
          
          <div className="flex items-center gap-3 shrink-0 z-10">
            <button 
              onClick={() => setDrawerOpen(true)}
              className="p-1.5 text-white hover:text-amber-400 focus:outline-none cursor-pointer border-none bg-transparent flex items-center gap-2" 
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-slate-300">Menu</span>
            </button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center justify-center z-0">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="./images/logoclone1.png" 
                alt="GeM Logo" 
                className="h-8 sm:h-10 w-auto object-contain"
                onError={(e) => {
                  // Fallback text if image loading fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-tight">
                  GEM 2.0 COMPLIANCE PORTAL
                </span>
                <span className="text-[10px] text-amber-400 font-medium tracking-wider">
                  Automated Bidder Compliance & Verification Suite
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-6 z-10">
            <form 
              onSubmit={(e) => { e.preventDefault(); alert(`Searching GeM 2.0 for: "${searchQuery}"`); }}
              className="flex items-center bg-white rounded-full overflow-hidden shadow-md h-9 w-full"
            >
              <input 
                type="text" 
                placeholder="Search Tenders, Bidder Compliance, PQC Rules..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-2 text-gray-800 text-xs focus:outline-none placeholder:text-gray-400" 
              />
              <button 
                type="submit" 
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-5 h-full flex items-center justify-center transition shrink-0 border-none cursor-pointer"
                aria-label="Search"
              >
                <span className="text-xs uppercase tracking-wide">Search</span>
              </button>
            </form>
          </div>

          <div className="flex items-center gap-3 z-10">
            <nav className="hidden md:flex items-center space-x-2 text-xs font-semibold text-slate-200">
              <Link 
                to="/vendor/login" 
                className="hover:text-amber-400 transition-colors px-2 py-1 rounded"
              >
                Vendor Login
              </Link>
              <Link 
                to="/vendor/register" 
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-3 py-1.5 rounded-full transition-colors"
              >
                Vendor Registration
              </Link>
              <Link 
                to="/gov/login" 
                className="hover:text-blue-400 transition-colors px-2 py-1 rounded"
              >
                Officer Login
              </Link>
              <Link 
                to="/gov/register" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <i className="fa-solid fa-building-columns text-[10px]" />
                Officer Registration
              </Link>
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <Link to="/vendor/register" className="bg-amber-500 text-slate-900 font-bold px-2.5 py-1 rounded-full text-xs">Vendor</Link>
              <Link to="/gov/register" className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded-full text-xs">Officer</Link>
            </div>
          </div>

        </div>

        <div className="bg-slate-950 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-200 uppercase">
            <div className="flex items-center space-x-6 overflow-x-auto py-1">
              <Link to="/" className="hover:text-amber-400 transition-colors text-amber-400">Home</Link>
              <a href="#about" className="hover:text-amber-400 transition-colors">About Us</a>
              <a href="#gem2" className="hover:text-amber-400 transition-colors">GeM 2.0 Platform</a>
              <a href="#initiatives" className="hover:text-amber-400 transition-colors">Our Initiatives</a>
              <a href="#portals" className="hover:text-amber-400 transition-colors">Portals Gateway</a>
              <a href="#statistics" className="hover:text-amber-400 transition-colors">Statistics</a>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-slate-400 text-[10px] lowercase">
              <i className="fa-solid fa-bolt text-amber-400" />
              <span>automated 14-point compliance engine active</span>
            </div>
          </div>
        </div>

        <section className="bg-slate-950 py-1.5 px-4 w-full border-t border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center overflow-hidden text-xs">
            <div className="inline-flex items-center gap-3 whitespace-nowrap">
              <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded uppercase shrink-0">
                {currentNotice.tag}
              </span>
              <span className="text-slate-300 shrink-0 text-xs">
                {currentNotice.desc}
              </span>
              <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="text-amber-400 underline ml-4 hover:text-amber-300 text-[11px]">
                API Telemetry Docs →
              </a>
            </div>
          </div>
        </section>

      </header>

      <section className="relative w-full overflow-hidden bg-slate-900 group h-[300px] sm:h-[400px] md:h-[500px] lg:h-[calc(100vh-180px)] min-h-[420px]">
        
        <div 
          className="relative w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {BANNERS.map((bannerSrc, idx) => (
            <div key={idx} className="w-full min-w-full h-full flex-shrink-0 relative">
              <img 
                src={bannerSrc} 
                alt={`GeM Hero Banner ${idx + 1}`} 
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  // Fallback gradient if banner image not found
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
                  <div className="max-w-xl">
                    <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block">
                      Smart India Hackathon 2026
                    </span>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md">
                      GEM 2.0 COMPLIANCE PORTAL
                    </h1>
                    <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed mb-6 drop-shadow">
                      Automated 14-point AI verification across 7+ Government Portals, GSTN, CBDT, MSME Udyam, MII Local Content, and CAG Cryptographic Merkle Ledger.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link 
                        to="/vendor/register" 
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 flex items-center gap-2"
                      >
                        <i className="fa-solid fa-user-plus" /> Vendor Registration
                      </Link>
                      <Link 
                        to="/gov/register" 
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 flex items-center gap-2"
                      >
                        <i className="fa-solid fa-building-columns" /> Officer Registration
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setCurrentSlide(s => (s - 1 + BANNERS.length) % BANNERS.length)}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-11 h-11 cursor-pointer transition focus:outline-none z-30 flex items-center justify-center border-none"
          aria-label="Previous Slide"
        >
          <i className="fa-solid fa-chevron-left text-lg" />
        </button>
        <button 
          onClick={() => setCurrentSlide(s => (s + 1) % BANNERS.length)}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-11 h-11 cursor-pointer transition focus:outline-none z-30 flex items-center justify-center border-none"
          aria-label="Next Slide"
        >
          <i className="fa-solid fa-chevron-right text-lg" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all border-none cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-amber-500' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <main className="w-full bg-white text-slate-800 pb-16">
        
        <section id="about" className="max-w-7xl mx-auto px-4 pt-10 sm:pt-14 relative z-20 text-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            <div 
              onClick={() => { setAboutModalTab('overview'); setAboutModalOpen(true); }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative cursor-pointer"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
              <div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors duration-300">
                  <i className="fa-solid fa-circle-info text-xl" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight">About GeM Public Procurement</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Government e-Marketplace (GeM) is the National Public Procurement Portal of India. It facilitates end-to-end online procurement of goods and services for Central &amp; State Ministries, PSUs, and local bodies transparently, efficiently, and inclusively.
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <span><i className="fa-solid fa-check text-emerald-500 mr-1" /> Transparent</span>
                  <span><i className="fa-solid fa-check text-emerald-500 mr-1" /> GFR 144 Aligned</span>
                  <span><i className="fa-solid fa-check text-emerald-500 mr-1" /> National Reach</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 group-hover:text-amber-700 transition-colors mt-6">
                LEARN MORE <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              id="gem2" 
              onClick={() => { setAboutModalTab('gem2_engine'); setAboutModalOpen(true); }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative cursor-pointer"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
              <div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <i className="fa-solid fa-laptop-code text-xl" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight">GeM 2.0 Compliance Engine</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  GeM 2.0 introduces automated multi-portal verification: direct API handshakes with GSTN, MCA-21, CBDT, MSME Udyam, EPFO/ESIC, DigiLocker, and CPPP Debarment databases to eliminate tender fraud and collusion.
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <span><i className="fa-solid fa-check text-blue-500 mr-1" /> 7+ Sovereign Gateways</span>
                  <span><i className="fa-solid fa-check text-blue-500 mr-1" /> AI Discrepancy Scanner</span>
                  <span><i className="fa-solid fa-check text-blue-500 mr-1" /> CAG Merkle Ledger</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors mt-6">
                EXPLORE COMPLIANCE SUITE <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </section>

        <section id="initiatives" className="max-w-7xl mx-auto px-4 py-12 text-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            <div 
              onClick={() => { setAboutModalTab('msme_mii'); setAboutModalOpen(true); }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative cursor-pointer"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
              <div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  <i className="fa-solid fa-lightbulb text-xl" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 tracking-tight">Sovereign Initiatives &amp; MSME Focus</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  From supporting Micro &amp; Small Enterprises through mandatory 25% public procurement targets, to fostering Start-up Runway innovations and Make-in-India (MII) Class-I preferences, we ensure inclusive growth.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                VIEW MSME &amp; STARTUP POLICIES <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => { setAboutModalTab('gem2_engine'); setAboutModalOpen(true); }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative cursor-pointer"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
              <div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <i className="fa-solid fa-shield-halved text-xl" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 tracking-tight">14-Point Automated Verification Framework</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Automated checks for Tax (GST), Company (MCA), PAN, Small Business (MSME), Worker Welfare (EPFO/ESI), Local Manufacturing (Make in India), Document Authenticity, and Fair Blind Grading.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                VIEW ALL 14 IMPLEMENTED CHECKS <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </section>

        <section id="statistics" className="max-w-7xl mx-auto px-4 py-8 text-slate-800">
          <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-3 block">
                GeM 2.0 National Procurement Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
                Live Sovereign Platform Telemetry
              </h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Real-time tracking of procurement volume, transaction speeds, registered buyers, verified sellers, and statutory audit integrity. Click below to inspect the live metrics.
              </p>
              
              <button 
                onClick={() => setStatsOpen(o => !o)} 
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3 rounded-full text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer border-none focus:outline-none"
              >
                {statsOpen ? 'Hide Live Statistics Drawer' : 'View Live Platform Statistics'}
              </button>

              {statsOpen && (
                <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-left animate-fadeIn">
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Total Transaction Value</span>
                    <span className="text-lg sm:text-xl font-extrabold text-amber-400 block mt-1">₹ 8,42,105 Cr</span>
                    <span className="text-[10px] text-emerald-400">100% verified via PFMS</span>
                  </div>
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Registered Sellers</span>
                    <span className="text-lg sm:text-xl font-extrabold text-blue-400 block mt-1">1.82 Million</span>
                    <span className="text-[10px] text-slate-400">GSTN &amp; PAN verified</span>
                  </div>
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Registered Buyers</span>
                    <span className="text-lg sm:text-xl font-extrabold text-emerald-400 block mt-1">74,200+ PSUs</span>
                    <span className="text-[10px] text-slate-400">Central &amp; State depts</span>
                  </div>
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Audit Ledger Blocks</span>
                    <span className="text-lg sm:text-xl font-extrabold text-purple-400 block mt-1">3.4M+ Merkle Blocks</span>
                    <span className="text-[10px] text-purple-300">Immutable SHA-256</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        <section id="portals" className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-slate-800">
          <div className="text-center mb-10">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-2 block">
              Unified Role-Based Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Choose Your Portal
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Vendors submit sealed compliance bids and track BoQ milestones. The Procurement Officer conducts 14-point automated verifications and audit signs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            <div className="group relative flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-500 pointer-events-none" />
              <div>
                <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors duration-300">
                  <i className="fa-solid fa-store text-2xl" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3">Vendor / Seller Portal</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                  OCR document vault, AI PQC pre-qualification checker, sealed bid submission to Double-Blind Vault, optimal pricing advisor, and BoQ milestone tracker.
                </p>
                <ul className="text-xs text-slate-400 space-y-2 mb-8">
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-400" /> AI PQC eligibility pre-check</li>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-400" /> Double-blind sealed bid vault</li>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-400" /> OCR document compliance repository</li>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-400" /> Make-in-India local content self-declaration</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/60">
                <Link 
                  to="/vendor/register" 
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-center text-xs uppercase tracking-wider transition-all"
                >
                  Vendor Registration
                </Link>
                <Link 
                  to="/vendor/login" 
                  className="border border-slate-600 hover:border-amber-400 text-slate-200 hover:text-amber-400 font-semibold py-3 px-4 rounded-xl text-center text-xs uppercase tracking-wider transition-all"
                >
                  Vendor Login
                </Link>
              </div>
            </div>

            <div className="group relative flex flex-col justify-between bg-gradient-to-br from-blue-950 to-slate-900 rounded-2xl p-8 border border-blue-900/60 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-500 pointer-events-none" />
              <div>
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <i className="fa-solid fa-building-columns text-2xl" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3">Procurement Officer Suite</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                  Single unified command for tender publishing, 14-point automated compliance verification, AI Risk Level evaluation, and CAG cryptographic Merkle ledger.
                </p>
                <ul className="text-xs text-slate-400 space-y-2 mb-8">
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-blue-400" /> 7+ Sovereign Database automated checks</li>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-blue-400" /> AI Discrepancy &amp; Missing Info Scanner</li>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-blue-400" /> Overall Compliance Score &amp; Risk Level</li>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-blue-400" /> Immutable CAG Cryptographic Audit Ledger</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-900/60">
                <Link 
                  to="/gov/register" 
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-center text-xs uppercase tracking-wider transition-all"
                >
                  Officer Registration
                </Link>
                <Link 
                  to="/gov/login" 
                  className="border border-blue-800 hover:border-blue-400 text-slate-200 hover:text-blue-400 font-semibold py-3 px-4 rounded-xl text-center text-xs uppercase tracking-wider transition-all"
                >
                  Officer Login
                </Link>
              </div>
            </div>

          </div>

          <div className="mt-10 flex justify-center">
            <div className={`inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs font-semibold border shadow-sm transition-colors ${
              apiStatus === 'online' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : apiStatus === 'offline' 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                apiStatus === 'online' ? 'bg-emerald-500 animate-pulse' : apiStatus === 'offline' ? 'bg-red-500' : 'bg-slate-400'
              }`} />
              <span>
                {apiStatus === 'online'
                  ? 'FastAPI Engine Online — Shared Relational Store Connected'
                  : apiStatus === 'offline'
                  ? 'Backend Server Offline — Run: python run_all.py'
                  : 'Pinging FastAPI Engine...'}
              </span>
              <a 
                href="http://127.0.0.1:8000/docs" 
                target="_blank" 
                rel="noreferrer" 
                className="ml-2 font-bold underline hover:opacity-80 text-amber-700"
              >
                API Swagger Docs ↗
              </a>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 text-xs font-normal border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-slate-800">

            <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800 flex flex-col text-center">
              <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Web Info &amp; Terms</h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <button 
                    onClick={() => { setAboutModalTab('gfr_rules'); setAboutModalOpen(true); }}
                    className="hover:text-amber-400 transition-colors bg-transparent border-none text-slate-300 cursor-pointer p-0 text-xs"
                  >
                    Terms of Use &amp; GFR Rules
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setAboutModalTab('overview'); setAboutModalOpen(true); }}
                    className="hover:text-amber-400 transition-colors bg-transparent border-none text-slate-300 cursor-pointer p-0 text-xs"
                  >
                    Website Policy &amp; Security Standards
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setAboutModalTab('gem2_engine'); setAboutModalOpen(true); }}
                    className="hover:text-amber-400 transition-colors bg-transparent border-none text-slate-300 cursor-pointer p-0 text-xs"
                  >
                    Document Verification Guidelines
                  </button>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800 flex flex-col text-center">
              <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">GeM 2.0 Compliance</h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li><Link to="/gov" className="hover:text-amber-400 transition-colors">Procurement Officer Suite</Link></li>
                <li><Link to="/vendor" className="hover:text-amber-400 transition-colors">Vendor Compliance Vault</Link></li>
                <li><a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">Swagger API Documentation</a></li>
              </ul>
            </div>

            <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800 flex flex-col text-center">
              <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Helpdesk &amp; Support</h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <button 
                    onClick={() => { setAboutModalTab('procurement_modes'); setAboutModalOpen(true); }}
                    className="hover:text-amber-400 transition-colors bg-transparent border-none text-slate-300 cursor-pointer p-0 text-xs"
                  >
                    Frequently Asked Questions (FAQs)
                  </button>
                </li>
                <li>
                  <Link to="/vendor" className="hover:text-amber-400 transition-colors">
                    Raise a Compliance Clarification Ticket
                  </Link>
                </li>
                <li>
                  <Link to="/gov" className="hover:text-amber-400 transition-colors">
                    CAG Audit Record Verification
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>GEM 2.0 COMPLIANCE PORTAL • Smart India Hackathon 2026</span>
            </div>
            <p className="text-center sm:text-right">
              Maintained &amp; Developed for Ministry of Commerce &amp; Industry • Team Neural Nexus
            </p>
          </div>

        </div>
      </footer>

      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div 
            className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)' }} />

            <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800 relative">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <i className="fa-solid fa-landmark text-xl" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Sovereign Procurement Framework
                    </span>
                    <span className="text-[10px] text-slate-400">GFR 2017 • Rule 149</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                    Government e-Marketplace (GeM) &amp; Public Procurement Suite
                  </h3>
                  <p className="text-xs text-slate-300">
                    Ministry of Commerce &amp; Industry, Government of India
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setAboutModalOpen(false)}
                className="text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 p-2 rounded-lg transition-colors border-none cursor-pointer"
                aria-label="Close Modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-2 text-xs font-bold scrollbar-thin">
              <button 
                onClick={() => setAboutModalTab('overview')}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 border-none cursor-pointer ${
                  aboutModalTab === 'overview' 
                    ? 'bg-amber-500 text-slate-950 shadow-sm' 
                    : 'bg-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i className="fa-solid fa-circle-info" /> Overview &amp; Genesis
              </button>

              <button 
                onClick={() => setAboutModalTab('gfr_rules')}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 border-none cursor-pointer ${
                  aboutModalTab === 'gfr_rules' 
                    ? 'bg-amber-500 text-slate-950 shadow-sm' 
                    : 'bg-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i className="fa-solid fa-scale-balanced" /> GFR Rule 149 Mandate
              </button>

              <button 
                onClick={() => setAboutModalTab('procurement_modes')}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 border-none cursor-pointer ${
                  aboutModalTab === 'procurement_modes' 
                    ? 'bg-amber-500 text-slate-950 shadow-sm' 
                    : 'bg-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i className="fa-solid fa-cart-shopping" /> Procurement Modes
              </button>

              <button 
                onClick={() => setAboutModalTab('msme_mii')}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 border-none cursor-pointer ${
                  aboutModalTab === 'msme_mii' 
                    ? 'bg-amber-500 text-slate-950 shadow-sm' 
                    : 'bg-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i className="fa-solid fa-hand-holding-dollar" /> MSME &amp; Make-In-India
              </button>

              <button 
                onClick={() => setAboutModalTab('gem2_engine')}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 border-none cursor-pointer ${
                  aboutModalTab === 'gem2_engine' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i className="fa-solid fa-microchip" /> GeM 2.0 AI Engine
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-sm leading-relaxed">
              
              {aboutModalTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <h4 className="font-bold text-amber-900 text-base mb-1">National Public Procurement Portal of India</h4>
                    <p className="text-xs text-amber-800">
                      Launched in August 2016 and established as a 100% Government-owned Section 8 Special Purpose Vehicle (SPV), GeM transforms how government offices, defense agencies, and PSUs procure goods and services.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">1</span>
                        Transparency &amp; Open Competition
                      </div>
                      <p className="text-xs text-slate-600">
                        Eliminates human discretion in tender publication, bid opening, and L1 calculation. Contactless, paperless, and cashless procurement environment.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
                        Fiscal Savings &amp; Efficiency
                      </div>
                      <p className="text-xs text-slate-600">
                        Standardized catalog specifications and dynamic pricing comparison have delivered an estimated average savings of ~10% across public procurement budgets.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs">3</span>
                        Inclusivity &amp; Grassroots Access
                      </div>
                      <p className="text-xs text-slate-600">
                        Direct market access for Micro &amp; Small Enterprises, Women entrepreneurs (Womaniya on GeM), Artisans (Tribes India / SARAS), and DPIIT Startups.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">4</span>
                        Guaranteed Payment Timelines
                      </div>
                      <p className="text-xs text-slate-600">
                        Integration with Public Financial Management System (PFMS) ensures mandated payment release within 10 days of CRAC (Consignee Receipt and Acceptance Certificate).
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Cumulative Volume: ₹8.42 Lakh Cr+</span>
                    <span className="font-semibold text-slate-700">Registered Sellers: 1.82M+</span>
                    <span className="font-semibold text-slate-700">Government Buyers: 74,200+</span>
                  </div>
                </div>
              )}

              {aboutModalTab === 'gfr_rules' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                    <h4 className="font-bold text-blue-950 text-base mb-1">General Financial Rules (GFR 2017) — Rule 149</h4>
                    <p className="text-xs text-blue-900">
                      &quot;The procurement of Goods and Services by Ministries or Departments will be mandatory for Goods or Services available on GeM.&quot;
                    </p>
                  </div>

                  <div className="space-y-4 text-xs text-slate-700">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h5 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                        <i className="fa-solid fa-gavel text-amber-600" /> Mandatory Statutory Obligation
                      </h5>
                      <p className="leading-relaxed">
                        Under Rule 149 of GFR 2017, all Central Government Ministries, Departments, Subordinate Offices, Autonomous Bodies, and Central Public Sector Enterprises (CPSEs) are mandated to procure common use Goods and Services exclusively through the GeM portal.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h5 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                        <i className="fa-solid fa-ban text-red-600" /> Prohibition of Off-GeM Tenders
                      </h5>
                      <p className="leading-relaxed">
                        Procuring entities cannot float physical or off-GeM tenders for items listed in the GeM product/service taxonomy unless a GeM Non-Availability Certificate (NAC) or custom bidding exemption is officially recorded.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h5 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                        <i className="fa-solid fa-stamp text-emerald-600" /> Purchase Committee Accountability
                      </h5>
                      <p className="leading-relaxed">
                        The Buyer/Consignee and competent financial authority are legally accountable for ensuring reasonability of rates, statutory verification of bidder qualifications, and timely CRAC generation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {aboutModalTab === 'procurement_modes' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-base">Standard Procurement Thresholds on GeM</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Up to ₹25,000</span>
                        <h5 className="font-bold text-slate-900 text-sm mt-2 mb-1">Direct Purchase Mode</h5>
                        <p className="text-slate-600 leading-relaxed">
                          Buyers can directly purchase any available product meeting quality, specification, and delivery period from any available seller without competitive bidding.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                        ⚡ Turnaround: Immediate checkout
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">₹25,000 to ₹5,00,000</span>
                        <h5 className="font-bold text-slate-900 text-sm mt-2 mb-1">L1 Comparison Mode</h5>
                        <p className="text-slate-600 leading-relaxed">
                          Automated online price comparison across at least 3 distinct manufacturers/OEMs meeting specifications. Lowest price (L1) bidder is awarded the contract.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                        ⚡ Turnaround: Instant L1 algorithm
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Above ₹5,00,000</span>
                        <h5 className="font-bold text-slate-900 text-sm mt-2 mb-1">Mandatory e-Bidding / Reverse Auction</h5>
                        <p className="text-slate-600 leading-relaxed">
                          Open e-Bidding published across the national portal with standard minimum 10-day notice period. Optional Reverse Auction (RA) enabled for dynamic competitive pricing.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                        ⚡ Two-Envelope: Technical + Financial
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Specialized</span>
                        <h5 className="font-bold text-slate-900 text-sm mt-2 mb-1">Custom &amp; BOQ Service Bidding</h5>
                        <p className="text-slate-600 leading-relaxed">
                          Bill of Quantities (BoQ) bidding for complex construction, software delivery, and facility management with SLA-linked milestone payments.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                        ⚡ Includes Milestone Stage Verification
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {aboutModalTab === 'msme_mii' && (
                <div className="space-y-5">
                  <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-lg">
                    <h4 className="font-bold text-emerald-950 text-base mb-1">Public Procurement Policy for MSEs &amp; Make-In-India (PPP-MII)</h4>
                    <p className="text-xs text-emerald-900">
                      Statutory concessions, purchase preference margins, and exemption frameworks for Indian manufacturers and innovators.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                        <i className="fa-solid fa-building-wheat text-emerald-600" />
                        MSE Mandatory 25% Procurement
                      </div>
                      <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                        <li><strong>25% of annual total procurement</strong> reserved for Micro and Small Enterprises.</li>
                        <li>Sub-targets: <strong>4% for SC/ST MSEs</strong> and <strong>3% for Women-owned MSEs</strong>.</li>
                        <li><strong>L1 + 15% Price Band:</strong> MSEs within 15% of non-MSE L1 allowed to match L1 price for 25% order volume.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                        <i className="fa-solid fa-flag text-amber-600" />
                        Make in India (PPP-MII) Order 2017
                      </div>
                      <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                        <li><strong>Class-I Local Supplier:</strong> Local content ≥ 50%. Top preference in all tenders.</li>
                        <li><strong>Class-II Local Supplier:</strong> Local content 20% to 50%.</li>
                        <li><strong>Margin of Purchase Preference:</strong> 20% price band against non-local bidders.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                        <i className="fa-solid fa-rocket text-purple-600" />
                        Startup India Relaxations
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        Under GFR Rule 173(i), DPIIT-recognized Startups are granted complete exemption from Prior Turnover and Prior Experience clauses, subject to meeting technical specifications.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                        <i className="fa-solid fa-shield-halved text-blue-600" />
                        EMD &amp; Tender Fee Exemption
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        100% waiver of Earnest Money Deposit (EMD) and Tender Document fees for Udyam-registered Micro &amp; Small Enterprises and NSIC-registered units.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {aboutModalTab === 'gem2_engine' && (
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-1">
                      <i className="fa-solid fa-shield-halved" /> 14-Point Automated Verification Framework
                    </div>
                    <h4 className="font-bold text-white text-lg">14 Automated Checks &amp; Implemented Solutions</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Our system replaces slow, error-prone manual document checking with instant, automatic verification directly through official government databases. Below are all 14 checks and how each one protects the procurement process in simple, everyday language:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">1</span>
                          <span>GST Verification (Tax Filing Check)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Fake tax returns or cancelled GST numbers submitted by unqualified sellers.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Real-time automated check with the GST Portal to verify active registration, legal company name, and on-time monthly/quarterly tax filings (GSTR-3B &amp; 1).
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> 100% Online &amp; Automated
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">2</span>
                          <span>Company &amp; Director Verification (MCA-21)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Paper-only shell companies or disqualified directors trying to win contracts.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Direct link to the Ministry of Corporate Affairs to verify Company Registration (CIN), active status, authorized share capital, and Director IDs (DIN).
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> Shell Companies Blocked
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">3</span>
                          <span>PAN &amp; Income Tax Check (CBDT)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Mismatched PAN details or forged 3-year annual financial turnover claims.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Direct verification with the Income Tax Department to match business PAN, legal entity name, and confirm 3-year Income Tax Return acknowledgments (ITR-V).
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> Verified Tax Records
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">4</span>
                          <span>MSME &amp; Small Business Status (Udyam)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Big companies falsely claiming small enterprise waivers or fake startup exemptions.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Live lookup with the MSME Udyam database to confirm Micro/Small classification, granting 100% tender fee waivers and 25% purchase reservations automatically.
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> 100% Tender Fee Waiver
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">5</span>
                          <span>Worker Welfare &amp; PF/ESI Check (EPFO/ESIC)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Contractors bidding for large works without real staff or failing to pay worker dues.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Automatic checks with Provident Fund (EPFO) and Employee State Insurance (ESIC) to verify real employee count and confirm zero pending worker defaults.
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> Verified Labor Compliance
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">6</span>
                          <span>Make in India Local Content Audit</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Re-packaged foreign goods falsely claiming to be manufactured in India.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> An automated cost-calculator checking Indian raw materials, local labor, and factory value addition (Class-I: 50%+ local content gets top buying preference).
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> Domestic Manufacturer Priority
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">7</span>
                          <span>Official Document Tamper Check (DigiLocker)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Altered PDF documents, modified dates, or fake digital signatures.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Direct document retrieval from Government DigiLocker and unique digital fingerprinting (SHA-256) to ensure uploaded certificates are 100% authentic and unaltered.
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> Tamper-Proof Document Integrity
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">8</span>
                          <span>CA Audited Turnover &amp; UDIN Validation</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Forged Chartered Accountant stamps and fake turnover certificates.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Automated check of the Unique Document Identification Number (UDIN) against the ICAI register to verify exact annual turnover and net worth.
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> Real CA Attestation Verified
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">9</span>
                          <span>Debarment &amp; Blacklist Registry Check</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Blacklisted or banned contractors participating under hidden company names.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Automated screening against Central Public Procurement Portal (CPPP) and Ministry debarment lists to instantly block ineligible bidders.
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> Corrupt Bidders Blocked
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">10</span>
                          <span>Fair Blind Evaluation (Hidden Company Names)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Bias or favoritism towards famous brands during technical tender evaluations.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Bidder names are encrypted and masked as secret candidate IDs (e.g. <code>VEN-ANON-7741</code>). Officers grade purely on technical merit with zero bias.
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> 100% Unbiased &amp; Fair Grading
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">11</span>
                          <span>Smart AI Document Discrepancy Scanner</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Human officers spending days reading 200-page bid documents to spot missing clauses or altered text.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> AI instantly scans all submitted PDF pages, highlighting rule violations, font anomalies, missing declarations, or conflicting dates in seconds.
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> Scans 200+ Pages in Seconds
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">12</span>
                          <span>Optimal Fair Pricing Advisor</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Over-inflated tender prices or unviably low predatory bids that result in abandoned projects.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Smart price intelligence analyzing raw material rates, logistics, and historical winning quotes to recommend fair, winnable price ranges.
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> Prevents Predatory Pricing
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">13</span>
                          <span>Transparent Quality &amp; Cost Merit Matrix</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Unclear ranking formulas or disputed tender awards.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Automatic, transparent ranking that combines Technical Merit (50%), Local Content (20%), Statutory Clearances (15%), and Compliance (15%).
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> 100% Mathematical Ranking
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">14</span>
                          <span>Permanent Audit Record (CAG &amp; CVC Ready)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong>Problem:</strong> Lost paper files, missing decision records, or untraceable changes during official audits.
                        </p>
                        <p className="text-blue-900 bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 leading-relaxed">
                          <strong>Implemented Solution:</strong> Every check, score, and unmasking event is permanently recorded in a tamper-proof digital audit chain with 1-click export for CAG &amp; vigilance inspection.
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check" /> 1-Click CAG Audit Export
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Link 
                  to="/vendor/register" 
                  onClick={() => setAboutModalOpen(false)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-user-plus" /> Vendor Registration
                </Link>
                <Link 
                  to="/gov/register" 
                  onClick={() => setAboutModalOpen(false)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-building-columns" /> Officer Registration
                </Link>
              </div>

              <button 
                onClick={() => setAboutModalOpen(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-4 py-2 rounded-lg transition-colors border-none cursor-pointer"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}