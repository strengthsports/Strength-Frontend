import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await getToken("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Teams"],
  endpoints: (builder) => ({
    // Search teams endpoint
    searchTeams: builder.query<
      {
        teams: any[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalTeams: number;
        };
      },
      {
        search?: string;
        page?: number;
        limit?: number;
        sportId?: string;
        gender?: string;
      }
    >({
      query: (params) => ({
        url: "/api/v1/teams/all-teams",
        method: "GET",
        params: {
          search: params.search,
          page: params.page || 1,
          limit: params.limit || 10,
          sportId: params.sportId,
          gender: params.gender,
        },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.teams.map(({ _id }) => ({ type: "Teams" as const, _id })),
              { type: "Teams", id: "LIST" },
            ]
          : [{ type: "Teams", id: "LIST" }],
    }),

    // Get team details endpoint
    getTeamDetails: builder.query<
      {
        team: any;
        isRequested: boolean;
        isSupporting: boolean;
      },
      string
    >({
      query: (teamId) => ({
        url: `/api/v1/teams/${teamId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, teamId) => [{ type: "Teams", id: teamId }],
    }),

    // Create team endpoint
    createTeam: builder.mutation<
      {
        team: any;
      },
      FormData
    >({
      query: (body) => ({
        url: "/api/v1/teams",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Teams", id: "LIST" }],
    }),

    // Update team endpoint
    updateTeam: builder.mutation<
      {
        team: any;
      },
      {
        teamId: string;
        body: FormData;
      }
    >({
      query: ({ teamId, body }) => ({
        url: `/api/v1/teams/${teamId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: "Teams", id: teamId },
      ],
    }),

    // Delete team endpoint
    deleteTeam: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      string
    >({
      query: (teamId) => ({
        url: `/api/v1/teams/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, teamId) => [
        { type: "Teams", id: teamId },
        { type: "Teams", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useSearchTeamsQuery,
  useLazySearchTeamsQuery,
  useGetTeamDetailsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamApi;