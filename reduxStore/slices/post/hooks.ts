// hooks.ts  — wiring thunks into the slices
import { createAsyncThunk } from "@reduxjs/toolkit";
import { upsertPosts } from "./postsSlice";
import { setFeedPage, setUserPage, setHashtagPage } from "./viewsSlice";
import { fetchFeedPostsAPI } from "./api/fetchFeedPostsAPI";
import { fetchUserPostsAPI } from "./api/fetchUserPostsAPI";
import { fetchHashtagPostsAPI } from "./api/fetchHashtagPostsAPI";
import { Post } from "~/types/post";

// Feed
export const fetchFeedPosts = createAsyncThunk(
  "feed/fetchFeedPosts",
  async (params: { limit?: number; cursor?: string }, thunkAPI) => {
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
