import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle, 
  HelpCircle, 
  UserCheck, 
  AlertTriangle, 
  Globe, 
  Phone, 
  MessageCircle,
  Info,
  Mail,
  Building2,
  Send,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  MapPin,
  Heart
} from 'lucide-react';

export function SafetyModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#eab308] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-sm md:text-base">Safety Tips / ආරක්ෂිත උපදෙස්</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 text-xs text-gray-700 space-y-3">
          <div className="flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p><strong>Never send money in advance / කලින් මුදල් නොගෙවන්න:</strong> භාණ්ඩ හෝ සේවාව ලැබීමට පෙර හෝ සත්‍යාපනය කිරීමට පෙර කිසිවිටෙකත් මුදල් තැන්පත් කිරීමෙන් වළකින්න.</p>
          </div>
          <div className="flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p><strong>Meet in public places / පොදු ස්ථානවල හමුවන්න:</strong> ගනුදෙනු හෝ හමුවීම් සඳහා ආරක්ෂිත, එළිමහන් පොදු ස්ථාන තෝරාගන්න.</p>
          </div>
          <div className="flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p><strong>Look for Verified Badges:</strong> "Verified Seller", "Real Image", සහ "Cash Back" ඇති දැන්වීම් වඩාත් විශ්වාසදායක වේ.</p>
          </div>
          <div className="pt-3 border-t flex justify-end">
            <button onClick={onClose} className="bg-[#eab308] text-white font-bold px-4 py-1.5 rounded-lg text-xs">
              තේරුම් ගතිමි (I Understand)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowToPublishModal({ isOpen, onClose, onOpenPostModal }) {
  const [lang, setLang] = useState('sin'); // 'sin' | 'en'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header with Title & Language Toggle */}
        <div className="bg-[#b91c3e] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-pink-200" />
            <h3 className="font-bold text-sm md:text-base">
              {lang === 'sin' ? 'දැන්වීමක් දමන්නේ කෙසේද?' : 'How to Publish Ads'}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Toggle Pill */}
            <div className="bg-black/20 rounded-lg p-0.5 flex text-[10px] font-bold">
              <button
                onClick={() => setLang('sin')}
                className={`px-2 py-0.5 rounded transition ${
                  lang === 'sin' ? 'bg-white text-[#b91c3e]' : 'text-white/80 hover:text-white'
                }`}
              >
                සිංහල
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded transition ${
                  lang === 'en' ? 'bg-white text-[#b91c3e]' : 'text-white/80 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-lg text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 text-xs text-gray-700 space-y-4">
          {lang === 'sin' ? (
            /* Sinhala Instructions */
            <div className="space-y-3 font-medium">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#f03a5f] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-bold text-gray-900">ඉහළින් ඇති "Post Ad" බටනය ක්ලික් කරන්න</p>
                  <p className="text-[11px] text-gray-500">වෙබ් අඩවියේ ඉහළ ඇති Post Ad බටනය හෝ පහත ඇති බටනය ක්ලික් කරන්න.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#f03a5f] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-bold text-gray-900">වර්ගය (Category) සහ Badge එක තෝරන්න</p>
                  <p className="text-[11px] text-gray-500">දැන්වීමට අදාළ Category එක සහ Badge වර්ගය (Super Ad, VIP Ad, Normal Ad) තෝරන්න.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#f03a5f] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-bold text-gray-900">තොරතුරු සහ පින්තූරය ඇතුළත් කරන්න</p>
                  <p className="text-[11px] text-gray-500">ඔබගේ දුරකථන අංකය, WhatsApp, පින්තූරය සහ දැන්වීමේ විස්තරය ලියන්න.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#f03a5f] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <p className="font-bold text-gray-900">"Create" බටනය ක්ලික් කර Submit කරන්න</p>
                  <p className="text-[11px] text-gray-500">දැන්වීම සජීවීව පළ වී My Ads එකට එකතු වන අතර, Admin අනුමැතියෙන් පසු මුල් පිටුවේ දිස්වේ!</p>
                </div>
              </div>
            </div>
          ) : (
            /* English Instructions */
            <div className="space-y-3 font-medium">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#f03a5f] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-bold text-gray-900">Click "Post Ad" button</p>
                  <p className="text-[11px] text-gray-500">Click the "Post Ad" button at the top header or below.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#f03a5f] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-bold text-gray-900">Select Category & Badge Type</p>
                  <p className="text-[11px] text-gray-500">Choose your appropriate category and badge tier (Super Ad, VIP Ad, Normal Ad).</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#f03a5f] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-bold text-gray-900">Fill in Details & Image</p>
                  <p className="text-[11px] text-gray-500">Provide your contact phone, WhatsApp, image URL, and ad description.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#f03a5f] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <p className="font-bold text-gray-900">Click "Create" to Submit</p>
                  <p className="text-[11px] text-gray-500">Your advertisement is added to My Ads and published live after admin approval!</p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-3 border-t flex justify-between items-center">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-semibold text-xs">
              {lang === 'sin' ? 'වසන්න (Close)' : 'Close'}
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenPostModal();
              }}
              className="bg-[#f03a5f] hover:bg-[#d92348] text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
            >
              {lang === 'sin' ? 'දැන්වීමක් පළ කරන්න (Post Ad Now)' : 'Post Ad Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentsModal({ isOpen, onClose, agents = [] }) {
  if (!isOpen) return null;
  const defaultAgents = [
    { name: "Colombo Central Verified Agent", phone: "+94 77 123 4567", rating: "4.9/5", status: "Active" },
    { name: "Kandy Regional Support Agent", phone: "+94 71 888 9900", rating: "4.8/5", status: "Active" },
    { name: "Galle Southern Coast Agent", phone: "+94 76 555 4433", rating: "4.9/5", status: "Active" },
  ];
  const list = agents && agents.length > 0 ? agents : defaultAgents;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#7c3aed] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm md:text-base">Verified Agents Directory / නියෝජිත සහය</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 text-xs text-gray-700 space-y-3">
          <p className="text-gray-600">දැන්වීම් පළ කිරීමට හෝ සහය ලබා ගැනීමට නිල නියෝජිතයින් අමතන්න:</p>
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {list.map((agent, i) => {
              const cleanPhone = (agent.phone || '').replace(/[^0-9]/g, '');
              return (
                <div key={agent.id || i} className="border border-purple-100 bg-purple-50/40 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{agent.name}</h4>
                      <p className="text-purple-700 font-semibold">{agent.phone}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {agent.status || 'Active'}
                      </span>
                      <p className="text-gray-500 text-[10px] mt-1 font-semibold">★ {agent.rating || '4.9/5'}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-purple-100/80 flex items-center space-x-2">
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold py-1.5 px-3 rounded-lg text-xs transition shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-purple-600" />
                      <span>Call Agent</span>
                    </a>
                    <a
                      href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(agent.name)},%20I%20need%20assistance%20posting%20my%20ad%20on%20Taizer%20Ads.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-1.5 px-3 rounded-lg text-xs transition shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-3 border-t flex justify-end">
            <button onClick={onClose} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold px-5 py-2 rounded-xl text-xs transition">
              Close (වසන්න)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FakeAdsModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#e11d48] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-sm md:text-base">Fake Ads & Scam Awareness / ව්‍යාජ දැන්වීම්</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 text-xs text-gray-700 space-y-3">
          <p className="text-red-700 font-medium">අපගේ ප්‍රජාව රැකගැනීමට ව්‍යාජ දැන්වීම් (Fake Ads / Scams) වාර්තා කරන්න:</p>
          <div className="space-y-2 border border-red-100 bg-red-50/40 p-3 rounded-xl text-gray-700">
            <p>1. කිසිවිටෙකත් කලින් Reload, Crypto හෝ බැංකු තැන්පතු මගින් මුදල් නොගෙවන්න.</p>
            <p>2. අසාමාන්‍ය ලෙස අඩු මිලට ඇති භාණ්ඩ හෝ සේවා පිළිබඳව සැලකිලිමත් වන්න.</p>
            <p>3. යම් දැන්වීමක් සැක සහිත නම් වහාම "Report Fake Ad" හරහා දැනුම් දෙන්න.</p>
          </div>
          <div className="pt-3 border-t flex justify-end">
            <button onClick={onClose} className="bg-[#e11d48] text-white font-bold px-4 py-1.5 rounded-lg text-xs">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= ABOUT MODAL ================= */
export function AboutModal({ isOpen, onClose, onOpenPostModal }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#be123c] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Info className="w-5 h-5 text-pink-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">
                About Taizer Ads Marketplace
              </h3>
              <p className="text-[11px] text-pink-200">
                ශ්‍රී ලංකාවේ ප්‍රමුඛතම Classifieds දැන්වීම් ජාලය
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 text-xs text-gray-700 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
          <div className="bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-100 p-3.5 rounded-xl space-y-1">
            <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm text-[#f03a5f]">
              ✨ Smart, Safe & Transparent Local Marketplace
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Taizer Ads is Sri Lanka's leading digital marketplace connecting buyers, sellers, and service providers with advanced fraud-prevention tools, verified badges, and real-time live avatar highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-start space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 text-xs">Admin Verified</strong>
                <p className="text-[10px] text-gray-500">සෑම දැන්වීමක්ම Admin කණ්ඩායම විසින් පරීක්ෂා කර සත්‍යාපනය කරනු ලැබේ.</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-start space-x-2.5">
              <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 text-xs">Circular Live Stories</strong>
                <p className="text-[10px] text-gray-500">විශේෂ දීමනා සහිත දැන්වීම් මුල් පිටුවේ ඉහළින්ම ප්‍රදර්ශනය කිරීමේ පහසුකම.</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-start space-x-2.5">
              <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 text-xs">Anti-Fraud Shield</strong>
                <p className="text-[10px] text-gray-500">කලින් Advance මුදල් ඉල්ලන වංචනික දැන්වීම් වහාම හඳුනාගෙන අවහිර කිරීම.</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-start space-x-2.5">
              <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 text-xs">Instant WhatsApp Connect</strong>
                <p className="text-[10px] text-gray-500">ගැණුම්කරුවන් සහ විකුණුම්කරුවන් අතර ක්ෂණික WhatsApp සබඳතා.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-gray-500">
              Colombo, Sri Lanka • 24/7 Verified Network
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-1.5 rounded-xl text-xs transition cursor-pointer"
              >
                Close (වසන්න)
              </button>
              {onOpenPostModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPostModal();
                  }}
                  className="bg-[#f03a5f] hover:bg-[#d92348] text-white font-bold px-4 py-1.5 rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  Post an Ad
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= CONTACT MODAL ================= */
export function ContactModal({ isOpen, onClose, siteConfig }) {
  const [subject, setSubject] = useState('');
  const [msgText, setMsgText] = useState('');

  if (!isOpen) return null;

  const whatsappNum = (siteConfig?.contact?.whatsapp || '94771234567').replace(/[^0-9]/g, '');
  const telegramHandle = siteConfig?.contact?.telegram || '+94764097500';
  const emailAddr = siteConfig?.contact?.email || 'support@taizerads.lk';
  const bank = siteConfig?.bankDetails || {
    bankName: "Commercial Bank PLC",
    accountName: "Taizer Ads Advertising",
    accountNumber: "8001 2345 6789",
    branch: "Colombo City Branch",
  };

  const handleSendQuickMessage = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(`Hello Taizer Ads Support,\nSubject: ${subject || 'General Inquiry'}\nMessage: ${msgText}`);
    window.open(`https://wa.me/${whatsappNum}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#16a34a] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Phone className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">
                Official Contact & Support Center
              </h3>
              <p className="text-[11px] text-green-100">
                අප හා සම්බන්ධ වන්න • 24/7 පාරිභෝගික සහය
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 text-xs text-gray-700 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Direct channels grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={`https://wa.me/${whatsappNum}?text=Hello%20Taizer%20Ads%20Admin,%20I%20need%20assistance.`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#f0fdf4] border border-[#bbf7d0] hover:bg-green-100/60 p-3 rounded-xl flex items-center space-x-3 transition group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#16a34a] text-white flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 font-semibold block">Official WhatsApp</span>
                <span className="font-extrabold text-gray-900 text-xs group-hover:text-green-700 truncate block">
                  +{whatsappNum}
                </span>
              </div>
            </a>

            <a
              href={`https://t.me/${telegramHandle.replace(/[^0-9a-zA-Z_]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#eff6ff] border border-[#bfdbfe] hover:bg-blue-100/60 p-3 rounded-xl flex items-center space-x-3 transition group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 font-semibold block">Telegram Support</span>
                <span className="font-extrabold text-gray-900 text-xs group-hover:text-blue-700 truncate block">
                  {telegramHandle}
                </span>
              </div>
            </a>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gray-800 text-white flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 font-semibold block">Official Email</span>
                <span className="font-extrabold text-gray-900 text-xs truncate block">
                  {emailAddr}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gray-800 text-white flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 font-semibold block">Headquarters</span>
                <span className="font-extrabold text-gray-900 text-xs truncate block">
                  Colombo 03, Sri Lanka
                </span>
              </div>
            </div>
          </div>

          {/* Bank Details Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center space-x-1.5 text-gray-900 font-extrabold text-xs">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Official Bank Account (ගෙවීම් සඳහා බැංකු ගිණුම් විස්තර)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-gray-200">
              <div>
                <span className="text-gray-400 block text-[10px]">Bank</span>
                <strong className="text-gray-800">{bank.bankName}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Account Name</span>
                <strong className="text-gray-800">{bank.accountName}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Account Number</span>
                <strong className="text-gray-900 font-mono text-xs">{bank.accountNumber}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Branch</span>
                <strong className="text-gray-800">{bank.branch}</strong>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <form onSubmit={handleSendQuickMessage} className="border border-gray-200 rounded-xl p-3.5 space-y-2.5 bg-white">
            <h4 className="font-bold text-gray-900 text-xs flex items-center space-x-1.5">
              <Send className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Send Instant Message to Admin via WhatsApp</span>
            </h4>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject (e.g. Ad Approval / Credit Deposit / Support)"
              className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
            />
            <textarea
              rows={2}
              required
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Write your question or note here..."
              className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
            />
            <button
              type="submit"
              className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold py-2 px-3 rounded-xl transition text-xs flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Send via WhatsApp</span>
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-1.5 rounded-xl text-xs transition cursor-pointer"
            >
              Close (වසන්න)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= FAQ MODAL ================= */
export function FaqModal({ isOpen, onClose }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!isOpen) return null;

  const faqs = [
    {
      qSin: "දැන්වීමක් පළ කරන්නේ කෙසේද? (How do I post an ad?)",
      qEn: "How do I post an advertisement on Taizer Ads?",
      aSin: "ඉහළ ඇති 'Post Ad' හෝ 'Login / Post Ad' බොත්තම ක්ලික් කරන්න. ඔබගේ දුරකථන අංකය ඇතුළත් කර OTP මගින් ලොග් වී, වර්ගය, පින්තූරය, මිල සහ විස්තරය ඇතුළත් කර Submit කරන්න. Admin අනුමැතියෙන් පසු ඔබේ දැන්වීම සජීවීව මුල් පිටුවේ දිස්වේ.",
      aEn: "Click the 'Post Ad' button at the top. Log in with your phone number via OTP, select your category, upload photos, enter your price and details, and click Submit. Once approved by our admin team, your ad goes live!"
    },
    {
      qSin: "Normal Ad, Super Ad සහ VIP Ad වල වෙනස කුමක්ද?",
      qEn: "What is the difference between Normal, Super, and VIP Ads?",
      aSin: "Normal Ad සාමාන්‍ය ලැයිස්තුවේ පෙන්වයි. Super Ad රන්වන් පැහැති Highlight එකක් සහිතව ප්‍රමුඛව දිස්වේ. VIP Ad රතු පැහැති VIP Badge එකක් සහිතව වැඩිම පිරිසක් වෙත ළඟා වන ඉහළම ස්ථානවල දිස්වේ.",
      aEn: "Normal Ads are standard listings. Super Ads get high visibility with a gold highlight and top priority placement. VIP Ads feature bold red VIP badges and maximum exposure across all category feeds."
    },
    {
      qSin: "රවුම් Live Story Avatars / Special Offer එකට මගේ දැන්වීම දමන්නේ කෙසේද?",
      qEn: "How can I feature my ad in the top Circular Live Stories?",
      aSin: "ඔබගේ User Dashboard එකෙහි 'මගේ දැන්වීම් (My Ads)' වෙත යන්න. එහි ඇති 'Request Special Offer Spot' ක්ලික් කර, ඔබේ විශේෂ වට්ටම් ලේබලය (උදා: 🔥 50% OFF) ඇතුළත් කර නියමිත ගාස්තුව ගෙවා ඉල්ලුම් කරන්න. Admin විසින් එය සත්‍යාපනය කර මුල් පිටුවේ රවුම් Story Avatars වලට එක් කරනු ලැබේ.",
      aEn: "Go to your User Dashboard under 'My Ads'. Click 'Request Special Offer Spot', enter your custom promo tag (e.g. 🔥 50% OFF), and pay the activation fee. The admin will verify and place your ad in the top circular bar!"
    },
    {
      qSin: "පැකේජ සඳහා මුදල් ගෙවන්නේ (Deposit කරන්නේ) කෙසේද?",
      qEn: "How do I deposit wallet credits or pay for ad packages?",
      aSin: "අපගේ නිල Commercial Bank PLC ගිණුමට තැන්පත් කර, රිසිට්පත WhatsApp (+94 77 123 4567) වෙත යොමු කරන්න. මිනිත්තු කිහිපයක් ඇතුළත ඔබේ Wallet ශේෂයට Credits එකතු කරනු ලැබේ.",
      aEn: "Transfer funds to our official Commercial Bank account and share the receipt slip via WhatsApp to +94 77 123 4567. Credits will be loaded into your account within minutes."
    },
    {
      qSin: "කලින් Advance මුදල් ඉල්ලන වංචනිකයන්ගෙන් ආරක්ෂා වන්නේ කෙසේද?",
      qEn: "How do I protect myself from advance payment scams?",
      aSin: "භාණ්ඩ හෝ සේවා ලබා ගැනීමට පෙර කිසිවිටෙකත් Reload, Crypto හෝ බැංකු තැන්පතු මගින් මුදල් නොගෙවන්න. සියලු ගනුදෙනු පෞද්ගලිකව හමුවී සත්‍යාපනය කිරීමෙන් පසු පමණක් සිදු කරන්න.",
      aEn: "Never send advance payments (Reload, Crypto, or Bank transfers) before receiving and inspecting the goods or services. Always verify everything in safe public locations."
    },
    {
      qSin: "දැන්වීම පළ කළ පසු වෙනස්කම් (Edit) හෝ ඉවත් (Delete) කළ හැකිද?",
      qEn: "Can I edit or delete my ad after posting?",
      aSin: "ඔව්. 'My Ads' වෙත ගොස් ඕනෑම අවස්ථාවක 'Edit' ක්ලික් කර විස්තර සහ පින්තූර වෙනස් කිරීමට හෝ 'Delete' ක්ලික් කර දැන්වීම සම්පූර්ණයෙන්ම ඉවත් කිරීමට ඔබට හැකියාව ඇත.",
      aEn: "Yes! Simply navigate to 'My Ads' in your dashboard where you can edit descriptions, prices, photos, or delete your ad permanently at any time."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#7c3aed] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <HelpCircle className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">
                Frequently Asked Questions (FAQ)
              </h3>
              <p className="text-[11px] text-purple-200">
                නිතර අසන ප්‍රශ්න සහ පිළිතුරු
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Accordion list */}
        <div className="p-5 text-xs text-gray-700 space-y-2.5 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-3 text-left font-bold text-gray-900 flex items-center justify-between space-x-2 hover:bg-purple-50/50 transition cursor-pointer"
                >
                  <span className="text-xs">{item.qSin}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 text-[11.5px] text-gray-600 border-t border-gray-100 bg-white space-y-1.5 animate-in fade-in duration-150">
                    <p className="leading-relaxed font-medium text-gray-800">{item.aSin}</p>
                    <p className="text-[10.5px] text-gray-500 italic border-l-2 border-purple-300 pl-2">
                      {item.aEn}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer"
            >
              I Understand (තේරුම් ගතිමි)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
