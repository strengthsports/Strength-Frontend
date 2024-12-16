import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { Redirect, useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState("");
  const { login, error, status, msgBackend, isLoggedIn } = useAuth();

  const router = useRouter();
  const handleLogin = async () => {
    if (!email || !password) {
      setInputError("Both email and password are required.");
      return;
    }

    setInputError(""); // Clear input validation errors

    try {
      await login(email, password);
      router.push('/(app)/(tabs)')
    } catch (err) {
      if (err instanceof Error) {
        console.error("Login failed:", err.message);
      } else {
        console.error("Login failed:", err);
      }
    } finally {
      if (isLoggedIn) { <Redirect href="/(app)/(tabs)" />}
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Login
      </ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {inputError ? <Text style={styles.error}>{inputError}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {/* {status && (
        <Text style={status === 200 ? styles.success : styles.error}>
          {status === 200 ? `` : `Error: ${msgBackend}`}
        </Text>
      )} */}
      <Button title="Login" onPress={handleLogin} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  success: {
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
});
