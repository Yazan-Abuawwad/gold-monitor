import { useState, useCallback } from 'react';
import type { AiBriefResponse } from '../types/index.ts';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export function useAiBrief() {
  const [data, setData] = useState<AiBriefResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateBrief = useCallback(async (briefType: string, headlines: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai-brief`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefType, headlines }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as AiBriefResponse;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate brief');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, generateBrief };
}
