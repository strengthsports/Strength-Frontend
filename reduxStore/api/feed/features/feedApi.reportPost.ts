import { ReportPost } from "~/types/post";
import { feedApi } from "../services/feedApi"; // Import the base feedApi

export const reportPostApi = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    reportPost: builder.mutation<any, ReportPost>({
      query: (body) => ({
        url: "/report",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    undoReportPost: builder.mutation<any, Partial<ReportPost>>({
      query: (body) => ({
        url: "/report",
        method: "DELETE",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
  }),
});

export const { useReportPostMutation, useUndoReportPostMutation } =
  reportPostApi;
