import { feedApi } from "../services/feedApi";

export const likeUnlikeApi = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    likeContent: builder.mutation({
      query: (body) => ({
        url: "/post/like",
        method: "POST",
        body,
      }),
    }),
    unLikeContent: builder.mutation({
      query: (body) => ({
        url: "/post/like",
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const { useLikeContentMutation, useUnLikeContentMutation } =
  likeUnlikeApi;
