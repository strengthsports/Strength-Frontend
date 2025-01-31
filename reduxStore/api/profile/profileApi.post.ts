import { FeedResponse } from "../feedPostApi";
import { profileApi } from "./profileApi";
import { TargetUser, User } from "~/types/user";

export const profileEndpoints = profileApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecificUserPost: builder.query<
      any,
      {
        postedBy: string;
        postedByType: string;
        limit?: number;
        skip?: number;
        lastTimestamp?: string | null;
      }
    >({
      query: ({ postedBy, postedByType, limit, skip, lastTimestamp }) => ({
        url: "/api/v1/specific-user-posts",
        method: "POST",
        body: { postedBy, postedByType },
        params: { limit, skip, lastTimestamp },
      }),
      transformResponse: (response: { data: any }) => {
        console.log(response);
        return response.data.formattedPosts;
      },
      keepUnusedDataFor: 300,
      providesTags: ["UserPosts"],
    }),
  }),
});

export const { useLazyGetSpecificUserPostQuery } = profileEndpoints;
