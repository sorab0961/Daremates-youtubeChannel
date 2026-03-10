import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, TrendingUp, Clock, Youtube, RefreshCw } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';
import { FadeIn } from '../components/FadeIn';
import { VideoSkeletonGrid } from '../components/VideoSkeleton';
import { useYouTubeData } from '../hooks/useYouTubeData';
import { clearYouTubeCache } from '../api/youtube';

const SORT_OPTIONS = [
  { key: 'latest', label: 'Latest', icon: Clock },
  { key: 'popular', label: 'Most Viewed', icon: TrendingUp },
];

export default function AllVideos() {
  const { videos, shorts, channelStats, loading, error } = useYouTubeData();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('latest');
  const [showShorts, setShowShorts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const sourceList = showShorts ? shorts : videos;

  const filtered = useMemo(() => {
    let list = [...sourceList];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((v) => v.title.toLowerCase().includes(q));
    }

    if (sort === 'popular') {
      list.sort((a, b) => b.viewCount - a.viewCount);
    } else {
      list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    return list;
  }, [sourceList, query, sort]);

  const handleRefresh = () => {
    clearYouTubeCache();
    setRefreshing(true);
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <div className="pt-20 pb-24 px-4 max-w-7xl mx-auto space-y-10">
      {/* ── Page Header ── */}
      <FadeIn>
        <div className="border-b-4 border-[#FFD600] pb-6 flex flex-col md:flex-row md:items-end gap-4 justify-between">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic text-white drop-shadow-[3px_3px_0_#FFD600]">
              THE ARCHIVE
            </h1>
            <p className="text-[#A0A0B0] font-black uppercase tracking-widest text-xs mt-2">
              EVERY DARE. EVERY PRANK. EVERY CHAOS.
            </p>
          </div>

          {/* Channel stats */}
          {channelStats && (
            <div className="flex gap-6 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-black text-[#FFD600]">{channelStats.subscriberCount}</p>
                <p className="text-[10px] text-[#A0A0B0] uppercase font-black tracking-widest">subscribers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-[#FF2ED1]">{channelStats.viewCount}</p>
                <p className="text-[10px] text-[#A0A0B0] uppercase font-black tracking-widest">total views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">{channelStats.videoCount}</p>
                <p className="text-[10px] text-[#A0A0B0] uppercase font-black tracking-widest">videos</p>
              </div>
            </div>
          )}
        </div>
      </FadeIn>

      {/* ── Filters Bar ── */}
      <FadeIn delay={80}>
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH VIDEOS..."
              className="w-full bg-[#111118] border-2 border-white/10 focus:border-[#FFD600] pl-10 pr-4 py-3 text-white font-black uppercase text-sm placeholder:text-white/20 outline-none transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-white text-xs font-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort buttons */}
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-[#A0A0B0] text-xs font-black uppercase">
              <SlidersHorizontal size={14} /> Sort:
            </span>
            {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase transition-all ${
                  sort === key
                    ? 'bg-[#FFD600] text-black'
                    : 'bg-white/5 text-[#A0A0B0] hover:text-white'
                }`}
              >
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>

          {/* Shorts toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowShorts(false)}
              className={`px-3 py-2 text-xs font-black uppercase transition-all ${!showShorts ? 'bg-[#FF2ED1] text-white' : 'bg-white/5 text-[#A0A0B0] hover:text-white'}`}
            >
              Videos
            </button>
            <button
              onClick={() => setShowShorts(true)}
              className={`px-3 py-2 text-xs font-black uppercase transition-all ${showShorts ? 'bg-[#FF2ED1] text-white' : 'bg-white/5 text-[#A0A0B0] hover:text-white'}`}
            >
              Shorts
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Force refresh from YouTube"
            className="bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 text-[#A0A0B0] hover:text-[#FFD600] transition-colors"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </FadeIn>

      {/* ── Results count ── */}
      {!loading && (
        <p className="text-[#A0A0B0] font-black text-xs uppercase tracking-widest">
          {filtered.length} {showShorts ? 'shorts' : 'videos'}
          {query ? ` matching "${query}"` : ''}
        </p>
      )}

      {/* ── Add API key hint ── */}
      {!loading && !channelStats && (
        <div className="bg-[#111118] border-l-4 border-[#FFD600] p-4 font-black text-sm text-[#A0A0B0] uppercase">
          💡 Add <code className="text-[#FFD600]">VITE_YOUTUBE_API_KEY</code> to your .env to load live channel content.
        </div>
      )}

      {/* ── Error state ── */}
      {error && !loading && (
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 text-red-300 font-black text-sm uppercase">
          ⚠️ Could not load live data: {error}. Showing static fallback.
        </div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        showShorts ? (
          <VideoSkeletonGrid
            count={12}
            tall
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          />
        ) : (
          <VideoSkeletonGrid
            count={9}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          />
        )
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-[#A0A0B0] font-black uppercase text-xl">
            {query ? `No results for "${query}"` : 'No content found'}
          </p>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mt-4 bg-[#FFD600] text-black px-6 py-3 font-black uppercase text-sm"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : showShorts ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((v, i) => (
            <FadeIn key={v.id} delay={(i % 10) * 40}>
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-[9/16] overflow-hidden border-2 border-white/5 hover:border-[#FF2ED1] transition-all block"
              >
                <img
                  src={v.thumbnail}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  alt={v.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1">
                  <p className="font-black text-white text-[10px] italic drop-shadow line-clamp-2 leading-tight">{v.title}</p>
                  <p className="text-[#FF2ED1] font-black text-[10px] uppercase">{v.views} VIEWS</p>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((v, i) => (
            <FadeIn key={v.id} delay={(i % 9) * 60}>
              <VideoCard video={v} />
            </FadeIn>
          ))}
        </div>
      )}

      {/* ── YouTube CTA ── */}
      <FadeIn>
        <div className="flex items-center justify-center gap-4 pt-8 border-t border-white/10">
          <a
            href="https://www.youtube.com/@daremates"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#FF0000] text-white px-8 py-4 font-black uppercase text-sm shadow-[4px_4px_0_#FFF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <Youtube size={18} /> Watch on YouTube
          </a>
        </div>
      </FadeIn>
    </div>
  );
}
