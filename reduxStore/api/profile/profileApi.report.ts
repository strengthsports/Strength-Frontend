import { profileApi } from "./profileApi";
import { ReportUser } from "~/types/user";

export const reportApi = profileApi.injectEndpoints({
  endpoints: (builder) => ({
    reportUser: builder.mutation<any, ReportUser>({
      query: (body) => ({
        url: "/api/v1/report",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    undoReportUser: builder.mutation<any, Partial<ReportUser>>({
      query: (body) => ({
        url: "/api/v1/undo-report",
        method: "DELETE",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
  }),
});

export const { useReportUserMutation, useUndoReportUserMutation } = reportApi;
