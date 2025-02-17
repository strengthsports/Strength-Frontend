import { feedApi } from "../services/feedApi";

export const likeUnlikeApi = feedApi.injectEndpoints({
    endpoints: (builder) => ({
        likeContent: builder.mutation({
            query: (body) => ({
                url:"api/v1/createLike",
                method: "POST",
                body,
            })
        }),
        unLikeContent: builder.mutation ({
            query: (body) => ({
                url: "api/v1/deleteLike" ,
                method: "DELETE",
                body,
            })
        })
    })
})

export const { useLikeContentMutation, useUnLikeContentMutation } = likeUnlikeApi;