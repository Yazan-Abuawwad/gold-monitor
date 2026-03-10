export interface FeedItem {
  id: number;
  title: string;
  description: string;
  url: string;
  publishedAt: string | null;
  category: string;
  fetchedAt: string;
  source: {
    id: number;
    name: string;
  };
}

export interface FeedsResponse {
  items: FeedItem[];
  sources: string[];
  lastUpdated: string | null;
}

export interface MapEvent {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  occurredAt: string;
}

export interface MapEventsResponse {
  events: MapEvent[];
}

export interface AiBriefResponse {
  brief: string | null;
  model: string;
  generatedAt: string;
  cached: boolean;
  error?: string;
}
