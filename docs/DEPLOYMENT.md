# Deployment Guide — Gold Monitor

This guide covers deploying Gold Monitor to production.

**Recommended stack:**
- **Frontend**: Vercel (free tier)
- **Backend + DB**: Railway (free tier or $5/mo Hobby) with a PostgreSQL add-on
- **LLM**: VPS with Ollama (see [OLLAMA_SETUP.md](OLLAMA_SETUP.md))

---

## Option A: Vercel (Frontend) + Railway (Backend)

### 1. Deploy Backend to Railway

1. Create a new [Railway](https://railway.app) project
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Railway auto-detects Maven and builds with `mvn package -DskipTests`; set the **Start Command** to:
   ```
   java -jar target/gold-monitor-backend-1.0.0.jar
   ```
5. Add a **PostgreSQL** plugin — Railway injects `DATABASE_URL` automatically (update `application.properties` or override with env vars below)

**Environment Variables** (set in Railway dashboard):
```
DATABASE_URL=jdbc:postgresql://<host>:<port>/<db>
DB_USERNAME=<railway_pg_user>
DB_PASSWORD=<railway_pg_password>
PORT=3001
ALLOWED_ORIGINS=https://gold-monitor.vercel.app
OLLAMA_HOST=http://YOUR_VPS_IP:11434
OLLAMA_MODEL=llama3.2
```

6. Note your Railway URL: `https://gold-monitor-api.up.railway.app`

### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist/gold-monitor-frontend/browser`

**Environment Variables** (set in Vercel dashboard):
```
# None required — the Angular proxy is replaced by the production API URL
# configured in frontend/src/environments/environment.prod.ts
```

6. Deploy → your app is live at `https://gold-monitor.vercel.app`

---

## Option B: Full-Stack on Railway

Deploy the entire monorepo as a single Railway service:

1. Create a new Railway project
2. Connect your GitHub repository
3. Add a **PostgreSQL** plugin
4. Set **Root Directory** to `backend`
5. Set **Start Command**: `java -jar target/gold-monitor-backend-1.0.0.jar`
6. Set environment variables as in Option A
7. Build the Angular frontend locally first (`npm run build:frontend`), then serve the
   `frontend/dist/gold-monitor-frontend/browser` folder via a CDN or include it in the Spring Boot
   static resources directory (`backend/src/main/resources/static/`)

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
- [ ] Map panel shows global events
- [ ] AI Brief panel shows "Generate Brief" button
- [ ] If Ollama is configured: AI brief generates successfully
- [ ] `ALLOWED_ORIGINS` includes your Vercel domain
- [ ] No secrets hardcoded in the repository
