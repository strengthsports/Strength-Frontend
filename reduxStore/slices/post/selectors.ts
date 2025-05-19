// selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "~/reduxStore";
import memoize from "lodash.memoize";

//constant empty array reference
const EMPTY_ARRAY: any[] = [];

// Feed selector: full post objects for the feed page
export const makeSelectFeedPosts = createSelector(
  (state: RootState) => state.views.feed.ids ?? EMPTY_ARRAY,
  (state: RootState) => state.posts.entities,
  (ids, entities) => {
    if (ids === EMPTY_ARRAY) return EMPTY_ARRAY;
    return ids.map((id) => entities[id]!).filter(Boolean);
  }
);

// User selector
export const makeSelectUserPosts = memoize((userId: string, type: string) =>
  createSelector(
    [
      (state: RootState) => state.views.user[userId]?.[type]?.ids ?? EMPTY_ARRAY,
      (state: RootState) => state.posts.entities
    ],
    (ids, entities) => {
      if (ids === EMPTY_ARRAY) {
        return EMPTY_ARRAY;
      }
      return ids.map(id => entities[id]!).filter(Boolean);
    }
  ),
  (userId, type) => `${userId}|${type}`
);

// Hashtag selector
export const makeSelectHashtagPosts = memoize((tag: string, type: string) =>
  createSelector(
    [
      (state: RootState) => state.views.hashtag[tag]?.[type]?.ids ?? EMPTY_ARRAY,
      (state: RootState) => state.posts.entities
    ],
    (ids, entities) => {
      if (ids === EMPTY_ARRAY) {
        return EMPTY_ARRAY;
      }
      return ids.map(id => entities[id]!).filter(Boolean);
    }
  ),
  (tag, type) => `${tag}|${type}`
);