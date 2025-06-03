import axios from "axios";
import { getToken } from "~/utils/secureStore";

export interface UserCardData {
  _id: string;
  firstName: string;
  lastName: string;
  headline: string;
  profilePic: string;
  type: string;
}

export interface PaginatedResult {
  users: UserCardData[];
  nextCursor: string | null;
}

const baseURL = `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1`;

const getAuthHeaders = async () => {
  const token = await getToken("accessToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchLikers = async ({
  targetId,
  limit,
  cursor,
}: {
  targetId: string;
  limit: number;
  cursor?: string;
}): Promise<PaginatedResult> => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${baseURL}/post/${targetId}/fetch-likes`, {
    headers,
    params: { limit, ...(cursor && { cursor }) },
  });

  const { likers, nextCursor } = response.data.data;
  return { users: likers, nextCursor };
};

export const fetchFollowers = async ({
  targetUserId,
  limit,
  cursor,
}: {
  targetUserId: string;
  limit: number;
  cursor?: string;
}): Promise<PaginatedResult> => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${baseURL}/findFollowers/${targetUserId}`, {
    headers,
    params: { limit, ...(cursor && { cursor }) },
  });

  const { followers, nextCursor } = response.data.data;
  return { users: followers, nextCursor };
};

export const fetchFollowings = async ({
  targetUserId,
  limit,
  cursor,
}: {
  targetUserId: string;
  limit: number;
  cursor?: string;
}): Promise<PaginatedResult> => {
  const headers = await getAuthHeaders();
  const response = await axios.get(
    `${baseURL}/findFollowings/${targetUserId}`,
    {
      headers,
      params: { limit, ...(cursor && { cursor }) },
    }
  );

  const { followings, nextCursor } = response.data.data;
  return { users: followings, nextCursor };
};
