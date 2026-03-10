import React, { useState } from 'react';
import { useAiBrief } from '../hooks/useAiBrief.ts';

const BRIEF_TYPES = ['world', 'security'];

interface AiBriefPanelProps {
  headlines: string[];
}

export default function AiBriefPanel({ headlines }: AiBriefPanelProps) {
  const [briefType, setBriefType] = useState('world');
  const { data, loading, error, generateBrief } = useAiBrief();

  const handleGenerate = () => {
    void generateBrief(briefType, headlines);
  };

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
          flexWrap: 'wrap',
          gap: '8px',
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
          ▶ AI INTELLIGENCE BRIEF
        </h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {BRIEF_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setBriefType(t)}
              style={{
                padding: '2px 10px',
                fontSize: '0.7rem',
                background: briefType === t ? 'var(--accent-gold)' : 'transparent',
                color: briefType === t ? '#000' : 'var(--text-secondary)',
                border: '1px solid var(--accent-gold)',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
          <button
            onClick={handleGenerate}
            disabled={loading || headlines.length === 0}
            style={{
              padding: '4px 14px',
              fontSize: '0.75rem',
              background: loading ? '#333' : 'var(--accent-gold)',
              color: loading ? 'var(--text-secondary)' : '#000',
              border: 'none',
              borderRadius: '2px',
              cursor: loading || headlines.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
            }}
          >
            {loading ? '⟳ GENERATING...' : '⚡ GENERATE BRIEF'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {loading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              padding: '32px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--accent-gold)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Analyzing headlines with {briefType} context...
            </span>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '16px',
              border: '1px solid var(--severity-high)',
              borderRadius: '4px',
              color: 'var(--severity-high)',
              fontSize: '0.8rem',
            }}
          >
            ⚠ Error: {error}
          </div>
        )}

        {!loading && data && (
          <>
            {data.error ? (
              <div
                style={{
                  padding: '16px',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  background: 'var(--bg-secondary)',
                }}
              >
                <div style={{ color: 'var(--severity-medium)', marginBottom: '8px', fontSize: '0.8rem' }}>
                  ⚠ LLM Unavailable
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                  {data.error}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '8px' }}>
                  Set <code style={{ color: 'var(--accent-gold)' }}>OLLAMA_HOST</code> in your{' '}
                  <code style={{ color: 'var(--accent-gold)' }}>.env</code> to enable AI briefs.
                </p>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  {data.brief}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !data && !error && (
          <div
            style={{
              textAlign: 'center',
              padding: '32px',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🤖</div>
            <p>Click <strong style={{ color: 'var(--accent-gold)' }}>GENERATE BRIEF</strong> to produce an AI-synthesized intelligence brief from today's headlines.</p>
            <p style={{ fontSize: '0.75rem', marginTop: '8px' }}>
              Powered by <span style={{ color: 'var(--accent-gold)' }}>Ollama / qwen2:1.5b</span>
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {data && !data.error && (
        <div
          style={{
            padding: '6px 16px',
            borderTop: '1px solid #333',
            fontSize: '0.65rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Model: {data.model}</span>
          <span>
            {data.cached ? '📦 cached · ' : ''}
            {new Date(data.generatedAt).toUTCString()}
          </span>
        </div>
      )}
    </div>
  );
}
