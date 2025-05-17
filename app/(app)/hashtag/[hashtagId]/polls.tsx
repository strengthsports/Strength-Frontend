import React, { useEffect, useState } from "react";
import HashtagPosts from "~/components/hashtagPage/HashtagPosts";
import { View, Text, ActivityIndicator } from "react-native";
import { Colors } from "~/constants/Colors";

const LatestScreen = ({ hashtag }: { hashtag: string }) => {
  const [showPosts, setShowPosts] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowPosts(true);
    }, 0); // next frame

    return () => clearTimeout(timeout);
  }, []);

  return showPosts ? (
    <HashtagPosts type="polls" hashtag={hashtag} />
  ) : (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={Colors.themeColor} />
    </View>
  );
};

export default LatestScreen;
