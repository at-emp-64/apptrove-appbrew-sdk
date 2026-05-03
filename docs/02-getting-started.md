# Getting Started

## Setup npm auth

The app depends on private `@app-brew/*` packages on npm. You need a read token provided by the AppBrew team.

Add it to your global `~/.npmrc` (not the repo's `.npmrc`):

```
//registry.npmjs.org/:_authToken=npm_YOUR_TOKEN_HERE
```

This only needs to be done once per machine.

## Clone and install

```bash
git clone git@github.com:appbrew-community/sample-appbrew-app.git
cd sample-appbrew-app
pnpm install
```

## Run on iOS

Install Ruby gems and CocoaPods first (one-time setup):

```bash
bundle install
cd ios && bundle exec pod install && cd ..
```

Then build and run:

```bash
pnpm ios --simulator "iPhone 17 Pro"
```

## Run on Android

Start an Android emulator from Android Studio, then:

```bash
pnpm android
```

## What you should see

The app launches the Natori store -- a real Shopify store connected via AppBrew. You'll see a home screen with product grids, a bottom navigation bar, and screens for collections, cart, account, etc. All of this is driven by a JSON config fetched from the AppBrew backend.

## Troubleshooting

**Metro can't resolve a module**
```bash
pnpm start --reset-cache
```

**iOS build fails after dependency changes**
```bash
cd ios && rm -rf Pods build && bundle exec pod install && cd ..
```

**Android build fails**
```bash
pnpm clean:android
pnpm android
```

**Stale Xcode cache (path errors referencing old node_modules)**

Delete DerivedData:
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/natori-*
```
Then rebuild.
