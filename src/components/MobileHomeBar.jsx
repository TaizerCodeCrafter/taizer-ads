import React, { useState } from 'react';
import { 
  Search, 
  Megaphone, 
  ShieldCheck, 
  Crown, 
  Send, 
  AlertTriangle, 
  BookOpen, 
  HelpCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useDialog } from '../context/DialogContext.jsx';

export default function MobileHomeBar({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  selectedCategory,
  onSelectCategory,
  onOpenAgents,
  onOpenFakeAds,
  onOpenHelpServices,
  onOpenBlog,
  siteConfig = {}
}) {
  const { showAlert } = useDialog();
  const [activeSlide, setActiveSlide] = useState(0);
  const whatsappNum = (siteConfig.supportWhatsApp || '94771234567').replace(/[^0-9]/g, '');

  const categories = [
    { id: 'lifestyle', name: 'Girls Personal' },
    { id: 'studio', name: 'Live Cam' },
    { id: 'spa', name: 'Spa & Wellness Services' },
    { id: 'shemale', name: 'Shemale Personal' },
    { id: 'boys', name: 'Boys Personal' },
    { id: 'marriage', name: 'Marriage Proposals' },
    { id: 'rooms', name: 'Rooms' },
    { id: 'rent', name: 'Rent' },
    { id: 'salerent', name: 'Real Estate' },
    { id: 'sales', name: 'Sales' },
    { id: 'accessories', name: 'Toys & Accessories' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'vehicles', name: 'Vehicles' }
  ];

  const handleBlogClick = async () => {
    if (onOpenBlog) {
      onOpenBlog();
    } else {
      await showAlert({
        title: 'Taizer Ads Blog (බ්ලොග් අංශය)',
        titleSin: 'ළඟදීම බලාපොරොත්තු වන්න',
        message: 'වටිනා ලිපි, ප්‍රවෘත්ති සහ ආරක්ෂක උපදෙස් සහිත බ්ලොග් අංශය ළඟදීම බලාපොරොත්තු වන්න!',
        type: 'info'
      });
    }
  };

  const handleBannerRentClick = () => {
    window.open(`https://wa.me/${whatsappNum}?text=Hello%20Taizer%20Ads%20Admin,%20I%20want%20to%20rent%20the%20top%20banner%20ad%20spot.`, '_blank');
  };

  const handleSubscribeClick = () => {
    const telegram = (siteConfig.supportTelegram || '@taizerads_support').replace(/[^0-9a-zA-Z_]/g, '');
    window.open(`https://t.me/${telegram}`, '_blank');
  };

  return (
    <div className="md:hidden space-y-3 pb-1">
      {/* 1. Mobile Search Bar (Image 2) */}
      <form onSubmit={onSearchSubmit} className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Ads or Location (Colombo, Kandy, Galle)..."
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#f03a5f] shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="bg-[#0f172a] hover:bg-black text-white text-xs font-extrabold px-4 py-2 rounded-lg transition shadow-sm active:scale-95 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* 2. Horizontal Scrolling Category Bar (Image 2) */}
      <div className="bg-[#d81b60] rounded-lg shadow-xs overflow-hidden py-2 px-1">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar px-2 select-none scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer flex-shrink-0 active:scale-95 ${
                  isSelected 
                    ? 'bg-white text-[#d81b60] shadow-sm' 
                    : 'text-white/95 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Purple "ADVERTISE HERE" Banner (Image 2) */}
      <div 
        onClick={handleBannerRentClick}
        className="cursor-pointer bg-gradient-to-r from-[#4a044e] via-[#6b21a8] to-[#7c3aed] text-white rounded-xl p-3.5 shadow-md relative overflow-hidden active:scale-99 transition select-none border border-purple-400/30"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center space-x-3">
            {/* Megaphone icon */}
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center flex-shrink-0 shadow-sm font-black">
              <Megaphone className="w-5 h-5 -rotate-12 fill-current" />
            </div>

            <div className="min-w-0 leading-tight">
              <div className="flex items-center space-x-1.5">
                <span className="bg-amber-400 text-purple-950 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-xs">
                  ADVERTISE HERE
                </span>
              </div>
              <p className="text-[10px] text-purple-100 font-medium mt-1 line-clamp-1">
                Reach Sri Lankan Customers • Grow Your Business
              </p>
              <h4 className="text-xs font-black text-amber-200 tracking-tight mt-0.5">
                YOUR BUSINESS CAN BE SEEN HERE
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleBannerRentClick();
            }}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-purple-950 font-black text-[10px] px-2.5 py-1.5 rounded-lg shadow-sm whitespace-nowrap active:scale-95 flex-shrink-0 cursor-pointer"
          >
            RENT THIS BANNER
          </button>
        </div>

        {/* Carousel indicator dots */}
        <div className="flex justify-center space-x-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
      </div>

      {/* 4. Action Buttons Grid (Image 2) */}
      <div className="space-y-2">
        {/* Row 1: [ Agents ] [ Blog ] [ Help Services ] */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onOpenAgents}
            className="bg-[#d81b60] hover:bg-[#c2185b] active:scale-95 text-white text-xs font-bold py-2 rounded-lg transition shadow-xs text-center cursor-pointer"
          >
            Agents
          </button>

          <button
            type="button"
            onClick={handleBlogClick}
            className="bg-[#991b1b] hover:bg-[#7f1d1d] active:scale-95 text-white text-xs font-bold py-2 rounded-lg transition shadow-xs text-center cursor-pointer"
          >
            Blog
          </button>

          <button
            type="button"
            onClick={onOpenHelpServices}
            className="bg-[#e11d48] hover:bg-[#be123c] active:scale-95 text-white text-xs font-bold py-2 rounded-lg transition shadow-xs text-center cursor-pointer"
          >
            Help Services
          </button>
        </div>

        {/* Row 2: [ 👑 Premium ] [ ✈️ Subscribe ] [ 🎒 Browse Fake Ads ] */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onSelectCategory(selectedCategory === 'vip' ? null : 'vip')}
            className="bg-[#f59e0b] hover:bg-[#d97706] active:scale-95 text-white text-xs font-black py-2 rounded-lg transition shadow-xs flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>👑</span>
            <span>Premium</span>
          </button>

          <button
            type="button"
            onClick={handleSubscribeClick}
            className="bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white text-xs font-bold py-2 rounded-lg transition shadow-xs flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>✈️</span>
            <span>Subscribe</span>
          </button>

          <button
            type="button"
            onClick={onOpenFakeAds}
            className="bg-[#ea580c] hover:bg-[#c2410c] active:scale-95 text-white text-xs font-bold py-2 rounded-lg transition shadow-xs flex items-center justify-center space-x-1 cursor-pointer truncate px-1"
          >
            <span>🎒</span>
            <span className="truncate">Browse Fake Ads</span>
          </button>
        </div>
      </div>
    </div>
  );
}
