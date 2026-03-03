# Environment Variables

This document lists all environment variables used by the Shopify Instafeed App.

## Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SHOPIFY_API_KEY` | App API key from Partner Dashboard | `9d193f98bac5c4f538958ba291fee5cd` |
| `SHOPIFY_API_SECRET` | App secret key | `9060f7d210f9bf84...` |
| `SHOPIFY_APP_URL` | Public URL of the app | `https://instagramfeed-app.sprinix.com` |
| `SCOPES` | OAuth scopes (comma-separated) | `write_products` |

## Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `APP_PORT` | Server port | `3000` |
| `SHOPIFY_APP_HANDLE` | App handle for CLI | From `shopify.app.toml` |
| `BYPASS_SUBSCRIPTION` | Skip subscription check | `false` |
| `DATABASE_URL` | PostgreSQL connection string | SQLite file |
| `SHOP_CUSTOM_DOMAIN` | Custom shop domain | None |

## Development Variables

During development, Shopify CLI sets these automatically:

| Variable | Description |
|----------|-------------|
| `HOST` | Tunnel URL (deprecated) |
| `SHOPIFY_APP_URL` | Current tunnel URL |
| `PORT` | Dev server port |
| `FRONTEND_PORT` | HMR port |

## Instagram API (Optional)

If implementing server-side Instagram API calls:

| Variable | Description |
|----------|-------------|
| `INSTAGRAM_CLIENT_ID` | Meta App ID |
| `INSTAGRAM_CLIENT_SECRET` | Meta App Secret |

---

## Example `.env` File

### Development

```env
# Shopify App (auto-populated by CLI)
SHOPIFY_APP_HANDLE="instafeed-dev"
SHOPIFY_API_KEY=your_dev_api_key
SHOPIFY_API_SECRET=your_dev_secret
SHOPIFY_APP_URL=https://random-tunnel.trycloudflare.com

# App Config
SCOPES=write_products
APP_PORT=3000
BYPASS_SUBSCRIPTION=true

# Development
NODE_ENV=development
```

### Production

```env
# Shopify App
SHOPIFY_APP_HANDLE="instafeed-sprinix"
SHOPIFY_API_KEY=your_prod_api_key
SHOPIFY_API_SECRET=your_prod_secret
SHOPIFY_APP_URL=https://instagramfeed-app.sprinix.com

# App Config
SCOPES=write_products
APP_PORT=3000
BYPASS_SUBSCRIPTION=false

# Production
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/instafeed
```

---

## Security Notes

> [!CAUTION]
> **Never commit `.env` to version control.**

1. Add `.env` to `.gitignore`
2. Use environment-specific files (`.env.production`, `.env.development`)
3. Store production secrets in secure vault or hosting platform secrets

---

## Where Variables Are Used

| File | Variables Used |
|------|----------------|
| `app/shopify.server.js` | `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_APP_URL`, `SCOPES`, `SHOP_CUSTOM_DOMAIN` |
| `vite.config.js` | `SHOPIFY_APP_URL`, `PORT`, `FRONTEND_PORT` |
| `app/routes/app._index.jsx` | `BYPASS_SUBSCRIPTION` |
| `prisma/schema.prisma` | `DATABASE_URL` (if PostgreSQL) |
