import { useSelector } from "react-redux";
import MediaPage from "~/components/profilePage/MediaPage";

const Media = () => {
  const { user } = useSelector((state: any) => state?.profile);

  return <MediaPage userId={user._id} />;
};

export default Media;
