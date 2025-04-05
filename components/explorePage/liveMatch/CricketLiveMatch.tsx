import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import TextScallingFalse from "../../CentralText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CricketMatchCard from "../matchCard/CricketMatchCard";
import ScoresSkeletonLoader from "../../skeletonLoaders/ScoresSkeletonLoader";
import { useGetCricketMatchesQuery } from "~/reduxStore/api/explore/cricketApi";

const {
  data: cricketData,
  isFetching: isCricketFetching,
  refetch: refetchLiveCricket,
} = useGetCricketMatchesQuery({});
const { liveMatches: liveCricketMatches, nextMatch: nextCricketMatches } =
  cricketData || {};

const CricketLiveMatch = () => {
  return (
    <View className="mt-7">
      <View className="flex-row items-center justify-between pl-7 pr-10 mb-4">
        <View className="flex-row items-center ">
          <TextScallingFalse className="text-white text-6xl font-bold">
            Matches
          </TextScallingFalse>
          <MaterialCommunityIcons
            name="chevron-double-right"
            size={22}
            color="white"
            className="-mb-1"
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={refetchLiveCricket}
          style={{
            width: 40,
            height: 20,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <MaterialCommunityIcons
            name="reload"
            size={22}
            color="grey"
            className="-mb-1"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={liveCricketMatches}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View className="h-52 w-96 bg-transparent rounded-2xl mr-5 border border-[#454545] ">
            {isCricketFetching ? (
              <View className="h-full flex justify-center self-center items-center">
                {/* <ActivityIndicator size="large" color={Colors.themeColor} /> */}
                <ScoresSkeletonLoader />
              </View>
            ) : (
              <CricketMatchCard match={item} isLive={true} />
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="w-screen justify-center mt-10">
            <TextScallingFalse className="text-white self-center text-center pr-7">
              No live matches available
            </TextScallingFalse>
          </View>
        }
      />
    </View>
  );
};

export default CricketLiveMatch;

const styles = StyleSheet.create({});
