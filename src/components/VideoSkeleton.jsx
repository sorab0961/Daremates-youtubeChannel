import React from 'react';

/**
 * Shimmer skeleton card that matches the VideoCard aspect ratio.
 * Use while YouTube data is loading.
 */
export const VideoSkeleton = ({ tall = false }) => (
  <div className="bg-[#111118] border-2 border-white/5 overflow-hidden animate-pulse">
    <div className={`${tall ? 'aspect-[9/16]' : 'aspect-video'} bg-white/5`} />
    {!tall && (
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="flex justify-between">
          <div className="h-3 bg-white/10 rounded w-1/4" />
          <div className="h-3 bg-white/10 rounded w-1/4" />
        </div>
      </div>
    )}
  </div>
);

/** Render a grid of N skeleton cards */
export const VideoSkeletonGrid = ({ count = 6, tall = false, className = '' }) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <VideoSkeleton key={i} tall={tall} />
    ))}
  </div>
);
