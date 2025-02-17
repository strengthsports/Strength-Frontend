import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";
import { feedApi } from "../services/feedApi";

export interface AddPostRequest { //not used in this file but in UI
    assets: string[];
    caption: string;
  }
  export const addPostApi = feedApi.injectEndpoints({
    endpoints: (builder) => ({
      addPost: builder.mutation({
        query: (formData) => ({
          url: 'api/v1/createPost',
          method: 'POST',
          body: formData,
          // Set the headers for multipart/form-data

        }),
        invalidatesTags: ["addPost"], // Invalidate cache for posts after adding a new one
      }),
    }),
  });
  
  export const { useAddPostMutation } = addPostApi;