import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

export const likeUnlikeApi = createApi({
    reducerPath:'likeUnlikeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
        prepareHeaders: async (headers)=>{
            const token = await getToken("accessToken")
            if(token)
                headers.set("Authorization", `Bearer ${token}`)
            return headers
        }

    }),
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