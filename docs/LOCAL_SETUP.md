# Local Setup Guide — Gold Monitor

This guide walks you through running Gold Monitor locally for development.

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Java | 17+ | [adoptium.net](https://adoptium.net) |
| Maven | 3.8+ | [maven.apache.org](https://maven.apache.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) — for the Angular frontend |
| npm | 9+ | Included with Node.js |
| PostgreSQL | 14+ | [postgresql.org](https://www.postgresql.org) |
| Ollama | Latest | Optional — for AI briefs; see [OLLAMA_SETUP.md](OLLAMA_SETUP.md) |

---

## Step-by-Step Setup

### 1. Clone the repository

```bash
git clone https://github.com/Yazan-Abuawwad/gold-monitor.git
cd gold-monitor
```

### 2. Create the PostgreSQL database

```sql
CREATE DATABASE gold_monitor;
```

### 3. Configure the backend

Open `backend/src/main/resources/application.properties` and adjust if needed:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/gold_monitor
spring.datasource.username=postgres
spring.datasource.password=root

# Ollama (optional — enables AI briefs)
ollama.host=http://localhost:11434
ollama.model=llama3.2

# CORS — add any extra origins here
allowed.origins=http://localhost:4200
```

All values support environment-variable overrides:

| Env var | Default |
|---------|---------|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/gold_monitor` |
| `DB_USERNAME` | `postgres` |
| `DB_PASSWORD` | `root` |
| `OLLAMA_HOST` | `http://localhost:11434` |
| `OLLAMA_MODEL` | `llama3.2` |
| `ALLOWED_ORIGINS` | `http://localhost:4200,...` |
| `PORT` | `3001` |

### 4. Install frontend dependencies

```bash
cd frontend && npm install && cd ..
```

### 5. Start the backend API

```bash
npm run dev:backend
# or: cd backend && mvn spring-boot:run
```

On first start Spring Boot runs `schema.sql` then `data.sql`, creating all tables and seeding the RSS sources.

Expected output:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
...
Started GoldMonitorApplication in X.XXXs
```

The API is now available at **http://localhost:3001**

### 6. Start the frontend (new terminal)

```bash
npm run dev:frontend
# or: cd frontend && npm run dev
```

Open: **http://localhost:4200**

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/feeds` | News headlines (params: `category`, `source`, `limit`) |
| `GET` | `/api/map-events` | Geo events (params: `type`, `severity`, `since`) |
| `POST` | `/api/ai-brief` | Generate AI brief (body: `{ briefType, headlines }`) |

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

### PostgreSQL connection refused
Ensure PostgreSQL is running and the credentials in `application.properties` (or environment variables) are correct.

### RSS feeds not loading
RSS feeds are fetched on start-up and then every 15 minutes via a scheduled task. If the initial fetch fails (network issues), wait and check your internet connection. The API responds with an empty list in the meantime.

### Map not rendering
The map uses CartoDB tiles (CDN). Ensure you have internet connectivity. Leaflet is included as an npm package in the Angular frontend.

### Ollama not available
The AI Brief panel will show a graceful error. To enable:
1. Install Ollama — see [OLLAMA_SETUP.md](OLLAMA_SETUP.md)
2. Set `OLLAMA_HOST` and `OLLAMA_MODEL` in `application.properties` or as env vars
3. Restart the backend
