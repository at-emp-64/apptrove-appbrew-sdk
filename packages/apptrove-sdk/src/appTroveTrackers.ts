    //import { TrackierConfig, TrackierSDK, TrackierEvent } from 'react-native-trackier';
    import { ApptroveConfig, ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';
    import { Platform } from 'react-native';
    import { AnalyticsTrackerV2 } from '@gauntlet/analytics'
    import { AnalyticsEvent, AnalyticsPayload, AppConfig } from '@gauntlet/types'

    export class ApptroveTracker extends AnalyticsTrackerV2 {

        async initTracker(config?: AppConfig) {
            if (Platform.OS === 'android' || Platform.OS === 'ios') {
            try {
                console.log('🚀 Initializing Trackier SDK');

                var apptroveConfig = new ApptroveConfig(
                "ee9f21fb-5848-4ed9-8d9c-e4093e6d220c",
                "development" // ✅ fixed typo
                );
                apptroveConfig.setAppSecret("setSecretId","setSecretKey"); // Set app secret for enhanced security

                ApptroveSDK.initialize(apptroveConfig);

                console.log("✅ Apptrove SDK Initialized");
            } catch (error) {
                console.log("❌ Apptrove Init Error:", error);
            }
            }
        }

        async sendEvent(event?: AnalyticsEvent, payload?: AnalyticsPayload) {

            console.log('📊 Event:', event , "------", payload);

            switch (event) {
            case 'add_to_cart':
                this.track('nr8Ri53bVe', payload);
                break;

            case 'remove_from_cart':
                this.track('cOUkbYcmPO', payload);
                break;

            case 'view_item':
                console.log('📊 Event: case---',"view_item")
                this.track('rqU8Fj2eH2', payload);
                break;

            case 'view_item_list':
                this.track('KGItNYWJwH', payload);
                break;

            case 'view_cart':
                this.track('drsYVcgcAh', payload);
                break;

            case 'begin_checkout':
                this.track('34mjlWJaHL', payload);
                break;

            case 'purchase':
                this.track('jpk3n2mi68', payload);
                break;

            case 'search':
                this.track('mH6sqU7t6u', payload);
                break;

            case 'screen_view':
                this.track('mHJoo2USkp', payload);
                break;

            case 'add_to_wishlist':
                this.track('ePL2CANIYV', payload);
                break;

            case 'remove_from_wishlist':
                this.track('u9zlOUxIuS', payload);
                break;

            case 'login':
                this.track('o91gt1Q0PK', payload);
                break;

            case 'signup':
                this.track('Fs2RFODrwU', payload);
                break;

            case 'select_item':
                this.track('aujWzJaEcv', payload);
                break;

            case 'apply_coupon':
                this.track('CMfNLYL3CO', payload);
                break;

            case 'remove_coupon':
                this.track('rzXoWvrLQZ', payload);
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

        // // ✅ Single reusable Apptrove event sender
        // track(eventId: string, payload?: AnalyticsPayload) {
        //     try {
        //     var apptroveEvent = new ApptroveEvent(eventId); // Built-in event
        //     apptroveEvent.ev = payload; // Custom payload
        //     ApptroveSDK.trackEvent(apptroveEvent);

        //     } catch (error) {
        //     console.error('❌ Apptrove Event Error:', error);
        //     }
        // }

        track(eventId: string, payload?: any) {
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
                const revenue = getNumber(payload.value || payload.sub_total);
                const currency = getString(payload.currency || "USD");

                apptroveEvent.revenue = revenue;
                apptroveEvent.currency = currency;

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

                // 🔹 Fire event
                ApptroveSDK.trackEvent(apptroveEvent);

            } catch (error) {
                console.error("❌ Apptrove Event Error:", error);
            }
        }
    }



   // import { TrackierConfig, TrackierSDK, TrackierEvent } from 'react-native-trackier';
    // import { Platform } from 'react-native';
    // import { AnalyticsTrackerV2 } from '@gauntlet/analytics'
    // import { AnalyticsEvent, AnalyticsPayload, AppConfig } from '@gauntlet/types'


    // export class ApptroveTracker extends AnalyticsTrackerV2  {

    //     async initTracker(config?: AppConfig) {
            
    //         if (Platform.OS === 'android' || Platform.OS === 'ios') {
    //         try {
    //             console.log('Initializing ApptroveTracker initTracker')
    //             const trackierConfig = new TrackierConfig("ee9f21fb-5848-4ed9-8d9c-e4093e6d220c", "development");
    //             TrackierSDK.initialize(trackierConfig);

    //             console.log("✅ Trackier SDK Initialized");
    //             } catch (error) {
    //             console.log("❌ Trackier Init Error:", error);
    //             }
    //         } else {
    //             console.log("⚠️ Trackier not supported on this platform");
    //         }
            
    //     }

    //     async sendEvent(event?: AnalyticsEvent, payload?: AnalyticsPayload) {
    //     // Called for every event (after filtering and mapping)
    //     // Send to your API
    //     // console.log('Initializing ApptroveTracker sendEvent', event, payload)
    //     //     await fetch('https://api.yourservice.com/events', {
    //     //     method: 'POST',
    //     //     headers: { 'Content-Type': 'application/json' },
    //     //     body: JSON.stringify({ event, payload, timestamp: Date.now() }),
    //     //     })

    //     console.log('Initializing ApptroveTracker sendEvent', event, payload)
    //         switch (event) {
    //             case 'add_to_cart':
    //             addToCart(payload);
    //             break;

    //             case 'remove_from_cart':
    //             removeFromCart(payload);
    //             break;

    //             case 'view_item':
    //             viewItem(payload);
    //             break;

    //             case 'view_item_list':
    //             viewItemList(payload);
    //             break;

    //             case 'view_cart':
    //             viewCart(payload);
    //             break;

    //             case 'begin_checkout':
    //             beginCheckout(payload);
    //             break;

    //             case 'purchase':
    //             purchase(payload);
    //             break;

    //             case 'search':
    //             search(payload);
    //             break;

    //             case 'screen_view':
    //             screenView(payload);
    //             break;

    //             case 'add_to_wishlist':
    //             addToWishlist(payload);
    //             break;

    //             case 'remove_from_wishlist':
    //             removeFromWishlist(payload);
    //             break;

    //             case 'login':
    //             login(payload);
    //             break;

    //             case 'signup':
    //             signup(payload);
    //             break;

    //             case 'select_item':
    //             selectItem(payload);
    //             break;

    //             case 'apply_coupon':
    //             applyCoupon(payload);
    //             break;

    //             case 'remove_coupon':
    //             removeCoupon(payload);
    //             break;

    //             default:
    //             console.log('Unhandled event:', event);
    //             break;
    //         }
    //     }

    //     async sendScreenView(screenName?: string) {
    //         // Called on every screen navigation
    //         console.log('Initializing ApptroveTracker sendScreenView')
    //         await fetch('https://api.yourservice.com/pageview', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ screen: screenName }),
    //         })
    //     }

    //     sendTrackierEvents(eventsId, jsonData, params) {
    //         try {
    //         var trackierEvent = new TrackierEvent(eventsId);
    //         trackierEvent.ev = jsonData;
    //         console.log("Tarckier Events---", trackierEvent);
    //         TrackierSDK.trackEvent(trackierEvent);
    //         } catch (error) {
    //         console.error('Error sending Trackier event:', error);
    //         }
    //     }

    //     callApptroveSDK(){
    //         //console.log('Initializing ApptroveTracker with config:', config)
    //         console.log('Initializing ApptroveTracker in AppTroveTrackers.ts')
    //         const trackierConfig = new TrackierConfig("ee9f21fb-5848-4ed9-8d9c-e4093e6d220c", "developemnet");
    //         //trackierConfig.setAppSecret("", "");
    //         TrackierSDK.initialize(trackierConfig);
    //     }


    // }

