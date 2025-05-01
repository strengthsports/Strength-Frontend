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
    username: string;
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
  data: { posts: Post[]; nextCursor: string; hasMore: boolean };
  message: string;
  statusCode: number;
  success: boolean;
}

export interface Comment {
  _id: string;
  postedBy: {
    _id: string;
    type: string;
    profilePic: string;
    firstName: string;
    lastName: string;
    headline: string;
    username: string;
  };
  text: string;
  commentsCount: number;
  likesCount: number;
  [key: string]: any;
}
