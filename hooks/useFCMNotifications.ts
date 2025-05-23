import { useEffect } from "react";
import { Alert } from "react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";

export default function useFCMNotifications() {
  useEffect(() => {
    const setupFCM = async () => {
      try {
        // Request permissions
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log("Authorization status:", authStatus);

          // Get and log FCM token
          const token = await messaging().getToken();
          console.log("FCM Token:", token);
        } else {
          console.log("Permission not granted", authStatus);
        }

        // Handle notification when app is opened from a quit state
        const initialNotification: FirebaseMessagingTypes.RemoteMessage | null =
          await messaging().getInitialNotification();

        if (initialNotification) {
          console.log(
            "Notification caused app to open from quit state:",
            initialNotification.notification
          );
        }

        // App opened from background state by tapping a notification
        const unsubscribeOnNotificationOpened =
          messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log(
              "Notification caused app to open from background state:",
              remoteMessage.notification
            );
          });

        // Background message handler (Android only)
        messaging().setBackgroundMessageHandler(
          async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log("Message handled in the background!", remoteMessage);
          }
        );

        // Foreground message handler
        const unsubscribeOnMessage = messaging().onMessage(
          async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            Alert.alert(
              "New FCM message",
              remoteMessage.notification?.body || JSON.stringify(remoteMessage)
            );
          }
        );

        // Cleanup function: unsubscribe listeners
        return () => {
          unsubscribeOnMessage();
          unsubscribeOnNotificationOpened();
        };
      } catch (error) {
        console.error("FCM setup error:", error);
      }
    };

    const unsubscribePromise = setupFCM();

    return () => {
      // Properly clean up async unsubscribe when the component unmounts
      unsubscribePromise.then((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
    };
  }, []);
}
