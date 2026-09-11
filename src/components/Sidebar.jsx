import React from 'react';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Bookmark, 
  BookOpen, 
  User, 
  LogOut, 
  Flame, 
  HelpCircle,
  LogIn
} from 'lucide-react';
import { useDialog } from '../context/DialogContext.jsx';

export default function Sidebar({
  isLoggedIn = false,
  onOpenLogin,
  onLogout,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  selectedCategory,
  onSelectCategory,
  savedOnly,
  onToggleSavedOnly,
  onOpenHowToPublish,
  onOpenAgents,
  onOpenFakeAds,
  onOpenDashboard,
  currentLang = 'sin'
}) {
  const { showAlert } = useDialog();
  const isSin = currentLang === 'sin';

  const quickLinksList = [
    { id: 'spa', name: 'Spa Massage & Wellness', nameSin: 'ස්පා සහ සම්බාහන සේවා' },
    { id: 'studio', name: 'Live Cam & Studio', nameSin: 'ලයිව් ස්ටුඩියෝ සහ කැම්' },
    { id: 'lifestyle', name: 'Girls Personal', nameSin: 'කාන්තා පෞද්ගලික දැන්වීම්' },
    { id: 'boys', name: 'Boys Personal', nameSin: 'පිරිමි පෞද්ගලික දැන්වීම්' },
    { id: 'special', name: 'Personal & Care', nameSin: 'පෞද්ගලික සත්කාර' },
    { id: 'salerent', name: 'Sale / Rent', nameSin: 'විකිණීමට / කුලියට' },
    { id: 'marriage', name: 'Marriage Proposal', nameSin: 'මංගල යෝජනා' },
    { id: 'accessories', name: 'Toys & Accessories', nameSin: 'උපාංග සහ භාණ්ඩ' },
    { id: 'rooms', name: 'Rooms & Boarding', nameSin: 'කාමර සහ නවාතැන්' },
    { id: 'vehicles', name: 'Vehicles & Rentals', nameSin: 'වාහන සහ කුලී රථ' },
    { id: 'fake', name: 'Fake Ads & Scams', nameSin: '🚫 ව්‍යාජ දැන්වීම්' },
  ];

  return (
    <aside className="w-full md:w-[270px] flex-shrink-0 space-y-4">
      {/* 1. How to publish Ads banner */}
      <div 
        onClick={onOpenHowToPublish}
        className="cursor-pointer bg-[#b91c3e] hover:bg-[#a11434] transition p-4 rounded-xl shadow-sm text-center text-white select-none border border-red-800/40"
      >
        <div className="flex items-center justify-center space-x-1.5 text-base font-bold">
          <HelpCircle className="w-4 h-4 text-pink-200" />
          <span>{isSin ? 'දැන්වීමක් දමන්නේ කෙසේද?' : 'How to publish Ads?'}</span>
        </div>
        <p className="text-xs font-medium text-pink-100 mt-0.5 tracking-wide">
          {isSin ? 'පියවර 4කින් පහසුවෙන් පළ කරන්න' : 'Publish easily in 4 simple steps'}
        </p>
      </div>

      {/* 2. Search Box & Action Buttons Box */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-3.5">
        {/* Search Input Row */}
        <form onSubmit={onSearchSubmit} className="flex items-center space-x-1.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isSin ? "දැන්වීම් හෝ Location (කොළඹ, නුවර...) සොයන්න..." : "Search Ads, Location (Colombo, Kandy...)"}
            className="flex-1 bg-[#f8fafc] border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#f03a5f]"
          />
          <button
            type="submit"
            className="bg-[#0f172a] hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded transition shadow-sm"
          >
            {isSin ? 'සොයන්න' : 'Search'}
          </button>
        </form>

        {/* Action Buttons Grid */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Agents */}
            <button
              onClick={onOpenAgents}
              className="flex items-center justify-center space-x-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-medium py-2 px-2 rounded-lg transition shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isSin ? 'නියෝජිතයින්' : 'Agents'}</span>
            </button>

            {/* Fake Ads */}
            <button
              onClick={() => onSelectCategory(selectedCategory === 'fake' ? null : 'fake')}
              className={`flex items-center justify-center space-x-1.5 text-white text-xs font-medium py-2 px-2 rounded-lg transition shadow-sm ${
                selectedCategory === 'fake'
                  ? 'bg-black ring-2 ring-red-400 font-bold'
                  : 'bg-[#e11d48] hover:bg-[#be123c]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isSin ? 'ව්‍යාජ දැන්වීම්' : 'Fake Ads'}</span>
            </button>

            {/* Saved Ads */}
            <button
              onClick={onToggleSavedOnly}
              className={`flex items-center justify-center space-x-1.5 text-white text-xs font-medium py-2 px-2 rounded-lg transition shadow-sm ${
                savedOnly ? 'bg-[#7f1d1d] ring-2 ring-red-400' : 'bg-[#991b1b] hover:bg-[#7f1d1d]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSin ? 'සුරැකි දැන්වීම්' : 'Saved Ads'}</span>
            </button>

            {/* Blog */}
            <button
              onClick={async () => {
                await showAlert({
                  title: isSin ? 'බ්ලොග් අංශය (Blog)' : 'Taizer Ads Blog',
                  titleSin: isSin ? 'ළඟදීම බලාපොරොත්තු වන්න' : 'Coming Soon',
                  message: isSin 
                    ? 'වටිනා ලිපි, ප්‍රවෘත්ති සහ ආරක්ෂක උපදෙස් සහිත බ්ලොග් අංශය ළඟදීම බලාපොරොත්තු වන්න!' 
                    : 'Blog articles, scam awareness, and safety guidelines coming soon!',
                  type: 'info'
                });
              }}
              className="flex items-center justify-center space-x-1.5 bg-[#0891b2] hover:bg-[#0e7490] text-white text-xs font-medium py-2 px-2 rounded-lg transition shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isSin ? 'බ්ලොග්' : 'Blog'}</span>
            </button>
          </div>

          {/* Conditional 3rd Row based on Login Status */}
          {isLoggedIn ? (
            /* Logged in: Show Dashboard & Logout */
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                onClick={onOpenDashboard}
                className="flex items-center justify-center space-x-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-medium py-2 px-2 rounded-lg transition shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>{isSin ? 'මගේ ගිණුම' : 'Dashboard'}</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center justify-center space-x-1.5 bg-[#0f172a] hover:bg-black text-white text-xs font-medium py-2 px-2 rounded-lg transition shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isSin ? 'ඉවත් වන්න' : 'Logout'}</span>
              </button>
            </div>
          ) : (
            /* NOT Logged in: Show Login button */
            <button
              onClick={onOpenLogin}
              className="w-full flex items-center justify-center space-x-2 bg-[#0f172a] hover:bg-black text-white text-xs font-bold py-2.5 px-3 rounded-lg transition shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isSin ? '🔒 ගිණුමට ඇතුල් වන්න (Login)' : 'Login'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Quick Links Categories */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm tracking-tight flex items-center space-x-1.5">
            <span>{isSin ? 'ප්‍රධාන කාණ්ඩ (Quick Links)' : 'Quick Links'}</span>
          </h3>
          {selectedCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-[11px] text-[#f03a5f] hover:underline font-semibold"
            >
              {isSin ? 'ඉවත් කරන්න' : 'Clear filter'}
            </button>
          )}
        </div>

        <ul className="space-y-1.5 text-xs">
          {quickLinksList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const displayName = isSin ? `${cat.nameSin} (${cat.name})` : cat.name;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-md transition text-left ${
                    isSelected 
                      ? 'bg-red-50 text-[#f03a5f] font-bold border border-red-200' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#f03a5f]'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-[#f03a5f] flex-shrink-0" />
                  <span className="truncate">{displayName}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
