# API Reference

This document covers all API routes and endpoints in the Shopify Instafeed App.

## Route Overview

| Route | Type | Description |
|-------|------|-------------|
| `/app` | Admin | Main dashboard layout |
| `/app/_index` | Admin | Dashboard with Instagram feed management |
| `/app/accounts` | Admin | Instagram account management |
| `/app/plan` | Admin | Subscription management |
| `/app/instructions` | Admin | Setup instructions |
| `/app/privacy-policy` | Admin | In-app privacy policy |
| `/app/terms-of-service` | Admin | In-app terms of service |
| `/app/data-deletion` | Admin | Data deletion requests |
| `/auth/*` | Auth | OAuth handlers |
| `/proxy/handler` | Proxy | Storefront data endpoint |
| `/webhooks/*` | Webhook | Event handlers |
| `/api/products` | API | Product search |

---

## Admin Routes

### GET `/app`

**Description**: Main app layout wrapper

**Authentication**: Required (Shopify Admin)

**Response**: Renders app shell with navigation

---

### GET/POST `/app/_index`

**Description**: Main dashboard for Instagram feed management

**Authentication**: Required

**Loader Data**:
```json
{
  "subscriptionStatus": "ACTIVE" | "EXPIRED" | null,
  "shop": "store.myshopify.com",
  "instagramAccounts": [...],
  "filteredPosts": [...],
  "tokenExpiringSoon": false
}
```

**Actions**:

| Action | Method | Description |
|--------|--------|-------------|
| `filterPosts` | POST | Filter posts by type/search |
| `toggleSelection` | POST | Toggle post selection |
| `refreshPosts` | POST | Fetch new posts from Instagram |
| `addProduct` | POST | Link product to post |
| `removeProduct` | POST | Unlink product from post |
| `deleteAccount` | POST | Remove Instagram account |

---

### GET/POST `/app/accounts`

**Description**: Manage connected Instagram accounts

**Loader Data**:
```json
{
  "accounts": [
    {
      "id": "uuid",
      "instagramUsername": "username",
      "accountType": "BUSINESS",
      "posts": [...]
    }
  ]
}
```

---

### GET/POST `/app/plan`

**Description**: Subscription plan management

**Loader Data**:
```json
{
  "subscription": {
    "status": "ACTIVE",
    "planId": "plan_123",
    "renewsAt": "2024-03-15T00:00:00Z"
  }
}
```

**Actions**:
- Subscribe to plan
- Cancel subscription

---

## Authentication Routes

### GET `/auth/login`

**Description**: Initiates Shopify OAuth flow

**Query Parameters**:
- `shop` - Shop domain (required)

---

### GET `/auth/*`

**Description**: Catch-all for OAuth callbacks

---

### GET `/auth/instagram/callback`

**Description**: Handles Instagram OAuth callback

**Query Parameters**:
- `code` - Authorization code from Instagram
- `state` - CSRF protection token

**Process**:
1. Exchange code for access token
2. Fetch Instagram user profile
3. Store account in database
4. Redirect to dashboard

---

## App Proxy

### GET `/proxy/handler`

**Description**: Storefront endpoint for fetching Instagram posts

**URL Pattern**: `https://store.myshopify.com/apps/instafeed`

**Query Parameters**:
- `shop` - Shop domain
- `logged_in_customer_id` (optional)

**Response**:
```json
{
  "success": true,
  "posts": [
    {
      "id": "post_123",
      "mediaType": "IMAGE",
      "mediaUrl": "https://...",
      "permalink": "https://instagram.com/p/...",
      "caption": "...",
      "products": [
        {
          "productId": "gid://shopify/Product/123",
          "productTitle": "Product Name",
          "productHandle": "product-handle",
          "productImage": "https://...",
          "productPrice": "$29.99"
        }
      ]
    }
  ]
}
```

**Headers**:
- `Content-Type: application/json`
- CORS headers for storefront access

---

## API Routes

### GET `/api/products`

**Description**: Search Shopify products

**Query Parameters**:
- `search` - Search term

**Response**:
```json
{
  "products": [
    {
      "id": "gid://shopify/Product/123",
      "title": "Product Name",
      "handle": "product-handle",
      "image": { "url": "https://..." },
      "price": "29.99"
    }
  ]
}
```

---

## Webhook Routes

See [WEBHOOKS.md](./WEBHOOKS.md) for detailed webhook documentation.

| Route | Topic |
|-------|-------|
| `/webhooks/app/uninstalled` | APP_UNINSTALLED |
| `/webhooks/app/scopes_update` | APP_SCOPES_UPDATE |
| `/webhooks/app_subscriptions/update` | APP_SUBSCRIPTIONS_UPDATE |
| `/webhooks/customers/data_request` | CUSTOMERS_DATA_REQUEST |
| `/webhooks/customers/redact` | CUSTOMERS_REDACT |
| `/webhooks/shop/redact` | SHOP_REDACT |

---

## GraphQL Queries

Located in `app/routes/graphql/query.jsx`:

### `getSubscriptionStatus(admin)`

Fetches current subscription status for the shop.

### `searchProducts(admin, query)`

Searches products by title.

### `getSubscriptionDetails(admin, subscriptionId)`

Fetches detailed subscription information.

---

## Error Handling

All routes include error boundaries:

```jsx
export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <Page>
      <Card>
        <Text>Something went wrong: {error.message}</Text>
      </Card>
    </Page>
  );
}
```

## Authentication Patterns

### Admin Routes

```jsx
import { authenticate } from '../shopify.server.js';

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  // admin = GraphQL client
  // session = { shop, accessToken, ... }
}
```

### Webhook Routes

```jsx
import { authenticate } from '../shopify.server.js';

export async function action({ request }) {
  const { payload, shop } = await authenticate.webhook(request);
  // payload = webhook body
  // shop = shop domain
}
```
