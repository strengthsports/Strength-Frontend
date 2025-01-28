import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

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

export const likerApi = createApi({
  reducerPath: "likerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await getToken("accessToken") // Adjust based on your auth state
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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