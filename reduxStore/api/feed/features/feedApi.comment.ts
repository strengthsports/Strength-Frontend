// api/commentApi.js
import { feedApi } from "../services/feedApi";

export const handleCommentApi = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    postComment: builder.mutation({
      query: (body) => ({
        url: "/post/comment",
        method: "POST",
        body,
      }),
    }),
    deleteComment: builder.mutation({
      query: ({ commentId, targetId, targetType }) => ({
        url: "/post/comment",
        method: "DELETE",
        body: { commentId, targetId, targetType },
      }),
    }),
    fetchComments: builder.query({
      query: ({ targetId, targetType }) => ({
        url: "/post/fetch-comments",
        method: "POST", // Use POST to send data in the body
        body: { targetId, targetType },
      }),
    }),
  }),
});

export const {
  usePostCommentMutation,
  useDeleteCommentMutation,
  useFetchCommentsQuery,
} = handleCommentApi;
