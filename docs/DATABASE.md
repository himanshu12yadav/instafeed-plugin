# Database Guide

This document covers the database schema, models, and operations for the Shopify Instafeed App.

## Overview

The app uses [Prisma](https://prisma.io) as the ORM with SQLite for development and supports PostgreSQL for production.

## Database Models

### 1. Session

Manages Shopify authentication sessions (handled by `@shopify/shopify-app-session-storage-prisma`).

```prisma
model Session {
  id            String    @id
  shop          String
  state         String
  isOnline      Boolean   @default(false)
  scope         String?
  expires       DateTime?
  accessToken   String
  userId        BigInt?
  firstName     String?
  lastName      String?
  email         String?
  accountOwner  Boolean   @default(false)
  locale        String?
  collaborator  Boolean?  @default(false)
  emailVerified Boolean?  @default(false)
}
```

### 2. InstagramAccount

Stores connected Instagram accounts per shop.

```prisma
model InstagramAccount {
  id                    String          @id @default(uuid())
  instagramId           String?         @unique
  instagramUsername     String?         @unique
  instagramToken        String?
  instagramTokenExpires DateTime?
  accountType           String?         # "BUSINESS" or "CREATOR"
  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt
  posts                 InstagramPost[]
  shop                  String
}
```

### 3. InstagramPost

Stores Instagram media fetched from the API.

```prisma
model InstagramPost {
  id              String                 @id @default(uuid())
  mediaType       String                 # IMAGE, VIDEO, CAROUSEL_ALBUM
  mediaUrl        String
  thumbnailUrl    String?
  permalink       String
  timestamp       DateTime
  username        String
  caption         String?
  accountId       String
  account         InstagramAccount       @relation(...)
  selected        Boolean                @default(false)
  createdAt       DateTime               @default(now())
  updatedAt       DateTime               @updatedAt
  products        InstagramPostProduct[]
  shop            String                 @default("")
  
  @@index([accountId])
  @@index([selected])
}
```

### 4. InstagramPostProduct

Links Shopify products to Instagram posts (many-to-many).

```prisma
model InstagramPostProduct {
  id            String   @id @default(uuid())
  postId        String
  productId     String   # Shopify product ID
  productTitle  String?
  productHandle String?
  productImage  String?
  productPrice  String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  post InstagramPost @relation(...)
  
  @@unique([postId, productId])
  @@index([postId])
}
```

### 5. Subscription

Tracks merchant subscription status.

```prisma
model Subscription {
  id                    String    @id @default(cuid())
  shop                  String    @unique
  planId                String
  status                String    # ACTIVE, CANCELLED, EXPIRED
  shopifySubscriptionId String    @unique
  trialEndsAt           DateTime?
  endsAt                DateTime?
  renewsAt              DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}
```

## Database Helper Functions

Located in `app/db.server.js`:

### Instagram Account Functions

| Function | Description |
|----------|-------------|
| `createOrUpdate(data)` | Create or update Instagram account |
| `getAllInstagramAccounts(shop)` | Get all accounts for a shop |
| `findUserByInstagramId(id)` | Find account by Instagram ID |
| `findUserByInstagramUsername(username)` | Find account by username |
| `deleteInstagramAccount(accountId)` | Delete account and all related data |
| `getAccountDeletionDetails(accountId)` | Get counts before deletion |

### Instagram Post Functions

| Function | Description |
|----------|-------------|
| `getPosts()` | Get all posts |
| `storeInstagramPosts(posts, accountId, shop)` | Store fetched posts |
| `getAllInstagramPostbyAccountId(accountId)` | Get posts for account |
| `getAllInstagramPostbyCondition(condition)` | Get posts by condition |
| `findPostById(postId)` | Find single post |
| `updatePostData(postId, field, value)` | Update post field |
| `deleteAllPostByAccountId(accountId)` | Delete all posts for account |
| `getFilteredInstagramPosts(search, filter, username)` | Search/filter posts |

### Product Linking Functions

| Function | Description |
|----------|-------------|
| `addProductToPost(postId, productData)` | Link product to post |
| `removeProductFromPost(postId, productId)` | Unlink product |
| `getProductsForPost(postId)` | Get products for post |
| `getPostsWithProducts(accountId)` | Get posts with products |
| `getProductCountsForPosts(accountId)` | Get product counts |

## Migrations

### Migration History

```
prisma/migrations/
├── 20250207072921_init/
├── 20250718132645_add_instagram_post_products/
├── 20251003130144_add_subscription_model/
└── 20251024061747_removed_unique_constraint_from_shop/
```

### Creating a New Migration

```bash
# Create migration with descriptive name
npx prisma migrate dev --name add_new_field

# Apply migrations in production
npx prisma migrate deploy
```

### Resetting Database (Development Only)

```bash
npx prisma migrate reset
```

> **Warning**: This deletes all data!

## Production Database

### Switching to PostgreSQL

1. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set environment variable:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

3. Push schema:

```bash
npx prisma db push
```

### Recommended Providers

| Provider | Free Tier |
|----------|-----------|
| [Supabase](https://supabase.com) | 500MB |
| [Neon](https://neon.tech) | 512MB |
| [PlanetScale](https://planetscale.com) | 5GB (MySQL) |
| [Railway](https://railway.app) | $5 credit |

## Prisma Studio

View and edit database in browser:

```bash
npx prisma studio
```

Opens at `http://localhost:5555`
