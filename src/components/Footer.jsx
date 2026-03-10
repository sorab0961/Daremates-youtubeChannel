import React from 'react';
import { Skull, Youtube, MessageCircle, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'DareMates', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <footer className="mt-32 pt-16 pb-12 border-t-8 border-[#FF2ED1] bg-black relative z-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div
          className="flex justify-center items-center gap-2 mb-8 rotate-1 cursor-pointer"
          onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <div className="bg-white text-black p-2">
            <Skull size={32} />
          </div>
          <span className="text-4xl font-black uppercase italic tracking-tighter">DareMates</span>
        </div>
        <p className="text-[#A0A0B0] text-xs font-black uppercase tracking-[0.3em] mb-8">
          THE HUB OF CHAOS • EST 2024 • DON'T TRY THIS AT HOME
        </p>
        <div className="flex justify-center gap-8">
          <a
            href="https://www.youtube.com/@daremates"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube Channel"
            className="text-white/60 hover:text-[#FF0000] transition-colors"
          >
            <Youtube size={24} />
          </a>
          <a
            href="https://www.youtube.com/@daremates/community"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Community"
            className="text-white/60 hover:text-[#FF2ED1] transition-colors"
          >
            <MessageCircle size={24} />
          </a>
          <button
            onClick={handleShare}
            aria-label="Share this page"
            className="text-white/60 hover:text-[#FFD600] transition-colors cursor-pointer"
          >
            <Share2 size={24} />
          </button>
        </div>
        <p className="mt-6 text-[#A0A0B0]/40 text-[10px] uppercase tracking-widest">
          © {new Date().getFullYear()} DareMates. All dares performed by professionals (sort of).
        </p>
      </div>
    </footer>
  );
};
