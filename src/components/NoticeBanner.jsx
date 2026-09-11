import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, Megaphone, X, Pin } from 'lucide-react';

export default function NoticeBanner({ notices = [], currentLang = 'sin' }) {
  const [dismissedIds, setDismissedIds] = useState([]);

  // Filter out inactive and locally dismissed notices
  const activeNotices = notices.filter(
    (n) => n.isActive !== false && !dismissedIds.includes(n.id)
  );

  if (activeNotices.length === 0) return null;

  // Sort pinned notices first
  const sortedNotices = [...activeNotices].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const handleDismiss = (id) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-2.5 w-full">
      {sortedNotices.map((notice) => {
        const isDanger = notice.type === 'danger';
        const isWarning = notice.type === 'warning';
        const isSuccess = notice.type === 'success';

        // Styling based on notice severity
        let containerStyle = 'bg-blue-50/90 border-blue-200 text-blue-950';
        let badgeStyle = 'bg-blue-600 text-white';
        let iconElement = <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />;

        if (isDanger) {
          containerStyle = 'bg-red-50/95 border-red-300 text-red-950 shadow-xs';
          badgeStyle = 'bg-red-600 text-white animate-pulse';
          iconElement = <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0" />;
        } else if (isWarning) {
          containerStyle = 'bg-amber-50/95 border-amber-300 text-amber-950';
          badgeStyle = 'bg-amber-600 text-white';
          iconElement = <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />;
        } else if (isSuccess) {
          containerStyle = 'bg-green-50/95 border-green-300 text-green-950';
          badgeStyle = 'bg-green-600 text-white';
          iconElement = <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />;
        }

        const title = currentLang === 'sin' ? (notice.titleSin || notice.titleEn) : (notice.titleEn || notice.titleSin);
        const content = currentLang === 'sin' ? (notice.contentSin || notice.contentEn) : (notice.contentEn || notice.contentSin);
        const badgeText = currentLang === 'sin' ? (notice.badgeSin || notice.badgeEn || 'නිවේදනයයි') : (notice.badgeEn || notice.badgeSin || 'Notice');

        return (
          <div
            key={notice.id}
            className={`rounded-xl border p-3 md:p-3.5 transition flex items-start justify-between gap-3 ${containerStyle}`}
          >
            <div className="flex items-start space-x-2.5 min-w-0">
              <div className="mt-0.5">{iconElement}</div>
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wide shadow-xs ${badgeStyle}`}>
                    {badgeText}
                  </span>
                  {notice.isPinned && (
                    <span className="flex items-center space-x-0.5 text-[10px] font-bold text-gray-500 bg-white/70 px-1.5 py-0.5 rounded border border-gray-200">
                      <Pin className="w-3 h-3 text-[#f03a5f]" />
                      <span>Pinned</span>
                    </span>
                  )}
                  <h4 className="font-extrabold text-xs md:text-sm tracking-tight leading-snug truncate sm:whitespace-normal">
                    {title}
                  </h4>
                </div>
                <p className="text-[11px] md:text-xs leading-relaxed opacity-90 font-medium">
                  {content}
                </p>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => handleDismiss(notice.id)}
              className="p-1 rounded-lg hover:bg-black/10 text-gray-500 hover:text-gray-900 transition flex-shrink-0"
              title="Dismiss Notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
