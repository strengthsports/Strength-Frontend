import React from "react";
import { useSelector } from "react-redux";
import ActivityPage from "~/components/profilePage/ActivityPage";

const Clips = () => {
  const { user } = useSelector((state: any) => state?.profile);

  return <ActivityPage userId={user._id} type="clips" />;
};

export default Clips;
