# Shopify Instafeed App Documentation

Welcome to the documentation for the **Shopify Instafeed App** - a Shopify app that integrates Instagram feeds into merchants' online stores.

## 📚 Documentation Index

| Document | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | System design, folder structure, and tech stack |
| [Getting Started](./GETTING_STARTED.md) | Prerequisites, installation, and first run |
| [Development](./DEVELOPMENT.md) | Local development workflow and commands |
| [Database](./DATABASE.md) | Prisma schema, models, and migrations |
| [API Reference](./API_REFERENCE.md) | Route handlers and endpoints |
| [Webhooks](./WEBHOOKS.md) | Webhook subscriptions and handlers |
| [Theme Extension](./THEME_EXTENSION.md) | Theme block and storefront integration |
| [Deployment](./DEPLOYMENT.md) | Docker, production, and hosting |
| [Environment Variables](./ENVIRONMENT.md) | Configuration reference |
| [Troubleshooting](./TROUBLESHOOTING.md) | Common issues and solutions |
| [Contributing](./CONTRIBUTING.md) | Contribution guidelines |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run locally with Shopify CLI
npm run dev

# Deploy to Shopify
npm run deploy
```

## ✨ Key Features

- **Instagram Integration**: Connect Instagram Business/Creator accounts via OAuth
- **Feed Display**: Display Instagram posts on storefront using theme blocks
- **Product Tagging**: Link Shopify products to Instagram posts
- **Subscription Billing**: $2/month plan with 1-day trial
- **GDPR Compliant**: Full data request, deletion, and shop redact support

## 🛠 Tech Stack

- **Framework**: [Remix](https://remix.run) v2.7+
- **UI**: [Shopify Polaris](https://polaris.shopify.com/) v12
- **Database**: [Prisma](https://prisma.io) with SQLite (dev) / PostgreSQL (prod)
- **Build**: [Vite](https://vitejs.dev) v5
- **Deployment**: Docker with multi-stage build

## 📁 Project Structure

```
├── app/                  # Remix application
│   ├── routes/           # Route handlers (27 routes)
│   ├── components/       # React components
│   ├── db.server.js      # Database helpers
│   └── shopify.server.js # Shopify app configuration
├── extensions/           # Shopify extensions
│   └── theme-extension/  # Theme app extension
├── prisma/               # Database schema & migrations
├── docs/                 # This documentation
└── Dockerfile            # Production container
```

## 📞 Support

For issues or questions, refer to the [Troubleshooting](./TROUBLESHOOTING.md) guide or contact the development team.
