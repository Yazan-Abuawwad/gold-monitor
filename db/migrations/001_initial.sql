-- ============================================================
-- Migration 001 — Initial schema  (PostgreSQL)
-- ============================================================

-- News feed sources
CREATE TABLE IF NOT EXISTS sources (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    url        TEXT NOT NULL UNIQUE,
    category   TEXT NOT NULL DEFAULT 'world',
    enabled    SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Cached headlines / feed items
CREATE TABLE IF NOT EXISTS feed_items (
    id           SERIAL PRIMARY KEY,
    source_id    INTEGER NOT NULL REFERENCES sources(id),
    title        TEXT NOT NULL,
    description  TEXT,
    url          TEXT UNIQUE,
    published_at TEXT,
    category     TEXT,
    fetched_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Map / geo events
CREATE TABLE IF NOT EXISTS map_events (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    lat         DOUBLE PRECISION NOT NULL,
    lng         DOUBLE PRECISION NOT NULL,
    event_type  TEXT NOT NULL DEFAULT 'news',
    severity    TEXT NOT NULL DEFAULT 'medium',
    source      TEXT,
    occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- AI-generated briefs (cached)
CREATE TABLE IF NOT EXISTS ai_briefs (
    id             SERIAL PRIMARY KEY,
    brief_type     TEXT NOT NULL DEFAULT 'world',
    content        TEXT NOT NULL,
    headlines_used TEXT,
    model_used     TEXT NOT NULL DEFAULT 'llama3.2',
    generated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Seed default RSS sources
-- ============================================================
INSERT INTO sources (name, url, category) VALUES
    -- World News
    ('BBC News World',     'https://feeds.bbci.co.uk/news/world/rss.xml',                       'world'),
    ('Al Jazeera',         'https://www.aljazeera.com/xml/rss/all.xml',                         'world'),
    ('The Guardian World', 'https://www.theguardian.com/world/rss',                             'world'),
    ('NPR World',          'https://feeds.npr.org/1004/rss.xml',                                'world'),
    ('ABC News Intl',      'https://abcnews.go.com/abcnews/internationalheadlines',             'world'),
    -- Security / Defence
    ('Defense News',       'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml', 'security'),
    -- Gold & Commodities
    ('Kitco News Gold',    'https://www.kitco.com/rss/KitcoNewsGold.xml',                       'gold'),
    ('MarketWatch Metals', 'https://feeds.marketwatch.com/marketwatch/marketpulse/',            'gold'),
    ('Investing.com Gold', 'https://www.investing.com/rss/news_25.rss',                         'gold'),
    ('Gold Silver Worlds', 'https://goldsilverworlds.com/feed/',                                'gold'),
    ('Seeking Alpha Gold', 'https://seekingalpha.com/tag/gold.xml',                             'gold'),
    ('Mining.com',         'https://www.mining.com/feed/',                                      'gold'),
    ('FX Empire Gold',     'https://www.fxempire.com/api/v1/en/markets/commodity/Gold/news/feed', 'gold')
ON CONFLICT (url) DO NOTHING;
