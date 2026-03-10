import { useState, useEffect, useCallback } from 'react';
import type { MapEventsResponse } from '../types/index.ts';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export function useMapEvents() {
  const [data, setData] = useState<MapEventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/map-events`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as MapEventsResponse;
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch map events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  return { data, loading, error, refresh: fetchEvents };
}
