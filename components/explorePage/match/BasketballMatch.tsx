import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";
import BasketballMatchCard from "../matchCard/BasketballMatchCard";

interface BasketballMatchProps {
  liveBasketballMatches: any[];
  recentBasketballMatches: any[];
  isBasketballLiveFetching: boolean;
  isBasketballRecentFetching: boolean;
}

const BasketballMatch = ({
  liveBasketballMatches,
  recentBasketballMatches,
  isBasketballLiveFetching,
  isBasketballRecentFetching,
}: BasketballMatchProps) => {
  // Add a type tag to distinguish
  const combinedMatches = [
    ...(Array.isArray(liveBasketballMatches) ? liveBasketballMatches : []).map(
      (match: any) => ({
        ...match,
        type: "live",
      })
    ),
    ...(Array.isArray(recentBasketballMatches)
      ? recentBasketballMatches
      : []
    ).map((match: any) => ({
      ...match,
      type: "recent",
    })),
  ];

  const isLoading = isBasketballLiveFetching || isBasketballRecentFetching;

  return (
    <View className="mt-4">
      <FlatList
        data={combinedMatches}
        keyExtractor={(item) => item?.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View className="h-[164px] w-[290px] bg-transparent rounded-2xl mr-5 border border-[#454545]">
            {isLoading ? (
              <View className="h-full flex justify-center self-center items-center">
                <ScoresSkeletonLoader />
              </View>
            ) : (
              <BasketballMatchCard match={item} isLive={item.type === "live"} />
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

export default BasketballMatch;

const styles = StyleSheet.create({});
