import React from "react";
import { useSelector } from "react-redux";
import ActivityPage from "~/components/profilePage/ActivityPage";

const Polls = () => {
  const { user } = useSelector((state: any) => state?.profile);

  return <ActivityPage userId={user._id} type="polls" />;
};

export default Polls;
