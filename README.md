# Sample AppBrew App

A sample React Native app for building and testing third-party integrations for AppBrew-powered mobile apps.

See the full documentation at [docs/index.md](./docs/index.md).

## Quick Start

```bash
git clone git@github.com:appbrew-community/sample-appbrew-app.git
cd sample-appbrew-app
pnpm install

# iOS
bundle install && cd ios && bundle exec pod install && cd ..
pnpm ios

# Android
pnpm android
```

## Create an Integration

```bash
pnpm create-integration my-integration
pnpm install
```

Then follow the guides in [docs/](./docs/index.md).
