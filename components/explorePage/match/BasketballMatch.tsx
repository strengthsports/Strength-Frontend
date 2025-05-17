import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState } from "react";
import TextScallingFalse from "~/components/CentralText";
import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";
import BasketballMatchCard from "../matchCard/BasketballMatchCard";
import ThisFeatureUnderDev from "~/components/modals/ThisFeatureUnderDev";

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
  const [modalVisible, setModalVisible] = useState(false);
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
        keyExtractor={(item) => item?.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <View className="h-[164px] w-[290px] bg-transparent rounded-2xl mr-5 border border-[#454545]">
            <BasketballMatchCard
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

export default BasketballMatch;

const styles = StyleSheet.create({});
