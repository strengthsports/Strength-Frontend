import axios from "axios";
import { getToken } from "~/utils/secureStore";

// Like or Unlike a comment
export const fetchPostById = async ({ postId }: { postId: string }) => {
  try {
    const token = await getToken("accessToken");
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/id/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw error.response?.data || error;
  }
};
