// ─── Helpers ────────────────────────────────────────────────────────────────

const formatViews = (count) => {
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return count.toString();
};

const formatTimeAgo = (isoDate) => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

/** Parse ISO 8601 duration (e.g. PT1M30S) to total seconds */
const parseDuration = (iso = '') => {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] || 0) * 3600) + (parseInt(m[2] || 0) * 60) + parseInt(m[3] || 0);
};

/** A video is a Short if it is ≤ 62 s (allow slight rounding) or tagged #shorts */
const detectShort = (raw) => {
  const secs = parseDuration(raw.contentDetails?.duration);
  const title = (raw.snippet?.title || '').toLowerCase();
  const desc = (raw.snippet?.description || '').toLowerCase();
  return secs > 0 && secs <= 62 || title.includes('#shorts') || desc.includes('#shorts');
};

/** Normalize a single YouTube API video object into our app format */
const normalizeVideo = (raw) => {
  const viewCount = parseInt(raw.statistics?.viewCount || 0);
  const short = detectShort(raw);
  const thumbs = raw.snippet?.thumbnails || {};
  const thumbnail =
    thumbs.maxres?.url ||
    thumbs.standard?.url ||
    thumbs.high?.url ||
    thumbs.medium?.url ||
    thumbs.default?.url || '';

  return {
    id: raw.id,
    title: raw.snippet?.title || '',
    views: formatViews(viewCount),
    viewCount,
    time: formatTimeAgo(raw.snippet?.publishedAt),
    publishedAt: raw.snippet?.publishedAt,
    thumbnail,
    // Shorts link to /shorts/:id, regular videos link to /watch?v=:id
    url: short
      ? `https://www.youtube.com/shorts/${raw.id}`
      : `https://www.youtube.com/watch?v=${raw.id}`,
    tag: null,           // caller can set tag: 'LATEST' / 'MOST WATCHED' etc.
    duration: parseDuration(raw.contentDetails?.duration),
    isShort: short,
  };
};

// ─── Cache ───────────────────────────────────────────────────────────────────

const CACHE_KEY = 'daremates_yt_cache_v2';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const getCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
};

const setCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch { /* storage quota exceeded — skip silently */ }
};

/** Force-clear the YouTube cache (e.g. for a refresh button) */
export const clearYouTubeCache = () => {
  try { localStorage.removeItem(CACHE_KEY); } catch {}
};

// ─── Core API fetch ──────────────────────────────────────────────────────────

const BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Fetch everything needed for the site from the DareMates channel.
 * Uses localStorage cache for 1 hour to protect API quota.
 *
 * Returns:
 *  { videos, shorts, latestVideo, mostWatchedVideo, channelStats }
 */
export const fetchAllChannelVideos = async () => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('VITE_YOUTUBE_API_KEY is not set in your .env file.');

  // ── Serve from cache if fresh ──
  const cached = getCache();
  if (cached) return cached;

  // ── 1. Get channel metadata + uploads playlist ID ──
  const channelRes = await fetch(
    `${BASE}/channels?part=contentDetails,statistics&forHandle=daremates&key=${apiKey}`
  );
  if (!channelRes.ok) throw new Error(`YouTube API error: ${channelRes.status}`);
  const channelData = await channelRes.json();

  const channel = channelData.items?.[0];
  if (!channel) throw new Error('DareMates channel not found via YouTube API.');

  const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
  const channelStats = {
    subscriberCount: formatViews(parseInt(channel.statistics.subscriberCount || 0)),
    viewCount: formatViews(parseInt(channel.statistics.viewCount || 0)),
    videoCount: parseInt(channel.statistics.videoCount || 0),
  };

  // ── 2. Collect video IDs from uploads playlist (up to 3 pages = 150 videos) ──
  let videoIds = [];
  let pageToken = null;
  let pages = 0;

  do {
    const url = new URL(`${BASE}/playlistItems`);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('playlistId', uploadsPlaylistId);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', apiKey);
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const res = await fetch(url.toString());
    if (!res.ok) break;
    const data = await res.json();

    const ids = (data.items || [])
      .map((item) => item.snippet?.resourceId?.videoId)
      .filter(Boolean);
    videoIds.push(...ids);

    pageToken = data.nextPageToken || null;
    pages++;
  } while (pageToken && pages < 3);

  // ── 3. Batch-fetch video details (snippet + statistics + contentDetails) ──
  const rawVideos = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50).join(',');
    const res = await fetch(
      `${BASE}/videos?part=snippet,statistics,contentDetails&id=${batch}&key=${apiKey}`
    );
    if (!res.ok) continue;
    const data = await res.json();
    rawVideos.push(...(data.items || []));
  }

  // ── 4. Normalize + split into shorts vs regular ──
  const all = rawVideos.map(normalizeVideo);
  const shorts = all.filter((v) => v.isShort);
  const videos = all
    .filter((v) => !v.isShort)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Tag the new hero and most-watched videos
  const latestVideo = videos[0]
    ? { ...videos[0], tag: 'NEW UPLOAD' }
    : null;

  const mostWatchedVideo = videos.length
    ? { ...[...videos].sort((a, b) => b.viewCount - a.viewCount)[0], tag: 'MOST WATCHED' }
    : null;

  const result = { videos, shorts, latestVideo, mostWatchedVideo, channelStats };
  setCache(result);
  return result;
};
