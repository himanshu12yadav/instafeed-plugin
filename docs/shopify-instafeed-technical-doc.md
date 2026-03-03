# Technical Documentation: Shopify Instafeed App

The Shopify Instafeed App allows merchants to seamlessly connect their Instagram accounts and display beautiful, auto-updating, and completely shoppable Instagram feeds directly on their Shopify storefronts. By bridging the Instagram Graph API with Shopify products, merchants can drive conversion directly from social engagement.

## 2. Application Architecture

The application is built on a modern, deeply integrated Shopify stack ensuring scalability, speed, and seamless storefront integration.

### 2.1 Backend Stack
- **Framework:** [Remix] (Vite-based) for a fast, file-based routing and full-stack API experience.
- **Database:** [PostgreSQL / SQLite] managed by [Prisma ORM] to securely store Instagram account tokens, cached post data, and product relationships.
- **Shopify Integration:** Built on `@shopify/shopify-app-remix`, ensuring secure, native integration within the Shopify Admin via App Bridge.
- **Frontend App Proxy:** Utilizes securely signed Shopify App Proxies to serve feed data to the storefront widget without exposing database credentials or API keys.

### 2.2 Key Components
1.  **Remix Admin App:** The merchant-facing dashboard providing OAuth flows and post-management UI.
2.  **App Proxy Handler (`app/routes/proxy.handler.jsx`):** A lightweight, high-performance endpoint designed specifically to securely serve JSON feed data to the customer's browser.

## 3. Core Features

### 3.1 Instagram Account Integration
Merchants can connect multiple Instagram profiles (Basic or Business) to the app.
1.  Initiates standard OAuth 2.0 flow via the Instagram API.
2.  Securely encrypts and stores long-lived access tokens.
3.  Automatically fetches and synchronizes the merchant's latest media posts (`InstagramPost`).

### 3.2 Shoppable Posts (`InstagramPostProduct`)
The core value proposition. Merchants can take an Instagram post within the app and "tag" it with Shopify products.
1.  The app uses the Shopify GraphQL API to let merchants search their inventory.
2.  A relational link (`InstagramPostProduct`) is created between the Instagram media ID and the Shopify Product ID.
3.  When a customer clicks the image on the storefront, they see the linked product(s) with direct "Add to Cart" or "View Product" calls to action.

### 3.3 Dynamic Storefront Integration (App Blocks)
The Instafeed widget is integrated via Shopify "App Blocks," allowing for a no-code setup by the merchant.
-  **Performance First:** The storefront requests data through the secure App Proxy. The app returns cached post data and resolved product links instantly without querying Instagram in real-time.
-  **Customizable:** Merchants can adjust the look and feel (grid layout, spacing) directly from the Shopify Theme Editor.

## 4. Administrative Interface

The administrative interface, built utilizing native Shopify Polaris components to ensure a seamless UI experience, provides a centralized dashboard for feed management.

`[📸 PASTE IMAGE HERE: Description: Show the 'Accounts' dashboard where a merchant views their connected Instagram profile and sync status.]`

Key areas include:
*   **Feed Management:** A visual grid of all synced Instagram posts where the merchant can select which posts to display or hide on the storefront.
*   **Product Tagging:** The specific view where a merchant clicks a post and searches for a Shopify product to attach to it.
    `[📸 PASTE IMAGE HERE: Description: Show the 'Tag Products' view or modal where a merchant selects an Instagram post and links a Shopify product to it.]`
*   **Subscription & Billing:** Leveraging Shopify's native billing system (`app/routes/app.plan.jsx`) to gate features or feed limits based on merchant tier.
    `[📸 PASTE IMAGE HERE: Description: Show the 'Plans' or 'Billing' page where merchants can upgrade their subscription.]`

### 4.1 Billing & Subscriptions Architecture
The app features tiered billing strictly managed via the Shopify Billing API, meaning merchants are charged seamlessly on their regular Shopify invoice.
-   **Enforcement:** Billing status is verified server-side (`app/routes/app.plan.jsx`). 
-   **Webhooks:** The app listens to `APP_SUBSCRIPTIONS_UPDATE` webhooks to automatically freeze background sync operations if a merchant cancels their charge or fails payment.
-   **Bypass:** A `BYPASS_SUBSCRIPTION` environment variable is available for local testing and developer previews.

### 4.2 Data Deletion & Privacy Policy Flow
To adhere strictly to European GDPR regulations and Shopify App Store Requirements:
-   **Merchant UI:** The application provides a dedicated dashboard (`app/routes/data-deletion.jsx`) where merchants can manually execute data purging.
-   **Privacy Transparency:** The app hosts a clear `privacy-policy.jsx` detailing what Instagram data is cached, how long it is stored, and the exact process for removal.

## 5. Storefront Experience

The storefront experience is powered by an App Block that is entirely manageable from the Shopify Online Store Editor.

`[📸 PASTE IMAGE HERE: Description: Show a screenshot of a live Shopify Storefront displaying a beautiful grid-style Instagram feed.]`

**Features:**
*   **Responsive Layouts:** The feed automatically adapts to mobile and desktop screens.
*   **Interactive Modals:** Clicking a post opens a modal showing the original caption and the "Shop this Look" product cards.

### 5.1 Theme App Extension Technicals
The Instafeed widget is injected via Shopify's standard **Theme App Extension** architecture (`extensions/theme-extension`).
-   **No Liquid Injection:** Unlike legacy apps, this application does not forcefully alter merchant `.liquid` files. The merchant entirely controls the placement via the visual Theme Editor.
-   **Performance First:** The frontend fetches the grid data asynchronously without blocking the initial page load, ensuring the merchant's Lighthouse Performance score is unaffected by the app.

## 6. Technical Setup & Configuration

### 6.1 Environment Variables
Key configuration required for the application to function in production:
```env
SHOPIFY_APP_HANDLE="instafeed-06-14-25"
BYPASS_SUBSCRIPTION="false"
APP_PORT=3000
SHOPIFY_APP_URL="https://worked-ins-institutes-dist.trycloudflare.com"
SCOPES=write_products
SHOPIFY_API_KEY=9d193f98bac5c4f538958ba291fee5cd
SHOPIFY_API_SECRET=9060f7d210f9bf84737fbd768ee64675
```

### 6.2 Data Deletion & Webhooks
The application securely handles mandatory data compliance requests.
-   **App Uninstalled (`webhooks.app.uninstalled.jsx`):** Revokes Instagram capabilities and cleans up tenant data.
-   **GDPR Webhooks (`data_request`, `customers.redact`, `shop.redact`):** The app properly implements endpoints that return `200 OK` and clear required identifiers per Shopify policy.

### 6.3 Internal API Endpoints
To keep the Admin UI fast without full-page reloads, the Remix backend exposes several internal API endpoints (e.g., `api.products.js`).
-   These routes handle asynchronous data operations, such as saving a newly tagged product to the database or retrieving the current product count for an Instagram post, all happening instantly in the background.

## 7. Future Enhancements

-   Support for Instagram Reels playback directly within the storefront modal.
-   Carousel configurations allowing merchants to embed feeds horizontally on specific product pages.
-   Advanced analytics tracking "Click-through-Rate" (CTR) from the Instagram feed directly to checkout.
