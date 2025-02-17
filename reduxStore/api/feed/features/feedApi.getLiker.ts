import { feedApi } from "../services/feedApi";

export interface Liker {
  _id: string;
  firstName: string;
  lastName: string;
  headline: string;
  profilePic: string;
}

interface FetchLikersResponse {
  data: {
    liker: Liker;
  }[];
}

export const likerApi = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchLikers: builder.query<FetchLikersResponse, { targetId: string; targetType: string }>({
      query: ({ targetId, targetType }) => ({
        url: "api/v1/fetchLikers",
        method: "POST",
        body: { targetId, targetType },
      }),
    }),
  }),
});

export const { useFetchLikersQuery } = likerApi;