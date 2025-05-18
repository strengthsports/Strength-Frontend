// api/commentApi.js
import { feedApi } from "../services/feedApi";

export const handleCommentApi = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchComments: builder.query({
      query: ({ postId, limit = 10, cursor }) => ({
        url: `/post/${postId}/comments`,
        params: { limit, ...(cursor ? { cursor } : {}) },
      }),
    }),
    fetchReplies: builder.query({
      query: ({ commentId, limit = 3, cursor }) => ({
        url: `/post/comments/${commentId}/replies`,
        params: { limit, ...(cursor ? { cursor } : {}) },
      }),
    }),
  }),
});

export const { useLazyFetchCommentsQuery, useLazyFetchRepliesQuery } =
  handleCommentApi;
