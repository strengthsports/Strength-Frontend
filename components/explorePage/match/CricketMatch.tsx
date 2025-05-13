import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";
import CricketMatchCard from "../matchCard/CricketMatchCard";

interface CricketMatchProps {
  liveCricketMatches: any[];
  recentCricketMatches: any[];
  isCricketLiveFetching: boolean;
  isCricketRecentFetching: boolean;
}

const CricketMatch = ({
  liveCricketMatches,
  recentCricketMatches,
  isCricketLiveFetching,
  isCricketRecentFetching,
}: CricketMatchProps) => {
  // Add a type tag to distinguish
  const combinedMatches = [
    ...(Array.isArray(liveCricketMatches) ? liveCricketMatches : []).map(
      (match: any) => ({
        ...match,
        type: "live",
      })
    ),
    ...(Array.isArray(recentCricketMatches) ? recentCricketMatches : []).map(
      (match: any) => ({
        ...match,
        type: "recent",
      })
    ),
  ];

  const isLoading = isCricketLiveFetching || isCricketRecentFetching;

  return (
    <View className="mt-4">
      <FlatList
        data={combinedMatches}
        keyExtractor={(item) =>
          `${item.type}-${item?.matchInfo?.matchId.toString()}`
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <View className="h-[164px] w-[290px] bg-transparent rounded-2xl mr-5 border border-[#454545]">
            {isLoading ? (
              <View className="h-full flex justify-center self-center items-center">
                <ScoresSkeletonLoader />
              </View>
            ) : (
              <CricketMatchCard match={item} isLive={item.type === "live"} />
            )}
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
    </View>
  );
};

export default CricketMatch;

const styles = StyleSheet.create({});
