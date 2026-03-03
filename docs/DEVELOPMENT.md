# Development Guide

This guide covers the local development workflow for the Shopify Instafeed App.

## Development Server

### Starting Development

```bash
npm run dev
```

This command uses Shopify CLI to:
1. Create a Cloudflare tunnel for HTTPS
2. Start Vite dev server with HMR (Hot Module Replacement)
3. Sync app configuration with Shopify
4. Register webhooks

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Shopify CLI |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Lint codebase |
| `npm run prisma` | Run Prisma CLI |
| `npm run deploy` | Deploy app to Shopify |
| `npm run config:link` | Link app to Partner account |
| `npm run config:use` | Switch between app configs |

## Code Structure

### Routes (`app/routes/`)

Remix uses file-based routing:

```
routes/
├── app._index.jsx        # Main dashboard (/app)
├── app.jsx               # App layout wrapper
├── app.accounts.jsx      # Instagram accounts (/app/accounts)
├── app.plan.jsx          # Subscription plans (/app/plan)
├── auth.$.jsx            # Auth catch-all
├── auth.instagram.callback.jsx  # Instagram OAuth callback
├── proxy.handler.jsx     # App proxy (/proxy/handler)
└── webhooks.*.jsx        # Webhook handlers
```

### Route Pattern

Each route exports:

```jsx
// Loader - runs on server, fetches data
export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  // Fetch data...
  return json({ data });
}

// Action - handles form submissions
export async function action({ request }) {
  const formData = await request.formData();
  // Process action...
  return json({ success: true });
}

// Component - renders UI
export default function RouteName() {
  const { data } = useLoaderData();
  const fetcher = useFetcher();
  
  return <Page>...</Page>;
}
```

### Database Operations

Use functions from `db.server.js`:

```js
import {
  createOrUpdate,
  getAllInstagramAccounts,
  storeInstagramPosts,
  addProductToPost,
} from '../db.server.js';

// Example: Get accounts for a shop
const accounts = await getAllInstagramAccounts(session.shop);
```

### Authentication

Use the `authenticate` helper from `shopify.server.js`:

```js
import { authenticate } from '../shopify.server.js';

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  
  // Make GraphQL requests
  const response = await admin.graphql(`
    query {
      products(first: 10) {
        nodes { id title }
      }
    }
  `);
}
```

## Hot Module Replacement

HMR is configured in `vite.config.js`:

- **Local development**: WebSocket on port 64999
- **Tunnel development**: WSS on port 443

Changes to components and styles reload instantly without full page refresh.

## Debugging

### Server-Side Debugging

Add `console.log` statements in loaders/actions - output appears in terminal.

### Client-Side Debugging

Use browser DevTools. React DevTools extension recommended.

### Database Debugging

View database contents:

```bash
npx prisma studio
```

Opens a web UI at `http://localhost:5555` to browse/edit data.

### Shopify CLI Debugging

View CLI logs:

```bash
DEBUG=* npm run dev
```

## Testing Webhooks

### Using Shopify CLI

```bash
shopify app webhook trigger --topic APP_UNINSTALLED --address /webhooks/app/uninstalled
```

### Manual Testing

Trigger events in Shopify admin (e.g., uninstall/reinstall app).

## Code Style

- **ESLint**: Run `npm run lint` before committing
- **Prettier**: Configured for auto-formatting
- **Polaris Components**: Use for all UI elements

### Import Order

```js
// 1. External packages
import { json } from '@remix-run/node';
import { Page, Card } from '@shopify/polaris';

// 2. Internal modules
import { authenticate } from '../shopify.server.js';
import { getAllInstagramAccounts } from '../db.server.js';

// 3. Relative imports
import { SkeletonCard } from '../components/SkeletonCard.jsx';
```

## Common Tasks

### Adding a New Route

1. Create file in `app/routes/` following naming convention
2. Export `loader`, `action`, and default component
3. Route automatically available based on filename

### Adding a Database Model

1. Update `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name describe_change`
3. Add helper functions to `db.server.js`

### Adding a Webhook

1. Add subscription in `shopify.app.toml`
2. Create handler in `app/routes/webhooks.{topic}.jsx`
3. Deploy: `npm run deploy`

## Performance Tips

1. **Use `defer`** for non-critical data loading
2. **Lazy load components** with `React.lazy()`
3. **Minimize GraphQL queries** - fetch only needed fields
4. **Cache Instagram data** in database to reduce API calls
