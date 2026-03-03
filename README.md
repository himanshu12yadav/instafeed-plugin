# Instafeed – Shopify Instagram Feed App

A Shopify embedded app that lets merchants connect their Instagram account, display their Instagram posts inside the Shopify admin, and tag Shopify products to individual posts for shoppable Instagram feeds.

Built with [Remix](https://remix.run), [Shopify App Remix](https://shopify.dev/docs/api/shopify-app-remix), [Prisma](https://www.prisma.io/), and deployable via Docker.

---

## Features

- **Instagram OAuth** – Connect one or more Instagram accounts (Personal / Business) via Meta's OAuth flow.
- **Post Management** – Browse, search, and filter synced Instagram posts (images, videos, carousels).
- **Product Tagging** – Tag Shopify products to individual Instagram posts and display shoppable feeds.
- **App Proxy** – Serve the Instagram feed on the storefront via a Shopify App Proxy (`/apps/instafeed`).
- **Subscription / Billing** – Shopify App Subscriptions with plan management.
- **Webhooks** – Handles `app/uninstalled`, `app/scopes_update`, `app_subscriptions/update`, and mandatory GDPR compliance webhooks.
- **GDPR Compliance** – Full data request, customer redact, and shop redact webhook handling.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Remix](https://remix.run) (Vite) |
| Shopify Integration | [@shopify/shopify-app-remix](https://www.npmjs.com/package/@shopify/shopify-app-remix) |
| UI | [@shopify/polaris](https://polaris.shopify.com/) + [App Bridge](https://shopify.dev/docs/apps/tools/app-bridge) |
| Database | SQLite (dev) via [Prisma ORM](https://www.prisma.io/) |
| Containerisation | Docker + Docker Compose |
| Instagram API | Meta Graph API (OAuth 2.0) |
| Language | JavaScript / JSX (TypeScript types via `env.d.ts`) |

---

## Project Structure

```
shopify-instafeed-app/
├── app/
│   ├── routes/
│   │   ├── app._index.jsx          # Main dashboard (post grid + product tagging)
│   │   ├── app.accounts.jsx        # Manage connected Instagram accounts
│   │   ├── app.plan.jsx            # Subscription / billing page
│   │   ├── app.instructions.jsx    # Setup instructions
│   │   ├── app.privacy-policy.jsx  # In-app privacy policy
│   │   ├── app.terms-of-service.jsx
│   │   ├── auth.instagram.callback.jsx   # Instagram OAuth callback
│   │   ├── proxy.handler.jsx             # App Proxy route for storefront
│   │   ├── api.products.js               # Internal API: Shopify product search
│   │   ├── webhooks.*.jsx                # Webhook handlers
│   │   └── data-deletion.jsx             # GDPR data deletion
│   ├── db.server.js        # Prisma database helpers
│   ├── shopify.server.js   # Shopify app initialisation
│   ├── components/         # Shared UI components
│   ├── hooks/              # Custom React hooks
│   └── styles/             # CSS stylesheets
├── prisma/
│   └── schema.prisma       # DB schema (Session, InstagramAccount, InstagramPost, Subscription)
├── extensions/             # Shopify app extensions
├── Dockerfile
├── docker-compose.yml
├── shopify.app.toml        # Shopify CLI app configuration
└── vite.config.js
```

---

## Database Schema

Managed by Prisma. The app uses SQLite by default.

| Model | Purpose |
|---|---|
| `Session` | Shopify session storage |
| `InstagramAccount` | Connected Instagram accounts per shop |
| `InstagramPost` | Synced Instagram posts (image/video/carousel) |
| `InstagramPostProduct` | Many-to-many: posts ↔ Shopify products |
| `Subscription` | Shopify billing subscription per shop |

---

## Prerequisites

- **Node.js** `^18.20 || ^20.10 || >=21.0.0`
- **Shopify Partner Account** – [Create one](https://partners.shopify.com/signup)
- **Shopify Development Store** – For testing
- **Meta Developer App** – For Instagram OAuth credentials (`INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET`)
- **Docker** (optional, for containerised deployment)

---

## Local Development

### 1. Install dependencies

```shell
npm install
```

### 2. Set up environment variables

Copy `.env` and fill in your values:

```env
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SCOPES=write_products
HOST=
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=
DATABASE_URL=file:./dev.sqlite
```

### 3. Set up the database

```shell
npm run setup
# runs: prisma generate && prisma migrate deploy
```

### 4. Start the dev server

```shell
npm run dev
# runs: shopify app dev
```

Press **P** to open the app URL. Install the app in your dev store to begin development.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start local dev server via Shopify CLI |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run setup` | Generate Prisma client + run migrations |
| `npm run deploy` | Deploy app config to Shopify |
| `npm run lint` | Run ESLint |

---

## Docker Deployment

The app is fully containerised. The Docker setup uses a multi-stage build (builder on `node:20.10-slim`, runtime on `node:20.10-alpine3.18`).

### Build & run with Docker Compose

```shell
docker compose up --build -d
```

The app will be available at `http://127.0.0.1:7002`.

### Environment

Pass environment variables via the `.env` file (referenced in `docker-compose.yml`).

The container entrypoint runs:
```
npm run setup && npm run start
```
which runs Prisma migrations before starting the server.

---

## Webhooks

Configured in `shopify.app.toml`:

| Topic | Handler |
|---|---|
| `app/uninstalled` | `/webhooks/app/uninstalled` |
| `app/scopes_update` | `/webhooks/app/scopes_update` |
| `app_subscriptions/update` | `/webhooks/app_subscriptions/update` |
| `customers/data_request` | `/webhooks` (GDPR) |
| `customers/redact` | `/webhooks` (GDPR) |
| `shop/redact` | `/webhooks` (GDPR) |

---

## App Proxy

The storefront feed is served through a Shopify App Proxy:

- **Prefix / Subpath**: `apps/instafeed`
- **Backend URL**: `https://instagramfeed-app.sprinix.com/proxy/handler`

Storefronts can embed the feed by requesting `/apps/instafeed`.

---

## Resources

- [Shopify App Remix Docs](https://shopify.dev/docs/api/shopify-app-remix)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [Polaris Design System](https://polaris.shopify.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Meta Graph API – Instagram](https://developers.facebook.com/docs/instagram-api)
- [Remix Docs](https://remix.run/docs/en/main)
