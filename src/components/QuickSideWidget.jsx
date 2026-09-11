import React, { useState } from 'react';
import { 
  Flame, 
  BookOpen, 
  Sparkles, 
  Zap, 
  X, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft,
  Share2,
  Bookmark,
  MessageCircle
} from 'lucide-react';

export default function QuickSideWidget({ siteConfig = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [readingArticle, setReadingArticle] = useState(null);

  const sideBlog = siteConfig?.sideBlog || {};
  const buttonConfig = sideBlog.button || {
    title: "Admin Blog",
    titleSin: "විශේෂ ලිපි",
    badgeText: "HOT",
    bgColor: "#881337",
    bgGradient: "linear-gradient(135deg, #881337 0%, #be123c 100%)",
    isGradient: true,
    pulseAnimation: true,
    iconType: "Flame"
  };

  const posts = (sideBlog.posts || []).filter(p => p.isActive !== false);
  const primaryPost = posts.find(p => p.isPrimary) || posts[0];
  const secondaryPosts = posts.filter(p => p.id !== primaryPost?.id);

  // Icon selector
  const renderIcon = () => {
    switch (buttonConfig.iconType) {
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-amber-300" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-300" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />;
      case 'Flame':
      default:
        return <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />;
    }
  };

  const handleOpenArticle = (post) => {
    if (post.linkUrl && !post.content) {
      window.open(post.linkUrl, '_blank');
      return;
    }
    setReadingArticle(post);
  };

  const whatsappNum = (siteConfig?.contact?.whatsapp || siteConfig?.supportWhatsApp || '94771234567').replace(/[^0-9]/g, '');

  return (
    <>
      {/* Floating Side Toggle Tag on the Right Screen Edge */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              background: buttonConfig.isGradient 
                ? (buttonConfig.bgGradient || 'linear-gradient(135deg, #881337 0%, #be123c 100%)')
                : (buttonConfig.bgColor || '#881337')
            }}
            className="group flex items-center space-x-1.5 sm:space-x-2.5 text-white pl-2 sm:pl-3.5 pr-1.5 sm:pr-2.5 py-1.5 sm:py-2.5 rounded-l-xl sm:rounded-l-2xl shadow-xl sm:shadow-2xl border-l border-y border-rose-400/40 hover:pl-3 sm:hover:pl-4.5 transition-all duration-300 cursor-pointer select-none active:scale-95"
            title={`${buttonConfig.title || 'Admin Blog'} - ${buttonConfig.titleSin || 'විශේෂ ලිපි'}`}
          >
            {/* Pulsing indicator badge */}
            <div className="relative flex items-center justify-center scale-75 sm:scale-100">
              {buttonConfig.pulseAnimation && (
                <span className="absolute -top-1 -right-1 flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-amber-400" />
                </span>
              )}
              {renderIcon()}
            </div>

            {/* Vertical / Compact Text */}
            <div className="flex flex-col items-start leading-none sm:leading-tight">
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <span className="text-[9px] sm:text-[11px] font-black tracking-wider uppercase text-amber-200">
                  {buttonConfig.title || 'Admin Blog'}
                </span>
                {buttonConfig.badgeText && (
                  <span className="bg-amber-400 text-slate-950 font-black text-[7.5px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 rounded-full uppercase">
                    {buttonConfig.badgeText}
                  </span>
                )}
              </div>
              <span className="text-[8.5px] font-bold text-rose-100 hidden sm:inline">
                {buttonConfig.titleSin || 'විශේෂ ලිපි'}
              </span>
            </div>

            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-rose-200 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => {
              setIsOpen(false);
              setReadingArticle(null);
            }}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] bg-slate-900 border-l border-rose-900/50 text-white shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Top Header */}
            <div className="p-4 bg-gradient-to-r from-slate-950 via-[#4c0519] to-[#881337] border-b border-rose-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 p-0.5 flex items-center justify-center shadow-md">
                  <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight text-white leading-tight">
                    {readingArticle ? 'Admin Article Reader' : (buttonConfig.title || 'Admin Blog & Highlights')}
                  </h3>
                  <p className="text-[10px] text-rose-200 font-medium">
                    {readingArticle ? 'විශේෂ සටහන කියවීම' : (buttonConfig.titleSin || 'විශේෂ ලිපි සහ නිල මගපෙන්වීම්')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                {readingArticle && (
                  <button
                    type="button"
                    onClick={() => setReadingArticle(null)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white transition flex items-center space-x-1 text-xs font-bold"
                    title="Back to All Articles"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setReadingArticle(null);
                  }}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                  title="Close Drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {/* CASE 1: FULL IN-DRAWER ARTICLE READER */}
              {readingArticle ? (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Article Cover Image */}
                  {readingArticle.imageUrl && (
                    <div className="relative rounded-2xl overflow-hidden border border-rose-900/40 shadow-lg h-48 sm:h-52 bg-slate-950">
                      <img
                        src={readingArticle.imageUrl}
                        alt={readingArticle.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="bg-rose-600/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                          {readingArticle.category || 'Featured'}
                        </span>
                        {readingArticle.badge && (
                          <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                            {readingArticle.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-400 gap-2 border-b border-gray-800 pb-2.5">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-rose-400" />
                        <span>{readingArticle.author || 'Admin Team'}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{readingArticle.readTime || '3 min read'}</span>
                      </span>
                    </div>
                    <span>{readingArticle.publishedDate || 'Recent'}</span>
                  </div>

                  {/* Titles */}
                  <div className="space-y-1">
                    <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                      {readingArticle.title}
                    </h2>
                    {readingArticle.titleSin && (
                      <p className="text-xs sm:text-sm text-rose-200 font-bold leading-relaxed">
                        {readingArticle.titleSin}
                      </p>
                    )}
                  </div>

                  {/* Excerpt Highlight Box */}
                  <div className="bg-rose-950/30 border-l-4 border-rose-500 p-3 rounded-r-xl text-xs text-rose-100/90 leading-relaxed font-medium">
                    {readingArticle.excerptSin || readingArticle.excerpt}
                  </div>

                  {/* Body Content */}
                  <div className="text-xs sm:text-sm text-gray-300 leading-relaxed space-y-2.5 font-normal whitespace-pre-line">
                    {readingArticle.content || readingArticle.excerpt}
                  </div>

                  {/* External Link Action if specified */}
                  {readingArticle.linkUrl && (
                    <div className="pt-2">
                      <a
                        href={readingArticle.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md transition"
                      >
                        <span>Visit Full Website Post</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                /* CASE 2: BLOG & HIGHLIGHT POSTS OVERVIEW */
                <>
                  {/* Primary Highlight Card */}
                  {primaryPost && (
                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-rose-500/40 rounded-2xl overflow-hidden shadow-xl group">
                      {primaryPost.imageUrl && (
                        <div className="relative h-44 overflow-hidden bg-slate-950">
                          <img
                            src={primaryPost.imageUrl}
                            alt={primaryPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                            <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                              {primaryPost.badge || '⭐ Admin Highlight'}
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-gray-300 font-semibold">
                            <span>{primaryPost.category || 'Special Guide'}</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-amber-300" />
                              <span>{primaryPost.readTime || '3 min'}</span>
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-3.5 space-y-2">
                        <h4 className="text-sm font-extrabold text-white group-hover:text-rose-300 transition leading-snug">
                          {primaryPost.title}
                        </h4>
                        {primaryPost.titleSin && (
                          <p className="text-[11px] text-amber-200/90 font-bold leading-tight">
                            {primaryPost.titleSin}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {primaryPost.excerptSin || primaryPost.excerpt}
                        </p>

                        <div className="pt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenArticle(primaryPost)}
                            className="flex-1 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition cursor-pointer"
                          >
                            <span>{primaryPost.actionButtonText || 'Read Article / ලිපිය'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          {primaryPost.linkUrl && (
                            <a
                              href={primaryPost.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition"
                              title="Open External Blog Link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section Title: More Highlighted Links & Articles */}
                  {secondaryPosts.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black tracking-wide uppercase text-amber-300 flex items-center space-x-1.5">
                          <Flame className="w-3.5 h-3.5 fill-amber-300" />
                          <span>More Highlighted Posts & Links</span>
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">
                          {secondaryPosts.length} posts
                        </span>
                      </div>

                      <div className="space-y-2">
                        {secondaryPosts.map((post) => (
                          <div
                            key={post.id}
                            onClick={() => handleOpenArticle(post)}
                            className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-rose-500/50 rounded-xl p-2.5 transition flex items-center space-x-3 group cursor-pointer"
                          >
                            {post.imageUrl && (
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-700 group-hover:scale-105 transition-transform"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1.5 text-[10px] text-rose-300 font-bold mb-0.5">
                                <span>{post.category || 'Post'}</span>
                                <span>•</span>
                                <span className="text-gray-400">{post.readTime || '2 min'}</span>
                              </div>
                              <h5 className="text-xs font-bold text-white group-hover:text-rose-300 transition truncate leading-snug">
                                {post.title}
                              </h5>
                              <p className="text-[10px] text-gray-400 line-clamp-1 leading-tight mt-0.5">
                                {post.excerptSin || post.excerpt}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state if no posts configured */}
                  {posts.length === 0 && (
                    <div className="text-center py-12 text-gray-400 space-y-2">
                      <BookOpen className="w-8 h-8 mx-auto text-gray-600" />
                      <p className="font-bold text-sm">No blog posts featured yet.</p>
                      <p className="text-xs text-gray-500">The administrator can add highlighted posts from the Admin Panel.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Drawer Footer Banner */}
            <div className="p-3.5 bg-slate-950 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-bold">Official Admin Blog</span>
                </span>
                <span className="text-[10px] text-gray-500">Live Updates</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.open(`https://wa.me/${whatsappNum}?text=Hello%20Taizer%20Ads%20Admin,%20I%20am%20interested%20in%20your%20featured%20blog%20posts.`, '_blank');
                }}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Contact Admin on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
