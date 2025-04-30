import { Platform, ToastAndroid, Vibration } from "react-native";
import Toast from "react-native-toast-message";

// Vibration pattern for feedback (in milliseconds)
export const vibrationPattern = [0, 50, 80, 50];

/**
 * Provides feedback to the user via toast messages and vibration.
 * @param message - The message to display.
 * @param type - The type of feedback ("error" | "success" | "info" | "warning").
 * @param duration - How long to show the toast (in milliseconds).
 */
export const showFeedback = (
  message: string,
  type: "error" | "success" | "info" | "warning" = "info",
  duration: number = 3000
) => {
  // Vibrate for error and warning types
  if (type === "error") {
    Vibration.vibrate(vibrationPattern);
  }

  // Show toast message with slight delay to ensure UI is ready
  setTimeout(() => {
    if (Platform.OS === "android" && type === "info") {
      // Use native Android toast for simple info messages
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // Use the custom toast for all other cases
      Toast.show({
        type,
        text1: message,
        visibilityTime: duration,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
      });
    }
  }, 100);
};

/**
 * Shows a success toast with appropriate styling
 * @param message - The success message to display
 * @param duration - How long to show the toast (in milliseconds)
 */
export const showSuccess = (message: string, duration: number = 3000) => {
  showFeedback(message, "success", duration);
};

/**
 * Shows an error toast with appropriate styling and vibration
 * @param message - The error message to display
 * @param duration - How long to show the toast (in milliseconds)
 */
export const showError = (message: string, duration: number = 3000) => {
  showFeedback(message, "error", duration);
};

/**
 * Shows an informational toast
 * @param message - The info message to display
 * @param duration - How long to show the toast (in milliseconds)
 */
export const showInfo = (message: string, duration: number = 3000) => {
  showFeedback(message, "info", duration);
};

/**
 * Shows a warning toast
 * @param message - The warning message to display
 * @param duration - How long to show the toast (in milliseconds)
 */
export const showWarning = (message: string, duration: number = 3000) => {
  showFeedback(message, "warning", duration);
};