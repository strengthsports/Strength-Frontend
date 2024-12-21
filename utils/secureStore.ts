import * as SecureStore from "expo-secure-store";

// Save a value to SecureStore, ensuring it's a string
export const saveToken = async (key: string, value: any) => {
  if (typeof value !== "string") {
    value = JSON.stringify(value); // Convert non-string values to JSON strings
  }
  await SecureStore.setItemAsync(key, value);
};

// Retrieve a value from SecureStore, and optionally parse JSON if applicable
export const getToken = async (key: string) => {
  const value = await SecureStore.getItemAsync(key);
  try {
    return value ? JSON.parse(value) : null; // Try parsing as JSON
  } catch {
    return value; // Return as string if parsing fails
  }
};

// Remove a value from SecureStore
export const removeToken = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};
