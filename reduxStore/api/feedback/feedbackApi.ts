// reduxStore/api/feedback/feedbackApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["FeedbackQuestions"],
  endpoints: (builder) => ({
    getFeedbackQuestions: builder.query<any[], void>({
      query: () => "/api/v1/feedback",
      transformResponse: (response: any) => {
        // ✅ Extract the array you actually need
        return response?.data?.questions || [];
      },
      providesTags: ["FeedbackQuestions"],
    }),

    //for submitting response
    submitFeedbackResponses: builder.mutation<void, {
      user: { firstName: string; lastName: string; username: string };
      responses: { questionId: string; questionText: string; answer: string }[];
    }>({
      query: (body) => ({
        url: "/api/v1/feedback/response",
        method: "POST",
        body,
      }),
      // No need to invalidate tags here if you don't want to refetch questions
    }),

    //for fetching the Number of times that username exist in the feedback
    getFeedbackCountByUsername: builder.query<
      { count: number },
      string // username
    >({
      query: (username) =>
        `/api/v1/feedback/count?username=${username}`,
    }),

}),
});

export const { useGetFeedbackQuestionsQuery, useSubmitFeedbackResponsesMutation, useGetFeedbackCountByUsernameQuery, } = feedbackApi;
