export interface CommentPostedBy {
    _id: string;
    type: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  }
  
  export interface CommentPostInfo {
    _id: string; // Post ID
    originalPoster: {
      username: string;
    };
  }
  
  export interface CommentWithPostInfo {
    _id: string; // Comment ID
    text: string;
    postedBy: CommentPostedBy;
    postInfo: CommentPostInfo | null;
    createdAt: string; // ISO Date string
  }
  
  export interface UserCommentsState {
    comments: CommentWithPostInfo[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    cursor: string | null;
    hasNextPage: boolean;
  }