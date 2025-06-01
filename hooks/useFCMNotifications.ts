import { useEffect, useRef } from "react";
import { Alert, Linking, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "@/reduxStore/hooks";
import { sendFcmToken } from "@/reduxStore/slices/user/authSlice";

const FCM_TOKEN_KEY = "FCM_TOKEN_KEY";

export default function useFCMNotifications() {
  const dispatch = useAppDispatch();
  const hasSetupFCM = useRef(false);

  useEffect(() => {
    if (hasSetupFCM.current) return;
    hasSetupFCM.current = true;

    let unsubscribeOnMessage: (() => void) | null = null;
    let unsubscribeOnNotificationOpened: (() => void) | null = null;
    let unsubscribeOnTokenRefresh: (() => void) | null = null;

    const requestNotificationPermission = async (): Promise<boolean> => {
      try {
        // Use Firebase's permission request for both platforms
        const authStatus = await messaging().requestPermission();

        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          Alert.alert(
            "Notifications Disabled",
            "Please enable notifications in your device settings to stay updated.",
            [
              {
                text: "Open Settings",
                onPress: () => {
                  if (Platform.OS === "ios") {
                    Linking.openURL("app-settings:");
                  } else {
                    Linking.openSettings();
                  }
                },
              },
              { text: "Cancel", style: "cancel" },
            ]
          );
        }

        return enabled;
      } catch (err) {
        console.error("Notification permission error", err);
        return false;
      }
    };

    const getFCMToken = async (): Promise<string | undefined> => {
      try {
        // Critical for iOS - must register device first
        if (Platform.OS === "ios") {
          await messaging().registerDeviceForRemoteMessages();

          // Check if we have APNs token (required for iOS)
          const apnsToken = await messaging().getAPNSToken();
          if (!apnsToken) {
            console.warn("APNs token not available yet - retrying...");
            return undefined;
          }
        }

        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        return token;
      } catch (error) {
        console.error("Failed to get FCM token:", error);
        return undefined;
      }
    };

    const setupFCM = async () => {
      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) return;

      try {
        // Initial token fetch
        let token = await getFCMToken();

        // Retry mechanism for iOS (APNs might take time to register)
        if (!token && Platform.OS === "ios") {
          const maxRetries = 5;
          let retryCount = 0;

          const retryInterval = setInterval(async () => {
            retryCount++;
            token = await getFCMToken();

            if (token || retryCount >= maxRetries) {
              clearInterval(retryInterval);
              if (token) {
                await handleNewToken(token);
              } else {
                console.error("Failed to get FCM token after retries");
              }
            }
          }, 3000); // Retry every 3 seconds
        } else if (token) {
          await handleNewToken(token);
        }

        // Listen for foreground messages
        unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
          console.log("Foreground message:", remoteMessage);
          // Handle your foreground messages here
        });

        // Listen for notification opened from background
        unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(
          (remoteMessage) => {
            console.log("Notification opened from background:", remoteMessage);
          }
        );

        // Check if app was opened from a notification
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          console.log("App opened from notification:", initialNotification);
        }

        // Token refresh listener
        unsubscribeOnTokenRefresh = messaging().onTokenRefresh(
          async (newToken) => {
            console.log("FCM token refreshed:", newToken);
            await handleNewToken(newToken);
          }
        );

        // Background handler
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          console.log("Background message:", remoteMessage);
        });
      } catch (error) {
        console.error("FCM setup error:", error);
      }
    };

    const handleNewToken = async (token: string) => {
      const cachedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
      if (token !== cachedToken) {
        await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
        dispatch(sendFcmToken(token));
        console.log("New FCM token saved and sent to server");
      }
    };

    setupFCM();

    return () => {
      unsubscribeOnMessage?.();
      unsubscribeOnNotificationOpened?.();
      unsubscribeOnTokenRefresh?.();
    };
  }, [dispatch]);
}
