import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapEvents } from '../hooks/useMapEvents.ts';
import type { MapEvent } from '../types/index.ts';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ff2222',
  high: '#ff6600',
  medium: '#ffaa00',
  low: '#44bb44',
};

const SEVERITY_RADIUS: Record<string, number> = {
  critical: 12,
  high: 10,
  medium: 8,
  low: 6,
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs > 0) return `${hrs}h ago`;
  return 'recently';
}

function MapEventMarker({ event }: { event: MapEvent }) {
  const color = SEVERITY_COLORS[event.severity] || '#ffaa00';
  const radius = SEVERITY_RADIUS[event.severity] || 8;

  return (
    <CircleMarker
      center={[event.lat, event.lng]}
      radius={radius}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.7,
        weight: event.severity === 'critical' ? 3 : 2,
      }}
    >
      <Popup>
        <div
          style={{
            background: '#1a1a1a',
            color: '#e8e8e8',
            minWidth: '200px',
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
          }}
        >
          <div
            style={{
              color: SEVERITY_COLORS[event.severity],
              fontWeight: 'bold',
              marginBottom: '6px',
              fontSize: '13px',
            }}
          >
            {event.title}
          </div>
          <p style={{ margin: '0 0 8px 0', color: '#aaa', lineHeight: '1.4' }}>
            {event.description}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: SEVERITY_COLORS[event.severity] + '33',
                color: SEVERITY_COLORS[event.severity],
                padding: '2px 8px',
                borderRadius: '2px',
                fontSize: '11px',
              }}
            >
              {event.type.toUpperCase()}
            </span>
            <span
              style={{
                background: '#333',
                color: SEVERITY_COLORS[event.severity],
                padding: '2px 8px',
                borderRadius: '2px',
                fontSize: '11px',
              }}
            >
              {event.severity.toUpperCase()}
            </span>
          </div>
          <div style={{ color: '#666', fontSize: '11px', marginTop: '6px' }}>
            {timeAgo(event.occurredAt)} · {event.source}
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}

function InvalidateMapSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

export default function MapPanel() {
  const { data, loading, error, refresh } = useMapEvents();

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
          ▶ GLOBAL SITUATION MAP
        </h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.65rem' }}>
            {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
              <span key={sev} style={{ color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>●</span>
                <span style={{ color: 'var(--text-secondary)' }}>{sev}</span>
              </span>
            ))}
          </div>
          <button
            onClick={() => void refresh()}
            style={{
              padding: '2px 10px',
              fontSize: '0.7rem',
              background: 'transparent',
              color: 'var(--accent-gold)',
              border: '1px solid var(--accent-gold)',
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            ↻ REFRESH
          </button>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.7)',
              zIndex: 1000,
              color: 'var(--accent-gold)',
              fontSize: '0.8rem',
            }}
          >
            Loading events...
          </div>
        )}
        {error && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.7)',
              zIndex: 1000,
              color: 'var(--severity-high)',
              fontSize: '0.8rem',
            }}
          >
            ⚠ {error}
          </div>
        )}
        <MapContainer
          center={[20, 15]}
          zoom={2}
          style={{ height: '100%', width: '100%', minHeight: '300px' }}
          zoomControl={true}
        >
          <InvalidateMapSize />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />
          {data?.events.map(event => (
            <MapEventMarker key={event.id} event={event} />
          ))}
        </MapContainer>
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
          {data.events.length} active events monitored
        </div>
      )}
    </div>
  );
}
