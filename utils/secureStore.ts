import * as SecureStore from "expo-secure-store";

// Token
export const saveToken = async (key: string, value: any) => {
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  await SecureStore.setItemAsync(key, value);
};

export const getToken = async (key: string) => {
  const value = await SecureStore.getItemAsync(key);
  return value;
  // try {
  //   return value ? JSON.parse(value) : null; // Try parsing as JSON
  // } catch {
  //   return value; // Return as string if parsing fails
  // }
};

export const removeToken = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

// Token expiry
export const setExpiry = async () => {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  console.log("Set expiry ", expiresAt);
  await SecureStore.setItemAsync("expiresAt", expiresAt.toString());
};

export const getExpiry = async () => {
  const value = await SecureStore.getItemAsync("expiresAt");
  return value;
};

export const saveRToken = async (key: string, value: any) => {
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  await SecureStore.setItemAsync(key, value);
};

export const getRToken = async (key: string) => {
  const value = await SecureStore.getItemAsync(key);
  return value;
};

export const removeRToken = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

// Logged in user
export const saveUserId = async (key: string, value: any) => {
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  await SecureStore.setItemAsync(key, value);
};

export const getUserId = async (key: string) => {
  const value = await SecureStore.getItemAsync(key);
  return value;
};

export const removeUserId = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};
