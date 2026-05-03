# Connecting Your Store

By default, the sample app connects to the Natori store. To test your integration with your own Shopify store, you need an AppBrew account and a configured store.

## Steps

### 1. Create or use an existing Shopify store

You need a Shopify store with products, collections, and a theme.

### 2. Install the AppBrew app

Install the AppBrew app from the Shopify App Store into your store. This connects your store to the AppBrew backend and generates the credentials you need.

### 3. Get your credentials from the AppBrew dashboard

From the AppBrew dashboard, find your:

- **APP_ID** -- your app's unique identifier (e.g., `app_XXXXXXXXXXXXX`)
- **APP_THEME_ID** -- the theme configuration to use (e.g., `theme_XXXXXXXXXXXXX`)

### 4. Update .env

Edit the `.env` file in the repo root:

```
ENV=release
APP_ID="app_YOUR_APP_ID"
APP_NAME="Your Store"
APP_THEME_ID="theme_YOUR_THEME_ID"
APP_SERVICE_URL="https://edge.app.appbrew.tech"
```

`APP_SERVICE_URL` is the AppBrew edge API. Do not change it.

### 5. Rebuild and run

```bash
pnpm start --reset-cache
pnpm ios
```

The app now loads your store's config, products, and theme.

## Notes

- The Firebase config (`GoogleService-Info.plist`, `google-services.json`) in the repo is for the sample app. Push notifications and Firebase Analytics will still point to the sample project. This is fine for development.
- If you need to test checkout flows with real payments, configure your Shopify store's payment settings accordingly.
