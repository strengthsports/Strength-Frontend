import MediaPage from "~/components/profilePage/MediaPage";

const MediaScreen = ({ hashtag }: { hashtag: string }) => {
  return <MediaPage hashtag={hashtag} pageType="Hashtag" />;
};

export default MediaScreen;
