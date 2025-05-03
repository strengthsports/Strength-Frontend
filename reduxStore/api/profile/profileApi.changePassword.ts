import { profileApi } from "./profileApi";

export const passwordApi = profileApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = passwordApi;
