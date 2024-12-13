import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  const handleLogin = () => {
    // Implement actual login logic
    // For now, just navigate to home
    setIsLoggedIn(true);
    router.replace("/(app)/(tabs)");
  };

  return (
    <SafeAreaView>
      <ThemedText type="title">Login</ThemedText>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </SafeAreaView>
  );
}
