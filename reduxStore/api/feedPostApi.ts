import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { number } from "zod";
import { getToken } from "~/utils/secureStore";

interface FeedResponse {
    posts: Post[];
    lastTimestamp: string | null;
}
interface Post {
    _id: string;
    content: string;
    createdAt: string;
  }
  
export const feedPostApi = createApi({
    reducerPath: 'feedPostApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
        prepareHeaders: async (headers) => {
            const token = await getToken("accessToken");
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
          }
        }),
    endpoints: (builder) => ({
        getFeedPost: builder.query<FeedResponse, {limit?: number; lastTimeStamp?: string | null}>({
            query:({ limit = 20, lastTimeStamp }) => ({
                url: 'api/v1/get-feed',
                params: {
                    limit,
                    lastTimeStamp
                }
              }),
            //   providesTags: ['Feed'],
        })
    })
})

export const { useGetFeedPostQuery } = feedPostApi;
