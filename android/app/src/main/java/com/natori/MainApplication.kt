package com.natori.appbrew

import android.app.Application
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.common.assets.ReactFontManager
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.google.android.gms.security.ProviderInstaller
import com.lugg.RNCConfig.RNCConfigPackage

class MainApplication :
  Application(),
  ReactApplication {
  override val reactNativeHost: ReactNativeHost =
    object : DefaultReactNativeHost(this) {
      override fun getPackages(): List<ReactPackage> =
        PackageList(this).packages.apply {
          add(RNCConfigPackage())
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        }

      override fun getJSMainModuleName(): String = "index"

      override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

      override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
    }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()

    // GMS Conscrypt is only needed below Android 14 for the cert fix (#17213). On 14+ the system
    // provider already has current certs + TLS 1.3, and installing GMS Conscrypt there can cap
    // the handshake at TLS 1.2 (breaks the TLS-1.3-only api.appbrew.tech), so skip it.
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
      try {
        ProviderInstaller.installIfNeeded(this)
      } catch (e: Exception) {
        android.util.Log.w("TLS", "ProviderInstaller failed; using platform provider", e)
      }
    }

    ReactFontManager.getInstance().addCustomFont(this, "Roboto Condensed", R.font.roboto_condensed)
    loadReactNative(this)
  }
}
