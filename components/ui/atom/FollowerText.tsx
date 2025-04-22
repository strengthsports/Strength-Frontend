import { useMemo } from "react";
import { formatFollowersText } from "@/utils/formatFollowersText";
import TextScallingFalse from "~/components/CentralText";

const FollowerText = ({ user }: { user: any }) => {
  const supportText = useMemo(() => {
    return formatFollowersText(user.followers, user.followerCount);
  }, [user.followers, user.followerCount]);

  return (
    <TextScallingFalse className="text-lg text-[#808080]">
      {supportText}
    </TextScallingFalse>
  );
};

export default FollowerText;
