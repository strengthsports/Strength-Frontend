import { Post } from "./post";

// Types
export interface User {
  id: string;
  email: string;
  type: string;
  username: string | null;
  address: object | null;
  sportsData: { _id: string; name: string }[];
  fetchedUsers: User[];
  selectedSports: string[] | any;
  profilePic: string | null;
  coverPic: string | null;
  headline: string;
  [key: string]: any;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  error: string | null;
  loading: boolean;
  success: boolean;
  status: number | null;
  msgBackend: string | null;
}

export interface OnboardingData {
  headline: any;
  assets: any;
  followings: any;
}

export interface TargetUser {
  targetUserId: string;
  targetUserType: string;
}

export interface ProfileState {
  user: User | null;
  loading: boolean;
  error: string | null;
  msgBackend: string | null;
  posts: Array<any>;
  followings: string[];
  currentPost: Post | null;
  [key: string]: any;
}

export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  headline: string | "";
  dateOfBirth: Date | any | null;
  address: object;
  height: string | null;
  weight: string | null;
  assets: Array<string> | Array<Blob> | Array<File> | null;
}

export interface FollowUser {
  followingId: string;
  followingType: string;
}

export interface BlockUser {
  blockingId: string;
  blockingType: string;
}

export interface UnblockUser {
  blockedId: string;
  blockedType: string;
}

export interface SuggestionUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  headline: string;
  type: string;
  profilePic: string;
  coverPic: string;
  followerCount?: number;
  [key: string]: any;
}

export interface ReportUser {
  targetId: string;
  targetType: string;
  reason: string;
}

export type Member = {
  _id: string;
  type: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  role: string;
};
