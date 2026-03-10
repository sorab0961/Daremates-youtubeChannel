const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Calls the Gemini generative language API with retry/backoff.
 * @param {string} prompt - User prompt text
 * @param {string} systemInstruction - Optional system instruction
 * @returns {Promise<string>} Generated text
 */
export const callGemini = async (
  prompt,
  systemInstruction = 'You are a creative viral YouTube content strategist.'
) => {
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not set.');

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
