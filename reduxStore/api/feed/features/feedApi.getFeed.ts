import { feedApi } from "../services/feedApi";

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
  isReported: boolean;
}

export interface FeedResponse {
  data: {
    posts: Post[];
    lastTimestamp: string | null;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export const feedPostApi = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeedPost: builder.query<
      FeedResponse,
      { limit?: number; lastTimeStamp?: string | null }
    >({
      query: ({ limit = 20, lastTimeStamp }) => ({
        url: "api/v1/get-feed",
        params: { limit, lastTimeStamp },
      }),
      keepUnusedDataFor: 300, // Cache response for 5 minutes
      providesTags: ["FeedPost"],
    }),
  }),
});

export const { useGetFeedPostQuery } = feedPostApi;
