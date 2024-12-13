import { Redirect, router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function Index() {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
