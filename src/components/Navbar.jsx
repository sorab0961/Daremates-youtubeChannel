import React, { useState } from 'react';
import { Skull, Menu, X } from 'lucide-react';
import { CHANNEL_AVATAR } from '../data/content';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { id: '/', label: 'Home' },
  { id: '/shorts', label: 'Shorts' },
  { id: '/challenges', label: 'Challenges' },
  { id: '/all-videos', label: 'All Videos' },
  { id: '/generator', label: 'Generator' },
  { id: '/ai-tools', label: 'AI Tools' },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-black border-b-4 border-[#FFD600] px-4 h-20 flex items-center justify-between shadow-[0_4px_20px_rgba(255,214,0,0.2)]">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rotate-[-2deg] shadow-[4px_4px_0_rgba(255,214,0,1)] hover:rotate-0 transition-all"
            onClick={() => handleNav('/')}
          >
            <Skull className="text-black" size={24} />
            <span className="text-2xl font-black italic tracking-tighter uppercase text-black">
              Dare<span className="text-red-600">Mates</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex gap-4">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`text-xs font-black uppercase tracking-widest px-3 py-1 transition-all ${
                  isActive(id)
                    ? 'bg-[#FF2ED1] text-white -rotate-3'
                    : 'text-[#A0A0B0] hover:text-[#FFD600]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.youtube.com/@daremates?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FF0000] text-white px-6 py-2 rounded-sm font-black text-xs uppercase italic tracking-widest hover:scale-110 active:scale-95 transition-all shadow-[4px_4px_0_#FFF]"
          >
            Sub to Madness
          </a>
          <img
            src={CHANNEL_AVATAR}
            alt="DareMates Channel"
            className="w-10 h-10 rounded-full border-2 border-white rotate-3 hidden sm:block"
          />
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden text-white hover:text-[#FFD600] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      {mobileOpen && (
        <div className="fixed top-20 left-0 right-0 z-[99] bg-black border-b-4 border-[#FFD600] flex flex-col lg:hidden shadow-2xl">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full text-left px-6 py-4 font-black uppercase tracking-widest text-sm border-b border-white/5 transition-all ${
                isActive(id)
                  ? 'bg-[#FF2ED1] text-white'
                  : 'text-[#A0A0B0] hover:text-[#FFD600] hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};
