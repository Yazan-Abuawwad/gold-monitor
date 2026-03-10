# Ollama / LLM Setup Guide — Gold Monitor

This guide explains how to set up Ollama with the `qwen2:1.5b` model for Gold Monitor's AI Brief feature.

---

## Option A: Local Ollama (Development)

Best for development and testing on your own machine.

### Install Ollama

**macOS / Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download the installer from [ollama.ai/download](https://ollama.ai/download)

### Pull the model
```bash
ollama pull qwen2:1.5b
```

This downloads ~1GB. Takes a few minutes.

### Start Ollama server
```bash
ollama serve
# Ollama running at http://localhost:11434
```

### Configure Gold Monitor
In your `.env`:
```env
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen2:1.5b
```

### Test
```bash
curl http://localhost:11434/api/generate \
  -d '{"model":"qwen2:1.5b","prompt":"Say hello","stream":false}'
```

---

## Option B: VPS Deployment (Production)

Run Ollama on a VPS (Ubuntu 22.04 recommended, min 4GB RAM).

### Install Ollama on VPS
```bash
ssh user@YOUR_VPS_IP

# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the model
ollama pull qwen2:1.5b
```

### Configure as a systemd service (auto-start)

Create the service file:
```bash
sudo tee /etc/systemd/system/ollama.service > /dev/null << 'EOF'
[Unit]
Description=Ollama LLM Server
After=network.target

[Service]
Type=simple
User=ollama
Group=ollama
ExecStart=/usr/local/bin/ollama serve
Restart=on-failure
RestartSec=5
Environment=OLLAMA_HOST=0.0.0.0:11434

[Install]
WantedBy=multi-user.target
EOF
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl start ollama
sudo systemctl status ollama
```

### Open firewall port
```bash
# UFW (Ubuntu default)
sudo ufw allow 11434/tcp

# OR iptables
sudo iptables -A INPUT -p tcp --dport 11434 -j ACCEPT
```

> ⚠️ **Security warning**: Exposing Ollama publicly has no authentication. Consider using a reverse proxy with authentication (Nginx + basic auth) for production.

### Configure Gold Monitor
In your backend `.env` (or Railway/Fly.io environment variables):
```env
OLLAMA_HOST=http://YOUR_VPS_IP:11434
OLLAMA_MODEL=qwen2:1.5b
```

### Test from your local machine
```bash
curl http://YOUR_VPS_IP:11434/api/tags
```

Expected output: list of installed models including `qwen2:1.5b`.

---

## Option C: Qwen via Alibaba Cloud API

If you prefer a managed API instead of self-hosting:

1. Sign up at [dashscope.aliyun.com](https://dashscope.aliyun.com)
2. Get your API key
3. The Alibaba DashScope API is compatible with OpenAI format

Modify `backend/src/services/ollamaService.ts` to use the DashScope endpoint:

```typescript
// Replace the Ollama call with:
const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'qwen-turbo',
    messages: [{ role: 'user', content: prompt }],
  }),
});
```

Add to `.env`:
```env
QWEN_API_KEY=your_dashscope_api_key
QWEN_API_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

---

## Supported Models

| Model | Size | RAM Required | Notes |
|-------|------|-------------|-------|
| `qwen2:1.5b` | ~1GB | 2GB | Default — fast, lightweight |
| `qwen2:7b` | ~4.7GB | 8GB | Better quality |
| `llama3.2:3b` | ~2GB | 4GB | Alternative |
| `llama3.2:1b` | ~1.3GB | 2GB | Smallest Llama |

To use a different model, set `OLLAMA_MODEL=model-name` in `.env`.

---

## Troubleshooting

### "LLM service unavailable" in dashboard
- Check `OLLAMA_HOST` is set correctly in `.env`
- Ensure Ollama is running: `systemctl status ollama`
- Check firewall rules allow port 11434
- Test: `curl $OLLAMA_HOST/api/tags`

### Model not found
```bash
ollama pull qwen2:1.5b
```

### Out of memory
Use a smaller model (`qwen2:1.5b`) or increase VPS RAM.

### Slow responses
`qwen2:1.5b` typically generates in 10-30 seconds on a 2-CPU VPS. Responses are cached for 2 hours.
