# Shopify Instafeed App — General Documentation

> **Version:** 1.0  
> **Last Updated:** February 27, 2026  
> **Audience:** Non-technical readers, project stakeholders, reviewers

---

## Table of Contents

1. [What This App Does](#1-what-this-app-does)
2. [How It Works (Simple Overview)](#2-how-it-works-simple-overview)
3. [App Screens & What They Do](#3-app-screens--what-they-do)
4. [Complete Folder Structure & File Reference](#4-complete-folder-structure--file-reference)
5. [How Data Is Stored](#5-how-data-is-stored)
6. [Permissions & Access](#6-permissions--access)
7. [Webhooks (Automated Events)](#7-webhooks-automated-events)
8. [App Proxy (Storefront Data Delivery)](#8-app-proxy-storefront-data-delivery)
9. [Billing & Subscriptions](#9-billing--subscriptions)
10. [Deployment & Hosting](#10-deployment--hosting)
11. [Screenshot Checklist](#11-screenshot-checklist)
12. [Glossary](#12-glossary)

---

## 1. What This App Does

The **Instafeed Sprinix** app allows Shopify store owners (merchants) to:

- **Connect their Instagram account** to their Shopify store.
- **Display Instagram posts** directly on the storefront as a beautiful, responsive grid.
- **Tag Shopify products** on Instagram posts so customers can "Shop the Look" — clicking a post shows related products and lets customers buy directly.
- **Manage subscriptions** through Shopify's native billing system.

In simple terms: *Instagram posts become shoppable product showcases on the store.*

---

## 2. How It Works (Simple Overview)

```
┌──────────────────┐     ┌────────────────────┐     ┌───────────────────┐
│   Merchant's     │     │   Instafeed App    │     │   Shopify Store   │
│   Instagram      │────▶│   (Admin Panel)    │────▶│   (Storefront)    │
│   Account        │     │   Manages posts,   │     │   Displays the    │
│                  │     │   tags products     │     │   Instagram feed  │
└──────────────────┘     └────────────────────┘     └───────────────────┘
```

**Step-by-step flow:**

1. Merchant installs the app from the Shopify App Store.
2. Merchant connects their Instagram account via a secure login (OAuth).
3. The app automatically pulls in all Instagram posts (photos and videos).
4. Merchant selects which posts to display on the storefront.
5. Merchant can "tag" Shopify products onto specific Instagram posts.
6. The storefront shows a customizable Instagram feed grid with shoppable posts.
7. Customers click posts to see tagged products and can add them to cart.

---

## 3. App Screens & What They Do

### 3.1 Home / Dashboard (`/app`)

The main screen when you open the app. It shows:

- A grid of all Instagram posts fetched from the connected account.
- Checkboxes to select which posts appear on the storefront.
- Search and filter options (by media type, by caption text).
- Product tagging — click a post to search and link Shopify products to it.
- A "Selected Posts" preview showing what will appear on the storefront.

`[📸 PASTE IMAGE HERE: The main dashboard showing the Instagram post grid with checkboxes and product tagging.]`

### 3.2 Manage Accounts (`/app/accounts`)

Shows all connected Instagram accounts in a table with:

- Instagram username
- Account type (Personal or Business)
- Connection status
- Number of posts synced
- Options to view posts or delete the account

`[📸 PASTE IMAGE HERE: The Accounts page showing connected Instagram accounts in a table.]`

### 3.3 Instructions / How-To (`/app/instructions`)

A step-by-step guide within the app that explains:

- **Step 1:** Connect your Instagram account
- **Step 2:** View your Instagram posts
- **Step 3:** Select posts to display
- **Step 4:** Add the Instagram feed block to your storefront via the Theme Editor

`[📸 PASTE IMAGE HERE: The Instructions page showing the step-by-step guide.]`

### 3.4 Subscription / Plan (`/app/plan`)

Displays the merchant's current subscription status:

- Whether a free plan, trial, or paid subscription is active.
- Trial end date or subscription renewal date.
- Option to cancel the subscription.
- Link to manage the subscription via Shopify's billing portal.

`[📸 PASTE IMAGE HERE: The Plan/Subscription page showing billing status.]`

### 3.5 Privacy Policy (`/privacy-policy`)

A public-facing page that explains:

- What Instagram data the app collects (post images, captions, tokens).
- How long data is stored.
- How merchants can request data deletion.

### 3.6 Terms of Service (`/terms-of-service`)

A public-facing page with the legal terms for using the app.

### 3.7 Data Deletion (`/data-deletion`)

A public-facing page and in-app page (`/app/data-deletion`) where merchants can:

- Request full deletion of their Instagram data from the app.
- Understand GDPR compliance and what data is removed.

### 3.8 Storefront Feed (Theme App Extension)

This is what the **customer sees** on the storefront. It is not a separate URL — it is added as a "block" in the Shopify Theme Editor:

- Displays selected Instagram posts in a responsive grid (2, 3, or 4 columns).
- Shows post captions, usernames, and timestamps.
- Displays "Shop This Post" product cards for tagged products.
- Videos auto-play on hover.
- Fully customizable (heading, subtitle, colors, column count) from the Theme Editor.

`[📸 PASTE IMAGE HERE: The storefront Instagram feed as seen by customers on a live Shopify store.]`

---

## 4. Complete Folder Structure & File Reference

Below is every file and folder in the project with a plain-English explanation of its purpose.

### 4.1 Root Files (Top Level)

```
shopify-instafeed-app/
├── .env                          # Environment settings (secret keys, URLs, ports)
├── .gitignore                    # Tells Git which files to ignore (not upload to code repository)
├── CHANGELOG.md                  # History of changes made to the app over time
├── Dockerfile                    # Instructions for building the app inside a Docker container
├── docker-compose.yml            # Configuration to run the app container with one command
├── env.d.ts                      # Tells the code editor what environment variables exist
├── package.json                  # List of all software libraries the app depends on + run scripts
├── package-lock.json             # Exact version lock of every dependency (auto-generated)
├── remix.config.js               # Legacy configuration for the Remix web framework
├── shopify.app.toml              # Shopify app configuration (name, permissions, webhooks, proxy URL)
├── shopify.web.toml              # Tells Shopify CLI how to run the web server
├── tsconfig.json                 # Settings for TypeScript (the programming language used)
├── vite.config.js                # Configuration for Vite (the build tool that bundles the app)
└── README.md                     # General information and setup instructions for developers
```

| File | Purpose (Non-Technical) |
|---|---|
| `.env` | Stores private settings like API keys, app URLs, and ports. Never shared publicly. |
| `.gitignore` | Prevents sensitive files and temporary files from being uploaded to the code repository. |
| `CHANGELOG.md` | A log of all updates, bug fixes, and new features added to the app. |
| `Dockerfile` | A recipe that tells Docker how to package the app for deployment on a server. |
| `docker-compose.yml` | A simplified way to start the app using Docker with a single command. Maps port 7002 (server) to port 3000 (app). |
| `env.d.ts` | A helper file that tells the code editor what environment settings are available. |
| `package.json` | The "ingredient list" — names all the software libraries the app needs, plus commands to run, build, and deploy. |
| `package-lock.json` | Auto-generated file that locks exact versions of every library to ensure consistency. |
| `remix.config.js` | Settings for the Remix framework (the web framework used to build pages). |
| `shopify.app.toml` | The most important config file for Shopify — defines the app name (`instafeed-sprinix`), permissions (`write_products`), webhook URLs, and app proxy settings. |
| `shopify.web.toml` | Tells Shopify CLI how to start the development server. |
| `tsconfig.json` | Settings for TypeScript, the programming language the app is written in. |
| `vite.config.js` | Settings for Vite, the tool that compiles and bundles the app code for browsers. |
| `README.md` | A general overview document with setup instructions for developers. |

---

### 4.2 `app/` — The Main Application Code

This is where all the app logic lives.

```
app/
├── assets/                       # Static image files used within the app
│   ├── instagram-thumbnail-1.jpg
│   ├── instagram-thumbnail-2.jpg
│   ├── instagram-thumbnail-3.jpg
│   ├── instagram-thumbnail-4.jpg
│   └── thumbnail.jpg
├── components/                   # Reusable UI building blocks
│   ├── AutoComplete.jsx          # Search bar with auto-suggestions for filtering posts
│   ├── ModalGridComponent.jsx    # Grid display for selected posts (shown in preview modal)
│   ├── SelectComponent.jsx       # Dropdown menu component for choosing options
│   └── SkeletonCard.jsx          # Loading placeholder that appears while content loads
├── hooks/                        # Custom behavior helpers
│   └── useHydrated.jsx           # Ensures certain code only runs in the browser, not on the server
├── routes/                       # Each file here = one page or API endpoint in the app
│   └── (see detailed breakdown below)
├── styles/                       # Visual styling files
│   ├── data-deletion.css         # Styles for the data deletion page
│   ├── privacy-policy.css        # Styles for the privacy policy page
│   └── terms-of-service.css      # Styles for the terms of service page
├── db.server.js                  # All database operations (create, read, update, delete records)
├── entry.server.jsx              # The very first file that runs when the server starts
├── root.jsx                      # The outermost HTML shell (loads fonts, stylesheets, scripts)
├── routes.js                     # Tells Remix how to discover page routes from the file system
└── shopify.server.js             # Shopify configuration (API keys, billing plans, session storage)
```

#### Core App Files

| File | Purpose (Non-Technical) |
|---|---|
| `db.server.js` | The "data manager" — contains all the code for saving, fetching, updating, and deleting Instagram accounts, posts, and product tags from the database. |
| `entry.server.jsx` | The starting point when the app server boots up. Handles the initial page rendering. |
| `root.jsx` | The outer HTML wrapper — sets up fonts (Inter from Google), meta tags, and loads all stylesheets and scripts. |
| `routes.js` | A tiny file that tells the framework to auto-discover pages from the `routes/` folder. |
| `shopify.server.js` | Configures the Shopify connection — API keys, billing plan ($2/month with 1-day trial), session storage, and app distribution mode. |

#### `app/assets/` — Static Images

| File | Purpose |
|---|---|
| `instagram-thumbnail-1.jpg` through `4.jpg` | Sample Instagram thumbnail images used as placeholders or demos. |
| `thumbnail.jpg` | A general thumbnail image for the app. |

#### `app/components/` — Reusable UI Parts

| File | Purpose |
|---|---|
| `AutoComplete.jsx` | A search bar with auto-complete suggestions. Used to search/filter Instagram posts by caption text. Also includes a dropdown filter for media type (images, videos, all). |
| `ModalGridComponent.jsx` | A grid view of selected Instagram posts. Shows post images, captions, usernames, dates, and product tag counts. Used in the preview modal on the dashboard. |
| `SelectComponent.jsx` | A simple dropdown select menu, used for choosing account options. |
| `SkeletonCard.jsx` | A "loading skeleton" — a grey placeholder that animates while real content is loading. Improves the user experience. |

#### `app/hooks/` — Custom Behavior Helpers

| File | Purpose |
|---|---|
| `useHydrated.jsx` | A helper that wraps parts of the UI so they only render in the browser (not during server-side rendering). This prevents errors with browser-only features. |

#### `app/styles/` — Page Styling

| File | Purpose |
|---|---|
| `data-deletion.css` | Visual styles (colors, fonts, layout, spacing) for the Data Deletion page. |
| `privacy-policy.css` | Visual styles for the Privacy Policy page. |
| `terms-of-service.css` | Visual styles for the Terms of Service page. |

---

### 4.3 `app/routes/` — All Pages & API Endpoints

Each file in this folder represents either a visual page or a behind-the-scenes API endpoint. Remix uses the file name to determine the URL.

```
app/routes/
├── _index/                                    # Landing/login page folder
│   └── (login page files)
├── auth.login/                                # Shopify authentication login page
│   └── (login page files)
├── graphql/                                   # GraphQL query helpers
│   └── query.jsx                              # Shopify API queries (subscription status, product search, etc.)
├── api.products.js                            # API: Returns product data for product-tagging feature
├── app._index.jsx                             # Main dashboard (home page of the app)
├── app.accounts.jsx                           # Manage Accounts page
├── app.data-deletion.jsx                      # In-app data deletion page (within admin)
├── app.instructions.jsx                       # How-to instructions page
├── app.jsx                                    # App layout wrapper (navigation menu, Polaris styling)
├── app.plan.jsx                               # Subscription/billing management page
├── app.privacy-policy.jsx                     # In-app privacy policy page (within admin)
├── app.terms-of-service.jsx                   # In-app terms of service page (within admin)
├── auth.$.jsx                                 # Catch-all route for Shopify authentication redirects
├── auth.instagram.callback.jsx                # Handles Instagram OAuth callback (exchanges tokens)
├── data-deletion.jsx                          # Public-facing data deletion page (outside admin)
├── meta.callback.jsx                          # Meta/Facebook callback handler
├── privacy-policy.jsx                         # Public-facing privacy policy page (outside admin)
├── proxy.handler.jsx                          # App Proxy handler — serves feed data to the storefront
├── terms-of-service.jsx                       # Public-facing terms of service page (outside admin)
├── webhooks.app.scopes_update.jsx             # Webhook: Fires when app permissions change
├── webhooks.app.uninstalled.jsx               # Webhook: Fires when merchant uninstalls the app
├── webhooks.app_subscriptions.update.jsx      # Webhook: Fires when subscription status changes
├── webhooks.customers.data_request.jsx        # GDPR Webhook: Customer data request
├── webhooks.customers.redact.jsx              # GDPR Webhook: Customer data deletion
└── webhooks.shop.redact.jsx                   # GDPR Webhook: Shop data deletion
```

#### Detailed Route File Reference

| File | URL / Trigger | Purpose |
|---|---|---|
| `app._index.jsx` | `/app` | **Main Dashboard.** The heart of the app — shows all Instagram posts in a grid, allows selecting posts, searching/filtering, and tagging Shopify products. Contains the `loader` (fetches data on page load) and `action` (handles form submissions like selecting posts, tagging products, syncing). |
| `app.accounts.jsx` | `/app/accounts` | **Manage Accounts.** Lists all connected Instagram accounts in a data table. Allows viewing posts for each account and deleting accounts (with a confirmation dialog showing how many posts and product links will be removed). |
| `app.instructions.jsx` | `/app/instructions` | **Instructions Page.** Step-by-step guide with icons explaining how to connect Instagram, view posts, select posts, and add the feed block to the storefront. |
| `app.plan.jsx` | `/app/plan` | **Subscription Page.** Shows current billing status (active, trial, or inactive). Allows cancelling the subscription. Supports a bypass mode for development/testing. |
| `app.jsx` | `/app/*` | **App Layout.** Wraps all `/app/` pages with the Shopify Polaris design system and the navigation menu (Home, Manage Accounts, Instructions, Plan, Privacy, Terms, Data Deletion). |
| `app.data-deletion.jsx` | `/app/data-deletion` | **In-App Data Deletion.** Data deletion page accessible from within the Shopify admin panel. |
| `app.privacy-policy.jsx` | `/app/privacy-policy` | **In-App Privacy Policy.** Privacy policy viewable from within the admin panel. |
| `app.terms-of-service.jsx` | `/app/terms-of-service` | **In-App Terms of Service.** Terms page viewable from within the admin panel. |
| `auth.$.jsx` | `/auth/*` | **Auth Catch-All.** Handles Shopify authentication redirects during the login process. |
| `auth.instagram.callback.jsx` | `/auth/instagram/callback` | **Instagram OAuth Callback.** Receives the authorization code from Instagram after the merchant approves the app. Exchanges it for a long-lived access token (valid 30 days) and saves the account details to the database. |
| `auth.login/` | `/auth/login` | **Login Page.** The initial Shopify authentication page where merchants enter their store URL. |
| `api.products.js` | `/api/products` | **Product Search API.** An internal endpoint that handles AJAX requests for searching Shopify products (used in the product tagging feature) and managing product-to-post relationships. |
| `proxy.handler.jsx` | `/proxy/handler` | **App Proxy Handler.** The critical endpoint that serves Instagram feed data to the storefront widget. Validates requests using HMAC signatures, checks subscription status, and returns selected posts with product tags as JSON. |
| `data-deletion.jsx` | `/data-deletion` | **Public Data Deletion Page.** A standalone page (outside the admin) where merchants can learn about and request data deletion. |
| `privacy-policy.jsx` | `/privacy-policy` | **Public Privacy Policy.** A standalone privacy policy page accessible without logging in. |
| `terms-of-service.jsx` | `/terms-of-service` | **Public Terms of Service.** A standalone terms page accessible without logging in. |
| `meta.callback.jsx` | `/meta/callback` | **Meta Callback.** Handles callback from Meta/Facebook platform (used during Instagram OAuth flow). |
| `graphql/query.jsx` | (not a page) | **GraphQL Queries.** Contains reusable Shopify Admin API queries — subscription status check, product search, and subscription cancellation. |
| `webhooks.app.uninstalled.jsx` | Webhook trigger | **App Uninstalled.** Automatically runs when a merchant uninstalls the app. Cleans up session data and related records. |
| `webhooks.app.scopes_update.jsx` | Webhook trigger | **Scopes Updated.** Runs when the app's permissions are changed. Logs the update. |
| `webhooks.app_subscriptions.update.jsx` | Webhook trigger | **Subscription Updated.** Runs when a subscription status changes (e.g., activated, cancelled, expired). Updates the local database accordingly. |
| `webhooks.customers.data_request.jsx` | Webhook trigger | **GDPR: Customer Data Request.** Responds to Shopify's mandatory GDPR webhook when a customer requests their data. Returns a 200 OK acknowledgment. |
| `webhooks.customers.redact.jsx` | Webhook trigger | **GDPR: Customer Data Deletion.** Responds when Shopify requests deletion of a specific customer's data. |
| `webhooks.shop.redact.jsx` | Webhook trigger | **GDPR: Shop Data Deletion.** Responds when Shopify requests deletion of all data for a specific shop (48 hours after uninstall). |

---

### 4.4 `extensions/` — Storefront Theme Extension

This folder contains code that runs on the **customer-facing storefront** (not the admin panel).

```
extensions/
├── .gitkeep
└── theme-extension/
    ├── assets/
    │   ├── instagram-feed.css            # Storefront feed styling (grid layout, hover effects, modals)
    │   └── thumbs-up.png                 # Icon asset used in the extension
    ├── blocks/
    │   └── instafeed.liquid              # The main Instagram feed block (HTML + CSS + JavaScript)
    ├── locales/
    │   └── en.default.json               # English language translations for the block settings
    ├── snippets/
    │   └── stars.liquid                   # A reusable Liquid snippet (star rating display)
    └── shopify.extension.toml            # Extension configuration (name, type, version)
```

| File/Folder | Purpose |
|---|---|
| `blocks/instafeed.liquid` | **The storefront widget.** This is the main file that powers the Instagram feed on the store. It fetches selected posts via the App Proxy, renders them in a responsive grid, shows "Shop This Post" product cards, and handles video hover-play. Merchants can customize heading, subtitle, grid columns (2-4), colors, and "View More" button directly from the Shopify Theme Editor. |
| `assets/instagram-feed.css` | Styles specifically for the storefront feed — grid layout, hover effects, loading animation, responsive design for mobile/tablet/desktop. |
| `assets/thumbs-up.png` | A small icon image used within the extension. |
| `locales/en.default.json` | English translations so the block settings labels appear correctly in the Theme Editor. |
| `snippets/stars.liquid` | A reusable code snippet for displaying star ratings. |
| `shopify.extension.toml` | Tells Shopify the extension name, type, and version. |

---

### 4.5 `prisma/` — Database Schema & Migrations

```
prisma/
├── schema.prisma                                    # The database blueprint (defines all tables)
├── dev.sqlite                                       # The local development database file
└── migrations/
    ├── 20250207072921_init/                          # Initial database setup
    │   └── migration.sql
    ├── 20250718132645_add_instagram_post_products/   # Added product tagging feature
    │   └── migration.sql
    ├── 20251003130144_add_subscription_model/        # Added subscription tracking
    │   └── migration.sql
    ├── 20251024061747_removed_unique_constraint_from_shop/ # Fixed database constraint
    │   └── migration.sql
    └── migration_lock.toml                          # Prevents conflicting database changes
```

| File | Purpose |
|---|---|
| `schema.prisma` | **The database blueprint.** Defines 5 tables: `Session` (login sessions), `InstagramAccount` (connected Instagram profiles), `InstagramPost` (individual posts), `InstagramPostProduct` (links between posts and Shopify products), and `Subscription` (billing records). Uses SQLite as the database engine. |
| `dev.sqlite` | The actual database file for local development. Contains all stored data. |
| `migrations/` | A history of database changes. Each subfolder represents one structural change to the database, tracked in order by date. |

---

### 4.6 `public/` — Publicly Accessible Files

```
public/
└── favicon.ico                   # The small icon shown in browser tabs
```

---

### 4.7 `docs/` — Documentation Files

```
docs/
├── README.md                     # Documentation index/overview
├── API_REFERENCE.md              # API endpoint reference for developers
├── ARCHITECTURE.md               # System architecture overview
├── CONTRIBUTING.md               # Guidelines for contributing to the codebase
├── DATABASE.md                   # Database schema documentation
├── DEPLOYMENT.md                 # Deployment instructions
├── DEVELOPMENT.md                # Local development setup guide
├── ENVIRONMENT.md                # Environment variables reference
├── GETTING_STARTED.md            # Quick start guide
├── THEME_EXTENSION.md            # Theme extension documentation
├── TROUBLESHOOTING.md            # Common issues and solutions
├── WEBHOOKS.md                   # Webhook handling documentation
└── shopify-instafeed-technical-doc.md  # Detailed technical documentation
```

---

## 5. How Data Is Stored

The app uses **SQLite** — a simple, file-based database that stores everything in a single file (`prisma/dev.sqlite`). The database is managed using **Prisma ORM**, which provides a safe and structured way to interact with data.

### Database Tables

| Table Name | What It Stores |
|---|---|
| **Session** | Login sessions for merchants. Stores shop name, access tokens, and user info. This is managed automatically by Shopify. |
| **InstagramAccount** | Connected Instagram profiles — Instagram ID, username, access token, token expiry date, account type, and which shop it belongs to. |
| **InstagramPost** | Individual Instagram posts — media type (image/video), media URL, thumbnail URL, link to original post, caption, timestamp, and whether the merchant has "selected" it for display on the storefront. |
| **InstagramPostProduct** | The link between an Instagram post and a Shopify product. Stores the product's ID, title, handle (URL slug), image, and price. This is what powers the "Shop This Post" feature. |
| **Subscription** | Billing records — which shop, which plan, subscription status (active/cancelled), Shopify subscription ID, trial end date, renewal date. |

### Data Flow

```
Instagram API → InstagramAccount → InstagramPost → InstagramPostProduct → Storefront
                 (account info)     (post content)    (product links)       (displayed to customer)
```

---

## 6. Permissions & Access

The app requests the following Shopify permission:

| Permission | What It Allows |
|---|---|
| `write_products` | Read and write access to the store's products. Needed so merchants can search for and tag products onto Instagram posts. |

The app is:
- **Embedded:** Yes — it runs inside the Shopify Admin panel, not in a separate browser tab.
- **Distribution:** App Store — available for any Shopify merchant to install.

---

## 7. Webhooks (Automated Events)

Webhooks are automatic notifications that Shopify sends to the app when certain events happen. The app listens for:

| Webhook Event | When It Fires | What the App Does |
|---|---|---|
| `app/uninstalled` | Merchant uninstalls the app | Cleans up session data and related records from the database. |
| `app/scopes_update` | App permissions are changed | Logs the change for tracking purposes. |
| `app_subscriptions/update` | Subscription status changes | Updates the local subscription record (e.g., marks as cancelled if payment fails). |
| `customers/data_request` | Customer requests their personal data (GDPR) | Acknowledges the request with a 200 OK response. |
| `customers/redact` | Shopify requests deletion of a specific customer's data (GDPR) | Processes and removes the customer's data. |
| `shop/redact` | Shopify requests full shop data deletion (GDPR, 48 hours after uninstall) | Removes all data associated with the shop. |

---

## 8. App Proxy (Storefront Data Delivery)

The **App Proxy** is a secure bridge that allows the storefront (what customers see) to request data from the app without exposing any private keys.

| Setting | Value |
|---|---|
| **Proxy URL** | `https://instagramfeed-app.sprinix.com/proxy/handler` |
| **Subpath** | `instafeed` |
| **Prefix** | `apps` |
| **Storefront URL** | `https://your-store.myshopify.com/apps/instafeed?dataset` |

**How it works:**

1. The customer visits a page with the Instagram feed block.
2. The block sends a request to `/apps/instafeed?dataset`.
3. Shopify forwards this to the app's proxy handler.
4. The handler validates the request (HMAC signature check), verifies the subscription is active, and returns the selected Instagram posts with product data as JSON.
5. The storefront block renders the posts in a beautiful grid.

---

## 9. Billing & Subscriptions

| Detail | Value |
|---|---|
| **Plan Name** | Monthly Plan |
| **Price** | $2.00 USD / month |
| **Billing Cycle** | Every 30 days |
| **Trial Period** | 1 day |
| **Billing Method** | Through Shopify's native billing (charged on the merchant's Shopify invoice) |
| **Bypass Mode** | Available via `BYPASS_SUBSCRIPTION=true` environment variable for development/testing |

The subscription is enforced both in the admin panel (plan page) and on the storefront (proxy handler checks subscription before serving data).

---

## 10. Deployment & Hosting

| Detail | Value |
|---|---|
| **Hosting** | Self-hosted via Docker container |
| **Production URL** | `https://instagramfeed-app.sprinix.com` |
| **Internal Port** | 3000 (app) → Mapped to 7002 (host server) |
| **Container Name** | `shopify-instafeed-app` |
| **Restart Policy** | `unless-stopped` (auto-restarts on crash) |
| **Node.js Version** | 20.10 (Slim for building, Alpine for production) |

**Deployment flow:**

1. Docker builds the app (installs dependencies, generates Prisma client, bundles with Vite).
2. Production dependencies are kept; development dependencies are removed.
3. The container runs on port 3000 internally, exposed to the host on port 7002.
4. A reverse proxy (e.g., Nginx) forwards `instagramfeed-app.sprinix.com` to port 7002.

---

## 11. Screenshot Checklist

Use this checklist to capture all required screenshots for complete documentation:

| # | Screen | Description | Status |
|---|---|---|---|
| 1 | Main Dashboard | The post grid with checkboxes, search bar, and filter dropdown | ☐ |
| 2 | Product Tagging | The product search and tagging interface on a selected post | ☐ |
| 3 | Selected Posts Preview | The modal showing only selected posts with product counts | ☐ |
| 4 | Manage Accounts | The accounts table with connected Instagram profiles | ☐ |
| 5 | Instructions Page | The step-by-step guide with icons | ☐ |
| 6 | Subscription - Active | The plan page showing an active subscription | ☐ |
| 7 | Subscription - Inactive | The plan page showing no active subscription | ☐ |
| 8 | Privacy Policy | The public-facing privacy policy page | ☐ |
| 9 | Terms of Service | The public-facing terms of service page | ☐ |
| 10 | Data Deletion | The data deletion request page | ☐ |
| 11 | Storefront Feed | A live Shopify store showing the Instagram feed grid | ☐ |
| 12 | Storefront - Shop This Post | A post modal showing tagged products with "Shop" buttons | ☐ |
| 13 | Theme Editor | The Shopify Theme Editor with the Instagram Feed block settings | ☐ |

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **OAuth** | A secure login method where you authorize one app to access another (e.g., allowing Instafeed to access your Instagram posts). You never share your password. |
| **Access Token** | A digital key that the app uses to access your Instagram data on your behalf. It expires after 30 days and is automatically refreshed. |
| **API** | Application Programming Interface — a way for two software systems to talk to each other. The app uses Instagram's API to fetch posts and Shopify's API to search products. |
| **Webhook** | An automatic notification sent by Shopify to the app when something happens (like an uninstall or subscription change). |
| **GDPR** | General Data Protection Regulation — European privacy law that requires apps to handle data deletion requests. |
| **App Proxy** | A Shopify feature that securely forwards requests from the storefront to the app's server, hiding private details. |
| **HMAC** | Hash-based Message Authentication Code — a security check that verifies a request is genuinely from Shopify and hasn't been tampered with. |
| **Prisma** | A tool that makes it easy to interact with the database using simple code instead of complex SQL queries. |
| **SQLite** | A lightweight database engine that stores all data in a single file. Good for small to medium-sized apps. |
| **Remix** | The web framework used to build this app. It handles page routing, data loading, and form submissions. |
| **Vite** | A modern build tool that compiles the app's code into optimized files for browsers. |
| **Polaris** | Shopify's official design system — provides pre-built UI components (buttons, cards, tables) that look consistent with the Shopify admin. |
| **App Bridge** | Shopify's library that allows the embedded app to communicate with the Shopify Admin (e.g., navigation, modals). |
| **Theme App Extension** | A way to add custom blocks to a Shopify store's theme without editing the theme's code directly. Merchants control placement via the Theme Editor. |
| **Liquid** | Shopify's template language used to build storefront pages. The Instagram feed block is written in Liquid. |
| **Docker** | A tool that packages the app and all its dependencies into a "container" that can run consistently on any server. |
| **Embedded App** | An app that runs inside the Shopify Admin panel (in an iframe) rather than in a separate browser window. |
| **App Block** | A section or block that merchants can add to their storefront pages using the Shopify Theme Editor. The Instagram feed is delivered as an App Block. |

---

*This document was generated from the actual codebase of the Shopify Instafeed App. All file references and descriptions are based on the current state of the project.*
