import { feedApi } from "../services/feedApi";

export const hashtagContentApi = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    getHashtagContents: builder.query<
      any,
      {
        hashtag: string;
        type?: "top" | "latest" | "polls" | "media" | "people";
        limit?: number;
        lastTimeStamp?: string | null;
      }
    >({
      query: ({ hashtag, type = "top", limit = 10, lastTimeStamp }) => ({
        url: `/hashtag/${type}`,
        params: { hashtag, limit, lastTimeStamp },
      }),
      transformResponse: (response: {
        data: any;
        nextCursor: string | null;
      }) => ({
        data: response.data,
        nextCursor: response.nextCursor,
      }),
      providesTags: ["HashtagContents"],
    }),
  }),
});

export const { useGetHashtagContentsQuery } = hashtagContentApi;
