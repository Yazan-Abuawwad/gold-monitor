import { Router, Request, Response } from 'express';
import db from '../db/client.js';
import { generateBrief, checkOllamaHealth, OLLAMA_MODEL } from '../services/ollamaService.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();

const CACHE_DURATION_HOURS = 2;

router.post('/', rateLimit({ windowMs: 60_000, max: 10 }), async (req: Request, res: Response) => {
  const { briefType = 'world', headlines = [] } = req.body as {
    briefType?: string;
    headlines?: string[];
  };

  // Check cache
  const cached = db.prepare(`
    SELECT * FROM ai_briefs
    WHERE brief_type = ?
      AND datetime(generated_at, '+${CACHE_DURATION_HOURS} hours') > datetime('now')
    ORDER BY generated_at DESC
    LIMIT 1
  `).get(briefType) as {
    id: number;
    brief_type: string;
    content: string;
    headlines_used: string;
    model_used: string;
    generated_at: string;
  } | undefined;

  if (cached) {
    return res.json({
      brief: cached.content,
      model: cached.model_used,
      generatedAt: cached.generated_at,
      cached: true,
    });
  }

  // Check Ollama health
  const ollamaAvailable = await checkOllamaHealth();
  if (!ollamaAvailable) {
    return res.json({
      brief: null,
      model: OLLAMA_MODEL,
      generatedAt: new Date().toISOString(),
      cached: false,
      error: 'LLM service unavailable — configure OLLAMA_HOST in your environment',
    });
  }

  try {
    const headlinesToUse = headlines.slice(0, 20);
    const brief = await generateBrief(headlinesToUse, briefType);

    // Cache the result
    db.prepare(`
      INSERT INTO ai_briefs (brief_type, content, headlines_used, model_used)
      VALUES (?, ?, ?, ?)
    `).run(briefType, brief, JSON.stringify(headlinesToUse), OLLAMA_MODEL);

    return res.json({
      brief,
      model: OLLAMA_MODEL,
      generatedAt: new Date().toISOString(),
      cached: false,
    });
  } catch (error) {
    console.error('Error generating AI brief:', error);
    return res.status(500).json({
      brief: null,
      model: OLLAMA_MODEL,
      generatedAt: new Date().toISOString(),
      cached: false,
      error: 'Failed to generate brief. Please try again.',
    });
  }
});

export default router;
