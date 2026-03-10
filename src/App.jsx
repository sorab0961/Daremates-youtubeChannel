import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Zap, Skull } from 'lucide-react';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import Home from './pages/Home';
import Shorts from './pages/Shorts';
import Challenges from './pages/Challenges';
import DareGenerator from './pages/DareGenerator';
import AITools from './pages/AITools';
import AllVideos from './pages/AllVideos';

// Inject marquee keyframe globally once
const marqueeCss = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;
const styleTag = document.createElement('style');
styleTag.textContent = marqueeCss;
document.head.appendChild(styleTag);

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-body selection:bg-[#FFD600] selection:text-black overflow-x-hidden">
      {/* Subtle noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] z-0" />

      <Navbar />

      <main className="relative z-10 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/all-videos" element={<AllVideos />} />
          <Route path="/generator" element={<DareGenerator />} />
          <Route path="/ai-tools" element={<AITools />} />
          {/* Fallback to home for unknown routes */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />

      {/* Decorative ambient icons */}
      <div className="fixed top-20 left-4 pointer-events-none opacity-10 hidden xl:block">
        <Skull size={100} />
      </div>
      <div className="fixed bottom-20 right-4 pointer-events-none opacity-10 hidden xl:block rotate-12">
        <Zap size={150} fill="currentColor" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  );
}
