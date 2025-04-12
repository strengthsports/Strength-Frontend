import { Post } from "../types/post";

interface User {
  _id: string;
  type: string;
  profilePic: string;
  firstName: string;
  lastName: string;
  headline: string;
  isFollowing: boolean;
}

interface ProcessedData {
  posts: Post[];
  users: User[];
}

const processFeedData = (feedData: Post[]): ProcessedData => {
  const posts: Post[] = [];
  const usersMap: Record<string, User> = {};

  feedData.forEach((post) => {
    // Save post with reference to user id
    posts.push({
      ...post,
      userId: post.postedBy._id, // Change postedBy to just the user id
    });

    // Store the user if not already added
    if (!usersMap[post.postedBy._id]) {
      usersMap[post.postedBy._id] = {
        ...post.postedBy,
        isFollowing: post.isFollowing, // Store follow status
      };
    }
  });

  return { posts, users: Object.values(usersMap) };
};

export default processFeedData;
