import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'topbar' | 'navbar' | 'minimal' | 'footer';
  className?: string;
  dark?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'topbar',
  className = '',
  dark = false
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const visibleLanguages = SUPPORTED_LANGUAGES.filter(lang => lang.code === 'en' || lang.code === 'hi');
  const activeLang = visibleLanguages.find(l => l.code === language) || visibleLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Variant styling
  const isTopbar = variant === 'topbar';
  const isNavbar = variant === 'navbar';
  const isMinimal = variant === 'minimal';

  return (
    <div 
      className={`relative inline-block text-left notranslate language-selector-widget ${className}`} 
      translate="no" 
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/80 ${
          isTopbar
            ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00244D] hover:bg-[#003875] text-white border-2 border-amber-400/80 hover:border-amber-300 shadow-md'
            : isNavbar
            ? 'px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border-2 border-amber-400/70 shadow-md'
            : isMinimal
            ? 'p-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10'
            : 'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800'
        }`}
        title={`Select language: Currently ${activeLang.label}`}
      >
        <Globe size={16} className="text-amber-400 shrink-0 animate-pulse" />
        <span className="font-sans tracking-wide font-bold text-white text-xs">
          {activeLang.nativeLabel}
        </span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 text-amber-400 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          role="listbox"
          className="absolute right-0 mt-1.5 w-72 rounded-xl bg-slate-900/98 backdrop-blur-md border border-slate-700/80 shadow-2xl z-[9999] overflow-hidden py-1 animate-fadeIn notranslate language-selector-dropdown"
          translate="no"
          style={{
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Globe size={12} />
              <span>Select & Lock Portal Language</span>
            </span>
          </div>

          {/* Language Options Grid */}
          <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-800/40">
            {visibleLanguages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors cursor-pointer border-none ${
                    isSelected
                      ? 'bg-amber-500/15 text-white font-bold border-l-4 border-amber-400'
                      : 'bg-transparent text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isSelected ? 'text-amber-300 font-bold' : 'text-white font-semibold'}`}>
                        {lang.nativeLabel}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 ml-2 shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};
