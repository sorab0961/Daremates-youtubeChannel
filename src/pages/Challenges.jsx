import React from 'react';
import { VideoCard } from '../components/VideoCard';
import { FadeIn } from '../components/FadeIn';
import { VideoSkeletonGrid } from '../components/VideoSkeleton';
import { useYouTubeData } from '../hooks/useYouTubeData';

export default function Challenges() {
  const { videos, channelStats, loading } = useYouTubeData();

  return (
    <div className="pt-20 px-4 max-w-7xl mx-auto space-y-12 pb-20">
      <FadeIn>
        <div className="flex items-end gap-4 flex-wrap">
          <h1 className="text-6xl font-black uppercase italic text-center text-[#FFD600] drop-shadow-[4px_4px_0_#FFF]">
            ALL VIDEOS
          </h1>
          {!loading && channelStats && (
            <span className="text-[#A0A0B0] font-black text-sm uppercase pb-2">
              {videos.length} videos loaded
            </span>
          )}
        </div>
      </FadeIn>

      {loading ? (
        <VideoSkeletonGrid
          count={9}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        />
      ) : videos.length === 0 ? (
        <div className="text-center py-20 text-[#A0A0B0] font-black uppercase">
          No videos found — add your YouTube API key to load real content!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {videos.map((v, i) => (
            <FadeIn key={v.id} delay={(i % 9) * 60}>
              <VideoCard video={v} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
