import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { number } from "zod";
import { getToken } from "~/utils/secureStore";

// In your feedPostApi.ts
export interface Post {
  _id: string;
  caption: string;
  assets: Array<{ url: string }>;
  postedBy: {
    _id: string;
    type: string;
    profilePic: string;
    firstName: string;
    lastName: string;
    headline: string;
  };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isFollowing: boolean;
}

export interface FeedResponse {
  data: {
    formattedPosts: Post[];
    lastTimestamp: string | null;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export const feedPostApi = createApi({
  reducerPath: "feedPostApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await getToken("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["FeedPost"], // Specify tag types here
  endpoints: (builder) => ({
    getFeedPost: builder.query<
      FeedResponse,
      { limit?: number; lastTimeStamp?: string | null }
    >({
      query: ({ limit = 20, lastTimeStamp }) => ({
        url: "api/v1/get-feed",
        params: {
          limit,
          lastTimeStamp,
        },
      }),
      keepUnusedDataFor: 300, // how long api response is stored in memory after all components using it unmounts, 5 mins || default - 1 min
      providesTags: ["FeedPost"],
    }),
  }),
});

export const { useGetFeedPostQuery } = feedPostApi;
