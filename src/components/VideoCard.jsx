import React from 'react';
import { Play } from 'lucide-react';
import { Sticker } from './Sticker';

/** Format seconds → M:SS (e.g. 245 → "4:05") */
const fmtDuration = (secs) => {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const VideoCard = ({ video }) => (
  <a
    href={video.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative block bg-[#111118] border-2 border-white/5 hover:border-[#FFD600] transition-all hover:-translate-y-2 hover:rotate-1"
  >
    <div className="relative aspect-video overflow-hidden">
      <img
        src={video.thumbnail}
        alt={video.title}
        loading="lazy"
        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
      />
      {/* Tag sticker — only if set */}
      {video.tag && (
        <div className="absolute top-2 left-2">
          <Sticker color="bg-[#FFD600]">{video.tag}</Sticker>
        </div>
      )}
      {/* Duration badge */}
      {video.duration > 0 && !video.isShort && (
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-black px-1.5 py-0.5">
          {fmtDuration(video.duration)}
        </span>
      )}
      {/* Play overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
        <Play
          fill="#FFD600"
          size={48}
          className="text-[#FFD600] drop-shadow-[0_0_10px_rgba(255,214,0,0.8)] scale-75 group-hover:scale-100 transition-transform duration-300"
        />
      </div>
    </div>
    <div className="p-4 space-y-2">
      <h3 className="text-lg font-black uppercase italic leading-none group-hover:text-[#FFD600] transition-colors line-clamp-2">
        {video.title}
      </h3>
      <div className="flex justify-between items-center text-[10px] font-black text-[#A0A0B0] uppercase">
        <span>{video.views} VIEWS</span>
        <span className="bg-white/5 px-2 py-0.5 rounded-sm">{video.time}</span>
      </div>
    </div>
    <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity rotate-12 bg-white text-black px-2 py-1 text-[8px] font-black uppercase">
      #DO_IT
    </div>
  </a>
);

