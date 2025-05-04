import { profileApi } from "./profileApi";

export const profileEndpoints = profileApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserPostsByCategory: builder.query<
      any,
      {
        userId: string;
        type?: "all" | "recent" | "polls" | "media" | "thoughts" | "clips";
        limit?: number;
        cursor?: string | null;
      }
    >({
      query: ({ userId, type = "all", limit = 10, cursor }) => ({
        url: `/post/${userId}`,
        params: { type, limit, ...(cursor && { cursor }) },
      }),
      transformResponse: (response: {
        data: any;
        nextCursor: string | null;
      }) => ({
        data: response.data,
        nextCursor: response.nextCursor,
      }),
      keepUnusedDataFor: 10,
      providesTags: ["UserPosts"],
    }),
  }),
});

export const { useLazyGetUserPostsByCategoryQuery } = profileEndpoints;
