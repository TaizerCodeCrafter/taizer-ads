import React from 'react';
import { RefreshCw, PlusCircle, Menu, LogIn, Home, Info, PhoneCall, HelpCircle, Sparkles } from 'lucide-react';
import TaizerLogo from './TaizerLogo.jsx';

export default function Header({ 
  isLoggedIn = false,
  onRefresh, 
  onOpenPostModal, 
  onOpenLogin,
  onToggleMobileSidebar,
  currentLang = 'sin',
  onToggleLang,
  onOpenHome,
  onOpenAbout,
  onOpenContact,
  onOpenFaq
}) {
  const isSin = currentLang === 'sin';

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (onOpenHome) onOpenHome();
    else if (onRefresh) onRefresh();
  };

  return (
    <header className="bg-gradient-to-r from-slate-950 via-[#3b0718] to-[#881337] text-white shadow-xl sticky top-0 z-40 border-b border-rose-500/20 backdrop-blur-md">
      <div className="max-w-[1380px] mx-auto px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Mobile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button 
            onClick={onToggleMobileSidebar} 
            className="md:hidden p-2 hover:bg-white/10 rounded-xl text-white transition active:scale-95 flex-shrink-0"
            title="Toggle Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a href="#" onClick={handleHomeClick} className="inline-flex items-center group min-w-0">
            <TaizerLogo size="md" isSin={isSin} />
          </a>
        </div>

        {/* Center: Desktop Navigation Bar (Home, About, Contact, FAQ) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 bg-black/25 px-2 py-1 rounded-xl border border-white/10 shadow-inner backdrop-blur-xs">
          <button
            type="button"
            onClick={handleHomeClick}
            className="flex items-center space-x-1.5 text-xs font-bold text-white/90 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition active:scale-95 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-rose-400" />
            <span>{isSin ? 'මුල් පිටුව' : 'Home'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAbout}
            className="flex items-center space-x-1.5 text-xs font-bold text-white/90 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition active:scale-95 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>{isSin ? 'අප ගැන' : 'About'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenContact}
            className="flex items-center space-x-1.5 text-xs font-bold text-white/90 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSin ? 'සම්බන්ධ වන්න' : 'Contact'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenFaq}
            className="flex items-center space-x-1.5 text-xs font-bold text-white/90 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition active:scale-95 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSin ? 'නිතර අසන ප්‍රශ්න' : 'FAQ'}</span>
          </button>
        </nav>

        {/* Right Action Buttons & Language Switcher */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          {/* Sinhala / English Toggle Pill - Hidden on Mobile (moved inside Menu), visible on desktop */}
          {onToggleLang && (
            <div className="hidden md:flex bg-black/35 rounded-xl p-0.5 text-[10px] sm:text-[11px] font-bold border border-white/15 select-none shadow-xs">
              <button
                type="button"
                onClick={() => onToggleLang('sin')}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition ${
                  isSin ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-xs' : 'text-white/70 hover:text-white'
                }`}
                title="සිංහල භාෂාව"
              >
                <span className="sm:hidden">සිං</span>
                <span className="hidden sm:inline">🇱🇰 සිංහල</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleLang('en')}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition ${
                  !isSin ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-xs' : 'text-white/70 hover:text-white'
                }`}
                title="English Language"
              >
                EN
              </button>
            </div>
          )}

          {/* Refresh Button: Icon-only on mobile, icon+text on desktop */}
          <button
            onClick={onRefresh}
            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold p-2 sm:px-3 sm:py-1.5 rounded-xl transition shadow-xs cursor-pointer border border-white/10"
            title="Refresh Feed"
          >
            <RefreshCw className="w-3.5 h-3.5 text-red-200" />
            <span className="hidden sm:inline">{isSin ? 'Refresh' : 'Refresh'}</span>
          </button>

          {/* Post Ad Button: High contrast, fits comfortably without overflowing */}
          <button
            onClick={onOpenPostModal}
            className="flex items-center space-x-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white text-xs font-black px-2.5 sm:px-3.5 py-1.5 rounded-xl transition shadow-md shadow-rose-950/40 border border-rose-400/30 cursor-pointer flex-shrink-0"
            title="Post an Advertisement"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Ad</span>
          </button>
        </div>
      </div>
    </header>
  );
}
