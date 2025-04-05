import React from "react";
import { View } from "react-native";
import TextScallingFalse from "~/components/CentralText";
// import { ExploreSportsCategoryHeader } from '~/components/explorePage/exploreHeader';

const TrendingTeam = () => {
  return (
    <View className="flex items-center my-12 ">
      <TextScallingFalse className="text-white ">
        Trending Team
      </TextScallingFalse>
    </View>
  );
};

export default TrendingTeam;
