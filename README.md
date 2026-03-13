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
│  │              DATABASE (PostgreSQL via JDBC)                 │ │
│  │  sources | feed_items | map_events | ai_briefs              │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────┘
                                        │
                             ┌──────────▼──────────┐
                             │  Ollama LLM         │
                             │  (VPS or localhost)  │
                             │  llama3.2 (default) │
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
# Edit .env — set DB_USERNAME, DB_PASSWORD, DATABASE_URL (PostgreSQL), and OLLAMA_HOST
```

### 3. Start the backend
```bash
cd backend
mvn spring-boot:run
# API running at http://localhost:3001
# PostgreSQL DB must be running and accessible via DATABASE_URL
# Map events seeded automatically on first start
# RSS feeds fetched on startup (then every 15 minutes)
# Rate limiting: 60 req/min for feeds/map, 10 req/min for AI brief (per IP)
```

### 4. Start the frontend
```bash
cd frontend
npm install
npm start
# Dashboard at http://localhost:4200
```

---

## 📁 Repository Structure

```
gold-monitor/
├── README.md
├── .env.example
├── package.json              # Root convenience scripts (dev:backend, dev:frontend, build)
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
│           ├── schema.sql      # PostgreSQL table definitions
│           └── data.sql        # RSS source seeds
├── frontend/                 # Angular 19 + PrimeNG 19
│   ├── angular.json
│   ├── package.json
│   ├── proxy.conf.json        # Dev-server proxy → backend :3001
│   └── src/app/
│       ├── app.component.*    # Root layout
│       ├── components/        # header, news-panel, map-panel, ai-brief-panel
│       ├── services/          # FeedService, MapEventsService, AiBriefService
│       ├── models/            # TypeScript interfaces
│       └── environments/      # Angular environment configs
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
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://localhost:5432/gold_monitor}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:root}
allowed.origins=${ALLOWED_ORIGINS:http://localhost:4200,http://localhost:5173,http://localhost:3000}
ollama.host=${OLLAMA_HOST:http://localhost:11434}
ollama.model=${OLLAMA_MODEL:llama3.2}
```

---

## 🤖 LLM / Ollama

The AI Brief panel uses [Ollama](https://ollama.ai). The default model is `llama3.2` (auto-detected at startup; falls back to the first installed model if not found).

- **Local**: `ollama pull llama3.2 && ollama serve`
- **VPS**: See [docs/OLLAMA_SETUP.md](docs/OLLAMA_SETUP.md)
- **Fallback**: If Ollama is unavailable, the panel shows a graceful error message

Set `OLLAMA_HOST=http://YOUR_VPS_IP:11434` in `.env` and pass it as an environment variable to Spring Boot.

---

## 🗄️ Database

PostgreSQL via Spring JDBC.

Tables: `sources`, `feed_items`, `map_events`, `ai_briefs`

Schema is auto-applied on startup via `src/main/resources/schema.sql`.
RSS feed sources are seeded via `src/main/resources/data.sql`.

---

## 📚 Documentation

- [Local Setup Guide](docs/LOCAL_SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Ollama / LLM Setup](docs/OLLAMA_SETUP.md)

---

## 🆕 What's New (March 2026)

### 🗺️ Global Situation Map
- **Gold Mining Layer** — 20 major world gold mines plotted as glowing ◆ markers (Barrick, Newmont, Polyus, AngloGold Ashanti, Gold Fields, and more). Click any marker for mine name, country, operator, and annual output. Toggle the layer on/off via the **◆ MINES** button.
- **5 Map Tile Styles** — Switch between `DARK` (CartoDB), `LIGHT` (CartoDB Positron), `OSM` (OpenStreetMap), `SAT` (Esri Satellite), and `TOPO` (OpenTopoMap) directly from the panel header.
- **XAU/USD Gold Price Chart** — Inline SVG sparkline chart beside the map showing the SPOT gold price with gradient fill, current-price dot, and HIGH / LOW / OPEN stats.
- **5 Chart Ranges** — `7D · 30D · 90D · 1Y · 5Y` selector that instantly re-renders the chart and updates all stats and date labels.
- **10 XAU Currency Pairs** — Scrollable ticker list showing gold priced in USD, EUR, GBP, JPY, CNY, INR, AUD, CHF, CAD, and TRY. Each row shows the price, 30D % change, and a mini sparkline. Click any row to switch the main chart to that currency.

### 🤖 AI Intelligence Brief
- **Gold Brief type added** as the default selection (`GOLD · WORLD · SECURITY`).
- Dedicated **gold-focused LLM prompt** covering: gold price & safe-haven sentiment, geopolitical risks to mining regions, and supply/production outlook.

### 📰 Intel Feed
- News channels now display a **maximum of 4 items per source** to prevent overflow and keep the panel compact.

### 🖥️ Layout
- Dashboard is now fully **no-scroll**: all panels fit exactly in the viewport (`height: 100vh; overflow: hidden`) regardless of content height.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19.2.19 + PrimeNG 19.1.4 + TypeScript |
| Map | Leaflet.js (CartoDB, OSM, Esri Satellite, OpenTopoMap tiles) |
| Gold Chart | Pure SVG sparkline — no extra library |
| Backend | Spring Boot 3.2 + Java 17 + Maven |
| Database | PostgreSQL (Spring JDBC) |
| RSS Parsing | Rome 2.1.0 |
| LLM | Ollama (default model: `llama3.2`, configurable via `OLLAMA_MODEL`) |
| Rate Limiting | Bucket4j per-IP (60 req/min feeds/map, 10 req/min AI brief) |
| News | RSS feeds (BBC, Al Jazeera, The Guardian, NPR, ABC News Intl, Defense News, Kitco, MarketWatch, Mining.com, and more) |

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
