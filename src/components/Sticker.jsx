import React from 'react';

export const Sticker = ({ children, color = 'bg-[#FF2ED1]', rotate = '-rotate-3', className = '' }) => (
  <div
    className={`${color} ${rotate} ${className} px-3 py-1 text-black font-black text-[10px] uppercase tracking-tighter shadow-md inline-block`}
  >
    {children}
  </div>
);
