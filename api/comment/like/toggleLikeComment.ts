import axios from "axios";
import { getToken } from "~/utils/secureStore";

// Like or Unlike a comment
export const toggleLikeComment = async ({
  commentId,
}: {
  commentId: string;
}) => {
  try {
    const token = await getToken("accessToken");
    const response = await axios.patch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/comment/like`,
      { commentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw error.response?.data || error;
  }
};
