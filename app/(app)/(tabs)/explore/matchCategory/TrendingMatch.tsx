import React from "react";
import { View } from "react-native";
import TextScallingFalse from "~/components/CentralText";
// import { ExploreSportsCategoryHeader } from '~/components/explorePage/exploreHeader';

const TrendingMatch = () => {
  return (
    <View className="flex items-center my-12 ">
      <TextScallingFalse className="text-white ">
        Trending Match
      </TextScallingFalse>
    </View>
  );
};

export default TrendingMatch;
