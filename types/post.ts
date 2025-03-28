export interface ReportPost {
  targetId: string;
  targetType: string;
  reason: string;
}

export type Post = {
  _id: string;
  caption: string;
  assets: Array<{ url: string }>;
  aspectRatio: [number, number];
  postedBy: {
    _id: string;
    type: string;
    profilePic: string;
    firstName: string;
    lastName: string;
    headline: string;
  };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isFollowing: boolean;
  isReported: boolean;
  [key: string]: any;
};

export interface FeedResponse {
  data: {
    posts: Post[];
    lastTimestamp: string | null;
    nextPage: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}
