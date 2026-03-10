import React, { useState } from 'react';
import { useFeeds } from '../hooks/useFeeds.ts';
import type { FeedItem } from '../types/index.ts';

const CATEGORIES = ['all', 'world', 'security'];

function timeAgo(ts: string | null): string {
  if (!ts) return '';
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function severityFromCategory(category: string): string {
  if (category === 'security') return 'severity-high';
  return 'severity-medium';
}

interface NewsPanelProps {
  onHeadlinesLoaded?: (headlines: string[]) => void;
  refreshInterval?: number;
}

export default function NewsPanel({ onHeadlinesLoaded, refreshInterval = 60000 }: NewsPanelProps) {
  const [category, setCategory] = useState('all');
  const { data, loading, error, refresh } = useFeeds(category, refreshInterval);

  React.useEffect(() => {
    if (data?.items && onHeadlinesLoaded) {
      onHeadlinesLoaded(data.items.slice(0, 20).map(i => i.title));
    }
  }, [data, onHeadlinesLoaded]);

  const groupedBySource = React.useMemo(() => {
    if (!data?.items) return {};
    return data.items.reduce<Record<string, FeedItem[]>>((acc, item) => {
      const key = item.source.name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [data?.items]);

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid #333',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h2
          style={{
            color: 'var(--accent-gold)',
            fontSize: '0.85rem',
            letterSpacing: '0.2em',
            margin: 0,
          }}
        >
          ▶ INTEL FEED
        </h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '2px 10px',
                fontSize: '0.7rem',
                background: category === cat ? 'var(--accent-gold)' : 'transparent',
                color: category === cat ? '#000' : 'var(--text-secondary)',
                border: '1px solid var(--accent-gold)',
                borderRadius: '2px',
                cursor: 'pointer',
                letterSpacing: '0.1em',
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => void refresh()}
            style={{
              padding: '2px 8px',
              fontSize: '0.7rem',
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid #444',
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            ↻
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {loading && (
          <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px', fontSize: '0.8rem' }}>
            Loading feeds...
          </div>
        )}
        {error && (
          <div style={{ color: 'var(--severity-high)', textAlign: 'center', padding: '16px', fontSize: '0.8rem' }}>
            ⚠ {error}
          </div>
        )}
        {!loading && !error && data?.items.length === 0 && (
          <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px', fontSize: '0.8rem' }}>
            No feed items yet. Feeds refresh every 15 minutes.
          </div>
        )}
        {Object.entries(groupedBySource).map(([sourceName, items]) => (
          <div key={sourceName} style={{ marginBottom: '16px' }}>
            <div
              style={{
                color: 'var(--accent-gold)',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                marginBottom: '6px',
                paddingBottom: '4px',
                borderBottom: '1px solid #2a2a2a',
              }}
            >
              {sourceName.toUpperCase()}
            </div>
            {items.map(item => (
              <div
                key={item.id}
                className={severityFromCategory(item.category)}
                style={{
                  padding: '8px 12px',
                  marginBottom: '6px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '2px',
                }}
              >
                <a
                  href={item.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    lineHeight: '1.4',
                    display: 'block',
                  }}
                >
                  {item.title}
                </a>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '4px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.65rem',
                      background: '#222',
                      color: 'var(--accent-gold)',
                      padding: '1px 6px',
                      borderRadius: '2px',
                    }}
                  >
                    {item.category}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    {timeAgo(item.publishedAt || item.fetchedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      {data && (
        <div
          style={{
            padding: '6px 16px',
            borderTop: '1px solid #333',
            fontSize: '0.65rem',
            color: 'var(--text-secondary)',
          }}
        >
          {data.items.length} items · {data.sources.length} sources · refreshes every {refreshInterval >= 60000 ? `${Math.round(refreshInterval / 60000)}m` : `${refreshInterval / 1000}s`}
        </div>
      )}
    </div>
  );
}
