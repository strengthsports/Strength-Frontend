import React, { useState } from "react";
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
import BadmintonMatchCard from "../matchCard/BadmintonMatchCard";
import BasketballMatchCard from "../matchCard/BasketballMatchCard";
import ScoresSkeletonLoader from "../../skeletonLoaders/ScoresSkeletonLoader";
import ThisFeatureUnderDev from "~/components/modals/ThisFeatureUnderDev";

interface LiveTrendingMatchProps {
  liveCricketMatches: any[];
  liveFootballMatches: any[];
  liveBasketballMatches: any[];
  isCricketFetching: boolean;
  isFootballFetching: boolean;
  isBasketballFetching: boolean;
}

const TrendingLiveMatch: React.FC<LiveTrendingMatchProps> = ({
  liveCricketMatches,
  liveFootballMatches,
  liveBasketballMatches,
  isCricketFetching,
  isFootballFetching,
  isBasketballFetching,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const isLoading =
    isCricketFetching || isFootballFetching || isBasketballFetching;

  // Combine and mark the type of match
  const combinedMatches = [
    ...(liveCricketMatches || []).map((match) => ({ type: "cricket", match })),
    ...(liveFootballMatches || []).map((match) => ({
      type: "football",
      match,
    })),
    ...(liveBasketballMatches || []).map((match) => ({
      type: "basketball",
      match,
    })),
  ];

  const renderItem = ({ item }: { item: { type: string; match: any } }) => {
    let CardComponent;

    switch (item.type) {
      case "cricket":
        CardComponent = (
          <CricketMatchCard
            match={item.match}
            isLive={true}
            onCardPress={() => setModalVisible(true)}
          />
        );
        break;
      case "football":
        CardComponent = (
          <FootballMatchCard
            match={item.match}
            isLive={true}
            onCardPress={() => setModalVisible(true)}
          />
        );
        break;
      case "basketball":
        CardComponent = (
          <BasketballMatchCard
            match={item.match}
            isLive={true}
            onCardPress={() => setModalVisible(true)}
          />
        );
        break;
      default:
        return null; // Skip unknown types
    }

    return (
      <View className="h-[164px] w-[290px] bg-transparent rounded-2xl mr-5 border border-[#454545]">
        {CardComponent}
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
    <View className="mt-5">
      <FlatList
        data={combinedMatches}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />
      <ThisFeatureUnderDev
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default TrendingLiveMatch;
