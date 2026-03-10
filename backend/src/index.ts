import 'dotenv/config';
import express from 'express';
import cron from 'node-cron';
import { corsMiddleware } from './middleware/cors.js';
import { createTables } from './db/schema.js';
import { seedMapEvents } from './services/seedEvents.js';
import { fetchAndCacheFeeds } from './services/rssService.js';
import feedsRouter from './routes/feeds.js';
import mapEventsRouter from './routes/mapEvents.js';
import aiBriefRouter from './routes/aiBrief.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/feeds', feedsRouter);
app.use('/api/map-events', mapEventsRouter);
app.use('/api/ai-brief', aiBriefRouter);

// Initialize DB, seed, and start
async function bootstrap(): Promise<void> {
  console.log('🚀 Starting Gold Monitor API...');

  // Create tables
  createTables();

  // Seed map events
  seedMapEvents();

  // Initial RSS fetch
  console.log('📰 Fetching initial RSS feeds...');
  await fetchAndCacheFeeds().catch(err => console.error('Initial feed fetch failed:', err));

  // Schedule RSS refresh every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log('🔄 Refreshing RSS feeds...');
    await fetchAndCacheFeeds().catch(err => console.error('Scheduled feed fetch failed:', err));
  });

  app.listen(PORT, () => {
    console.log(`✅ Gold Monitor API running on http://localhost:${PORT}`);
    console.log(`   Endpoints: GET /api/feeds, GET /api/map-events, POST /api/ai-brief`);
  });
}

bootstrap().catch(console.error);
