# Deployment Guide

This document covers deploying the Shopify Instafeed App to production.

## Deployment Options

| Platform | Difficulty | Cost | Link |
|----------|------------|------|------|
| Docker (Self-hosted) | Medium | Varies | This guide |
| Fly.io | Easy | Free tier | [Docs](https://fly.io) |
| Railway | Easy | $5/month | [Docs](https://railway.app) |
| Render | Easy | Free tier | [Docs](https://render.com) |
| Vercel | Easy | Free tier | [Docs](https://vercel.com) |

---

## Docker Deployment

### Production Dockerfile

The included `Dockerfile` uses multi-stage build:

```dockerfile
# Build stage
FROM node:20.10-slim AS builder

WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Production stage
FROM node:20.10-alpine3.18
WORKDIR /app
COPY --from=builder /app /app

EXPOSE 3000
CMD ["npm", "run", "docker-start"]
```

### Docker Compose

**`docker-compose.yml`**:
```yaml
version: '3.8'

services:
  app-instafeed:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: shopify-instafeed-app
    ports:
      - "127.0.0.1:7002:3000"
    env_file:
      - .env
    restart: unless-stopped
```

### Building & Running

```bash
# Build the image
docker-compose build

# Start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

---

## Environment Setup

### Production `.env`

```env
NODE_ENV=production
SHOPIFY_APP_HANDLE=instafeed-sprinix
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://instagramfeed-app.sprinix.com
SCOPES=write_products
APP_PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Optional
BYPASS_SUBSCRIPTION=false
```

---

## Reverse Proxy (Nginx)

Example configuration with SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name instagramfeed-app.sprinix.com;

    ssl_certificate /etc/ssl/certs/your_cert.pem;
    ssl_certificate_key /etc/ssl/private/your_key.pem;

    location / {
        proxy_pass http://127.0.0.1:7002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name instagramfeed-app.sprinix.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Shopify App Deployment

### Deploy App Configuration

```bash
npm run deploy
```

This syncs with Shopify:
- App configuration
- Webhook subscriptions
- Extension files
- Scopes and URLs

### Update App URL

In `shopify.app.toml`:
```toml
application_url = "https://your-production-url.com"
```

Then deploy again:
```bash
npm run deploy
```

---

## Database Migration

### Production PostgreSQL

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set environment variable:
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
```

3. Deploy migrations:
```bash
npx prisma migrate deploy
```

---

## Vercel Deployment

1. Install Vercel preset:
```bash
npm install @vercel/remix
```

2. Update `vite.config.js`:
```js
import { vercelPreset } from '@vercel/remix/vite';

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
    }),
  ],
});
```

3. Deploy:
```bash
vercel deploy --prod
```

---

## Fly.io Deployment

1. Install Fly CLI
2. Initialize:
```bash
fly launch
```

3. Set secrets:
```bash
fly secrets set SHOPIFY_API_KEY=xxx
fly secrets set SHOPIFY_API_SECRET=xxx
```

4. Deploy:
```bash
fly deploy
```

---

## Post-Deployment Checklist

- [ ] SSL certificate configured
- [ ] Environment variables set
- [ ] Database migrated
- [ ] App URL updated in Shopify
- [ ] Webhooks registered (`npm run deploy`)
- [ ] Test app installation
- [ ] Test Instagram OAuth
- [ ] Test theme block
- [ ] Monitor logs for errors

---

## Monitoring

### Docker Logs

```bash
docker-compose logs -f app-instafeed
```

### Health Check

Add to your hosting:
```bash
curl https://your-app.com/app
```

Should redirect to Shopify OAuth if not authenticated.
