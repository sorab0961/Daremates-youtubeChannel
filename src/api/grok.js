const apiKey = import.meta.env.VITE_GROK_API_KEY || '';

/**
 * Calls the xAI Grok API with retry/backoff.
 * @param {string} prompt - User prompt text
 * @param {string} systemInstruction - Optional system instruction
 * @returns {Promise<string>} Generated text
 */
export const callGrok = async (
  prompt,
  systemInstruction = 'You are a creative viral YouTube content strategist.'
) => {
  if (!apiKey) throw new Error('VITE_GROK_API_KEY is not set.');

  const url = 'https://api.x.ai/v1/chat/completions';

  const payload = {
    model: 'grok-beta',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
  };

  const fetchWithRetry = async (retries = 0) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Grok API error! status: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content;
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
