
import {getToken,} from "@/utils/secureStore";

export const checkUsernameAvailability = async (username: string) => {
  try {
    const accessToken = await getToken("accessToken");

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/checkUsername`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      }
    );

    const data = await response.json();
    return {
      ok: response.ok,
      data,
      status: response.status,
    };
  } catch (error: any) {
    console.error('Username check failed:', error);
    return {
      ok: false,
      error: error.message || 'Network error',
    };
  }
};
