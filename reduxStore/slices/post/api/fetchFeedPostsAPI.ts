import { FeedResponse, Post } from "~/types/post";
import { getToken } from "~/utils/secureStore";

export const fetchFeedPostsAPI = async ({
  limit = 10,
  cursor,
}: {
  limit?: number;
  cursor?: string;
}): Promise<{ posts: Post[]; nextCursor: string | null; hasMore: boolean }> => {
  const token = await getToken("accessToken");
  if (!token) throw new Error("Token not found");

  const queryParams = new URLSearchParams({
    limit: String(limit),
    ...(cursor && { cursor }),
  });

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/get-feed?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data: FeedResponse = await response.json();

  return {
    posts: data.data.posts || [],
    nextCursor: data.data.nextCursor ?? null,
    hasMore: data.data.hasMore,
  };
};
