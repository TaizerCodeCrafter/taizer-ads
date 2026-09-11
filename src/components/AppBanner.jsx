import React, { useState } from 'react';
import { ShieldAlert, Send, Download, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { useDialog } from '../context/DialogContext.jsx';

export default function AppBanner({ 
  onOpenSafetyTips, 
  topBanner = {
    title: "Download Taizer Ads Android App.",
    subtitle: "Taizer Ads ඇන්ඩ්‍රොයිඩ් ඇප් එක ඩවුන්ලෝඩ් කරන්න.",
    badgeText: "Admin Ad",
    bgColor: "#f06277",
    bgGradient: "linear-gradient(135deg, #f06277 0%, #f59e0b 100%)",
    isGradient: false,
    pulseAnimation: true,
    targetUrl: "https://taizerads.lk/download/taizer_ads.apk",
    actionType: "modal",
    openInNewTab: true
  },
  safetyBanner = {
    title: "Safety Tips",
    sinhalaTitle: "ආරක්ෂිත උපදෙස්",
    bgColor: "#eab308"
  },
  currentLang = 'sin'
}) {
  const { showAlert } = useDialog();
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const isSin = currentLang === 'sin';

  // Compute background: supports either single solid hex color or linear gradient
  const bannerBackground = topBanner.isGradient && topBanner.bgGradient
    ? topBanner.bgGradient
    : (topBanner.bgColor || '#f06277');

  // Handle Banner Click (opens target URL or opens download modal)
  const handleBannerClick = () => {
    if (topBanner.actionType === 'modal') {
      setIsAppModalOpen(true);
    } else if (topBanner.targetUrl && topBanner.targetUrl.trim()) {
      const url = topBanner.targetUrl.trim();
      if (topBanner.openInNewTab !== false) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = url;
      }
    } else {
      setIsAppModalOpen(true);
    }
  };

  const isExternalLink = topBanner.actionType !== 'modal' && Boolean(topBanner.targetUrl);

  return (
    <div className="space-y-3 w-full">
      {/* 1. Golden Yellow Safety Tips Banner */}
      <div 
        onClick={onOpenSafetyTips}
        style={{ backgroundColor: safetyBanner.bgColor || '#eab308' }}
        className="cursor-pointer hover:opacity-95 transition py-2 px-4 rounded-md text-white font-bold text-xs md:text-sm text-center shadow-sm flex items-center justify-center space-x-2 select-none"
      >
        <ShieldAlert className="w-4 h-4" />
        <span>
          {isSin ? 'ආරක්ෂිත උපදෙස් (Safety Tips)' : (safetyBanner.title || 'Safety Tips')}
        </span>
      </div>

      {/* 2. Admin Top Ad / Pink Android App Banner with Continuous Pulse Animation */}
      <div 
        onClick={handleBannerClick}
        style={{ background: bannerBackground }}
        className={`${
          topBanner.pulseAnimation ? 'banner-pulse-animation' : 'hover:scale-[1.01]'
        } text-white rounded-lg p-2.5 md:p-3 shadow-md flex items-center justify-between cursor-pointer select-none relative overflow-hidden transition-all`}
        title={isExternalLink ? `Open: ${topBanner.targetUrl}` : 'Admin Top Banner (Click to open)'}
      >
        {/* Glow sheen highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        <div className="flex items-center space-x-3 relative z-10">
          {/* Google Play / Action icon */}
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-inner flex-shrink-0">
            {isExternalLink ? (
              <ExternalLink className="w-5 h-5 text-[#f03a5f]" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M4.5 2.5L14.5 12L4.5 21.5V2.5Z" fill="#00C9FF" />
                <path d="M14.5 12L17.5 9L4.5 2.5L14.5 12Z" fill="#FFD200" />
                <path d="M4.5 21.5L17.5 15L14.5 12L4.5 21.5Z" fill="#FF3366" />
                <path d="M20.5 12L17.5 9V15L20.5 12Z" fill="#00E676" />
              </svg>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs md:text-sm font-bold leading-tight">
                {topBanner.title}
              </h4>
              <span className="bg-white/20 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded">
                {topBanner.badgeText || 'Admin Ad'}
              </span>
            </div>
            <p className="text-[11px] md:text-xs text-pink-100 font-medium mt-0.5">
              {topBanner.subtitle}
            </p>
          </div>
        </div>

        {/* Circular target / action icon on right */}
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 relative z-10">
          <div className="w-5 h-5 rounded-full bg-[#f03a5f] flex items-center justify-center">
            {isExternalLink ? (
              <ExternalLink className="w-3 h-3 text-white" />
            ) : (
              <Send className="icon-pulse-animation w-3 h-3 text-white ml-0.5 mb-0.5" />
            )}
          </div>
        </div>
      </div>

      {/* App Download / Admin Promo Modal */}
      {isAppModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div 
              style={{ background: bannerBackground }}
              className="text-white px-5 py-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <h3 className="font-bold text-sm sm:text-base">Taizer Ads Official Android App</h3>
              </div>
              <button 
                onClick={() => setIsAppModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs text-gray-700 space-y-4">
              <p className="text-gray-600">
                Download the verified official Android APK for fast ad posting, instant notifications, and smooth browsing:
              </p>

              <div className="bg-pink-50 border border-pink-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center space-x-2 text-pink-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#f06277]" />
                  <span>Version 2.4.0 (Latest Release)</span>
                </div>
                <p className="text-gray-600 text-[11px]">
                  Requires Android 7.0 and up • 100% Free & Safe APK
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAppModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsAppModalOpen(false);
                    await showAlert({
                      title: 'Download Started',
                      titleSin: 'බාගත කිරීම ආරම්භ විය',
                      message: 'Official Taizer Ads Android App (v2.4.apk) download has initiated.',
                      messageSin: 'නිල ඇන්ඩ්‍රොයිඩ් යෙදුම (Taizer_Ads_v2.4.apk) බාගත වීම ආරම්භ විය.',
                      type: 'success'
                    });
                  }}
                  style={{ background: bannerBackground }}
                  className="px-4 py-2 text-white font-bold rounded-lg transition shadow-sm flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK (14 MB)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
