import React from "react";
import HashtagPosts from "~/components/hashtagPage/HashtagPosts";

const Latest = () => {
  return <HashtagPosts sort={-1} />;
};

export default Latest;
