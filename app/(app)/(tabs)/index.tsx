import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ToastAndroid,
} from "react-native";
import { useRouter } from "expo-router"; // Import the router for navigation
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import { logoutUser } from "~/reduxStore/slices/user/authSlice";
import Toast from "react-native-toast-message";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    const isAndroid = Platform.OS == "android";

    // setIsLoggedIn(false);
    try {
      const response = await dispatch(logoutUser()).unwrap();
      isAndroid
        ? ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT)
        : Toast.show({
            type: "error",
            text1: "Logged out successfully",
            visibilityTime: 1500,
            autoHide: true,
          });
    } catch (err) {
      console.error("Logout failed:", err);
      isAndroid
        ? ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT)
        : Toast.show({
            type: "error",
            text1: "Logged out successfully",
            visibilityTime: 1500,
            autoHide: true,
          });
    }
  };

  const user = { id: "67667870ba4cfa5c24a3dc0b", type: "User" }; // Example object
  const serializedUser = encodeURIComponent(JSON.stringify(user)); //

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        <ThemedText>Home</ThemedText>
        <TouchableOpacity onPress={handleLogout}>
          <ThemedText>Logout</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`../(main)/profile/${serializedUser}`)}
        >
          <ThemedText>Chats</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen height
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    // backgroundColor: "white", // Optional, can set background color
  },
  innerContainer: {
    alignItems: "center", // Align items in the center horizontally
    gap: 30,
  },
  linkText: {
    // color: "black",
    fontSize: 18,
    marginVertical: 10, // Adds space between the links
  },
});
