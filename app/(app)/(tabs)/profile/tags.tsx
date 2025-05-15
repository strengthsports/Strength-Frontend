import React, { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import ActivityPage from "~/components/profilePage/ActivityPage";
import { useSelector } from "react-redux";

const Mentions = () => {
  const { user } = useSelector((state: any) => state?.profile);

  return <ActivityPage userId={user._id} type="mentions" />;
};

export default Mentions;
