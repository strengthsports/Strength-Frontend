// selectors.ts — how your components read data

import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "~/reduxStore";

// Feed selector: full post objects for the feed page
export const makeSelectFeedPosts = createSelector(
  (state: RootState) => state.views.feed.ids,
  (state: RootState) => state.posts.entities,
  (ids, entities) => ids.map((id) => entities[id]!).filter(Boolean)
);

// User selector
export const makeSelectUserPosts = (userId: string, type: string) =>
  createSelector(
    (state: RootState) => state.views.user[userId]?.[type]?.ids ?? [],
    (state: RootState) => state.posts.entities,
    (ids, entities) => ids.map((id) => entities[id]!).filter(Boolean)
  );

// Hashtag selector
export const makeSelectHashtagPosts = (tag: string, type: string) =>
  createSelector(
    (state: RootState) => state.views.hashtag[tag]?.[type]?.ids ?? [],
    (state: RootState) => state.posts.entities,
    (ids, entities) => ids.map((id) => entities[id]!).filter(Boolean)
  );
