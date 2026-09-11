import React from 'react';
import { 
  Send, 
  ShieldCheck, 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  HelpCircle, 
  Info, 
  ShieldAlert, 
  Flame, 
  Building2, 
  MapPin, 
  Clock, 
  ExternalLink,
  PlusCircle,
  Users,
  CheckCircle2,
  Heart
} from 'lucide-react';
import TaizerLogo from './TaizerLogo.jsx';
import WebsiteQRCode from './WebsiteQRCode.jsx';

export default function Footer({
  siteConfig = {},
  currentLang = 'sin',
  onOpenHome,
  onOpenAbout,
  onOpenContact,
  onOpenFaq,
  onOpenSafetyModal,
  onOpenHowToPublish,
  onOpenAgents,
  onOpenFakeAds,
  onOpenPostModal,
  isLoggedIn = false
}) {
  const currentYear = new Date().getFullYear();
  const whatsappNum = (siteConfig.supportWhatsApp || '94771234567').replace(/[^0-9]/g, '');
  const telegram = siteConfig.supportTelegram || '@taizerads_support';
  const email = siteConfig.supportEmail || 'support@taizerads.lk';
  const bank = siteConfig.bankDetails || {
    bankName: 'Commercial Bank PLC',
    accountName: 'Taizer Ads Advertising (Pvt) Ltd',
    accountNumber: '1000 4589 2314',
    branch: 'Kollupitiya Branch'
  };

  return (
    <footer className="mt-16 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-gray-300 border-t border-rose-950/40 relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-rose-600/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 pt-12 pb-8 space-y-10">
        {/* Official Website QR Code Card (Scan to Open, Download & Share) */}
        <WebsiteQRCode currentLang={currentLang} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <TaizerLogo size="lg" />

            <p className="text-xs text-gray-400 leading-relaxed">
              ශ්‍රී ලංකාවේ ආරක්ෂිතම සහ විශ්වාසනීයම ඔන්ලයින් දැන්වීම් ජාලය. භාණ්ඩ හා සේවා මිලදී ගැනීමට, විකිණීමට සහ සෘජුව සම්බන්ධ වීමට අංක 1 තේරීම.
            </p>

            {/* Trust Badges */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>100% Verified Ads & Anti-Fraud Shield</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-rose-300 font-semibold bg-rose-950/30 border border-rose-900/40 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>24/7 Dedicated Support & Fast Approval</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-gray-800 pb-2">
              Marketplace Navigation (ප්‍රධාන සේවා)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={onOpenHome}
                  className="hover:text-rose-400 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>මුල් පිටුව (Home Feed)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPostModal}
                  className="hover:text-rose-400 transition flex items-center space-x-1.5 text-rose-300 font-semibold cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>දැන්වීමක් පළ කරන්න (Post New Ad)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="hover:text-white transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>අප ගැන (About Taizer Ads)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-white transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>සම්බන්ධ වන්න (Contact & Support)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFaq}
                  className="hover:text-white transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>නිතර අසන ප්‍රශ්න (FAQ & Help)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Safety Guidance */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-gray-800 pb-2">
              Safety & Security (ආරක්ෂිත මාර්ගෝපදේශ)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={onOpenSafetyModal}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>ආරක්ෂිත උපදෙස් (Safety Tips)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFakeAds}
                  className="hover:text-rose-400 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  <span>ව්‍යාජ දැන්වීම් හඳුනාගැනීම (Fake Ads Alert)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenHowToPublish}
                  className="hover:text-blue-400 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>දැන්වීමක් දමන්නේ කෙසේද? (Publish Guide)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAgents}
                  className="hover:text-purple-400 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>අනුමත නියෝජිත ජාලය (Verified Agents)</span>
                </button>
              </li>
            </ul>

            {/* Warning Note */}
            <div className="bg-red-950/40 border border-red-800/40 rounded-xl p-2.5 text-[11px] text-red-200">
              <span className="font-bold text-red-400 block mb-0.5">⚠️ වංචනිකයන්ගෙන් ප්‍රවේශම් වන්න:</span>
              භාණ්ඩ හෝ සේවාව ලැබීමට පෙර කිසිවිටෙකත් Advance මුදල් හෝ Reload නොගෙවන්න.
            </div>
          </div>

          {/* Column 4: Official Contact & Bank Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-gray-800 pb-2">
              Official Help Desk (නිල සම්බන්ධතා)
            </h4>

            <div className="space-y-2 text-xs">
              <a
                href={`https://wa.me/${whatsappNum}?text=Hello%20Taizer%20Ads%20Admin,%20I%20need%20assistance.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-300 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-current flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 block">WhatsApp 24/7 Helpline</span>
                  <span className="font-extrabold text-white text-xs truncate">+{whatsappNum}</span>
                </div>
              </a>

              <a
                href={`https://t.me/${telegram.replace(/[^0-9a-zA-Z_]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2.5 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/40 text-blue-300 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                <Send className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 block">Telegram Channel & Chat</span>
                  <span className="font-extrabold text-white text-xs truncate">{telegram}</span>
                </div>
              </a>

              {/* Official Bank Pill */}
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl space-y-1">
                <div className="flex items-center space-x-1.5 text-white font-bold text-[11px]">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{bank.bankName}</span>
                </div>
                <div className="text-[10.5px] text-gray-400 leading-tight">
                  <p>A/C: <span className="font-mono text-amber-300 font-bold">{bank.accountNumber}</span></p>
                  <p className="truncate text-gray-400">{bank.accountName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 text-center sm:text-left">
          <div className="flex items-center space-x-1">
            <span>© {currentYear} Taizer Ads Marketplace. All rights reserved.</span>
            <span className="text-gray-600 hidden md:inline">•</span>
            <span className="hidden md:inline text-gray-500">Made with 🇱🇰 for Sri Lankan Community</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <button
              type="button"
              onClick={onOpenAbout}
              className="hover:text-white transition cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={onOpenSafetyModal}
              className="hover:text-white transition cursor-pointer"
            >
              Safety
            </button>
            <button
              type="button"
              onClick={onOpenFaq}
              className="hover:text-white transition cursor-pointer"
            >
              FAQ
            </button>
            <button
              type="button"
              onClick={onOpenContact}
              className="hover:text-white transition cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
