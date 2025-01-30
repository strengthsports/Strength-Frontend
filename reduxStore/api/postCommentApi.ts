// api/commentApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from "~/utils/secureStore";

export const postCommentApi = createApi({
  reducerPath: 'postCommentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
    prepareHeaders: async (headers)=>{
        const token = await getToken("accessToken")
        if(token)
            headers.set("Authorization", `Bearer ${token}`)
        return headers
    }
    }),
  endpoints: (builder) => ({
    postComment: builder.mutation({
      query: (body) => ({
        url: 'api/v1/postComment',
        method: 'POST',
        body,
      }),
    }),
    deleteComment: builder.mutation({
      query: (body) => ({
        url: 'api/v1/deleteComment',
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

export const { usePostCommentMutation, useDeleteCommentMutation } = postCommentApi;