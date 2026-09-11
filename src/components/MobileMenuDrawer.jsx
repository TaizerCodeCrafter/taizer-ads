import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Crown, 
  AlertTriangle, 
  Heart, 
  BookOpen, 
  User, 
  LogOut, 
  LogIn, 
  Flame,
  Tag,
  Sparkles,
  Home,
  Info,
  PhoneCall,
  HelpCircle
} from 'lucide-react';
import { useDialog } from '../context/DialogContext.jsx';
import TaizerLogo from './TaizerLogo.jsx';

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  isLoggedIn = false,
  onOpenLogin,
  onLogout,
  onOpenDashboard,
  onOpenHowToPublish,
  onOpenAgents,
  onOpenFakeAds,
  onOpenHome,
  onOpenAbout,
  onOpenContact,
  onOpenFaq,
  onOpenBlog,
  savedOnly,
  onToggleSavedOnly,
  selectedCategory,
  onSelectCategory,
  currentLang = 'sin',
  onToggleLang
}) {
  const { showAlert } = useDialog();
  const isSin = currentLang === 'sin';

  if (!isOpen) return null;

  // Categories matching Image 1: 2-column layout
  const col1Categories = [
    { id: 'all', name: 'Taizer Ads', nameSin: 'ටයිසර් ඇඩ්ස්' },
    { id: 'boys', name: 'Boys Personal', nameSin: 'පිරිමි පෞද්ගලික' },
    { id: 'marriage', name: 'Marriage Proposals', nameSin: 'මංගල යෝජනා' },
    { id: 'spa', name: 'Spa & Wellness Services', nameSin: 'ස්පා සහ සම්බාහන' },
    { id: 'rent', name: 'Rent', nameSin: 'කුලියට' },
    { id: 'sales', name: 'Sales', nameSin: 'විකිණීමට' },
    { id: 'electronics', name: 'Electronics', nameSin: 'ඉලෙක්ට්‍රොනික්' },
  ];

  const col2Categories = [
    { id: 'lifestyle', name: 'Girls Personal', nameSin: 'කාන්තා පෞද්ගලික' },
    { id: 'shemale', name: 'Shemale Personal', nameSin: 'විශේෂ පුද්ගලික' },
    { id: 'studio', name: 'Live Cam', nameSin: 'ලයිව් කැම්' },
    { id: 'rooms', name: 'Rooms', nameSin: 'කාමර සහ නවාතැන්' },
    { id: 'salerent', name: 'Real Estate', nameSin: 'ඉඩම් සහ නිවාස' },
    { id: 'accessories', name: 'Toys & Accessories', nameSin: 'උපාංග සහ භාණ්ඩ' },
    { id: 'vehicles', name: 'Vehicles', nameSin: 'වාහන සහ කුලී රථ' },
  ];

  const handleCategoryClick = (catId) => {
    if (catId === 'all') {
      onSelectCategory(null);
    } else {
      onSelectCategory(catId);
    }
    onClose();
  };

  const handleBlogClick = async () => {
    onClose();
    if (onOpenBlog) {
      onOpenBlog();
    } else {
      await showAlert({
        title: isSin ? 'බ්ලොග් අංශය (Taizer Ads Blog)' : 'Taizer Ads Blog',
        titleSin: isSin ? 'ළඟදීම බලාපොරොත්තු වන්න' : 'Coming Soon',
        message: isSin 
          ? 'වටිනා ලිපි, ව්‍යාපාරික උපදෙස් සහ ආරක්ෂක පුවත් සහිත බ්ලොග් අංශය ළඟදීම බලාපොරොත්තු වන්න!' 
          : 'Blog articles, tips, and security guides coming soon!',
        type: 'info'
      });
    }
  };

  const handlePremiumClick = () => {
    onClose();
    // Filters to VIP / Super Ads or opens pricing
    onSelectCategory('vip');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-in Menu Container (Left side) */}
      <div className="relative w-[86vw] max-w-[340px] bg-[#f8fafc] text-gray-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-left duration-200 overflow-y-auto p-3.5 space-y-3.5 scrollbar-thin">
        {/* 1. Close Button & Brand Logo (Top) */}
        <div className="flex items-center justify-between pt-1 pb-1 border-b border-gray-200">
          <TaizerLogo size="sm" showTagline={false} />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg transition active:scale-95 cursor-pointer"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection Bar inside Mobile Menu */}
        {onToggleLang && (
          <div className="bg-gradient-to-r from-slate-900 via-[#3b0718] to-slate-950 p-2.5 rounded-xl border border-rose-500/30 text-white shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-gray-200 flex items-center space-x-1.5">
              <span>🌐 {isSin ? 'භාෂාව' : 'Language'}:</span>
            </span>
            <div className="bg-black/60 p-1 rounded-lg flex text-xs font-black border border-white/10 select-none">
              <button
                type="button"
                onClick={() => onToggleLang('sin')}
                className={`px-3 py-1 rounded-md transition ${
                  isSin 
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-xs' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🇱🇰 සිංහල
              </button>
              <button
                type="button"
                onClick={() => onToggleLang('en')}
                className={`px-3 py-1 rounded-md transition ${
                  !isSin 
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-xs' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>
        )}

        {/* Quick Nav Links: Home, About, Contact, FAQ */}
        <div className="grid grid-cols-4 gap-1.5 bg-white p-1.5 rounded-xl border border-gray-200 shadow-xs text-center text-[10.5px] font-bold text-gray-700">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenHome?.();
            }}
            className="py-1.5 rounded-lg hover:bg-rose-50 hover:text-[#dc2626] transition flex flex-col items-center cursor-pointer"
          >
            <Home className="w-4 h-4 text-rose-500 mb-0.5" />
            <span>Home</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAbout?.();
            }}
            className="py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition flex flex-col items-center cursor-pointer"
          >
            <Info className="w-4 h-4 text-blue-500 mb-0.5" />
            <span>About</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenContact?.();
            }}
            className="py-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition flex flex-col items-center cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-emerald-500 mb-0.5" />
            <span>Contact</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFaq?.();
            }}
            className="py-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition flex flex-col items-center cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-500 mb-0.5" />
            <span>FAQ</span>
          </button>
        </div>

        {/* 2. "How to publish Ads? / දැන්වීම් දමන්නෙ කෙසේද?" Banner */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenHowToPublish?.();
          }}
          className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white p-3.5 rounded-xl text-center shadow-md transition active:scale-98 cursor-pointer select-none border border-red-800/30"
        >
          <h3 className="font-bold text-sm sm:text-base leading-tight tracking-tight">
            How to publish Ads?
          </h3>
          <p className="text-xs text-red-100 font-medium mt-0.5 tracking-wide">
            දැන්වීමක් දමන්නෙ කෙසේද?
          </p>
        </button>

        {/* 3. Action Buttons Stack Container (Image 1) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-xs space-y-2">
          {/* Agents */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAgents?.();
            }}
            className="w-full bg-[#d81b60] hover:bg-[#c2185b] active:scale-98 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer"
          >
            <span>Agents</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>

          {/* Premium */}
          <button
            type="button"
            onClick={handlePremiumClick}
            className="w-full bg-[#f59e0b] hover:bg-[#d97706] active:scale-98 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer"
          >
            <span>Premium</span>
            <Crown className="w-3.5 h-3.5" />
          </button>

          {/* Fake Ads */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFakeAds?.();
            }}
            className="w-full bg-[#1e293b] hover:bg-[#0f172a] active:scale-98 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer"
          >
            <span>Fake Ads</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* My Saved Ads */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onToggleSavedOnly?.();
            }}
            className={`w-full font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer active:scale-98 ${
              savedOnly ? 'bg-[#7f1d1d] text-white ring-2 ring-red-300' : 'bg-[#b91c1c] hover:bg-[#991b1b] text-white'
            }`}
          >
            <span>My Saved Ads</span>
            <Heart className={`w-3.5 h-3.5 ${savedOnly ? 'fill-white' : ''}`} />
          </button>

          {/* Blog */}
          <button
            type="button"
            onClick={handleBlogClick}
            className="w-full bg-[#0284c7] hover:bg-[#0369a1] active:scale-98 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer"
          >
            <span>Blog</span>
            <BookOpen className="w-3.5 h-3.5" />
          </button>

          {/* Dashboard */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDashboard?.();
            }}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-98 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer"
          >
            <span>Dashboard</span>
            <User className="w-3.5 h-3.5" />
          </button>

          {/* Logout or Login */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout?.();
              }}
              className="w-full bg-[#0f172a] hover:bg-black active:scale-98 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer"
            >
              <span>Logout</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin?.();
              }}
              className="w-full bg-[#0f172a] hover:bg-black active:scale-98 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer"
            >
              <span>Login</span>
              <LogIn className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 4. "Top Categories" Box (Image 1 2-Column Grid) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs space-y-3">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="font-black text-sm text-gray-900 tracking-tight">
              Top Categories
            </h3>
            <div className="w-12 h-1 bg-[#dc2626] rounded-full mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs">
            {/* Column 1 */}
            <div className="space-y-2">
              {col1Categories.map((cat) => {
                const isSelected = selectedCategory === cat.id || (cat.id === 'all' && !selectedCategory);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full flex items-center space-x-1.5 text-left py-1 px-1.5 rounded-md transition cursor-pointer ${
                      isSelected ? 'text-[#dc2626] font-extrabold bg-red-50' : 'text-gray-800 hover:text-[#dc2626] font-medium'
                    }`}
                  >
                    {/* Lotus / Leaf red outline icon */}
                    <Flame className="w-3.5 h-3.5 text-[#dc2626] flex-shrink-0" />
                    <span className="truncate text-[11.5px] leading-tight">{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Column 2 */}
            <div className="space-y-2">
              {col2Categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full flex items-center space-x-1.5 text-left py-1 px-1.5 rounded-md transition cursor-pointer ${
                      isSelected ? 'text-[#dc2626] font-extrabold bg-red-50' : 'text-gray-800 hover:text-[#dc2626] font-medium'
                    }`}
                  >
                    {/* Lotus / Leaf red outline icon */}
                    <Flame className="w-3.5 h-3.5 text-[#dc2626] flex-shrink-0" />
                    <span className="truncate text-[11.5px] leading-tight">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
