import { Post } from "~/types/post";
import { getToken } from "~/utils/secureStore";

export const fetchUserPostsAPI = async ({
  userId,
  type,
  limit = 10,
  cursor,
}: {
  userId: string;
  type: string;
  limit?: number;
  cursor?: string;
}): Promise<{ posts: Post[]; nextCursor: string | null; hasMore: boolean }> => {
  const token = await getToken("accessToken");
  if (!token) throw new Error("Token not found");

  const queryParams = new URLSearchParams({
    limit: String(limit),
    type,
    ...(cursor && { cursor }),
  });

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/${userId}?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return {
    posts: data.data || [],
    nextCursor: data.nextCursor ?? null,
    hasMore: data.hasMore,
  };
};
