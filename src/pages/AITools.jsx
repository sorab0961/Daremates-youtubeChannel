import React, { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { callGemini } from '../api/gemini';
import { Sticker } from '../components/Sticker';
import { FadeIn } from '../components/FadeIn';

export default function AITools() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generateAIIdea = async () => {
    if (!prompt.trim()) return;
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setError('Add your VITE_GEMINI_API_KEY to the .env file to use AI features.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await callGemini(
        `Generate a viral video script outline with the theme: "${prompt}". Make it wild, funny, and dare-focused.`,
        'You are a chaotic viral YouTuber. Use lots of emojis and caps. Keep it fun!'
      );
      setResult(response || 'No output from Gemini.');
    } catch (e) {
      setError('AI is overloaded right now! Try again in a few seconds. 🤖💥');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generateAIIdea();
  };

  return (
    <div className="space-y-12 py-10 px-4">
      <FadeIn>
        <div className="bg-[#FF2ED1] text-black p-8 rotate-1 shadow-2xl inline-block mx-auto">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic leading-none">
            AI BRAIN <br /> EXPLODER 🧠💥
          </h1>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-[#111118] border-4 border-[#FF2ED1] p-8 shadow-[10px_10px_0_rgba(255,46,209,0.3)]">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#A0A0B0] mb-3">
              Ctrl+Enter to submit
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="FEED ME AN IDEA... e.g., Mall Pranks"
              className="w-full bg-black/50 border-2 border-white/10 p-6 text-white font-black uppercase placeholder:opacity-30 focus:outline-none focus:border-[#FF2ED1] h-32 resize-none transition-colors"
            />
            <button
              onClick={generateAIIdea}
              disabled={loading || !prompt.trim()}
              className="w-full mt-6 bg-[#FF2ED1] text-white py-4 font-black uppercase text-xl hover:bg-black hover:text-[#FF2ED1] border-4 border-transparent hover:border-[#FF2ED1] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Zap fill="currentColor" />}
              {loading ? 'COOKING...' : 'COOK THE SCRIPT'}
            </button>
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-red-900/40 border-l-8 border-red-500 p-6 font-black uppercase text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="bg-white text-black p-8 border-l-8 border-black font-medium leading-relaxed shadow-xl">
              <Sticker color="bg-[#FFD600]" rotate="-rotate-1">
                LEAKED SCRIPT:
              </Sticker>
              <div className="mt-4 whitespace-pre-wrap uppercase font-black tracking-tight">{result}</div>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
