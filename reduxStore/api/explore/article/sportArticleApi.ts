import { articleApi } from "./articleApi";

interface Article {
  _id: string;
  title: string;
  content: string;
  isTrending: boolean;
  sportsName: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// type GetArticlesParams = {
//   sportsName?: string;
//   limit?: number;
//   page?: number;
// };

export const sportArticleEndpoint = articleApi.injectEndpoints({
  endpoints: (builder) => ({
    getSportArticle: builder.query<Article[], string | void>({
      query: (sportsName) => ({
        url: sportsName
          ? `/api/v1/explore/get-article?sportsName=${sportsName}`
          : "/api/v1/explore/get-article",
        method: "GET",
      }),
      transformResponse: (response: { data: { articles: Article[] } }) => {
        return response.data.articles;
      },
      keepUnusedDataFor: 300,
      providesTags: ["SportArticle"],
    }),
  }),
});

export const { useGetSportArticleQuery } = sportArticleEndpoint;
