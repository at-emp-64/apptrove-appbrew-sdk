# apptrove-sdk

Apptrove analytics tracker for AppBrew-powered React Native apps.

Wraps [`react-native-apptrove`](https://www.npmjs.com/package/react-native-apptrove) and exposes an `ApptroveTracker` you can plug into AppBrew's `AnalyticsProvider`. AppBrew analytics events (`add_to_cart`, `purchase`, `view_item`, etc.) get forwarded to Apptrove with the correct event IDs.

---

## Install

The SDK has two peer dependencies that the host app must install alongside it:

- `@app-brew/brewery >=1.0.0` — already present in any AppBrew app.
- `react-native-apptrove 2.0.1` — the native module that does the actual work.

```bash
pnpm add apptrove-sdk react-native-apptrove
cd ios && bundle exec pod install && cd ..
```

> **Why install `react-native-apptrove` directly?** React Native's autolinker only walks the host app's direct `package.json` dependencies — it does not recurse into transitive deps of a wrapper SDK. If you skip this, the iOS pod is never installed (you'll see `NativeEventEmitter requires a non-null argument` at runtime) and the Android module is not included in the autolink set. This is the same install pattern as `@react-native-firebase/*` and `@react-navigation/native-stack`.

---

## Android: resolve the `androidx.work` version conflict

`apptrove-android-sdk` (pulled in transitively) depends on `androidx.work:work-runtime-ktx:2.7.1`. Most AppBrew apps already pull `androidx.work:work-runtime:2.8.0+` from another library (Firebase Messaging, Notifee, etc.). Because the KTX APIs were merged into `work-runtime` at 2.7+, mismatched versions of the two artifacts cause:

```
Duplicate class androidx.work.OneTimeWorkRequestKt found in modules
  work-runtime-2.8.0.aar       (androidx.work:work-runtime:2.8.0)
  work-runtime-ktx-2.7.1.aar   (androidx.work:work-runtime-ktx:2.7.1)
```

Pin both to the same version. Add this to `android/app/build.gradle`, above the `dependencies { ... }` block:

```gradle
configurations.all {
    resolutionStrategy {
        force 'androidx.work:work-runtime:2.8.0'
        force 'androidx.work:work-runtime-ktx:2.8.0'
    }
}
```

---

## Wire it up

In your app's analytics initialization (typically `App.tsx`, where you call `AnalyticsProvider.getInstance().addTracker(...)`):

```ts
import { AnalyticsProvider } from '@gauntlet/analytics'
import { ApptroveTracker } from 'apptrove-sdk'

AnalyticsProvider.getInstance().addTracker(new ApptroveTracker())
```

That's it. Subsequent calls to `AnalyticsProvider.getInstance().sendEvent(...)` and `sendScreenView(...)` will be forwarded to Apptrove with the correct event IDs.

---

## Configuration

The tracker initializes the Apptrove SDK with your app key and environment when `initTracker()` is called by `AnalyticsProvider`. Edit your fork's `src/appTroveTrackers.ts` to set your own:

- App key (passed to `new ApptroveConfig(...)`)
- Environment (`development` / `production`)
- App secret (`apptroveConfig.setAppSecret(...)`)
- Event ID mappings, if you use different IDs in your Apptrove dashboard

---

## Events forwarded

| AppBrew event         | Apptrove event ID |
|-----------------------|-------------------|
| `add_to_cart`         | `nr8Ri53bVe`      |
| `remove_from_cart`    | `cOUkbYcmPO`      |
| `view_item`           | `rqU8Fj2eH2`      |
| `view_item_list`      | `KGItNYWJwH`      |
| `view_cart`           | `drsYVcgcAh`      |
| `begin_checkout`      | `34mjlWJaHL`      |
| `purchase`            | `jpk3n2mi68`      |
| `search`              | `mH6sqU7t6u`      |
| `screen_view`         | `mHJoo2USkp`      |
| `add_to_wishlist`     | `ePL2CANIYV`      |
| `remove_from_wishlist`| `u9zlOUxIuS`      |
| `login`               | `o91gt1Q0PK`      |
| `signup`              | `Fs2RFODrwU`      |
| `select_item`         | `aujWzJaEcv`      |
| `apply_coupon`        | `CMfNLYL3CO`      |
| `remove_coupon`       | `rzXoWvrLQZ`      |

Unknown events are logged but not sent.

---

## Troubleshooting

**iOS: `'new NativeEventEmitter()' requires a non-null argument`**
The native module didn't get linked. Ensure `react-native-apptrove` is in your host `package.json` (not just transitively from this SDK), then re-run `pnpm install` and `cd ios && bundle exec pod install`.

**Android: `Duplicate class androidx.work.OneTimeWorkRequestKt`**
You skipped the `resolutionStrategy` block above. Add it to `android/app/build.gradle` and rebuild.

**Events not appearing in Apptrove**
Check Metro logs for `🚀 Initializing Trackier SDK` and `✅ Apptrove SDK Initialized`. If those don't appear, `ApptroveTracker` isn't being added to `AnalyticsProvider`. Check Metro logs for `⚠️ Unhandled event:` — events without a mapping are dropped.
