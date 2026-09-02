import React, { useState, useEffect } from 'react';
import { Phone, Globe, HelpCircle, ShieldCheck, Clock, Accessibility } from 'lucide-react';

interface GovNationalTopBarProps {
  onOpenGuide: () => void;
}

export const GovNationalTopBar: React.FC<GovNationalTopBarProps> = ({ onOpenGuide }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'small' | 'large'>('normal');
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata'
      };
      setCurrentTime(now.toLocaleString('en-IN', options) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFontChange = (size: 'small' | 'normal' | 'large') => {
    setFontSize(size);
    if (size === 'small') {
      document.documentElement.style.fontSize = '14px';
    } else if (size === 'large') {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  };

  return (
    <div className="w-full bg-[#001833] text-slate-200 text-[11px] border-b border-[#1E3A68]">
      
      <div className="tricolor-stripe w-full"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1 flex flex-wrap items-center justify-between gap-2">
        
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>भारत सरकार</span>
            <span className="text-slate-500 font-normal">|</span>
            <span className="text-slate-100">Government of India</span>
          </div>

          <span className="text-slate-600 hidden md:inline">&bull;</span>

          <span className="text-slate-300 hidden md:inline text-[11px]">
            वाणिज्य एवं उद्योग मंत्रालय | Ministry of Commerce & Industry
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          
          <div className="hidden lg:flex items-center gap-1.5 text-slate-300 font-mono text-[10px] bg-[#00244D] px-2 py-0.5 rounded border border-[#1E3A68]">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{currentTime || '30-AUG-2026 20:00:00 IST'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-300 text-[11px]">
            <Phone className="w-3 h-3 text-amber-400" />
            <span>GeM Helpdesk: <strong className="text-white font-mono">1800-419-3436</strong></span>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <button 
            onClick={onOpenGuide}
            className="text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1 text-[11px]"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Portal SOP</span>
          </button>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-0.5 bg-[#00244D] px-1 py-0.5 rounded border border-[#1E3A68]">
            <Accessibility className="w-2.5 h-2.5 text-slate-400 mr-0.5" />
            <button 
              onClick={() => handleFontChange('small')}
              className={`px-1 text-[10px] rounded ${fontSize === 'small' ? 'bg-[#003875] text-amber-400 font-bold' : 'text-slate-300'}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button 
              onClick={() => handleFontChange('normal')}
              className={`px-1 text-[10px] rounded ${fontSize === 'normal' ? 'bg-[#003875] text-amber-400 font-bold' : 'text-slate-300'}`}
              title="Default Font Size"
            >
              A
            </button>
            <button 
              onClick={() => handleFontChange('large')}
              className={`px-1 text-[10px] rounded ${fontSize === 'large' ? 'bg-[#003875] text-amber-400 font-bold' : 'text-slate-300'}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <span className="text-slate-700">|</span>

          <button
            onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#00244D] hover:bg-[#003366] border border-[#1E3A68] text-slate-200 font-semibold text-[10px]"
          >
            <Globe className="w-2.5 h-2.5 text-amber-400" />
            <span>{lang === 'EN' ? 'हिन्दी' : 'English'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};