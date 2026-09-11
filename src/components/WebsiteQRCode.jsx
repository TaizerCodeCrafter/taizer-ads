import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles, 
  X, 
  Maximize2 
} from 'lucide-react';

export default function WebsiteQRCode({ currentLang = 'sin' }) {
  const isSin = currentLang === 'sin';
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Target website URL
  const siteUrl = typeof window !== 'undefined' && window.location.origin 
    ? window.location.origin 
    : 'https://taizerads.lk';

  useEffect(() => {
    // Generate high quality QR code data URL (points to website URL)
    QRCode.toDataURL(siteUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR code', err));
  }, [siteUrl]);

  // Copy website URL to clipboard
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Download high-resolution branded QR Code poster
  const handleDownloadQR = () => {
    if (!qrDataUrl) return;

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');

    // 1. Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 760);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.4, '#1e1b4b');
    gradient.addColorStop(1, '#881337');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 760);

    // Subtle border
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 580, 740);

    // 2. Header Brand Text
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TAIZER ADS', 300, 65);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('SRI LANKA NUMBER 1 CLASSIFIEDS MARKETPLACE', 300, 95);

    // Rounded card for QR
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(100, 120, 400, 420, 24);
    ctx.fill();

    // 3. Draw QR Image in Center
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 120, 140, 360, 360);

      // Mini logo badge in center of QR
      ctx.fillStyle = '#881337';
      ctx.beginPath();
      ctx.arc(300, 320, 32, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TAIZER', 300, 326);

      // 4. Instructions below QR
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('SCAN WITH YOUR PHONE CAMERA', 300, 580);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(siteUrl.replace(/^https?:\/\//, ''), 300, 620);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText('Post Ads • Find Spas, Rooms, Services & More', 300, 660);

      ctx.fillStyle = '#fda4af';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('24/7 Hotline & WhatsApp Support', 300, 695);

      // Trigger download
      const downloadLink = document.createElement('a');
      downloadLink.download = 'taizer_ads_official_qr.png';
      downloadLink.href = canvas.toDataURL('image/png');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src = qrDataUrl;
  };

  // Web Share API or WhatsApp Fallback
  const handleShare = async () => {
    const shareData = {
      title: 'Taizer Ads - Sri Lanka Classifieds',
      text: 'Scan or visit Taizer Ads to discover verified ads, services, and local marketplace deals in Sri Lanka!',
      url: siteUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleWhatsAppShare();
        }
      }
    } else {
      handleWhatsAppShare();
    }
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hello! Explore Taizer Ads - Sri Lanka's Premier Online Classifieds Marketplace:\n\n🌐 Website: ${siteUrl}\n\nFind Spas, Jobs, Rentals, Vehicles, Personal Ads and post your own advertisements easily!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <>
      {/* Footer QR Code Card Widget */}
      <div className="bg-gradient-to-br from-slate-900 via-[#1e1b4b]/80 to-[#881337]/70 border-2 border-rose-500/40 rounded-2xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden backdrop-blur-md group hover:border-rose-400 transition-all duration-300">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-500/20 blur-2xl pointer-events-none rounded-full group-hover:bg-rose-500/30 transition" />

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          {/* QR Code Frame */}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="relative cursor-pointer bg-white p-2.5 rounded-xl shadow-lg border-2 border-rose-400/80 group/qr shrink-0 transition hover:scale-105 active:scale-95"
            title="Click to Enlarge QR Code"
          >
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt="Taizer Ads Official QR Code" 
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-lg"
              />
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-100 flex items-center justify-center rounded-lg">
                <QrCode className="w-8 h-8 text-gray-400 animate-pulse" />
              </div>
            )}

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover/qr:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold space-x-1">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{isSin ? 'විශාල කර බලන්න' : 'Enlarge'}</span>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="space-y-2.5 flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 flex-wrap gap-y-1">
              <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <QrCode className="w-3 h-3" />
                <span>Official QR Code</span>
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Scan & Open Website</span>
              </span>
            </div>

            <h4 className="font-extrabold text-sm sm:text-base text-white leading-snug">
              {isSin ? 'QR Code එක Scan කර වෙබ් අඩවියට පිවිසෙන්න' : 'Scan to open Taizer Ads Marketplace'}
            </h4>

            <p className="text-[11px] text-gray-300 leading-relaxed">
              {isSin
                ? 'ඕනෑම Smart Phone එකකින් මෙම QR එක Scan කිරීම මගින් වෙබ් අඩවියට ක්ෂණිකව පිවිසිය හැක. ඔබගේ මිතුරන් සමඟද Share කරන්න.'
                : 'Scan with any mobile phone camera or QR scanner to access Taizer Ads directly. Download and share anytime!'}
            </p>

            {/* Quick Action Buttons: Download, Share, WhatsApp, Copy Link */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              {/* Download Button */}
              <button
                type="button"
                onClick={handleDownloadQR}
                className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-md active:scale-95 transition cursor-pointer"
                title="Download High-Quality QR Poster PNG"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isSin ? 'Download (බාගත කරන්න)' : 'Download QR'}</span>
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-md active:scale-95 transition cursor-pointer"
                title="Share via Apps"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isSin ? 'Share (බෙදාහරින්න)' : 'Share'}</span>
              </button>

              {/* WhatsApp Share Button */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="bg-[#25d366] hover:bg-[#20bd5a] text-black text-xs font-black px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-md active:scale-95 transition cursor-pointer"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-black text-black" />
                <span>WhatsApp</span>
              </button>

              {/* Copy Website Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center space-x-1.5 transition active:scale-95 cursor-pointer"
                title="Copy Website URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isSin ? 'Copied! ✓' : 'Copied! ✓') : (isSin ? 'Copy Link' : 'Copy Link')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged QR Code Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150 text-center">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-rose-500/20 text-rose-400 mb-1">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">
                Taizer Ads Official QR Code
              </h3>
              <p className="text-xs text-gray-400">
                {isSin ? 'දුරකථනයෙන් Scan කර වෙබ් අඩවියට පිවිසෙන්න' : 'Scan with your mobile camera to open the website'}
              </p>
            </div>

            {/* Big QR Code display */}
            <div className="flex justify-center my-2">
              <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-rose-500/80 inline-block">
                <img 
                  src={qrDataUrl} 
                  alt="Taizer Ads QR" 
                  className="w-56 h-56 object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Website URL chip */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-rose-300 truncate">{siteUrl}</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="ml-2 text-gray-400 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadQR}
                className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="bg-[#25d366] hover:bg-[#20bd5a] text-black font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Online</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
