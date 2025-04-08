import React from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from "react-native";
import TextScallingFalse from "../../CentralText";
import { Colors } from "~/constants/Colors";
import CricketMatchCard from "../matchCard/CricketMatchCard";
import FootballMatchCard from "../matchCard/FootballMatchCard";
import ScoresSkeletonLoader from "../../skeletonLoaders/ScoresSkeletonLoader";

interface LiveTrendingMatchProps {
  liveCricketMatches: any[];
  liveFootballMatches: any[];
  isCricketFetching: boolean;
  isFootballFetching: boolean;
}

const TrendingLiveMatch: React.FC<LiveTrendingMatchProps> = ({
  liveCricketMatches,
  liveFootballMatches,
  isCricketFetching,
  isFootballFetching,
}) => {
  const isLoading = isCricketFetching || isFootballFetching;

  // Combine and mark the type of match
  const combinedMatches = [
    ...liveCricketMatches.map((match) => ({ type: "cricket", match })),
    ...liveFootballMatches.map((match) => ({ type: "football", match })),
  ];

  const renderItem = ({ item }: { item: { type: string; match: any } }) => {
    return (
      <View className="h-52 w-80 bg-transparent rounded-2xl mr-5 border border-[#454545]">
        {item.type === "cricket" ? (
          <CricketMatchCard match={item.match} isLive={true} />
        ) : (
          <FootballMatchCard match={item.match} isLive={true} />
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="mt-5">
        <ScoresSkeletonLoader />
      </View>
    );
  }

  if (combinedMatches.length === 0) {
    return (
      <View className="mt-5">
        <TextScallingFalse className="text-white self-center text-center mt-4">
          No Live Matches
        </TextScallingFalse>
      </View>
    );
  }

  return (
    <View className="mt-6">
      <FlatList
        data={combinedMatches}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  );
};

export default TrendingLiveMatch;
