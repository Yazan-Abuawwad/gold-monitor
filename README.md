# 🟡 GOLD MONITOR — Intelligence Dashboard

> Inspired by [koala73/worldmonitor](https://github.com/koala73/worldmonitor)

A World Monitor–style situational-awareness dashboard combining real-time news aggregation, an interactive global map, and AI-synthesized intelligence briefs.

---

## 🖥️ Live App

**Frontend:** https://gold-monitor.vercel.app ← deploy and update this  
**LLM API:** http://YOUR_VPS_IP:11434 ← set `OLLAMA_HOST` in `.env`

 
 <img width="1917" height="986" alt="image" src="https://github.com/user-attachments/assets/fb95b106-dece-479f-b20d-2395cead2320" />


---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│               FRONTEND (Angular 19 + PrimeNG)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  News Panel  │  │  Map Panel   │  │  AI Brief Panel      │  │
│  │  (RSS feeds) │  │ (Leaflet.js) │  │ (Ollama/Qwen LLM)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼──────────────────────┼─────────────┘
          │                 │                       │
┌─────────▼─────────────────▼──────────────────────▼─────────────┐
│                 API LAYER (Spring Boot 3 / Java 17)              │
│  GET /api/feeds   GET /api/map-events   POST /api/ai-brief       │
│           │               │                    │                  │
│  ┌────────▼───────────────▼────────────────────▼──────────────┐ │
│  │              DATABASE (SQLite via JDBC)                     │ │
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

## ⚡ Quick Start

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+
- npm 9+
- [Ollama](https://ollama.ai) (optional, for AI briefs)

### 1. Clone the repository
```bash
git clone https://github.com/Yazan-Abuawwad/gold-monitor.git
cd gold-monitor
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set OLLAMA_HOST if you have Ollama running
```

### 3. Start the backend
```bash
cd backend
# Optional: export environment variables from .env
mvn spring-boot:run
# API running at http://localhost:3001
# SQLite DB auto-created at ./data/gold-monitor.db
# Map events seeded automatically on first start
# RSS feeds fetched on startup (then every 15 minutes)
# Rate limiting: 60 req/min for feeds/map, 10 req/min for AI brief (per IP)
```

### 4. Start the frontend
```bash
cd frontend
npm install
npm run dev
# Dashboard at http://localhost:4200
```

---

## 📁 Repository Structure

```
gold-monitor/
├── README.md
├── .env.example
├── package.json              # Root scripts
├── backend/                  # Spring Boot 3 (Java 17 + Maven)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/goldmonitor/
│       │   ├── GoldMonitorApplication.java
│       │   ├── config/         # CORS configuration
│       │   ├── controller/     # REST controllers
│       │   ├── service/        # RSS, Ollama, Seed services
│       │   ├── model/          # Domain models
│       │   └── dto/            # Request/response DTOs
│       └── resources/
│           ├── application.properties
│           ├── schema.sql      # SQLite table definitions
│           └── data.sql        # Initial RSS source data
├── frontend/                 # Angular 19 + PrimeNG 19
│   ├── angular.json
│   ├── package.json
│   ├── proxy.conf.json        # Dev-server proxy → backend :3001
│   └── src/app/
│       ├── app.component.*    # Root layout
│       ├── components/        # header, news-panel, map-panel, ai-brief-panel
│       ├── services/          # FeedService, MapEventsService, AiBriefService
│       └── models/            # TypeScript interfaces
├── db/
│   └── migrations/
└── docs/
    ├── LOCAL_SETUP.md
    ├── DEPLOYMENT.md
    └── OLLAMA_SETUP.md
```

---

## ⚙️ Backend Configuration

All backend settings are tunable via environment variables:

```properties
server.port=${PORT:3001}
spring.datasource.url=jdbc:sqlite:${DATABASE_URL:./data/gold-monitor.db}
allowed.origins=${ALLOWED_ORIGINS:http://localhost:4200}
ollama.host=${OLLAMA_HOST:http://localhost:11434}
ollama.model=${OLLAMA_MODEL:qwen2:1.5b}
```

---

## 🤖 LLM / Ollama

The AI Brief panel uses [Ollama](https://ollama.ai) with the `qwen2:1.5b` model.

- **Local**: `ollama pull qwen2:1.5b && ollama serve`
- **VPS**: See [docs/OLLAMA_SETUP.md](docs/OLLAMA_SETUP.md)
- **Fallback**: If Ollama is unavailable, the panel shows a graceful error message

Set `OLLAMA_HOST=http://YOUR_VPS_IP:11434` in `.env` (then pass as env var to Spring Boot).

---

## 🗄️ Database

SQLite via Spring JDBC — zero infrastructure, file-based.

Tables: `sources`, `feed_items`, `map_events`, `ai_briefs`

Schema is auto-applied on startup via `src/main/resources/schema.sql`.

---

## 📚 Documentation

- [Local Setup Guide](docs/LOCAL_SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Ollama / LLM Setup](docs/OLLAMA_SETUP.md)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19.2.19 + PrimeNG 19.1.4 + TypeScript |
| Map | Leaflet.js (CartoDB Dark Matter tiles) |
| Backend | Spring Boot 3.2 + Java 17 + Maven |
| Database | SQLite (Spring JDBC) |
| RSS Parsing | Rome 2.1.0 |
| LLM | Ollama with qwen2:1.5b |
| Rate Limiting | Bucket4j per-IP (60 req/min feeds/map, 10 req/min AI brief) |
| News | RSS feeds (BBC, Reuters, Al Jazeera, AP, Defense News, Guardian) |

---

## 🔒 Security

Angular was upgraded to **19.2.19** to fix the following CVEs (no patch available in ≤ 18.x):

| CVE | Package | Fixed in |
|-----|---------|----------|
| XSRF Token Leakage via protocol-relative URLs | `@angular/common` | 19.2.16 |
| XSS via unsanitized SVG script attributes | `@angular/compiler`, `@angular/core` | 19.2.18 |
| Stored XSS via SVG animation/URL/MathML attributes | `@angular/compiler` | 19.2.17 |
| i18n XSS | `@angular/core` | 19.2.19 |

> **Note**: six remaining high-severity advisories are in the dev build toolchain only (`@angular-devkit/build-angular`, `tar`, `serialize-javascript`, etc.). Their fix requires Angular CLI 21.x, which is incompatible with the 19.x runtime. They do not affect the production bundle.
