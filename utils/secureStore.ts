import * as SecureStore from "expo-secure-store"

export const saveToken = async (key: string, value: any) => {
  if (typeof value !== "string") {
    value = JSON.stringify(value)
  }
  await SecureStore.setItemAsync(key, value)
}

export const getToken = async (key: string) => {
  const value = await SecureStore.getItemAsync(key)
  return value
  // try {
  //   return value ? JSON.parse(value) : null; // Try parsing as JSON
  // } catch {
  //   return value; // Return as string if parsing fails
  // }
}

export const removeToken = async (key: string) => {
  await SecureStore.deleteItemAsync(key)
}
