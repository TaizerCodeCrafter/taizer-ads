import React from 'react';

export default function TaizerLogo({ 
  size = 'md', 
  showText = true, 
  showTagline = true, 
  isSin = false,
  className = '' 
}) {
  // Size presets for emblem
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl'
  };

  return (
    <div className={`flex items-center space-x-2.5 sm:space-x-3 group select-none ${className}`}>
      {/* Faceted 3D "T" Emblem */}
      <div className={`${sizeClasses[size] || sizeClasses.md} rounded-xl relative p-0.5 bg-gradient-to-br from-rose-500 via-amber-400 to-rose-600 shadow-lg shadow-rose-950/40 group-hover:scale-105 transition-transform flex-shrink-0`}>
        <div className="w-full h-full rounded-[10px] bg-[#0c0f1d] flex items-center justify-center overflow-hidden relative">
          {/* Subtle glowing radial backlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 via-transparent to-amber-500/20" />

          {/* Stylized Electric "T" Vector Path */}
          <svg 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-1.5 drop-shadow-[0_2px_8px_rgba(244,63,94,0.6)]"
          >
            {/* Top Bar Left Wing */}
            <path 
              d="M6 14L20 14L16 18L8 18L6 14Z" 
              fill="url(#topBarLeft)" 
            />
            {/* Top Bar Right Wing */}
            <path 
              d="M28 14L42 14L40 18L32 18L28 14Z" 
              fill="url(#topBarRight)" 
            />
            {/* Central Electric Centerpiece and T-Head */}
            <path 
              d="M18 12L30 12L27 19L21 19L18 12Z" 
              fill="url(#goldCenter)" 
            />
            {/* Left Lower Facet */}
            <path 
              d="M16 19L24 38L21 40L12 21L16 19Z" 
              fill="url(#rubyFacetLeft)" 
            />
            {/* Right Main Spine */}
            <path 
              d="M24 19L32 19L25 42L23 42L24 19Z" 
              fill="url(#goldSpine)" 
            />
            {/* Sharp Bottom Point Tip */}
            <path 
              d="M23 42L25 42L24 45L23 42Z" 
              fill="#fbbf24" 
            />

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="topBarLeft" x1="6" y1="14" x2="20" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f43f5e" />
                <stop offset="1" stopColor="#be123c" />
              </linearGradient>
              <linearGradient id="topBarRight" x1="42" y1="14" x2="28" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#ea580c" />
              </linearGradient>
              <linearGradient id="goldCenter" x1="18" y1="12" x2="30" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef08a" />
                <stop offset="0.5" stopColor="#f59e0b" />
                <stop offset="1" stopColor="#e11d48" />
              </linearGradient>
              <linearGradient id="rubyFacetLeft" x1="12" y1="19" x2="24" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e11d48" />
                <stop offset="1" stopColor="#881337" />
              </linearGradient>
              <linearGradient id="goldSpine" x1="24" y1="19" x2="25" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fde047" />
                <stop offset="0.4" stopColor="#f59e0b" />
                <stop offset="1" stopColor="#be123c" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-1.5 leading-none">
            <span className={`${textSizes[size] || textSizes.md} font-black tracking-tight bg-gradient-to-r from-white via-rose-100 to-amber-300 bg-clip-text text-transparent truncate`}>
              Taizer
            </span>
            <span className={`${textSizes[size] || textSizes.md} font-black tracking-tight text-amber-400`}>
              Ads
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-rose-500/30 to-amber-500/30 text-amber-300 border border-amber-500/40 rounded-full shadow-xs">
              LK
            </span>
          </div>

          {showTagline && (
            <span className="text-[9px] text-rose-200/80 font-semibold tracking-wide hidden sm:inline-block mt-0.5">
              {isSin ? 'ශ්‍රී ලංකාවේ ප්‍රමුඛතම දැන්වීම් ජාලය' : "Sri Lanka's #1 Classifieds Platform"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
