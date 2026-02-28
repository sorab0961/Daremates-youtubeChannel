import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Zap,
  Users,
  Play,
  Share2,
  Loader2,
  Skull,
  Ghost,
  Target,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';

// --- GEMINI API CONFIG ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const callGemini = async (
  prompt,
  systemInstruction = 'You are a creative viral YouTube content strategist.'
) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
  };

  const fetchWithRetry = async (retries = 0) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      if (retries < 5) {
        const delay = Math.pow(2, retries) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(retries + 1);
      }
      throw error;
    }
  };

  return fetchWithRetry();
};

// --- REAL CHANNEL DATA ---
const CHANNEL_AVATAR =
  'https://yt3.googleusercontent.com/Dz561nYd_Py0namp8Ac6yM2awRkbS1hdLlaqU7o4BqwH-FRqIfZZ5GB5kpXsqs98U__wGb7EoQ=s176-c-k-c0x00ffffff-no-rj';

const VIDEOS = [
  {
    id: 1,
    title: "I Asked for FREE Stuff Just Because I\u2019m a YouTuber 😱",
    views: '2.1M',
    time: '1 month ago',
    thumbnail: 'https://i.ytimg.com/vi/jC0Tl1npgnE/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=jC0Tl1npgnE',
    tag: 'EPIC FAIL?',
  },
  {
    id: 2,
    title: "MYSTERY BOX | Everything in a Stranger's Cart Challenge",
    views: '1.2M',
    time: '2 months ago',
    thumbnail: 'https://i.ytimg.com/vi/cGb5UObK0eY/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=cGb5UObK0eY',
    tag: 'CASH GIVEAWAY',
  },
];

const SHORTS = [
  {
    id: 1,
    views: '15M',
    url: 'https://www.youtube.com/shorts/jC0Tl1npgnE',
    thumbnail: 'https://i.ytimg.com/vi/jC0Tl1npgnE/hqdefault.jpg',
  },
  {
    id: 2,
    views: '9.2M',
    url: 'https://www.youtube.com/shorts/cGb5UObK0eY',
    thumbnail: 'https://i.ytimg.com/vi/cGb5UObK0eY/hqdefault.jpg',
  },
];

const DARES = [
  'Ask for FREE stuff just because you are a YouTuber.',
  "Buy everything inside a stranger's shopping cart.",
  'Public Survival Challenge for 24 hours.',
  'Do 50 pushups in the middle of a mall.',
  'Trade a paperclip for something bigger (IRL).',
  'Eat the spiciest ramen while doing a handstand.',
];

