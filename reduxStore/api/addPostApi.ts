import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

export interface AddPostRequest { //not used in this file but in UI
    assets: string[];
    caption: string;
  }
export const addPostApi = createApi({
  reducerPath: "addPostApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await getToken("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["addPost"],
  endpoints: (builder) => ({
    addPost: builder.mutation({
        query:({ assets, caption }) => ({
            url: 'api/v1/createPost',
            method: 'POST',
            body: { assets, caption },
        }),
        invalidatesTags: ["addPost"], // Invalidate cache for posts after adding a new one
    })
  }),
});

export const { useAddPostMutation } = addPostApi;