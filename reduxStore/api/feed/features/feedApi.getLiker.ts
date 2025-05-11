import { feedApi } from "../services/feedApi";

export interface Liker {
  _id: string;
  firstName: string;
  lastName: string;
  headline: string;
  profilePic: string;
  type: string;
}

export const likerApi = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchLikers: builder.query<
      any,
      { targetId: string; limit: number; cursor?: string | null }
    >({
      query: ({ targetId, limit, cursor }) => ({
        url: `/post/${targetId}/fetch-likes`,
        params: { limit, ...(cursor && { cursor }) },
      }),
      transformResponse: (response: { data: any }) => ({
        users: response.data.likers,
        nextCursor: response.data.nextCursor,
      }),
    }),
  }),
});

export const { useLazyFetchLikersQuery } = likerApi;
