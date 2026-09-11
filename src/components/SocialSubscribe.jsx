import React from 'react';
import { MessageCircle, Send, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function SocialSubscribe({ onOpenAgents, onOpenFakeAds }) {
  return (
    <div className="space-y-2.5 py-1">
      {/* Row 1: Social Subscribe Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* WhatsApp */}
        <a
          href="https://whatsapp.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 bg-[#25d366] hover:bg-[#20bd5a] text-white text-xs font-semibold px-4 py-1.5 rounded-md transition shadow-sm"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>Subscribe</span>
        </a>

        {/* Telegram */}
        <a
          href="https://telegram.org"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-semibold px-4 py-1.5 rounded-md transition shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Subscribe</span>
        </a>

        {/* X / Twitter */}
        <a
          href="https://x.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition shadow-sm"
        >
          <span className="font-bold text-xs">𝕏</span>
          <span>Subscribe</span>
        </a>
      </div>

      {/* Row 2: See All Agents & Browse Fake Ads */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onOpenAgents}
          className="flex items-center space-x-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold px-4 py-1.5 rounded-md transition shadow-sm"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>See All Agents</span>
        </button>

        <button
          onClick={onOpenFakeAds}
          className="flex items-center space-x-1.5 bg-[#0f172a] hover:bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-md transition shadow-sm"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Browse Fake Ads</span>
        </button>
      </div>
    </div>
  );
}
