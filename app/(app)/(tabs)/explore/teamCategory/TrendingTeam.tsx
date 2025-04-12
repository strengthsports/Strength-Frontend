import React from "react";
import { View } from "react-native";
import TextScallingFalse from "~/components/CentralText";
import ComingSoon from "~/components/explorePage/comingSoon";
// import { ExploreSportsCategoryHeader } from '~/components/explorePage/exploreHeader';

const TrendingTeam = () => {
  return (
    <View className="flex-1 items-center">
      <ComingSoon text="Teams" />
    </View>
  );
};

export default TrendingTeam;
