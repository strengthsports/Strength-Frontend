import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {

  return (
    <SafeAreaView>
      <ThemedText type="title">Chat Screen</ThemedText>
    </SafeAreaView>
  );
}
