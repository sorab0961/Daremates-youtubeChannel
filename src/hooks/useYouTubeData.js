import { useState, useEffect } from 'react';
import { fetchAllChannelVideos } from '../api/youtube';
import { VIDEOS, SHORTS } from '../data/content';

/**
 * Custom hook — fetches live YouTube channel data on mount.
 * Falls back gracefully to static content.js data if API key is missing or call fails.
 */
export function useYouTubeData() {
  const [state, setState] = useState({
    videos: VIDEOS,          // regular (non-short) videos
    shorts: SHORTS,          // shorts
    latestVideo: VIDEOS[0] ? { ...VIDEOS[0], tag: 'NEW UPLOAD' } : null,
    mostWatchedVideo: VIDEOS[0] ? { ...VIDEOS[0], tag: 'MOST WATCHED' } : null,
    channelStats: null,
    loading: true,
    error: null,
    isLive: false,           // true once real API data is loaded
  });

  useEffect(() => {
    if (!import.meta.env.VITE_YOUTUBE_API_KEY) {
      // No key — just drop spinner, use static fallback
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    let cancelled = false;
    fetchAllChannelVideos()
      .then((data) => {
        if (cancelled) return;
        setState({
          videos: data.videos,
          shorts: data.shorts.length ? data.shorts : SHORTS,
          latestVideo: data.latestVideo || state.latestVideo,
          mostWatchedVideo: data.mostWatchedVideo || state.mostWatchedVideo,
          channelStats: data.channelStats,
          loading: false,
          error: null,
          isLive: true,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn('[useYouTubeData] API fetch failed, using static fallback:', err.message);
        setState((prev) => ({ ...prev, loading: false, error: err.message }));
      });

    return () => { cancelled = true; };
  }, []);

  return state;
}
