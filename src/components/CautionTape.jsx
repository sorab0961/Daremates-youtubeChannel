import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const CautionTape = () => (
  <div className="w-full h-8 bg-[#FFD600] overflow-hidden flex items-center select-none rotate-1 -mx-4 shadow-xl border-y-2 border-black mb-12">
    <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          className="text-black font-black italic text-xs px-8 flex items-center gap-2"
        >
          <AlertTriangle size={14} /> DANGER: EXTREME DARES ONLY <AlertTriangle size={14} />
          100% CHAOS <AlertTriangle size={14} /> DON'T TRY THIS AT HOME
        </span>
      ))}
    </div>
  </div>
);
