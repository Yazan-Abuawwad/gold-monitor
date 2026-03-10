const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2:1.5b';

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

const ALLOWED_BRIEF_TYPES = new Set(['world', 'security', 'political', 'humanitarian', 'military', 'economic']);

export async function generateBrief(headlines: string[], briefType: string = 'world'): Promise<string> {
  const safeType = ALLOWED_BRIEF_TYPES.has(briefType) ? briefType : 'world';
  const headlineList = headlines.map(h => `- ${h}`).join('\n');
  const prompt = `You are a geopolitical intelligence analyst. Given these recent headlines, write a concise 3-paragraph "${safeType.charAt(0).toUpperCase() + safeType.slice(1)} Brief" summarizing the most significant global developments, key themes, and any emerging risks.
Headlines:
${headlineList}
Write in the style of a professional intelligence briefing. Be factual and concise.`;

  const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as OllamaResponse;
  return data.response;
}

export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export { OLLAMA_MODEL };
