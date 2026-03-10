# Deployment Guide — Gold Monitor

This guide covers deploying Gold Monitor to production.

**Recommended stack:**
- **Frontend**: Vercel (free tier)
- **Backend + DB**: Railway (free tier or $5/mo Hobby)
- **LLM**: VPS with Ollama (see [OLLAMA_SETUP.md](OLLAMA_SETUP.md))

---

## Option A: Vercel (Frontend) + Railway (Backend)

### 1. Deploy Backend to Railway

1. Create a new [Railway](https://railway.app) project
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Railway auto-detects Node.js and runs `npm install && npm run build && npm start`

**Environment Variables** (set in Railway dashboard):
```
DATABASE_URL=/app/data/gold-monitor.db
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://gold-monitor.vercel.app
OLLAMA_HOST=http://YOUR_VPS_IP:11434
OLLAMA_MODEL=qwen2:1.5b
```

5. Note your Railway URL: `https://gold-monitor-api.up.railway.app`

### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`

**Environment Variables** (set in Vercel dashboard):
```
VITE_API_BASE_URL=https://gold-monitor-api.up.railway.app
```

6. Deploy → your app is live at `https://gold-monitor.vercel.app`

---

## Option B: Full-Stack on Railway

Deploy the entire monorepo as a single Railway service:

1. Create a new Railway project
2. Connect your GitHub repository  
3. Set start command: `npm run dev:backend`
4. Set environment variables as above
5. For frontend, run `npm run build --workspace=frontend` and serve the `frontend/dist` folder via Express static middleware

Add to `backend/src/index.ts`:
```typescript
import path from 'path';
// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve('../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}
```

---

## Option C: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. `fly auth login`
3. Create a `fly.toml` at the repo root:
```toml
app = "gold-monitor"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[[services]]
  http_checks = []
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```
4. `fly deploy`

---

## Live URL Placeholders

After deployment, update these in `README.md`:

| Service | URL |
|---------|-----|
| Frontend | `https://gold-monitor.vercel.app` |
| Backend API | `https://gold-monitor-api.up.railway.app` |
| LLM Endpoint | `http://YOUR_VPS_IP:11434` |

---

## Post-Deployment Checklist

- [ ] `https://your-app.vercel.app` loads the dashboard
- [ ] News feeds panel shows headlines (may take a few minutes on first boot)
- [ ] Map panel shows 16 global events
- [ ] AI Brief panel shows "Generate Brief" button
- [ ] If Ollama is configured: AI brief generates successfully
- [ ] `ALLOWED_ORIGINS` includes your Vercel domain
- [ ] No secrets hardcoded in the repository
