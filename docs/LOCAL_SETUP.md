# Local Setup Guide — Gold Monitor

This guide walks you through running Gold Monitor locally for development.

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Included with Node.js |
| Ollama | Latest | Optional — for AI briefs |

---

## Step-by-Step Setup

### 1. Clone the repository

```bash
git clone https://github.com/Yazan-Abuawwad/gold-monitor.git
cd gold-monitor
```

### 2. Install all dependencies

```bash
npm install
```

This installs both backend and frontend dependencies via npm workspaces.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and configure:

```env
# Required — Database path (auto-created)
DATABASE_URL=./data/gold-monitor.db

# Required — API port
PORT=3001

# Required — Allowed frontend origins
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Optional — Ollama LLM endpoint
# Set this to enable AI briefs
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen2:1.5b

# Required — Frontend API URL (points to backend)
VITE_API_BASE_URL=http://localhost:3001
```

### 4. Run database migrations

```bash
npm run db:migrate --workspace=backend
```

This creates `data/gold-monitor.db` with all tables and seeds the default RSS sources.

### 5. Start the backend API

```bash
npm run dev:backend
```

Output:
```
🚀 Starting Gold Monitor API...
✅ Database tables created/verified
✅ Seeded 16 map events
📰 Fetching initial RSS feeds...
✅ Gold Monitor API running on http://localhost:3001
   Endpoints: GET /api/feeds, GET /api/map-events, POST /api/ai-brief
```

### 6. Start the frontend (new terminal)

```bash
npm run dev:frontend
```

Open: **http://localhost:5173**

---

## Testing the API

### Check health
```bash
curl http://localhost:3001/health
```

### Fetch news feeds
```bash
curl "http://localhost:3001/api/feeds?limit=5"
```

### Fetch map events
```bash
curl http://localhost:3001/api/map-events
```

### Generate AI brief (requires Ollama)
```bash
curl -X POST http://localhost:3001/api/ai-brief \
  -H "Content-Type: application/json" \
  -d '{"briefType":"world","headlines":["Headline 1","Headline 2"]}'
```

---

## Troubleshooting

### `better-sqlite3` build error
```bash
npm rebuild better-sqlite3 --workspace=backend
```

### RSS feeds not loading
RSS feeds are fetched every 15 minutes. If initial fetch fails (network issues), wait or check your internet connection. The API will still respond with an empty list.

### Map not rendering
The map uses CartoDB tiles (CDN). Ensure you have internet connectivity. The Leaflet CSS is loaded from the npm package.

### Ollama not available
The AI Brief panel will show a graceful error. To enable:
1. Install Ollama: see [OLLAMA_SETUP.md](OLLAMA_SETUP.md)
2. Set `OLLAMA_HOST` in `.env`
3. Restart the backend
