import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState } from "react";
import TextScallingFalse from "~/components/CentralText";
import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";
import FootballMatchCard from "../matchCard/FootballMatchCard";
import ThisFeatureUnderDev from "~/components/modals/ThisFeatureUnderDev";

interface FootballMatchProps {
  liveFootballMatches: any[];
  recentFootballMatches: any[];
  isFootballLiveFetching: boolean;
  isFootballRecentFetching: boolean;
}

const FootballMatch = ({
  liveFootballMatches,
  recentFootballMatches,
  isFootballLiveFetching,
  isFootballRecentFetching,
}: FootballMatchProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  // Add a type tag to distinguish
  const combinedMatches = [
    ...(Array.isArray(liveFootballMatches) ? liveFootballMatches : []).map(
      (match: any) => ({
        ...match,
        type: "live",
      })
    ),
    ...(Array.isArray(recentFootballMatches) ? recentFootballMatches : []).map(
      (match: any) => ({
        ...match,
        type: "recent",
      })
    ),
  ];

  const isLoading = isFootballLiveFetching || isFootballRecentFetching;

  if (isLoading)
    return (
      <View className="h-full flex justify-center self-center items-center">
        <ScoresSkeletonLoader />
      </View>
    );

  return (
    <View className="mt-4">
      <FlatList
        data={combinedMatches}
        keyExtractor={(item) => item?.fixture?.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <View className="h-[164px] w-[290px] bg-transparent rounded-2xl mr-5 border border-[#454545]">
            <FootballMatchCard
              match={item}
              isLive={item.type === "live"}
              onCardPress={() => setModalVisible(true)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="w-screen justify-center mt-10">
            <TextScallingFalse className="text-white self-center text-center pr-7">
              No live or recent matches available
            </TextScallingFalse>
          </View>
        }
      />
      <ThisFeatureUnderDev
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default FootballMatch;

const styles = StyleSheet.create({});
