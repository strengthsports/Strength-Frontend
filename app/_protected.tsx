import { Slot, Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedLayout() {
  const { isLoggedIn } = useAuth();

  // Redirect to login if the user is not authenticated
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  // Render child routes if authenticated
  return <Slot />;
}
