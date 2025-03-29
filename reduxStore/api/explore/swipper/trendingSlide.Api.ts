import { swipperSlideApi } from "./swipperSlide.Api";

export const swipperEndpoints = swipperSlideApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrendingSwipperSlides: builder.query<any, void>({
      query: () => ({
        url: "/exploreNews/get-trending-swipper",
        method: "GET",
      }),
      transformResponse: (response: { data: any }) =>
        response.data.swipperSlides || [],
      providesTags: ["SwipperSlides"],
    }),
  }),
});

export const { useGetTrendingSwipperSlidesQuery } = swipperEndpoints;
