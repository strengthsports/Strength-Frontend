import React, { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import MediaPage from "~/components/profilePage/MediaPage";

const Media = () => {
  const params = useLocalSearchParams();
  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);

  return <MediaPage userId={fetchedUserId.id} />;
};

export default Media;
