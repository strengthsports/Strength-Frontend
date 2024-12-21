import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router"; // Import the router for navigation
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";

export default function Index() {
  const router = useRouter();
  const { isLoggedIn, error, msgBackend, status } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    // setIsLoggedIn(false);
    console.log('soon to be implemented')
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
