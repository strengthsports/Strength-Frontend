import { feedApi } from '../services/feedApi'; // Import the base feedApi

export const deletePostApi = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    deletePost: builder.mutation({
      query: (postId) => ({
        url: '/api/v1/deletePost',
        method: 'DELETE',
        body: { postId },
      }),
      invalidatesTags: ['FeedPost'],
    }),
  }),
});

export const { useDeletePostMutation } = deletePostApi;