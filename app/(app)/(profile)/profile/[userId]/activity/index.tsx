import React, { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import ActivityPage from "~/components/profilePage/ActivityPage";

const Posts = () => {
  const params = useLocalSearchParams();
  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);

  return <ActivityPage userId={fetchedUserId.id} type="all" />;
};

export default Posts;
