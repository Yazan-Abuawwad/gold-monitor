# 🟡 GOLD MONITOR — Intelligence Dashboard

> Inspired by [koala73/worldmonitor](https://github.com/koala73/worldmonitor)

A World Monitor–style situational-awareness dashboard combining real-time news aggregation, an interactive global map, and AI-synthesized intelligence briefs.

---

## 🖥️ Live App

**Frontend:** https://gold-monitor.vercel.app ← deploy and update this  
**LLM API:** http://YOUR_VPS_IP:11434 ← set `OLLAMA_HOST` in `.env`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  News Panel  │  │  Map Panel   │  │  AI Brief Panel      │  │
│  │  (RSS feeds) │  │ (Leaflet.js) │  │ (Ollama/Qwen LLM)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼──────────────────────┼─────────────┘
          │                 │                       │
┌─────────▼─────────────────▼──────────────────────▼─────────────┐
│                  API LAYER (Express / Node.js)                   │
│  GET /api/feeds   GET /api/map-events   POST /api/ai-brief       │
│           │               │                    │                  │
│  ┌────────▼───────────────▼────────────────────▼──────────────┐ │
│  │              DATABASE (SQLite via better-sqlite3)           │ │
│  │  sources | feed_items | map_events | ai_briefs              │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────┘
                                        │
                             ┌──────────▼──────────┐
                             │  Ollama / Qwen LLM  │
                             │  (VPS or localhost)  │
                             │  qwen2:1.5b model   │
                             └─────────────────────┘
```

---

## ⚡ Quick Start (5 steps)

### Prerequisites
- Node.js 18+
- npm 9+
- [Ollama](https://ollama.ai) (optional, for AI briefs)

### 1. Clone the repository
```bash
git clone https://github.com/Yazan-Abuawwad/gold-monitor.git
cd gold-monitor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env — set OLLAMA_HOST if you have Ollama running
```

### 4. Start the backend
```bash
npm run dev:backend
# API running at http://localhost:3001
# SQLite DB auto-created at ./data/gold-monitor.db
# Map events seeded automatically
# RSS feeds fetched on startup
```

### 5. Start the frontend
```bash
npm run dev:frontend
# Dashboard at http://localhost:5173
```

---

## 📁 Repository Structure

```
gold-monitor/
├── README.md
├── .env.example
├── package.json              # Root workspace
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts          # Express server entry
│       ├── db/               # SQLite client, schema, migrations
│       ├── routes/           # /api/feeds, /api/map-events, /api/ai-brief
│       ├── services/         # RSS parser, Ollama client, seed data
│       └── middleware/       # CORS, rate limiting
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── components/       # NewsPanel, MapPanel, AiBriefPanel, Header
│       ├── hooks/            # useFeeds, useMapEvents, useAiBrief
│       ├── types/
│       └── styles/
├── db/
│   └── migrations/
│       └── 001_initial.sql
└── docs/
    ├── LOCAL_SETUP.md
    ├── DEPLOYMENT.md
    └── OLLAMA_SETUP.md
```

---

## 🤖 LLM / Ollama

The AI Brief panel uses [Ollama](https://ollama.ai) with the `qwen2:1.5b` model.

- **Local**: `ollama pull qwen2:1.5b && ollama serve`
- **VPS**: See [docs/OLLAMA_SETUP.md](docs/OLLAMA_SETUP.md)
- **Fallback**: If Ollama is unavailable, the panel shows a graceful error message

Set `OLLAMA_HOST=http://YOUR_VPS_IP:11434` in `.env`.

---

## 🗄️ Database

SQLite via `better-sqlite3` — zero infrastructure, file-based.

Tables: `sources`, `feed_items`, `map_events`, `ai_briefs`

Run migrations manually:
```bash
npm run db:migrate --workspace=backend
```

---

## 📚 Documentation

- [Local Setup Guide](docs/LOCAL_SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Ollama / LLM Setup](docs/OLLAMA_SETUP.md)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Map | Leaflet.js + react-leaflet (CartoDB Dark Matter tiles) |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite (better-sqlite3) |
| LLM | Ollama with qwen2:1.5b |
| News | RSS feeds via rss-parser (BBC, Reuters, Al Jazeera, AP, etc.) |