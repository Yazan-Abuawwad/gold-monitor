CREATE TABLE IF NOT EXISTS sources (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    url        TEXT NOT NULL UNIQUE,
    category   TEXT NOT NULL DEFAULT 'world',
    enabled    SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS ai_briefs (
    id             SERIAL PRIMARY KEY,
    brief_type     TEXT NOT NULL DEFAULT 'world',
    content        TEXT NOT NULL,
    headlines_used TEXT,
    model_used     TEXT NOT NULL DEFAULT 'qwen2:1.5b',
    generated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
