import { Router, Request, Response } from 'express';
import db from '../db/client.js';
import { getLastFetchTime } from '../services/rssService.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.get('/', rateLimit({ windowMs: 60_000, max: 60 }), (req: Request, res: Response) => {
  const { category, limit = '50', source } = req.query;

  let query = `
    SELECT fi.id, fi.title, fi.description, fi.url, fi.published_at, fi.category, fi.fetched_at,
           s.id as source_id, s.name as source_name
    FROM feed_items fi
    JOIN sources s ON fi.source_id = s.id
    WHERE 1=1
  `;

  const params: (string | number)[] = [];

  if (category && category !== 'all') {
    query += ' AND fi.category = ?';
    params.push(category as string);
  }

  if (source) {
    query += ' AND s.name = ?';
    params.push(source as string);
  }

  query += ' ORDER BY CASE WHEN fi.published_at IS NULL THEN 1 ELSE 0 END, fi.published_at DESC, fi.fetched_at DESC LIMIT ?';
  params.push(parseInt(limit as string, 10) || 50);

  const rows = db.prepare(query).all(...params) as Array<{
    id: number;
    title: string;
    description: string;
    url: string;
    published_at: string;
    category: string;
    fetched_at: string;
    source_id: number;
    source_name: string;
  }>;

  const items = rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    publishedAt: row.published_at,
    category: row.category,
    fetchedAt: row.fetched_at,
    source: {
      id: row.source_id,
      name: row.source_name,
    },
  }));

  const sourceNames = [...new Set(rows.map(r => r.source_name))];
  const lastUpdated = getLastFetchTime();

  res.json({ items, sources: sourceNames, lastUpdated });
});

export default router;
