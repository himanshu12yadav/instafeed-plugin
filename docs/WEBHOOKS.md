# Webhooks

This document covers webhook subscriptions and handlers for the Shopify Instafeed App.

## Overview

Webhooks are configured in `shopify.app.toml` and automatically registered when you deploy.

## Configured Webhooks

```toml
[webhooks]
api_version = "2025-01"

[[webhooks.subscriptions]]
topics = [ "app/uninstalled" ]
uri = "/webhooks/app/uninstalled"

[[webhooks.subscriptions]]
topics = [ "app/scopes_update" ]
uri = "/webhooks/app/scopes_update"

[[webhooks.subscriptions]]
uri = "/webhooks"
compliance_topics = [ "customers/data_request", "customers/redact", "shop/redact" ]

[[webhooks.subscriptions]]
topics = [ "app_subscriptions/update" ]
uri = "/webhooks/app_subscriptions/update"
```

---

## App Webhooks

### APP_UNINSTALLED

**File**: `app/routes/webhooks.app.uninstalled.jsx`

**Triggered**: When merchant uninstalls the app

**Handler**:
```jsx
export const action = async ({ request }) => {
  const { payload, shop } = await authenticate.webhook(request);
  
  console.log(`App uninstalled from ${shop}`);
  
  // Clean up shop data
  await prisma.instagramAccount.deleteMany({
    where: { shop }
  });
  
  return new Response(null, { status: 200 });
};
```

**Actions**:
- Logs uninstall event
- Deletes Instagram accounts and posts
- Removes subscription records

---

### APP_SCOPES_UPDATE

**File**: `app/routes/webhooks.app.scopes_update.jsx`

**Triggered**: When app access scopes change

**Handler**:
```jsx
export const action = async ({ request }) => {
  const { payload, shop } = await authenticate.webhook(request);
  
  console.log(`Scopes updated for ${shop}`, payload);
  
  return new Response(null, { status: 200 });
};
```

---

### APP_SUBSCRIPTIONS_UPDATE

**File**: `app/routes/webhooks.app_subscriptions.update.jsx`

**Triggered**: When subscription status changes

**Payload**:
```json
{
  "app_subscription": {
    "admin_graphql_api_id": "gid://shopify/AppSubscription/123",
    "status": "ACTIVE"
  }
}
```

**Handler**:
```jsx
export const action = async ({ request }) => {
  const { payload, shop } = await authenticate.webhook(request);
  
  // Update subscription in database
  await prisma.subscription.update({
    where: { shop },
    data: {
      status: payload.app_subscription.status,
      // ... other fields
    }
  });
  
  return new Response(null, { status: 200 });
};
```

---

## GDPR Compliance Webhooks

These webhooks are **mandatory** for Shopify App Store approval.

### CUSTOMERS_DATA_REQUEST

**File**: `app/routes/webhooks.customers.data_request.jsx`

**Triggered**: When customer requests their data

**Payload**:
```json
{
  "shop_id": 123456,
  "shop_domain": "store.myshopify.com",
  "customer": {
    "id": 789,
    "email": "customer@example.com",
    "phone": "+1234567890"
  },
  "data_request": {
    "id": 456
  }
}
```

**Handler**:
```jsx
export const action = async ({ request }) => {
  const { payload } = await authenticate.webhook(request);
  
  // This app doesn't store customer data
  // Log request for compliance records
  console.log('Customer data request:', payload.customer.email);
  
  return new Response(null, { status: 200 });
};
```

> **Note**: This app stores Instagram account data, not customer data. The webhook acknowledges the request.

---

### CUSTOMERS_REDACT

**File**: `app/routes/webhooks.customers.redact.jsx`

**Triggered**: When customer requests data deletion

**Payload**:
```json
{
  "shop_id": 123456,
  "shop_domain": "store.myshopify.com",
  "customer": {
    "id": 789,
    "email": "customer@example.com"
  },
  "orders_to_redact": [123, 456]
}
```

**Handler**:
```jsx
export const action = async ({ request }) => {
  const { payload } = await authenticate.webhook(request);
  
  console.log('Customer redact request:', payload.customer.email);
  
  // No customer data to delete in this app
  
  return new Response(null, { status: 200 });
};
```

---

### SHOP_REDACT

**File**: `app/routes/webhooks.shop.redact.jsx`

**Triggered**: 48 hours after app uninstall, requests complete data deletion

**Payload**:
```json
{
  "shop_id": 123456,
  "shop_domain": "store.myshopify.com"
}
```

**Handler**:
```jsx
export const action = async ({ request }) => {
  const { payload, shop } = await authenticate.webhook(request);
  
  // Delete ALL shop data
  await prisma.instagramPostProduct.deleteMany({
    where: { post: { shop } }
  });
  
  await prisma.instagramPost.deleteMany({
    where: { shop }
  });
  
  await prisma.instagramAccount.deleteMany({
    where: { shop }
  });
  
  await prisma.subscription.deleteMany({
    where: { shop }
  });
  
  return new Response(null, { status: 200 });
};
```

---

## Testing Webhooks

### Using Shopify CLI

```bash
# Trigger app uninstalled webhook
shopify app webhook trigger --topic APP_UNINSTALLED

# Trigger with custom shop
shopify app webhook trigger --topic APP_UNINSTALLED --address /webhooks/app/uninstalled
```

### Manual Testing

1. **APP_UNINSTALLED**: Uninstall app from development store
2. **APP_SUBSCRIPTIONS_UPDATE**: Subscribe/cancel subscription
3. **GDPR webhooks**: Use Shopify's webhook simulator in Partner Dashboard

---

## Webhook Security

### HMAC Validation

The `authenticate.webhook()` function automatically validates:
- Request signature (HMAC-SHA256)
- Timestamp freshness
- Content integrity

### Failure Handling

If validation fails:
```jsx
// Throws 401 Unauthorized automatically
const { payload } = await authenticate.webhook(request);
```

---

## Adding New Webhooks

1. **Add to `shopify.app.toml`**:
```toml
[[webhooks.subscriptions]]
topics = [ "orders/create" ]
uri = "/webhooks/orders/create"
```

2. **Create handler file**:
```jsx
// app/routes/webhooks.orders.create.jsx
import { authenticate } from '../shopify.server.js';

export const action = async ({ request }) => {
  const { payload, shop } = await authenticate.webhook(request);
  
  // Handle webhook
  
  return new Response(null, { status: 200 });
};
```

3. **Deploy to register**:
```bash
npm run deploy
```

---

## Debugging Webhooks

### Check Webhook Logs

View in Shopify Partner Dashboard:
1. Go to **Apps** > Your App
2. Click **Webhooks**
3. View delivery history

### Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check API secret is correct |
| Webhook not receiving | Verify tunnel is running |
| Timeout errors | Return 200 quickly, process async |
