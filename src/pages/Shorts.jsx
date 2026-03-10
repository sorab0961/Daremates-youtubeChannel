import React from 'react';
import { Play } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { VideoSkeletonGrid } from '../components/VideoSkeleton';
import { useYouTubeData } from '../hooks/useYouTubeData';

export default function Shorts() {
  const { shorts, loading } = useYouTubeData();
  const displayShorts = shorts.slice(0, 20); // show up to 20

  return (
    <div className="pt-20 px-4 max-w-7xl mx-auto space-y-12 pb-20">
      <FadeIn>
        <div className="flex items-end gap-4 flex-wrap">
          <h1 className="text-6xl font-black uppercase italic text-[#FF2ED1]">
            VERTICAL CHAOS
          </h1>
          {!loading && (
            <span className="text-[#A0A0B0] font-black text-sm uppercase pb-2">
              {displayShorts.length} shorts
            </span>
          )}
        </div>
      </FadeIn>

      {loading ? (
        <VideoSkeletonGrid
          count={12}
          tall
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        />
      ) : displayShorts.length === 0 ? (
        <div className="text-center py-20 text-[#A0A0B0] font-black uppercase">
          No shorts found yet — check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayShorts.map((s, i) => (
            <FadeIn key={s.id} delay={i * 50}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-[9/16] overflow-hidden border-2 border-white/5 hover:border-[#FF2ED1] transition-all block"
              >
                <img
                  src={s.thumbnail}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  alt={s.title || `Short ${i + 1}`}
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Play button on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <div className="bg-[#FF2ED1] rounded-full p-3">
                    <Play fill="white" size={20} className="text-white ml-0.5" />
                  </div>
                </div>

                {/* Views + title */}
                <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1">
                  <p className="font-black text-white text-[10px] italic drop-shadow-md line-clamp-2 leading-tight">
                    {s.title}
                  </p>
                  <p className="text-[#FF2ED1] font-black text-[10px] uppercase">{s.views} VIEWS</p>
                </div>

                {/* Shorts badge */}
                <div className="absolute top-2 right-2 bg-[#FF2ED1] text-white text-[9px] font-black px-1.5 py-0.5 uppercase">
                  #SHORT
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
