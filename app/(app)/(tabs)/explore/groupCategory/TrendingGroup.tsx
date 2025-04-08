import React from "react";
import { View } from "react-native";
import TextScallingFalse from "~/components/CentralText";
import ComingSoon from "~/components/explorePage/comingSoon";
// import { ExploreSportsCategoryHeader } from '~/components/explorePage/exploreHeader';

const TrendingGroup = () => {
  return (
    <View className="flex-1">
      <ComingSoon text="Groups" />
    </View>
  );
};

export default TrendingGroup;
