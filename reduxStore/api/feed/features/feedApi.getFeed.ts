import { feedApi } from "../services/feedApi";

export interface Post {
  _id: string;
  caption: string;
  assets: Array<{ url: string }>;
  aspectRatio?: Array<Number>;
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
  isReported: boolean;
}

export interface FeedResponse {
  data: {
    posts: Post[];
    lastTimestamp: string | null;
    nextPage: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export const feedPostApi = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeedPost: builder.query<
      FeedResponse,
      { limit?: number; page?: number; lastTimeStamp?: string | null }
    >({
      query: ({ limit = 10, page = 1, lastTimeStamp }) => ({
        url: "/get-feed",
        params: { limit, page, lastTimeStamp },
      }),
      keepUnusedDataFor: 500, // Cache response for 500 seconds
      providesTags: ["FeedPost"],
    }),
  }),
});

export const { useGetFeedPostQuery } = feedPostApi;
