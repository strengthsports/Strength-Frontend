import { Post } from "~/types/post";
import { getToken } from "~/utils/secureStore";

export const fetchHashtagPostsAPI = async ({
  hashtag,
  type,
  limit = 10,
  cursor,
}: {
  hashtag: string;
  type: string;
  limit?: number;
  cursor?: string | null;
}): Promise<{ data: Post[]; nextCursor: string | null }> => {
  const token = await getToken("accessToken");
  if (!token) throw new Error("Token not found");

  const queryParams = new URLSearchParams({
    limit: String(limit),
    hashtag,
    ...(cursor && { cursor }),
  });

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/hashtag/${type}?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  console.log(data.data);

  return {
    data: data.data || [],
    nextCursor: data.nextCursor ?? null,
  };
};
