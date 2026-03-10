import { Router, Request, Response } from 'express';
import db from '../db/client.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.get('/', rateLimit({ windowMs: 60_000, max: 60 }), (req: Request, res: Response) => {
  const { type, severity, since } = req.query;

  let query = 'SELECT id, title, description, lat, lng, event_type, severity, source, occurred_at, created_at FROM map_events WHERE 1=1';
  const params: (string | number)[] = [];

  if (type) {
    query += ' AND event_type = ?';
    params.push(type as string);
  }

  if (severity) {
    query += ' AND severity = ?';
    params.push(severity as string);
  }

  if (since) {
    query += ' AND occurred_at >= ?';
    params.push(since as string);
  }

  query += ' ORDER BY occurred_at DESC';

  const events = db.prepare(query).all(...params) as Array<{
    id: number;
    title: string;
    description: string;
    lat: number;
    lng: number;
    event_type: string;
    severity: string;
    source: string;
    occurred_at: string;
    created_at: string;
  }>;

  res.json({
    events: events.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      lat: e.lat,
      lng: e.lng,
      type: e.event_type,
      severity: e.severity,
      source: e.source,
      occurredAt: e.occurred_at,
    })),
  });
});

export default router;
