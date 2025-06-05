// hooks.ts  — wiring thunks into the slices
import { createAsyncThunk } from "@reduxjs/toolkit";
import { upsertPosts } from "./postsSlice";
import { setFeedPage, setUserPage, setHashtagPage } from "./viewsSlice";
import { fetchFeedPostsAPI } from "./api/fetchFeedPostsAPI";
import { fetchUserPostsAPI } from "./api/fetchUserPostsAPI";
import { fetchHashtagPostsAPI } from "./api/fetchHashtagPostsAPI";
import { Post } from "~/types/post";
import axios from "axios";
import { getToken } from "~/utils/secureStore";
export interface HashtagPerson {
  _id: string;
  firstName: string;
  lastName: string;
  headline: string;
  profilePic: string;
  type: string;
}

// Feed
export const fetchFeedPosts = createAsyncThunk(
  "feed/fetchFeedPosts",
  async (params: { limit?: number; cursor?: string }, thunkAPI) => {
    // console.log("fetch called");
    const data = await fetchFeedPostsAPI(params);
    thunkAPI.dispatch(upsertPosts(data.posts));
    thunkAPI.dispatch(
      setFeedPage({
        ids: data.posts.map((p: Post) => p._id),
        nextCursor: data.nextCursor,
        hasMore: data.hasMore,
      })
    );
    return data;
  }
);

// User
export const fetchUserPosts = createAsyncThunk(
  "user/fetchUserPosts",
  async (
    params: { userId: string; type: string; limit?: number; cursor?: string },
    thunkAPI
  ) => {
    const data = await fetchUserPostsAPI(params);
    thunkAPI.dispatch(upsertPosts(data.posts));
    thunkAPI.dispatch(
      setUserPage({
        userId: params.userId,
        type: params.type,
        ids: data.posts.map((p: Post) => p._id),
        nextCursor: data.nextCursor,
        hasMore: data.hasMore,
      })
    );
    return data;
  }
);

// Hashtag
export const fetchHashtagPosts = createAsyncThunk(
  "hashtag/fetchHashtagPosts",
  async (
    params: { hashtag: string; type: string; limit?: number; cursor?: string },
    thunkAPI
  ) => {
    const data = await fetchHashtagPostsAPI(params);
    thunkAPI.dispatch(upsertPosts(data.data));
    thunkAPI.dispatch(
      setHashtagPage({
        hashtag: params.hashtag,
        type: params.type,
        ids: data.data.map((p: Post) => p._id),
        nextCursor: data.nextCursor,
      })
    );
    return data;
  }
);

export const fetchHashtagPeople = async ({
  hashtag,
  limit,
  lastTimeStamp,
}: {
  hashtag: string;
  limit: number;
  lastTimeStamp?: string;
}): Promise<{ users: HashtagPerson[]; nextCursor: string | null }> => {
  try {
    const token = await getToken("accessToken");

    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/hashtag/people`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          hashtag,
          limit,
          ...(lastTimeStamp ? { lastTimeStamp } : {}),
        },
      }
    );

    const { data, nextCursor } = response.data;
    return { users: data, nextCursor };
  } catch (error: any) {
    console.error("fetchHashtagPeople error", error);
    throw error.response?.data || error;
  }
};
