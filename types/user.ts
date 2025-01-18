// Types
export interface User {
  id: string;
  email: string;
  type: string;
  username: string | null;
  address: object | null;
  sportsData: { _id: string; name: string }[];
  fetchedUsers: User[];
  selectedSports: string[];
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
  sports: any;
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
}

export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  headline: string | "";
  dateOfBirth: Date | null;
  address: object;
  height: string | null;
  weight: string | null;
  assets: Array<object> | Array<string> | null;
}
