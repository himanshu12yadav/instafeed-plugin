# Getting Started

This guide walks you through setting up the Shopify Instafeed App for development.

## Prerequisites

Before you begin, ensure you have:

| Requirement | Version | Link |
|-------------|---------|------|
| Node.js | 18.20+ or 20.10+ | [Download](https://nodejs.org/) |
| npm | 8.x+ | Included with Node.js |
| Shopify Partner Account | - | [Sign Up](https://partners.shopify.com/signup) |
| Development Store | - | [Create Store](https://help.shopify.com/en/partners/dashboard/development-stores) |

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shopify-instafeed-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Shopify CLI

If this is your first time, link the app to your Partner account:

```bash
npm run config:link
```

Follow the prompts to:
- Select your Partner organization
- Create a new app or connect to existing
- Choose your development store

### 4. Set Up Environment Variables

Create or update `.env` file:

```env
SHOPIFY_APP_HANDLE="your-app-handle"
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://your-tunnel-url.trycloudflare.com
SCOPES=write_products
APP_PORT=3000
BYPASS_SUBSCRIPTION=false
```

> **Note**: During development, the Shopify CLI will automatically set `SHOPIFY_APP_URL` to a Cloudflare tunnel.

### 5. Initialize the Database

Generate Prisma client and run migrations:

```bash
npm run setup
```

This runs:
```bash
prisma generate && prisma migrate deploy
```

### 6. Start Development Server

```bash
npm run dev
```

The CLI will:
1. Create a secure tunnel
2. Start the Vite dev server
3. Open the app in your browser

Press **P** when prompted to open the app URL.

## First Run

### Installing the App

1. Navigate to the app URL provided by the CLI
2. Click **Install** on the OAuth consent screen
3. Grant the required permissions (`write_products`)

### Connecting Instagram

1. From the app dashboard, click **Connect Instagram Account**
2. Authorize with Instagram (Business or Creator account required)
3. Posts will be automatically fetched and stored

### Testing the Theme Block

1. Go to **Online Store > Themes** in Shopify admin
2. Click **Customize** on your theme
3. Add an **App block** and select **Instafeed**
4. Select posts and save

## Project Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development with Shopify CLI |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run setup` | Generate Prisma & run migrations |
| `npm run deploy` | Deploy to Shopify |
| `npm run lint` | Run ESLint |

## Next Steps

- [Development Guide](./DEVELOPMENT.md) - Learn the development workflow
- [Database Guide](./DATABASE.md) - Understand the data models
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
