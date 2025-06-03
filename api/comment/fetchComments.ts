import axios from "axios";
import { getToken } from "~/utils/secureStore";

/**
 * Fetch comments for a given post with pagination support.
 * @param {{ postId: string; limit?: number; cursor?: string }} params
 * @returns {Promise<any>} The comments data.
 */
export const fetchComments = async ({
  postId,
  limit = 10,
  cursor,
}: {
  postId: string;
  limit?: number;
  cursor?: string;
}) => {
  try {
    const token = await getToken("accessToken");
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/${postId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit,
          ...(cursor ? { cursor } : {}),
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

/**
 * Fetch replies for a given comment with pagination support.
 * @param {{ commentId: string; limit?: number; cursor?: string }} params
 * @returns {Promise<any>} The replies data.
 */
export const fetchReplies = async ({
  commentId,
  limit = 3,
  cursor,
}: {
  commentId: string;
  limit?: number;
  cursor?: string;
}) => {
  try {
    const token = await getToken("accessToken");
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/comments/${commentId}/replies`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit,
          ...(cursor ? { cursor } : {}),
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
