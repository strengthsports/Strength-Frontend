import { useEffect, useRef } from "react";
import { Alert, Linking, Platform } from "react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
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
        const authStatus = await messaging().hasPermission();
        const granted =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (granted) return true;

        // Request permission
        const newStatus = await messaging().requestPermission();
        const newGranted =
          newStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          newStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!newGranted) {
          Alert.alert(
            "Notifications Disabled",
            "To stay updated, please enable notifications in your device settings.",
            [
              { text: "Cancel", style: "cancel" },
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
            ],
            { cancelable: true }
          );
        }

        return newGranted;
      } catch (err) {
        console.error("Notification permission error", err);
        return false;
      }
    };

    const setupFCM = async () => {
      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) return;

      try {
        const token = await messaging().getToken();
        const cachedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);

        if (token && token !== cachedToken) {
          console.log("New FCM Token:", token);
          await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
          dispatch(sendFcmToken(token));
        } else {
          console.log("Using cached FCM token or no change.");
        }

        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          console.log(
            "Notification caused app to open from quit state:",
            initialNotification.notification
          );
        }

        unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(
          (remoteMessage) => {
            console.log(
              "Notification caused app to open from background state:",
              remoteMessage.notification
            );
          }
        );

        messaging().setBackgroundMessageHandler(
          async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log("Message handled in the background!", remoteMessage);
          }
        );

        unsubscribeOnMessage = messaging().onMessage(
          async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            Alert.alert(
              "New FCM message",
              remoteMessage.notification?.body || JSON.stringify(remoteMessage)
            );
          }
        );

        unsubscribeOnTokenRefresh = messaging().onTokenRefresh(
          async (newToken) => {
            console.log("FCM Token refreshed:", newToken);
            await AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
            dispatch(sendFcmToken(newToken));
          }
        );
      } catch (error) {
        console.error("FCM setup error:", error);
      }
    };

    setupFCM();

    return () => {
      if (unsubscribeOnMessage) unsubscribeOnMessage();
      if (unsubscribeOnNotificationOpened) unsubscribeOnNotificationOpened();
      if (unsubscribeOnTokenRefresh) unsubscribeOnTokenRefresh();
    };
  }, [dispatch]);
}
