import { useState, useEffect, useCallback } from 'react';
import type { FeedsResponse } from '../types/index.ts';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export function useFeeds(category: string = 'all', refreshInterval: number = 60000) {
  const [data, setData] = useState<FeedsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (category !== 'all') params.set('category', category);
      const res = await fetch(`${API_BASE}/api/feeds?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as FeedsResponse;
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch feeds');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    void fetchFeeds();
    const interval = setInterval(() => void fetchFeeds(), refreshInterval);
    return () => clearInterval(interval);
  }, [fetchFeeds, refreshInterval]);

  return { data, loading, error, refresh: fetchFeeds };
}
