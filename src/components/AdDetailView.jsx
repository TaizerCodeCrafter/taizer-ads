import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ThumbsUp, 
  Heart, 
  Share2, 
  Eye, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Send, 
  Phone,
  Bookmark,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';

export default function AdDetailView({ 
  ad, 
  onBack, 
  onToggleSave, 
  onLike,
  onShowToast,
  onAddComplaint
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(ad.likes || 23000);
  const [isComplainModalOpen, setIsComplainModalOpen] = useState(false);
  const [complainReason, setComplainReason] = useState('Fake / Inaccurate Information');
  const [complainText, setComplainText] = useState('');

  const isFake = ad.isFake || ad.status === 'Fake Ad' || ad.category === 'fake';

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      onLike && onLike(ad.id);
      onShowToast && onShowToast('You liked this advertisement!');
    } else {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast && onShowToast('Ad link copied to clipboard!');
  };

  const handleComplainSubmit = (e) => {
    e.preventDefault();
    if (!complainText.trim()) return;

    if (onAddComplaint) {
      onAddComplaint({
        adId: ad.id,
        adTitle: ad.title || 'Untitled Ad',
        category: complainReason,
        details: complainText.trim()
      });
    }

    setIsComplainModalOpen(false);
    setComplainText('');
    onShowToast && onShowToast('පැමිණිල්ල සාර්ථකව යොමු කරන ලදී (Complaint submitted to Admin)');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs md:text-sm font-bold text-[#f03a5f] hover:text-[#d92348] transition bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Ads (ආපසු මුල් පිටුවට)</span>
        </button>

        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
          Ad ID: #{ad.id}
        </span>
      </div>

      {/* Scam / Fake Ad Warning Alert */}
      {isFake && (
        <div className="bg-red-600 text-white rounded-xl p-4 shadow-md flex items-start space-x-3.5 border-2 border-red-700 animate-in fade-in duration-200">
          <AlertOctagon className="w-7 h-7 flex-shrink-0 text-white mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h2 className="font-black text-sm sm:text-base uppercase tracking-wide flex items-center space-x-2">
              <span>🚫 VERIFIED FAKE AD & SCAM ALERT / ව්‍යාජ දැන්වීමක් බවට තහවුරු කර ඇත!</span>
            </h2>
            <p className="text-xs text-red-100 font-semibold leading-relaxed">
              මෙම දැන්වීම්කරු විසින් කලින් Reload, Crypto හෝ බැංකු තැන්පතු ඉල්ලා මුදල් වංචා කළ බවට පරිශීලකයින්ගෙන් පැමිණිලි ලැබී Admin විසින් ව්‍යාජ දැන්වීමක් ලෙස ලේඛනගත කර ඇත. 
              <strong> කිසිදු හේතුවක් මත මුදල් හෝ Reload නොදෙන්න!</strong>
            </p>
            <p className="text-[11px] text-red-200 font-medium">
              WARNING: This advertisement has been verified as FRAUDULENT by Taizer Ads administrators. Under no circumstances should you deposit money or send reloads.
            </p>
          </div>
        </div>
      )}

      {/* 1. Header Title & Meta */}
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-gray-900 uppercase">
          {ad.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-gray-600">
          <span className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>Location: {ad.location || 'Colombo'}</span>
          </span>
          <span>•</span>
          <span>{ad.categoryLabel || 'Services'}</span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span>{ad.views || '65.1K Views'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{ad.postedTime || '52 minutes ago'}</span>
          </span>
        </div>
      </div>

      {/* 2. Three Black Action Buttons: Like, Save, Share */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition shadow-sm ${
            liked 
              ? 'bg-[#f03a5f] text-white' 
              : 'bg-[#0f172a] hover:bg-black text-white'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{liked ? 'Liked' : 'Like'}</span>
        </button>

        <button
          onClick={() => onToggleSave && onToggleSave(ad.id)}
          className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition shadow-sm ${
            ad.isSaved
              ? 'bg-[#b91c1c] text-white'
              : 'bg-[#0f172a] hover:bg-black text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${ad.isSaved ? 'fill-white' : ''}`} />
          <span>{ad.isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center space-x-2 bg-[#0f172a] hover:bg-black text-white py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition shadow-sm"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* 3. Price and Total Likes Row */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-2xl sm:text-3xl font-extrabold text-[#b91c1c]">
          {ad.price || 'Rs. 1,500.00'}
        </div>
        <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-gray-700">
          <ThumbsUp className="w-4 h-4 text-[#f03a5f]" />
          <span>
            {likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount} Likes
          </span>
        </div>
      </div>

      {/* 4. Red/Pink Telegram Warning Box */}
      <div className="bg-[#fff1f2] border border-red-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-[#be123c] space-y-0.5 shadow-xs">
        <p className="font-semibold">
          <strong>WhatsApp</strong> නිතරම අවහිර වන බැවින් <strong>Telegram</strong> මගින් සම්බන්ධ වන්න.
        </p>
        <p className="font-normal text-red-600">
          <strong>WhatsApp</strong> is always blocked so connect via <strong>Telegram</strong>.
        </p>
      </div>

      {/* 5. Contact Buttons (WhatsApp & Telegram) */}
      <div className="space-y-2.5">
        {/* WhatsApp Green Outline Button */}
        <a
          href={`https://wa.me/${(ad.whatsapp || '+94767601924').replace(/\+/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center space-x-2 border-2 border-[#16a34a] hover:bg-green-50/70 text-[#16a34a] font-bold py-2.5 px-4 rounded-lg text-sm sm:text-base transition shadow-xs"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>{ad.whatsapp || '+94767601924'}</span>
        </a>

        {/* Telegram Blue Outline Button */}
        <a
          href={`https://t.me/${(ad.telegram || '+94764097500').replace(/\+/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center space-x-2 border-2 border-[#0284c7] hover:bg-sky-50/70 text-[#0284c7] font-bold py-2.5 px-4 rounded-lg text-sm sm:text-base transition shadow-xs"
        >
          <Send className="w-5 h-5" />
          <span>{ad.telegram || '+94764097500'}</span>
        </a>
      </div>

      {/* 6. Image Preview Showcase */}
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex justify-center max-h-[460px] relative">
        <img
          src={ad.image}
          alt={ad.title}
          className={`w-full h-full object-contain sm:object-cover max-h-[460px] ${isFake ? 'grayscale contrast-125' : ''}`}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80';
          }}
        />
        {isFake && (
          <div className="absolute inset-0 bg-red-950/75 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-4">
            <span className="bg-red-600 text-white text-sm sm:text-xl font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl border-2 border-white animate-pulse">
              🚫 VERIFIED FAKE AD / ව්‍යාජයි
            </span>
            <p className="text-red-200 font-extrabold text-xs sm:text-sm mt-2 tracking-wide">
              ⚠️ DO NOT SEND MONEY OR RELOAD (මුදල් නොගෙවන්න) ⚠️
            </p>
          </div>
        )}
      </div>

      {/* 7. Detailed Description & Packages (Screenshot 2 style) */}
      <div className="border border-gray-200 rounded-xl p-5 bg-[#fafafa] space-y-3.5">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b pb-2">
          Service Details & Tariff Information
        </h3>

        <div className="space-y-1.5 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
          {ad.packages && ad.packages.length > 0 ? (
            ad.packages.map((line, idx) => (
              <p key={idx} className={line === "" ? "h-2" : line.includes("PACKAGES") || line.includes("WELCOME") ? "font-bold text-gray-900 pt-1" : ""}>
                {line}
              </p>
            ))
          ) : (
            <p>{ad.description}</p>
          )}
        </div>
      </div>

      {/* 8. Repeated Contact Buttons (Screenshot 3 style) */}
      <div className="space-y-2.5 pt-2">
        <a
          href={`https://wa.me/${(ad.whatsapp || '+94767601924').replace(/\+/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center space-x-2 border-2 border-[#16a34a] hover:bg-green-50/70 text-[#16a34a] font-bold py-2.5 px-4 rounded-lg text-sm sm:text-base transition shadow-xs"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>{ad.whatsapp || '+94767601924'}</span>
        </a>

        <a
          href={`https://t.me/${(ad.telegram || '+94764097500').replace(/\+/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center space-x-2 border-2 border-[#0284c7] hover:bg-sky-50/70 text-[#0284c7] font-bold py-2.5 px-4 rounded-lg text-sm sm:text-base transition shadow-xs"
        >
          <Send className="w-5 h-5" />
          <span>{ad.telegram || '+94764097500'}</span>
        </a>
      </div>

      {/* 9. Light Blue Disclaimer / Verification Warning Box (Screenshot 3) */}
      <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 sm:p-5 text-xs sm:text-sm text-[#1e40af] space-y-2.5 leading-relaxed">
        <p className="font-semibold text-[#1e3a8a]">
          <strong>Taizer Ads</strong> අප විසින් සහතික කර ඇති සේවා සඳහා අප ආයතනය වග කියන අතර අනෙකුත් ඕනෑම සේවාවක් සඳහා හමු වීමට පෙර හෝ හමුවී ඔබ විසින් කරන ලද ගනුදෙනු සඳහා අප ආයතනය වග කියන්නේ නැත.
        </p>

        <p className="font-medium text-[#1d4ed8]">
          Our company is responsible for the services we guarantee and our company is not responsible for the transactions made by you before or after meeting for any other services.
        </p>

        <p className="text-gray-700">
          ඔබ සේවාවක් ලබා ගැනීමට යාමේදී හමු වූ පසුව පමණක් මුදල් ගෙවන්න. මෙය නිදහස් වෙබ් අඩවියකි. අප ඔබට සපයාදී ඇත්තේ නිදහස් දැන්වීම් පල කරගැනීමට ඇති මාධ්‍යයක් පමණි. ඔබගේ ගනුදෙනු වලට අප වගකිවයුතු නැත. සේවාවන් සඳහා <strong>VERIFIED</strong> දී ඇති සේවාවන් නියෝජිතයන් මගින් තහවුරු කොට ඇති විශ්වාසනීය සේවාවන්වේ.
        </p>

        <p className="text-gray-700">
          If you going to get a service please don't deposit money before meet. This is Only a Classified Ads website, We only provide classifieds. We are not responsible for transactions. If you pick services Use VERIFIED ADS for reliable services.
        </p>
      </div>

      {/* 10. Complaints & Support Section (Screenshot 3) */}
      <div className="space-y-3 pt-2">
        <h4 className="font-bold text-center text-sm text-gray-900">
          දැන්වීම සම්බන්ධ පැමිණිලි (Ad Complaints & Inquiries)
        </h4>

        <button
          onClick={() => setIsComplainModalOpen(true)}
          className="w-full bg-[#0f172a] hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Taizer Ads Support Complain Form</span>
        </button>

        <a
          href="https://wa.me/94771234567"
          target="_blank"
          rel="noreferrer"
          className="w-full bg-[#0f172a] hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-sm"
        >
          <MessageCircle className="w-4 h-4 text-green-400 fill-current" />
          <span>Taizer Ads Support Team</span>
        </a>
      </div>

      {/* Complain Modal */}
      {isComplainModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#0f172a] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm">Ad Complaint Form</h3>
              </div>
              <button 
                onClick={() => setIsComplainModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleComplainSubmit} className="p-5 space-y-3.5 text-xs text-gray-700">
              <p className="text-gray-600">
                Ad ID: <strong>#{ad.id}</strong> - {ad.title}
              </p>
              <div>
                <label className="block font-bold mb-1">Reason for Complaint / හේතුව</label>
                <select 
                  value={complainReason}
                  onChange={(e) => setComplainReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#f03a5f] bg-white"
                >
                  <option>Fake / Inaccurate Information</option>
                  <option>Scam or Advance Payment Request</option>
                  <option>Invalid Phone / Telegram Number</option>
                  <option>Duplicate or Spam Content</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Details / වැඩිදුර විස්තර</label>
                <textarea
                  rows={3}
                  required
                  value={complainText}
                  onChange={(e) => setComplainText(e.target.value)}
                  placeholder="පැමිණිල්ල පිළිබඳ විස්තරය මෙහි ලියන්න..."
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#f03a5f]"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsComplainModalOpen(false)}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#f03a5f] hover:bg-[#d92348] text-white font-bold rounded-lg transition"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
