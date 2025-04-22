export const formatFollowersText = (
  followers: { firstName: string }[],
  followerCount: number
): string => {
  if (followerCount === 1) {
    return `${followers[0]?.firstName ?? "Someone"} supports`;
  }

  if (followerCount === 2) {
    const names = followers.slice(0, 2).map((f) => f.firstName);
    return `${names.join(" and ")} support`;
  }

  if (followerCount > 2) {
    const names = followers.slice(0, 2).map((f) => f.firstName);
    const others = followerCount - 2;
    return `${names.join(", ")} and ${others} others support`;
  }

  return ""; // fallback for followerCount = 0
};
