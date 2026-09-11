import React from 'react';
import { Check, Flame, Sparkles } from 'lucide-react';

export default function StoryAvatars({ stories = [], onSelectStory }) {
  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-thin">
      <div className="flex items-center justify-center space-x-5 sm:space-x-6 min-w-max py-1.5 px-2">
        {stories.map((story) => {
          const isOffer = story.isSpecialOffer || story.adId;

          return (
            <div
              key={story.id}
              onClick={() => onSelectStory && onSelectStory(story)}
              className="flex flex-col items-center cursor-pointer group select-none transition-transform active:scale-95"
            >
              {/* Circular Ring with Avatar */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-full p-[2.5px] ${
                  isOffer
                    ? 'bg-gradient-to-tr from-[#f03a5f] via-orange-500 to-amber-400'
                    : 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400'
                } group-hover:scale-105 transition-transform duration-200 shadow-sm`}>
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover rounded-full border-2 border-white bg-gray-100"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                {/* Offer Flame Badge */}
                {isOffer && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-amber-500 text-white rounded-full p-1 shadow-md border-2 border-white">
                    <Flame className="w-2.5 h-2.5 fill-current" />
                  </div>
                )}

                {/* Green Live Badge */}
                {story.isLive && (
                  <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 bg-[#16a34a] text-white text-[9.5px] font-black px-1.5 py-0.2 rounded-full flex items-center space-x-0.5 border border-white shadow-xs">
                    <span>Live</span>
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Title Label */}
              <span className="text-[11.5px] font-bold text-gray-800 mt-2 text-center group-hover:text-[#f03a5f] transition-colors truncate max-w-[85px] leading-tight">
                {story.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
