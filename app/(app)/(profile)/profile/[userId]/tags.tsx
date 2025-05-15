import React, { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import ActivityPage from "~/components/profilePage/ActivityPage";

const Mentions = () => {
  const params = useLocalSearchParams();
  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);

  console.log(fetchedUserId.id);

  return <ActivityPage userId={fetchedUserId.id} type="mentions" />;
};

export default Mentions;
