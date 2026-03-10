import React, { useState } from 'react';
import { Ghost, Target } from 'lucide-react';
import { callGemini } from '../api/gemini';
import { DARES } from '../data/dares';
import { FadeIn } from '../components/FadeIn';

export default function DareGenerator() {
  const [currentDare, setCurrentDare] = useState(DARES[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const spin = async () => {
    setIsSpinning(true);

    if (useAI && import.meta.env.VITE_GEMINI_API_KEY) {
      try {
        const result = await callGemini(
          'Give me ONE wild, funny, and creative YouTube dare challenge in a single short sentence. Be outrageous and original!',
          'You are a chaotic dare master. Keep it short, wild, and safe. No harmful ideas.'
        );
        setTimeout(() => {
          setCurrentDare(result?.trim() || DARES[Math.floor(Math.random() * DARES.length)]);
          setIsSpinning(false);
        }, 600);
        return;
      } catch {
        // Fall through to local dares on error
      }
    }

    setTimeout(() => {
      setCurrentDare(DARES[Math.floor(Math.random() * DARES.length)]);
      setIsSpinning(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <FadeIn>
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
            className="mt-12 bg-black text-white px-12 py-5 font-black uppercase text-2xl hover:scale-105 active:scale-95 transition-all shadow-[8px_8px_0_#FFF] disabled:opacity-60"
          >
            {isSpinning ? 'SPINNING...' : 'GIVE ME A DARE'}
          </button>

          {/* AI toggle */}
          {import.meta.env.VITE_GEMINI_API_KEY && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="font-black uppercase text-sm">AI Mode</span>
              <button
                onClick={() => setUseAI((v) => !v)}
                className={`w-14 h-7 rounded-full transition-all relative ${
                  useAI ? 'bg-black' : 'bg-black/30'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                    useAI ? 'left-8' : 'left-1'
                  }`}
                />
              </button>
              <span className="font-black uppercase text-[10px] opacity-60">
                {useAI ? 'GEMINI POWERED' : 'CLASSIC LIST'}
              </span>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
