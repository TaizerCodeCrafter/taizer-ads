import React, { useState } from 'react';
import { Heart, Eye, Clock, Phone, MessageCircle, Bookmark, CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';

export default function AdCard({ ad, onSelectAd, onToggleSave, onLike }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(ad.likes);

  const isFake = ad.isFake || ad.status === 'Fake Ad' || ad.category === 'fake';

  const handleLike = (e) => {
    e.stopPropagation();
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      onLike && onLike(ad.id);
    } else {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onToggleSave && onToggleSave(ad.id);
  };

  // Border & badge colors based on badgeType or fake status
  const getBadgeStyle = () => {
    if (isFake) {
      return {
        cardBorder: 'border-2 border-red-600 bg-[#fff5f5]',
        badgeBg: 'bg-red-600 text-white animate-pulse',
        highlightColor: 'text-red-600'
      };
    }
    if (ad.badgeType === 'Super Ad') {
      return {
        cardBorder: 'border-2 border-[#ca8a04] bg-[#fffdfa]',
        badgeBg: 'bg-[#ca8a04] text-white',
        highlightColor: 'text-[#ca8a04]'
      };
    }
    if (ad.badgeType === 'VIP Ad') {
      return {
        cardBorder: 'border-2 border-[#dc2626] bg-[#fffafb]',
        badgeBg: 'bg-[#dc2626] text-white',
        highlightColor: 'text-[#dc2626]'
      };
    }
    // Default or NRA Ad
    return {
      cardBorder: 'border-2 border-[#2563eb] bg-[#f8fbff]',
      badgeBg: 'bg-[#2563eb] text-white',
      highlightColor: 'text-[#2563eb]'
    };
  };

  const style = getBadgeStyle();

  return (
    <div 
      onClick={() => onSelectAd && onSelectAd(ad)}
      className={`rounded-xl p-3.5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${style.cardBorder}`}
    >
      {/* Top Header Metrics Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200/70 text-xs font-semibold">
        {/* Badge Pill */}
        <span className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black tracking-wide shadow-xs ${style.badgeBg}`}>
          {isFake ? '🚫 FAKE AD (ව්‍යාජයි)' : ad.badgeType}
        </span>

        {/* Likes, Views & Time ago */}
        <div className="flex items-center space-x-3 sm:space-x-4 text-[11px] sm:text-xs text-gray-700">
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center space-x-1 hover:text-[#f03a5f] transition"
            title="Like Ad"
          >
            <Heart 
              className={`w-3.5 h-3.5 ${liked ? 'fill-[#f03a5f] text-[#f03a5f]' : 'text-gray-500'}`} 
            />
            <span className={liked ? 'text-[#f03a5f] font-bold' : ''}>
              {likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount} Likes
            </span>
          </button>

          <div className="flex items-center space-x-1 text-gray-600">
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span>{ad.views}</span>
          </div>

          <div className="flex items-center space-x-1 text-gray-500 font-normal">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>{ad.postedTime}</span>
          </div>
        </div>
      </div>

      {/* Main Content: Thumbnail & Details (Horizontal on phone and desktop matching Image 2) */}
      <div className="flex flex-row gap-2.5 sm:gap-3.5 items-start">
        {/* Left Thumbnail */}
        <div className="w-28 h-28 sm:w-44 sm:h-36 flex-shrink-0 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
          <img
            src={ad.image}
            alt={ad.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isFake ? 'grayscale contrast-125' : ''}`}
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80';
            }}
          />
          {isFake && (
            <div className="absolute inset-0 bg-red-950/80 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-1.5 z-10">
              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-md animate-pulse">
                🚫 FAKE AD
              </span>
              <span className="text-[8px] text-red-200 mt-0.5 font-bold leading-tight">
                මුදල් නොගෙවන්න
              </span>
            </div>
          )}
          {ad.isSaved && !isFake && (
            <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-xs p-1 rounded-full text-white">
              <Bookmark className="w-3 h-3 fill-red-500 text-red-500" />
            </div>
          )}
        </div>

        {/* Right Info Section */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {isFake && (
              <div className="bg-red-100 border border-red-300 text-red-800 text-[11px] font-extrabold px-2 py-1 rounded-md mb-2 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                <span>අවවාදයයි: Admin විසින් ව්‍යාජ ලෙස තහවුරු කළ දැන්වීමකි!</span>
              </div>
            )}

            {/* Badges & Rating (Image 2 style) */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              {!isFake && (
                <span className="bg-[#16a34a] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm flex items-center space-x-1 shadow-xs">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Cash Back Guaranteed</span>
                </span>
              )}

              {ad.realImage && !isFake && (
                <span className="bg-[#7c3aed] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                  Real Image
                </span>
              )}

              {ad.rating && !isFake && (
                <span className="text-amber-600 text-[11px] font-bold flex items-center space-x-0.5">
                  <span>★</span>
                  <span>{ad.rating}</span>
                </span>
              )}
            </div>

            {/* Title with Verified Checkmark */}
            <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 hover:text-[#f03a5f] transition flex items-start">
              {!isFake && <span className="text-emerald-600 mr-1 flex-shrink-0">✅</span>}
              <span>{ad.title}</span>
            </h3>

            {/* Location & Price Badge Row */}
            <div className="flex items-center space-x-2 text-[11px] text-gray-500 mt-1">
              <span className="inline-flex items-center space-x-1 text-gray-700 font-semibold bg-gray-100 px-2 py-0.5 rounded">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                <span>{ad.location || 'Colombo'}</span>
              </span>
              {ad.price && (
                <span className="font-extrabold text-[#f03a5f]">
                  {ad.price}
                </span>
              )}
            </div>

            {/* Description Snippet */}
            <p className="text-[11px] sm:text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
              {ad.description}
            </p>
          </div>

          {/* Action Row: Phone, WhatsApp, Save */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              {ad.phone && (
                <a
                  href={`tel:${ad.phone}`}
                  className="inline-flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded transition"
                >
                  <Phone className="w-3 h-3 text-[#f03a5f]" />
                  <span>{ad.phone}</span>
                </a>
              )}

              {ad.whatsapp && (
                <a
                  href={`https://wa.me/${ad.whatsapp.replace(/\+/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#16a34a] text-xs font-semibold px-2.5 py-1 rounded transition"
                >
                  <MessageCircle className="w-3 h-3 fill-current" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              className={`text-xs font-semibold flex items-center space-x-1 px-2.5 py-1 rounded transition ${
                ad.isSaved 
                  ? 'bg-red-50 text-[#f03a5f]' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${ad.isSaved ? 'fill-current text-[#f03a5f]' : ''}`} />
              <span>{ad.isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
