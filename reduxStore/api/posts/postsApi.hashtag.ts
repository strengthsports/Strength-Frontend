import { postsApi } from "./postsApi";

export const postsByHashtagApi = postsApi.injectEndpoints({
  endpoints: (builder) => ({
    getPostsByHashtag: builder.query<
      any,
      {
        hashtag: string;
        sort?: number;
        limit?: number;
        page?: number;
        lastTimeStamp?: string | null;
      }
    >({
      query: ({ hashtag, sort, limit = 10, page = 1, lastTimeStamp }) => ({
        url: `/post/hashtag/${hashtag}`,
        params: { sort, limit, page, lastTimeStamp },
      }),
      keepUnusedDataFor: 300, // Cache response for 500 seconds
      providesTags: ["PostsByHashtag"],
    }),
    getImagesByHashtag: builder.query<
      any,
      {
        hashtag: string;
        limit?: number;
        skip?: number;
        lastTimeStamp?: string | null;
      }
    >({
      query: ({ hashtag, limit = 10, skip = 0, lastTimeStamp }) => ({
        url: `/hashtag/${hashtag}/images`,
        params: { limit, skip, lastTimeStamp },
      }),
      keepUnusedDataFor: 300, // Cache response for 500 seconds
      providesTags: ["ImagesByHashtag"],
    }),
    getCommentsByHashtag: builder.query<
      any,
      {
        hashtag: string;
        limit?: number;
        skip?: number;
        lastTimeStamp?: string | null;
      }
    >({
      query: ({ hashtag, limit = 10, skip = 0, lastTimeStamp }) => ({
        url: `/hashtag/${hashtag}/comments`,
        params: { limit, skip, lastTimeStamp },
      }),
      keepUnusedDataFor: 300,
      providesTags: ["CommentsByHashtag"],
    }),
    getPeopleByHashtag: builder.query<
      any,
      {
        hashtag: string;
        limit?: number;
        skip?: number;
        page?: number;
        lastTimeStamp?: string | null;
      }
    >({
      query: ({ hashtag, page = 1, limit = 10, skip = 0, lastTimeStamp }) => ({
        url: `/hashtag/${hashtag}/people`,
        params: { page, limit, skip, lastTimeStamp },
      }),
      keepUnusedDataFor: 300,
      providesTags: ["PeopleByHashtag"],
    }),
  }),
});

export const {
  useGetPostsByHashtagQuery,
  useGetCommentsByHashtagQuery,
  useGetImagesByHashtagQuery,
  useGetPeopleByHashtagQuery,
} = postsByHashtagApi;
