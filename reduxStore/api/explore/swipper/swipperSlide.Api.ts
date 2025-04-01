import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const swipperSlideApi = createApi({
  reducerPath: "swipperSlideApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["SwipperSlides"],
  endpoints: () => ({}),
});
