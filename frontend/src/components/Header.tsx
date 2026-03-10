import { useState, useEffect } from 'react';

interface HeaderProps {
  lastFeedUpdate: string | null;
  llmAvailable: boolean | null;
}

export default function Header({ lastFeedUpdate, llmAvailable }: HeaderProps) {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      setUtcTime(new Date().toUTCString().replace(' GMT', ' UTC'));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatLastUpdate = (ts: string | null) => {
    if (!ts) return 'Never';
    const d = new Date(ts);
    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <header
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '2px solid var(--accent-gold)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1
          className="gold-glow"
          style={{
            color: 'var(--accent-gold)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            letterSpacing: '0.3em',
            margin: 0,
            fontFamily: 'serif',
          }}
        >
          ◈ GOLD MONITOR
        </h1>
        <span
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
          }}
        >
          INTELLIGENCE DASHBOARD
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {/* Live UTC clock */}
        <div style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
          🕐 {utcTime}
        </div>

        {/* Status indicators */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            DB{' '}
            <span style={{ color: 'var(--severity-low)' }}>●</span>
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            LLM{' '}
            <span
              style={{
                color:
                  llmAvailable === null
                    ? 'var(--text-secondary)'
                    : llmAvailable
                    ? 'var(--severity-low)'
                    : 'var(--severity-critical)',
              }}
            >
              {llmAvailable === null ? '○' : llmAvailable ? '●' : '●'}
            </span>
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            FEEDS{' '}
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.7rem' }}>
              {formatLastUpdate(lastFeedUpdate)}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
