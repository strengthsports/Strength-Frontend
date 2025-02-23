// src/utils/feedbackUtils.ts
import { Platform, ToastAndroid, Vibration } from "react-native";
import Toast from "react-native-toast-message";

export const vibrationPattern = [0, 50, 80, 50];

/**
 * Provides feedback to the user via toast messages and vibration.
 * @param message - The message to display.
 * @param type - The type of feedback ("error" | "success").
 */
export const showFeedback = (
  message: string,
  type: "error" | "success" = "error"
) => {
  // Vibrate on error
  if (type === "error") {
    Vibration.vibrate(vibrationPattern);
  }

  // Show toast message
  setTimeout(() => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Toast.show({
      type,
      text1: message,
      visibilityTime: 3000,
      autoHide: true,
    });
  }
}, 500);
};