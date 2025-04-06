import { feedApi } from "../services/feedApi";

export interface Liker {
  _id: string;
  firstName: string;
  lastName: string;
  headline: string;
  profilePic: string;
  type: string;
}

interface FetchLikersResponse {
  data: {
    liker: Liker;
  }[];
}

export const likerApi = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchLikers: builder.query<
      FetchLikersResponse,
      { targetId: string; targetType: string }
    >({
      query: ({ targetId, targetType }) => ({
        url: "/post/fetch-likes",
        method: "POST",
        body: { targetId, targetType },
      }),
    }),
  }),
});

export const { useFetchLikersQuery } = likerApi;
