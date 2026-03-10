import Parser from 'rss-parser';
import db from '../db/client.js';

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'GoldMonitor/1.0 RSS Reader' },
});

interface FeedItem {
  title?: string;
  contentSnippet?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
}

export async function fetchAndCacheFeeds(): Promise<void> {
  const sources = db.prepare('SELECT * FROM sources WHERE enabled = 1').all() as Array<{
    id: number;
    name: string;
    url: string;
    category: string;
  }>;

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      const insertItem = db.prepare(`
        INSERT OR IGNORE INTO feed_items (source_id, title, description, url, published_at, category)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const insertMany = db.transaction((items: FeedItem[]) => {
        for (const item of items) {
          insertItem.run(
            source.id,
            item.title || '',
            item.contentSnippet || '',
            item.link || null,
            item.isoDate || item.pubDate || null,
            source.category,
          );
        }
      });

      insertMany(feed.items.slice(0, 20));
      console.log(`✅ Fetched ${feed.items.length} items from ${source.name}`);
    } catch (error) {
      console.error(`❌ Failed to fetch feed from ${source.name}:`, error instanceof Error ? error.message : error);
    }
  }
}

export function getLastFetchTime(): string | null {
  const result = db.prepare('SELECT MAX(fetched_at) as last FROM feed_items').get() as { last: string | null };
  return result?.last ?? null;
}
