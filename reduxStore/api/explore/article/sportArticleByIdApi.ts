import { articleApi } from "./articleApi";

interface Article {
  _id: string;
  title: string;
  isTrending: boolean;
  sportsName: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// type GetArticlesParams = {
//   sportsName?: string;
//   limit?: number;
//   page?: number;
// };
export const sportArticleByIdEndpoint = articleApi.injectEndpoints({
  endpoints: (builder) => ({
    getSportArticleById: builder.query<Article, string>({
      query: (id) => ({
        url: `/api/v1/explore/get-article/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: { article: Article } }) => {
        return response.data.article;
      },
      keepUnusedDataFor: 300,
      providesTags: ["SportArticleById"],
    }),
  }),
});

export const { useGetSportArticleByIdQuery } = sportArticleByIdEndpoint;
