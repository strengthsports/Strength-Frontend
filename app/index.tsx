import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Redirect, useRouter } from "expo-router"; // Import the router for navigation
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const router = useRouter();

  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (isLoggedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(app)/(tabs)" />;
  }
  const handleLogin = () => {
    // const { setIsLoggedIn } = useAuth();
    setIsLoggedIn(true);
    router.push("/(app)/(tabs)")
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.linkText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.linkText}>Loggedin Screen</Text>
        </TouchableOpacity>
      </View>
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
