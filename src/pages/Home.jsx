import React, { useState } from 'react';
import { Users, RefreshCw, TrendingUp, Eye } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';
import { CautionTape } from '../components/CautionTape';
import { Sticker } from '../components/Sticker';
import { FadeIn } from '../components/FadeIn';
import { VideoSkeletonGrid } from '../components/VideoSkeleton';
import { useYouTubeData } from '../hooks/useYouTubeData';
import { clearYouTubeCache } from '../api/youtube';

const POLL_OPTIONS = [
  { key: 'library', label: 'The Library Revenge', color: 'hover:bg-[#FF2ED1]', border: 'border-[#FF2ED1]' },
  { key: 'car', label: 'Luxury Car Prank', color: 'hover:bg-[#FFD600] hover:text-black', border: 'border-[#FFD600]' },
];
const POLL_KEY = 'daremates_poll_votes';
const loadVotes = () => { try { return JSON.parse(localStorage.getItem(POLL_KEY)) || { library: 0, car: 0 }; } catch { return { library: 0, car: 0 }; } };
const saveVotes = (v) => localStorage.setItem(POLL_KEY, JSON.stringify(v));

export default function Home() {
  const { latestVideo, mostWatchedVideo, videos, channelStats, loading, isLive } = useYouTubeData();
  const [votes, setVotes] = useState(loadVotes);
  const [voted, setVoted] = useState(() => !!localStorage.getItem('daremates_poll_voted'));
  const [refreshing, setRefreshing] = useState(false);
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = (key) => {
    if (voted) return;
    const updated = { ...votes, [key]: (votes[key] || 0) + 1 };
    setVotes(updated); saveVotes(updated);
    localStorage.setItem('daremates_poll_voted', '1');
    setVoted(true);
  };

  const handleRefresh = () => {
    clearYouTubeCache();
    setRefreshing(true);
    setTimeout(() => window.location.reload(), 300);
  };

  const hero = latestVideo;
  const featuredVideos = videos.slice(0, 6);

  return (
    <div className="space-y-16">
      {/* ── Hero ── */}
      <header className="relative h-[420px] md:h-[620px] bg-black overflow-hidden flex items-center">
        {hero?.thumbnail ? (
          <img
            src={hero.thumbnail}
            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.3] scale-105 hover:scale-100 transition-transform duration-[8s]"
            alt={hero.title || 'DareMates Latest Video'}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#111118] to-[#050505] animate-pulse" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="relative z-10 px-8 max-w-4xl">
          <FadeIn delay={0}>
            <Sticker color="bg-[#FF2ED1]" rotate="-rotate-6" className="mb-4">
              {isLive ? '🔴 JUST UPLOADED' : 'NEW UPLOAD ALERT'}
            </Sticker>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-7xl font-black uppercase italic leading-[0.9] mt-4 tracking-tighter line-clamp-3 max-w-3xl">
              {loading
                ? <span className="block h-12 w-80 bg-white/10 animate-pulse rounded" />
                : hero?.title || 'WELCOME TO DAREMATES 💀'}
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <a
                href={hero?.url || 'https://www.youtube.com/@daremates'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black px-10 py-4 font-black uppercase italic text-xl shadow-[6px_6px_0_#FF2ED1] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Watch Now
              </a>
              {hero?.views && (
                <span className="flex items-center gap-2 text-[#FFD600] font-black uppercase text-sm">
                  <Eye size={16} /> {hero.views} VIEWS
                </span>
              )}
            </div>
          </FadeIn>
        </div>

        {/* Live channel stats badge */}
        {channelStats && (
          <div className="absolute top-4 right-4 bg-black/70 border border-white/10 px-4 py-2 flex flex-col items-end gap-1 backdrop-blur-sm">
            <span className="text-[#FFD600] font-black text-lg">{channelStats.subscriberCount}</span>
            <span className="text-white/50 text-[10px] uppercase font-black tracking-widest">subscribers</span>
          </div>
        )}

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title="Refresh channel data"
          className="absolute bottom-4 right-4 bg-black/50 border border-white/10 p-2 text-white/50 hover:text-[#FFD600] transition-colors"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </header>

      <CautionTape />

      {/* ── Most Watched Feature ── */}
      {(mostWatchedVideo || loading) && (
        <section className="px-4 max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-4 mb-8">
              <TrendingUp size={24} className="text-[#FF2ED1]" />
              <h2 className="text-3xl font-black uppercase italic bg-[#FF2ED1] text-white px-4 py-1 -rotate-1">
                MOST WATCHED
              </h2>
              <div className="h-1 flex-1 bg-white/10" />
            </div>
          </FadeIn>
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VideoSkeletonGrid count={1} className="grid" />
              <div className="hidden lg:block space-y-4">
                <div className="h-8 bg-white/5 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-white/5 animate-pulse rounded w-full" />
                <div className="h-4 bg-white/5 animate-pulse rounded w-1/2" />
              </div>
            </div>
          ) : mostWatchedVideo && (
            <FadeIn>
              <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-8 bg-[#111118] border-4 border-[#FF2ED1] p-6 shadow-[10px_10px_0_rgba(255,46,209,0.2)]">
                <VideoCard video={mostWatchedVideo} />
                <div className="flex flex-col justify-center gap-4 p-4">
                  <Sticker color="bg-[#FF2ED1]" rotate="-rotate-2">🔥 CHANNEL BANGER</Sticker>
                  <p className="text-5xl font-black text-[#FFD600] italic">{mostWatchedVideo.views}</p>
                  <p className="text-[#A0A0B0] font-black uppercase tracking-widest text-xs">total views</p>
                  <a
                    href={mostWatchedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-[#FF2ED1] text-white px-6 py-3 font-black uppercase text-sm hover:bg-white hover:text-black transition-all shadow-[4px_4px_0_#FFF] inline-block text-center"
                  >
                    Watch The Banger
                  </a>
                </div>
              </div>
            </FadeIn>
          )}
        </section>
      )}

      {/* ── Epic Bangers grid ── */}
      <section className="px-4 max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-black uppercase italic bg-[#FFD600] text-black px-4 py-1 rotate-1">
              EPIC BANGERS
            </h2>
            <div className="h-1 flex-1 bg-white/10" />
            {channelStats && (
              <span className="text-[#A0A0B0] text-xs font-black uppercase hidden sm:block">
                {channelStats.videoCount} total videos
              </span>
            )}
          </div>
        </FadeIn>
        {loading ? (
          <VideoSkeletonGrid count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredVideos.map((v, i) => (
              <FadeIn key={v.id} delay={i * 80}>
                <VideoCard video={v} />
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      {/* ── Poll + Join ── */}
      <section className="px-4 max-w-7xl mx-auto pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <FadeIn>
            <div className="bg-[#111118] p-8 border-4 border-white/5 relative overflow-hidden group h-full">
              <div className="absolute -top-10 -right-10 text-white/5 rotate-12 group-hover:rotate-45 transition-all duration-700">
                <Users size={300} />
              </div>
              <h2 className="text-4xl font-black uppercase italic mb-2">SQUAD POLL</h2>
              <p className="text-[#A0A0B0] font-bold mb-6 uppercase tracking-tighter text-sm">
                VOTE: WHAT SHOULD WE PRANK NEXT?
              </p>
              <div className="space-y-4 relative z-10">
                {POLL_OPTIONS.map(({ key, label, color, border }) => {
                  const pct = totalVotes ? Math.round(((votes[key] || 0) / totalVotes) * 100) : 0;
                  return (
                    <button
                      key={key}
                      onClick={() => handleVote(key)}
                      disabled={voted}
                      className={`w-full relative bg-white/5 ${voted ? 'cursor-default' : `${color} cursor-pointer`} p-4 font-black uppercase text-left transition-all border-l-4 ${border} overflow-hidden`}
                    >
                      {voted && (
                        <div
                          className="absolute inset-0 bg-white/10 origin-left transition-all duration-700"
                          style={{ transform: `scaleX(${pct / 100})` }}
                        />
                      )}
                      <span className="relative z-10 flex justify-between">
                        {label}
                        {voted && <span className="text-[#FFD600]">{pct}%</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
              {voted && (
                <p className="mt-4 text-[10px] text-[#A0A0B0] uppercase font-black tracking-widest">
                  {totalVotes} total vote{totalVotes !== 1 ? 's' : ''} • thanks for voting!
                </p>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="bg-black border-4 border-[#FFD600] p-10 flex flex-col justify-center items-center text-center h-full">
              <h2 className="text-5xl font-black uppercase italic mb-4">JOIN THE <br /> MADNESS</h2>
              <p className="text-[#A0A0B0] mb-8 font-black uppercase tracking-widest text-xs">NO RULES. JUST DARES.</p>
              <a
                href="https://www.youtube.com/@daremates?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FFD600] text-black px-12 py-4 font-black uppercase text-lg shadow-[6px_6px_0_#FFF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Join Squad
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
