// postActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "~/reduxStore";
import {
  removePost,
  selectPostById,
  updatePost,
  upsertPosts,
} from "./postsSlice";
import { getToken } from "~/utils/secureStore";

// 1️⃣ Toggle Like
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (
    { targetId, targetType }: { targetId: string; targetType: string },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const post = selectPostById(state, targetId);
    if (!post) throw new Error("Post not found");

    const updatedPost = {
      ...post,
      isLiked: !post.isLiked,
      likesCount: post.likesCount + (post.isLiked ? -1 : 1),
    };

    dispatch(updatePost({ id: updatedPost._id, changes: updatedPost }));

    const reqType = post.isLiked ? "DELETE" : "POST";
    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/like`,
        {
          method: reqType,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({ targetId, targetType }),
        }
      );

      if (!response.ok) throw new Error("Failed to like post");

      return updatedPost;
    } catch (error) {
      dispatch(updatePost({ id: post._id, changes: post }));
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to like post"
      );
    }
  }
);

// 2️⃣ Delete Post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (
    { postId }: { postId: string },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const post = selectPostById(state, postId);
    if (!post) throw new Error("Post not found");

    dispatch(removePost(postId));

    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({ postId }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete post");
    } catch (error) {
      dispatch(upsertPosts([post]));
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete post"
      );
    }
  }
);

// 3️⃣ Post Comment
export const postComment = createAsyncThunk(
  "posts/postComment",
  async (
    {
      postId,
      parentCommentId,
      text,
    }: { postId: string; parentCommentId?: string; text: string },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const post = selectPostById(state, postId);
    if (!post) throw new Error("Post not found");

    const updatedPost = {
      ...post,
      commentsCount: post.commentsCount + 1,
    };
    dispatch(updatePost({ id: postId, changes: updatedPost }));

    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Authorization token not found");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ postId, parentCommentId, text }),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment");

      return response.json();
    } catch (error) {
      dispatch(updatePost({ id: postId, changes: post }));
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to post comment"
      );
    }
  }
);

// 4️⃣ Delete Comment
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async (
    { postId, commentId }: { postId: string; commentId?: string },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const post = selectPostById(state, postId);
    if (!post) throw new Error("Post not found");

    const updatedPost = {
      ...post,
      commentsCount: post.commentsCount - 1,
    };
    dispatch(updatePost({ id: postId, changes: updatedPost }));

    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Authorization token not found");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/comment`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ postId, commentId }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete comment");

      return response.json();
    } catch (error) {
      dispatch(updatePost({ id: postId, changes: post }));
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete comment"
      );
    }
  }
);

// 5️⃣ Vote in Poll
export const voteInPoll = createAsyncThunk(
  "posts/voteInPoll",
  async (
    {
      targetId,
      targetType,
      selectedOption,
    }: { targetId: string; targetType: string; selectedOption: number },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const post = selectPostById(state, targetId);
    if (!post) throw new Error("Post not found");

    const updatedPost = {
      ...post,
      isVoted: true,
      votedOption: selectedOption,
    };
    dispatch(updatePost({ id: targetId, changes: updatedPost }));

    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Authorization token not found");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetId, targetType, selectedOption }),
        }
      );

      if (!response.ok) throw new Error("Failed to vote in the poll");

      return updatedPost;
    } catch (error) {
      dispatch(updatePost({ id: targetId, changes: post }));
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to vote in the poll"
      );
    }
  }
);
