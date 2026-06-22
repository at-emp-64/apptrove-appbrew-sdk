# apptrove-appbrew-sdk

Home of **[`@app-brew/apptrove-sdk`](./packages/apptrove-sdk/README.md)** — the Apptrove analytics tracker for [AppBrew](https://appbrew.tech)-powered React Native apps — plus a sample host app (Natori) to develop and test the tracker against a real AppBrew config.

- **The package** lives in [`packages/apptrove-sdk/`](./packages/apptrove-sdk/) and is published to AppBrew's private npm (`npm.appbrew.tech`).
- **Everything else** is the sample host app — a standard AppBrew RN app that consumes the package as a `workspace:*` dependency, so changes to the SDK are picked up immediately.

## Repo layout

```
packages/apptrove-sdk/      # the @app-brew/apptrove-sdk package (the thing you ship)
  src/appTroveTrackers.ts   # ApptroveTracker — event mapping + SDK init
  src/index.ts              # public exports
  README.md                 # install + config + event mappings + troubleshooting
src/app/App.tsx             # sample app — registers ApptroveTracker on AnalyticsProvider
.github/workflows/          # release.yml + publish.yml (publish to verdaccio)
RELEASING.md                # how to cut a release
docs/                       # general AppBrew integration-developer guide
```

## 1. Setup

Prerequisites:

- **macOS** with **Xcode** (iOS) and/or **Android Studio** (Android) — see RN's [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment).
- **[mise](https://mise.jdx.dev)** — pins the toolchain (Node, pnpm, Ruby, Java). `brew install mise`.
- **Registry access** — `.npmrc` ships a committed **read-only** token for `npm.appbrew.tech`. If `pnpm install` returns 401, ask the AppBrew team for a fresh read token.

```bash
git clone git@github.com:at-emp-64/apptrove-appbrew-sdk.git
cd apptrove-appbrew-sdk

mise install        # pinned toolchain (run `mise trust` if prompted)
pnpm install
```

## 2. Run the sample app

This is how you exercise the tracker on a device/simulator:

```bash
pnpm run-ios        # boots a simulator, installs Pods, builds + launches
pnpm run-android    # boots an emulator (or connected device), builds + launches
```

| Command | What it does |
| --- | --- |
| `pnpm start` | Start the Re.Pack/Metro dev server only |
| `pnpm pod-install` | (Re)install CocoaPods |
| `pnpm clean-ios` / `pnpm clean-android` | Wipe native build output |

The repo ships a working `APP_ID` / `APP_THEME_ID` (the Natori demo store) in `.env`, so it builds and runs as-is. `.env` is set to `ENV=debug` and the `!__DEV__` guard in `App.tsx` is commented out, so **the tracker runs in dev** — good for testing without a release build. To point at your own store's config, see [docs/11-connecting-your-store.md](./docs/11-connecting-your-store.md).

## 3. Develop the tracker

The tracker source is [`packages/apptrove-sdk/src/appTroveTrackers.ts`](./packages/apptrove-sdk/src/appTroveTrackers.ts). Because the sample app depends on it via `workspace:*`, edits are picked up by Metro on the next reload — no rebuild of the package needed.

- **Event mappings** (AppBrew event → Apptrove event ID) live in `sendEvent`. The full table is in the [package README](./packages/apptrove-sdk/README.md#events-forwarded).
- **Config** is read from `AppConfig.integrations.apptrove` at `initTracker` time — no source edits needed to change keys/environment; set them in the AppBrew dashboard. Shape and behavior: [package README → Configuration](./packages/apptrove-sdk/README.md#configuration).
- For tracker concepts in general, see [docs/07-building-trackers.md](./docs/07-building-trackers.md).

The package README also documents the two install requirements every consumer app needs: installing `react-native-apptrove` directly (autolinking doesn't recurse into wrapper SDKs) and the Android `androidx.work` `resolutionStrategy` pin.

## 4. Test it

Run the app (step 2) and watch the Metro logs:

- `🚀 Initializing Trackier SDK` and `✅ Apptrove SDK Initialized` confirm `ApptroveTracker` was added to `AnalyticsProvider` and initialized.
- Trigger events in the app (view a product, add to cart, etc.) and confirm they reach your Apptrove dashboard.
- `⚠️ Unhandled event:` means an AppBrew event has no Apptrove mapping — add it to `sendEvent` if it should be forwarded.

Troubleshooting (native link errors, duplicate-class, events not appearing): [package README → Troubleshooting](./packages/apptrove-sdk/README.md#troubleshooting).

## 5. Publish

Releases are automated — never `npm publish` from a laptop. In short:

1. **Actions → Release (prepare PR) → Run workflow**, pick a bump (`patch`/`minor`/`major`/`prerelease`).
2. Review and **squash-merge** the `release(apptrove-sdk): v<version>` PR (keep the title intact).
3. `publish.yml` runs automatically: publishes to `npm.appbrew.tech`, tags the commit, and creates a GitHub Release.

Publishing authenticates with the `VERDACCIO_NPM_TOKEN` write-token secret (no laptop tokens, no OIDC). Full details, including failure recovery and the token model: **[RELEASING.md](./RELEASING.md)**.

## More docs

The [`docs/`](./docs/index.md) folder is the general AppBrew integration-developer guide (how apps work, screens/blocks, building integrations/blocks/trackers, metafields, checkout, connecting a store). Hosted version: **[AppBrew Integration Developer Docs](https://app.notion.com/p/app-brew/Appbrew-Integration-Developer-Docs-344eca13d6e180e4af03f524b3daafcd)**.
