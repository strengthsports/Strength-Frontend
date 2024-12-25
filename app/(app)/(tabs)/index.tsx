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
import { logoutUser } from "@/reduxStore/slices/authSlice";
import Toast from "react-native-toast-message";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    const isAndroid = Platform.OS == "android";

    // setIsLoggedIn(false);
    try {
      await dispatch(logoutUser()).unwrap();
      console.log("Logged out successfully!");
      isAndroid
        ? ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT)
        : Toast.show({
            type: "success",
            text1: "Logged out successfully",
            visibilityTime: 1500,
            autoHide: true,
          });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.linkText}>Home</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.linkText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> router.push('../(main)/home')}>
          <Text style={styles.linkText}>Chats</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen height
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    backgroundColor: "white", // Optional, can set background color
  },
  innerContainer: {
    alignItems: "center", // Align items in the center horizontally
  },
  linkText: {
    color: "black",
    fontSize: 18,
    marginVertical: 10, // Adds space between the links
  },
});