const CautionTape = () => (
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

const Sticker = ({ children, color = 'bg-[#FF2ED1]', rotate = '-rotate-3', className = '' }) => (
  <div
    className={`${color} ${rotate} ${className} px-3 py-1 text-black font-black text-[10px] uppercase tracking-tighter shadow-md inline-block`}
  >
    {children}
  </div>
);

const VideoCard = ({ video }) => (
  <a
    href={video.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative block bg-[#111118] border-2 border-white/5 hover:border-[#FFD600] transition-all hover:-translate-y-2 hover:rotate-1"
  >
    <div className="relative aspect-video overflow-hidden">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
      />
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        <Sticker color="bg-[#FFD600]">{video.tag}</Sticker>
      </div>
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
        <Play fill="#FFD600" size={48} className="text-[#FFD600] drop-shadow-[0_0_10px_rgba(255,214,0,0.8)]" />
      </div>
    </div>
    <div className="p-4 space-y-2">
      <h3 className="text-lg font-black uppercase italic leading-none group-hover:text-[#FFD600] transition-colors line-clamp-2">
        {video.title}
      </h3>
      <div className="flex justify-between items-center text-[10px] font-black text-[#A0A0B0] uppercase">
        <span>{video.views} VIEWS</span>
        <span className="bg-white/5 px-2 py-0.5 rounded-sm">{video.time}</span>
      </div>
    </div>
    <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity rotate-12 bg-white text-black px-2 py-1 text-[8px] font-black uppercase">
      #DO_IT
    </div>
  </a>
);

const Navbar = ({ setPage, currentPage }) => (
  <nav className="fixed top-0 left-0 right-0 z-[100] bg-black border-b-4 border-[#FFD600] px-4 h-20 flex items-center justify-between shadow-[0_4px_20px_rgba(255,214,0,0.2)]">
    <div className="flex items-center gap-6">
      <div
        className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rotate-[-2deg] shadow-[4px_4px_0_rgba(255,214,0,1)] hover:rotate-0 transition-all"
        onClick={() => setPage('home')}
      >
        <Skull className="text-black" size={24} />
        <span className="text-2xl font-black italic tracking-tighter uppercase text-black">
          Dare<span className="text-red-600">Mates</span>
        </span>
      </div>

      <div className="hidden lg:flex gap-4">
        {['home', 'shorts', 'challenges', 'generator', 'ai-tools'].map((id) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`text-xs font-black uppercase tracking-widest px-3 py-1 transition-all ${
              currentPage === id
                ? 'bg-[#FF2ED1] text-white -rotate-3'
                : 'text-[#A0A0B0] hover:text-[#FFD600]'
            }`}
          >
            {id.replace('-', ' ')}
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
        alt="User"
        className="w-10 h-10 rounded-full border-2 border-white rotate-3 hidden sm:block"
      />
    </div>
  </nav>
);

const CreatorAITools = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generateAIIdea = async () => {
    if (!prompt) return;
    if (!apiKey) {
      alert('Missing VITE_GEMINI_API_KEY in your environment.');
      return;
    }

    setLoading(true);
    try {
      const response = await callGemini(
        `Generate a viral video script outline with the theme: "${prompt}". Make it wild, funny, and dare-focused.`,
        'You are a chaotic viral YouTuber. Use lots of emojis and caps. Keep it fun!'
      );
      setResult(response || 'No output from Gemini.');
    } catch (e) {
      alert('AI overloaded! Prank failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 py-10">
      <div className="bg-[#FF2ED1] text-black p-8 rotate-1 shadow-2xl inline-block mx-auto">
        <h1 className="text-4xl md:text-6xl font-black uppercase italic leading-none">
          AI BRAIN <br /> EXPLODER 🧠💥
        </h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-[#111118] border-4 border-[#FF2ED1] p-8 shadow-[10px_10px_0_rgba(255,46,209,0.3)]">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="FEED ME AN IDEA... e.g., Mall Pranks"
            className="w-full bg-black/50 border-2 border-white/10 p-6 text-white font-black uppercase placeholder:opacity-30 focus:outline-none focus:border-[#FF2ED1] h-32"
          />
          <button
            onClick={generateAIIdea}
            disabled={loading}
            className="w-full mt-6 bg-[#FF2ED1] text-white py-4 font-black uppercase text-xl hover:bg-black hover:text-[#FF2ED1] border-4 border-transparent hover:border-[#FF2ED1] transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Zap fill="currentColor" />}
            COOK THE SCRIPT
          </button>
        </div>

        {result && (
          <div className="bg-white text-black p-8 border-l-8 border-black font-medium leading-relaxed shadow-xl animate-in fade-in slide-in-from-top-4">
            <Sticker color="bg-[#FFD600]" rotate="-rotate-1">
              LEAKED SCRIPT:
            </Sticker>
            <div className="mt-4 whitespace-pre-wrap uppercase font-black tracking-tight">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const DareGenerator = () => {
  const [currentDare, setCurrentDare] = useState(DARES[0]);
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setCurrentDare(DARES[Math.floor(Math.random() * DARES.length)]);
      setIsSpinning(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="relative bg-[#FFD600] text-black p-12 md:p-20 text-center shadow-[15px_15px_0_#000] overflow-hidden">
        <div className="absolute top-4 left-4 opacity-10">
          <Ghost size={100} />
        </div>
        <div className="absolute bottom-4 right-4 opacity-10">
          <Target size={100} />
        </div>

        <h2 className="text-4xl md:text-7xl font-black uppercase italic leading-none mb-10">
          SPIN FOR <br /> <span className="text-white drop-shadow-[4px_4px_0_#000]">CHAOS</span>
        </h2>

        <div
          className={`min-h-[140px] flex items-center justify-center transition-all ${
            isSpinning ? 'scale-75 blur-sm' : 'scale-100'
          }`}
        >
          <p className="text-2xl md:text-4xl font-black uppercase leading-tight italic">
            "{currentDare}"
          </p>
        </div>

        <button
          onClick={spin}
          disabled={isSpinning}
          className="mt-12 bg-black text-white px-12 py-5 font-black uppercase text-2xl hover:scale-105 active:scale-95 transition-all shadow-[8px_8px_0_#FFF]"
        >
          {isSpinning ? 'SPINNING...' : 'GIVE ME A DARE'}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
          <div className="space-y-16">
            <header className="relative h-[400px] md:h-[600px] bg-black overflow-hidden flex items-center">
              <img
                src="https://i.ytimg.com/vi/jC0Tl1npgnE/maxresdefault.jpg"
                className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.4]"
                alt="Hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="relative z-10 px-8 max-w-4xl">
                <Sticker color="bg-[#FF2ED1]" rotate="-rotate-6" className="mb-4">
                  NEW UPLOAD ALERT
                </Sticker>
                <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.85] mt-4 tracking-tighter">
                  WE ASKED FOR <br /> <span className="text-[#FFD600]">FREE STUFF</span> <br />
                  AGAIN!!
                </h1>
                <div className="mt-8 flex gap-4">
                  <a
                    href="https://www.youtube.com/watch?v=jC0Tl1npgnE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-black px-10 py-4 font-black uppercase italic text-xl shadow-[6px_6px_0_#FF2ED1] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    Watch Now
                  </a>
                </div>
              </div>
            </header>

            <CautionTape />

            <section className="px-4 max-w-7xl mx-auto">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-black uppercase italic bg-[#FFD600] text-black px-4 py-1 rotate-1">
                  EPIC BANGERS
                </h2>
                <div className="h-1 flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {VIDEOS.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            </section>

            <section className="px-4 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-[#111118] p-8 border-4 border-white/5 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 text-white/5 rotate-12 group-hover:rotate-45 transition-all">
                    <Users size={300} />
                  </div>
                  <h2 className="text-4xl font-black uppercase italic mb-6">SQUAD POLL</h2>
                  <p className="text-[#A0A0B0] font-bold mb-8 uppercase tracking-tighter">
                    VOTE: WHAT SHOULD WE PRANK NEXT?
                  </p>
                  <div className="space-y-4 relative z-10">
                    <button className="w-full bg-white/5 hover:bg-[#FF2ED1] hover:text-white p-4 font-black uppercase text-left transition-all border-l-4 border-[#FF2ED1]">
                      The Library Revenge
                    </button>
                    <button className="w-full bg-white/5 hover:bg-[#FFD600] hover:text-black p-4 font-black uppercase text-left transition-all border-l-4 border-[#FFD600]">
                      Luxury Car Prank
                    </button>
                  </div>
                </div>
                <div className="bg-black border-4 border-[#FFD600] p-10 flex flex-col justify-center items-center text-center">
                  <h2 className="text-5xl font-black uppercase italic mb-4">
                    JOIN THE <br /> MADNESS
                  </h2>
                  <p className="text-[#A0A0B0] mb-8 font-black uppercase tracking-widest text-xs">
                    NO RULES. JUST DARES.
                  </p>
                  <button className="bg-[#FFD600] text-black px-12 py-4 font-black uppercase text-lg shadow-[6px_6px_0_#FFF]">
                    Join Squad
                  </button>
                </div>
              </div>
            </section>
          </div>
        );
      case 'challenges':
        return (
          <div className="pt-20 px-4 max-w-7xl mx-auto space-y-12 pb-20">
            <h1 className="text-6xl font-black uppercase italic text-center text-[#FFD600] drop-shadow-[4px_4px_0_#FFF]">
              ALL VIDEOS
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {VIDEOS.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </div>
        );
      case 'shorts':
        return (
          <div className="pt-20 px-4 max-w-7xl mx-auto space-y-12 pb-20">
            <h1 className="text-6xl font-black uppercase italic text-center text-[#FF2ED1]">
              VERTICAL CHAOS
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {SHORTS.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-[9/16] overflow-hidden border-2 border-white/5 hover:border-[#FF2ED1] transition-all"
                >
                  <img
                    src={s.thumbnail}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                    alt="Short"
                  />
                  <div className="absolute bottom-4 left-4 font-black text-white italic drop-shadow-md">
                    {s.views} VIEWS
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      case 'generator':
        return <DareGenerator />;
      case 'ai-tools':
        return <CreatorAITools />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FFD600] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] z-[0]" />

      <Navbar setPage={setPage} currentPage={page} />

      <main className="relative z-10 pt-20">{renderPage()}</main>

      <footer className="mt-32 pt-16 pb-12 border-t-8 border-[#FF2ED1] bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-8 rotate-1">
            <div className="bg-white text-black p-2">
              <Skull size={32} />
            </div>
            <span className="text-4xl font-black uppercase italic tracking-tighter">DareMates</span>
          </div>
          <p className="text-[#A0A0B0] text-xs font-black uppercase tracking-[0.3em] mb-8">
            THE HUB OF CHAOS • EST 2024 • DON'T TRY THIS AT HOME
          </p>
          <div className="flex justify-center gap-8 opacity-60">
            <Youtube size={24} className="hover:text-[#FF0000] cursor-pointer" />
            <MessageCircle size={24} className="hover:text-[#FF2ED1] cursor-pointer" />
            <Share2 size={24} className="hover:text-[#FFD600] cursor-pointer" />
          </div>
        </div>
      </footer>

      <div className="fixed top-20 left-4 pointer-events-none opacity-10 hidden xl:block">
        <Skull size={100} />
      </div>
      <div className="fixed bottom-20 right-4 pointer-events-none opacity-10 hidden xl:block rotate-12">
        <Zap size={150} fill="currentColor" />
      </div>
    </div>
  );
}
