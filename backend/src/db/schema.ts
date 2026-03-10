import db from './client.js';

export function createTables(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL DEFAULT 'world',
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS feed_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id INTEGER NOT NULL REFERENCES sources(id),
      title TEXT NOT NULL,
      description TEXT,
      url TEXT UNIQUE,
      published_at TEXT,
      category TEXT,
      fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (source_id) REFERENCES sources(id)
    );

    CREATE TABLE IF NOT EXISTS map_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      event_type TEXT NOT NULL DEFAULT 'news',
      severity TEXT NOT NULL DEFAULT 'medium',
      source TEXT,
      occurred_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ai_briefs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brief_type TEXT NOT NULL DEFAULT 'world',
      content TEXT NOT NULL,
      headlines_used TEXT,
      model_used TEXT NOT NULL DEFAULT 'qwen2:1.5b',
      generated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    INSERT OR IGNORE INTO sources (name, url, category) VALUES
      ('BBC World', 'http://feeds.bbci.co.uk/news/world/rss.xml', 'world'),
      ('Reuters', 'https://feeds.reuters.com/reuters/topNews', 'world'),
      ('Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml', 'world'),
      ('AP News', 'https://rsshub.app/apnews/topics/apf-intlnews', 'world'),
      ('Defense News', 'https://www.defensenews.com/rss/', 'security'),
      ('The Guardian World', 'https://www.theguardian.com/world/rss', 'world');
  `);

  console.log('✅ Database tables created/verified');
}
