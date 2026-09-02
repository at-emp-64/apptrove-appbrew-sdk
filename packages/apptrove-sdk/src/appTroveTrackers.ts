    import { ApptroveConfig, ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';
    import { Platform } from 'react-native';
    import { AnalyticsTrackerV2 } from '@gauntlet/analytics'
    import { AnalyticsEvent, AnalyticsEventParams, AnalyticsPayload, AppConfig, IntegrationsConfig } from '@gauntlet/types'
    import messaging from '@react-native-firebase/messaging';
    import { AuthorizationStatus } from '@react-native-firebase/messaging';

    const defaultEventsWhitelist = Object.values(AnalyticsEvent)
    const defaultParamsWhitelist = Object.values(AnalyticsEventParams)

    export type ApptroveEnvironment = 'development' | 'production' | 'testing'

    // Shape of integrations.apptrove as configured in studio / the config mapper.
    // Not part of @gauntlet/types' IntegrationsConfig, so it's accessed via a cast.
    export interface ApptroveIntegrationConfig {
        androidSdkKey?: string
        androidSdkSigningId?: string
        androidSdkSigningKey?: string
        androidEnvironment?: ApptroveEnvironment
        setFacebookAppId?: string
        iosSdkKey?: string
        iosSdkSigningId?: string
        iosSdkSigningKey?: string
        iosEnvironment?: ApptroveEnvironment
        waitForATTUserAuthorization?: number
        cleverTapIntegration?: boolean
        appleSearchAdsIntegration?: boolean
        sendFcmToken?: boolean
        sendApnToken?: boolean
    }
    

    export class ApptroveTracker extends AnalyticsTrackerV2 {

        private userDetails = {
        email: "",
        phone: "",
        name: ""
        };


        async initTracker(config?: AppConfig) {
            if (Platform.OS !== 'android' && Platform.OS !== 'ios') return

            this.eventsWhitelist = defaultEventsWhitelist
            this.paramsWhitelist = defaultParamsWhitelist

        try {
            const apptroveConfigData = (
                config?.integrations as
                    | (IntegrationsConfig & { apptrove?: ApptroveIntegrationConfig })
                    | undefined
            )?.apptrove;

            console.log('🚀 Apptrove Config Available:', !!apptroveConfigData);

            if (!apptroveConfigData) {
                console.log('⚠️ Apptrove config not found');
                return;
            }

            const isAndroid = Platform.OS === 'android';
            const isIOS = Platform.OS === 'ios';


            const sdkKey = isAndroid? apptroveConfigData.androidSdkKey : isIOS? apptroveConfigData.iosSdkKey: null;

            const environment = (isAndroid? apptroveConfigData.androidEnvironment : isIOS? apptroveConfigData.iosEnvironment: null) ?? 'development';

            const signingId = isAndroid? apptroveConfigData.androidSdkSigningId : apptroveConfigData.iosSdkSigningId;

            const signingKey = isAndroid? apptroveConfigData.androidSdkSigningKey: apptroveConfigData.iosSdkSigningKey;


            if (!sdkKey) {
                console.log('Apptrove SDK key not found for platform:', Platform.OS);
                return;
            }


            console.log('Initializing Apptrove SDK for:', Platform.OS);


            const apptroveConfig = new ApptroveConfig(sdkKey, environment);


            // Set App Secret if available
            if (signingId && signingKey) {
                console.log('Setting App Secret');
                apptroveConfig.setAppSecret(signingId, signingKey);
            } else {  
                console.log('App Secret not set - missing signing ID or key');
            }


            // Facebook App ID (Android only — iOS native ignores facebookAppId)
            if (isAndroid && apptroveConfigData?.setFacebookAppId) {
                console.log('Setting Facebook App ID');
                apptroveConfig.setFacebookAppId(apptroveConfigData.setFacebookAppId);
            }


            // Deferred Deeplink Callback
            apptroveConfig.setDeferredDeeplinkCallbackListener(
                (deepLinkData) => {
                    console.log('Deferred Deeplink Callback received');
                    console.log('DeepLink Data:', JSON.stringify(deepLinkData));
                }
            );


            // Wait for ATT authorization (iOS only) before init so events are
            // held until the user responds to the prompt or the timeout elapses.
            // A timeout of 0 means "don't wait", so only call for a positive value.
            const attTimeout = Number(apptroveConfigData?.waitForATTUserAuthorization)
            if (isIOS && attTimeout > 0) {
                console.log('Waiting for ATT authorization, timeout:', attTimeout);
                ApptroveSDK.waitForATTUserAuthorization(attTimeout);
            }


            console.log('Calling ApptroveSDK.initialize()');

            ApptroveSDK.initialize(apptroveConfig);


            // ---------------------------------------------------------
            // PUSH TOKEN CONFIGURATION
            // ---------------------------------------------------------

            const enableFcmToken =
                apptroveConfigData?.sendFcmToken === true;

            const enableApnToken =
                apptroveConfigData?.sendApnToken === true;

            console.log(
                "Push Token Configuration:",
                {
                    enableFcmToken,
                    enableApnToken,
                    platform: Platform.OS
                }
            );

            void this.getPushTokens(enableFcmToken, enableApnToken);

            console.log('Apptrove SDK Initialized');


        } catch (error) {
            console.log('❌ Apptrove Init Error:', error);
        }
    }

        async setUserDetails(user?: any) {
            // Called when a user signs in or profile updates
            // user contains: email, phone, firstName, lastName
            this.userDetails = {
            email: user?.email || "",
            phone: user?.phone || "",
            name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
            };
        }

        async sendEvent(event?: AnalyticsEvent, payload?: AnalyticsPayload) {

            console.log('📊 Event:', event , "------", payload);

            switch (event) {
            case 'add_to_cart':
                this.track('Fy4uC1_FlN', payload); // nr8Ri53bVe = add_to_cart (Custom)
                break;

            case 'remove_from_cart':
                this.track('zjzhYZNNTE', payload); // cOUkbYcmPO = remove_from_cart (Custom)
                break;

            case 'view_item':
                console.log('📊 Event: case---',"view_item") //rqU8Fj2eH2 = view_item (Custom)
                this.track('XLdSodqgld', payload); // 
                break;

            case 'view_item_list':
                this.track('xLo5iOmEUm', payload); // KGItNYWJwH = view_item_list (Custom)
                break;

            case 'view_cart':
                this.track('drsYVcgcAh', payload); // drsYVcgcAh = view_cart (Custom)
                break;

            case 'begin_checkout':
                this.track('rbJmUiy8vZ', payload); // HP1zW85IFo = begin_checkout (Custom)
                break;

            case 'purchase':
                this.track('Q4YsqBKnzZ', payload); // jpk3n2mi68 = purchase (Custom)
                break;

            case 'search':
                this.track('mH6sqU7t6u', payload); // mH6sqU7t6u = search (Built-in)
                break;

            case 'screen_view':
                this.track('0zrztVO54t', payload); // mHJoo2USkp = screen_view (custom)
                break;

            case 'add_to_wishlist':
                this.track('AOisVC76YG', payload); // ePL2CANIYV = add_to_wishlist (Custom)
                break;

            case 'remove_from_wishlist':
                this.track('XyrCtDCVFg', payload); // u9zlOUxIuS = remove_from_wishlist (Custom)
                break;

            case 'login':
                this.track('o91gt1Q0PK', payload); // o91gt1Q0PK = login (Custom)
                break;

            case 'signup':
                this.track('8ASKXJ1vWO', payload); // Fs2RFODrwU = signup (Custom)
                break;

            case 'select_item':
                this.track('5f0BML6LDg', payload); // aujWzJaEcv = select_item (Custom)
                break;

            case 'apply_coupon':
                this.track('AR1argJ9TD', payload); // CMfNLYL3CO = apply_coupon (Custom)
                break;

            case 'remove_coupon':
                this.track('tpJ8NfA1Iv', payload); // rzXoWvrLQZ = remove_coupon (Custom)
                break;

            default:
                console.log('⚠️ Unhandled event:', event);
                break;
            }
        }

        async sendScreenView(screenName?: string) {
            console.log('📺 Screen View:', screenName);

            this.track('SCREEN_VIEW', {
            screen_name: screenName
            });
        }


        private async getPushTokens(enableFcmToken: boolean, enableApnToken: boolean): Promise<void> {
            try {
                // ---------------------------------------------------------
                // IOS - APNs TOKEN
                // ---------------------------------------------------------
                if (Platform.OS === "ios" && enableApnToken) {
                    console.log("📱 iOS: APNs token tracking is enabled");
                    
                    console.log("📱 iOS: Registering for remote messages...");
                    await messaging().registerDeviceForRemoteMessages();
                    console.log("📱 iOS: Registered for remote messages");
                    
                    let apnsToken: string | null = null;
                    let attempts = 0;
                    const maxAttempts = 10;
                    
                    while (attempts < maxAttempts && !apnsToken) {
                        attempts++;
                        try {
                            apnsToken = await messaging().getAPNSToken();
                            if (apnsToken) {
                                console.log(`iOS APNs Token obtained on attempt ${attempts}:`, apnsToken);
                                ApptroveSDK.sendAPNToken(apnsToken);
                                break;
                            }
                            console.log(`⏳ iOS APNs attempt ${attempts}: No token yet, waiting...`);
                            await new Promise(resolve => setTimeout(resolve, 500));
                        } catch (error) {
                            console.log(`⚠️ iOS APNs attempt ${attempts} failed:`, error);
                        }
                    }
                    
                    if (!apnsToken) {
                        console.log("iOS: Failed to get APNs token after", maxAttempts, "attempts");
                    }
                }

                // ---------------------------------------------------------
                // FCM TOKEN - ANDROID ONLY
                // ---------------------------------------------------------
                if (Platform.OS === "android" && enableFcmToken) {
                    console.log("📱 Android: FCM token tracking is enabled");
                    
                    // Request permission first
                    const authStatus = await messaging().requestPermission();
                    const enabled = authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

                    console.log("📱 Android: Permission enabled:", enabled);
                    
                    if (!enabled) {
                        console.log('⚠️ Android: Notification permission not granted.');
                        return;
                    }

                    // Get the token with retry (FCM token is cached, so less retries needed)
                    let fcmToken: string | null = null;
                    let attempts = 0;
                    const maxAttempts = 3; // FCM is cached, so fewer attempts needed
                    
                    while (attempts < maxAttempts && !fcmToken) {
                        attempts++;
                        try {
                            fcmToken = await messaging().getToken();
                            if (fcmToken) {
                                console.log(`Android FCM Token obtained on attempt ${attempts}:`, fcmToken);
                                ApptroveSDK.sendFcmToken(fcmToken);
                                break;
                            }
                            console.log(`⏳ Android FCM attempt ${attempts}: No token yet, waiting...`);
                            await new Promise(resolve => setTimeout(resolve, 500));
                        } catch (error) {
                            console.log(`Android FCM attempt ${attempts} failed:`, error);
                        }
                    }
                    
                    if (!fcmToken) {
                        console.log("Android: Failed to get FCM token after", maxAttempts, "attempts");
                    }
                } else if (Platform.OS === "android" && !enableFcmToken) {
                    console.log("📱 Android: FCM token tracking is disabled by configuration");
                } else if (Platform.OS === "ios") {
                    console.log("📱 iOS: FCM token tracking skipped - iOS uses APNs only");
                }
                
            } catch (error: any) {
                console.error("Error fetching push tokens:", error);
                if (error?.code) console.log('Error code:', error.code);
                return;
            }
        }


        private async waitForUserDetails(timeout = 1000): Promise<void> {

            if (this.userDetails.email || this.userDetails.phone) {
                return;
            }
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log(
                        "⏳ 1000ms wait completed for user details");

                    resolve();

                }, timeout);

            });
        }

        async track(eventId: string, payload?: any) {

            const isAuthEvent =
            eventId === "o91gt1Q0PK" ||   // Login
            eventId === "8ASKXJ1vWO";     // Signup

            try {
                if (!eventId) {
                console.warn("⚠️ Event ID is missing");
                return;
                }

                const apptroveEvent = new ApptroveEvent(eventId);

                // 🔹 Helpers
                const getString = (val: any) =>
                val !== undefined && val !== null ? String(val) : "";

                const getNumber = (val: any) => {
                const num = Number(val);
                return isNaN(num) ? 0 : num;
                };

                if (payload && typeof payload === "object") {

                // 🔹 Ensure items array
                let items = [];
                if (Array.isArray(payload.items)) {
                    items = payload.items;
                }

                // 🔹 Revenue + Currency (IMPORTANT)
                
                // const revenue = getNumber(payload.value || payload.sub_total);
                // const currency = getString(payload.currency || "USD");

                // apptroveEvent.revenue = revenue;
                // apptroveEvent.currency = currency;

                let revenue = 0;

                if (eventId === "Q4YsqBKnzZ") {
                    revenue = getNumber(payload.value || payload.sub_total);

                    const currency = getString(payload.currency || "INR");

                    apptroveEvent.revenue = revenue;
                    apptroveEvent.currency = currency; 
                }

                // 🔹 Core fields
                apptroveEvent.orderId = getString(payload.checkout_token);
                apptroveEvent.discount = getNumber(payload.discount);

                // 🔹 Item mapping (safe)
                if (items.length > 0 && typeof items[0] === "object") {
                    const item = items[0];

                    apptroveEvent.productId = getString(item.item_id);
                    apptroveEvent.param1 = getString(item.item_name);
                    apptroveEvent.param2 = getString(item.item_size);
                    apptroveEvent.param3 = getString(item.item_brand);
                    apptroveEvent.param4 = getString(item.item_color);
                    apptroveEvent.param5 = getString(item.sku);
                }

                // 🔹 Attach full payload (always)
                apptroveEvent.ev = payload;

                // 🔹 Optional tracking values
                apptroveEvent.setEventValue("items_count", items.length);
                apptroveEvent.setEventValue("source", "app");

                // 🔹 (Optional) Explicit revenue event style mapping
                // Useful if backend treats revenue events differently
                if (revenue > 0) {
                    apptroveEvent.setEventValue("is_revenue_event", true);
                }
                }

                if (isAuthEvent) {
                    await this.waitForUserDetails(1000);
                }
                if (this.userDetails.email) {
                    ApptroveSDK.setUserEmail(this.userDetails.email);
                }
                if (this.userDetails.phone) {
                    ApptroveSDK.setUserPhone(this.userDetails.phone);
                }
                if (this.userDetails.name) {
                    ApptroveSDK.setUserName(this.userDetails.name);
                }

                // Fire event
                ApptroveSDK.trackEvent(apptroveEvent);

            } catch (error) {
                console.error("❌ Apptrove Event Error:", error);
            }
        }
    }