import React, { useState, useCallback } from 'react';
import Header from './components/Header.tsx';
import NewsPanel from './components/NewsPanel.tsx';
import MapPanel from './components/MapPanel.tsx';
import AiBriefPanel from './components/AiBriefPanel.tsx';

export default function App() {
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [lastFeedUpdate, setLastFeedUpdate] = useState<string | null>(null);
  const [llmAvailable, setLlmAvailable] = useState<boolean | null>(null);

  const handleHeadlinesLoaded = useCallback((items: string[]) => {
    setHeadlines(items);
    setLastFeedUpdate(new Date().toISOString());
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Header lastFeedUpdate={lastFeedUpdate} llmAvailable={llmAvailable} />

      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '320px 1fr 340px',
          gridTemplateRows: '1fr',
          gap: '8px',
          padding: '8px',
          height: 'calc(100vh - 60px)',
          overflow: 'hidden',
        }}
      >
        {/* Left: News Panel */}
        <div style={{ overflow: 'hidden' }}>
          <NewsPanel onHeadlinesLoaded={handleHeadlinesLoaded} />
        </div>

        {/* Center: Map Panel */}
        <div style={{ overflow: 'hidden' }}>
          <MapPanel />
        </div>

        {/* Right: AI Brief Panel */}
        <div style={{ overflow: 'hidden' }}>
          <AiBriefPanel headlines={headlines} onLlmStatus={setLlmAvailable} />
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
