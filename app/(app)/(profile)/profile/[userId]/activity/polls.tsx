import React, { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import ActivityPage from "~/components/profilePage/ActivityPage";

const Polls = () => {
  const params = useLocalSearchParams();

  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);

  return <ActivityPage userId={fetchedUserId.id} type="polls" />;
};

export default Polls;
