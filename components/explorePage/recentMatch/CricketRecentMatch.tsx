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
// import MatchCard from "../matchCard/CricketMatchCard";

interface RecentCricketMatchProps {
  recentMatches: any[];
  isFetching: boolean;
  onRefetch: () => void;
}

const CricketRecentMatch: React.FC<RecentCricketMatchProps> = ({
  recentMatches,
  isFetching,
  onRefetch,
}) => {
  return (
    <View className="mt-4">
      <FlatList
        data={recentMatches}
        keyExtractor={(item) => item?.match_id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View className="h-[164px] w-[280px] bg-transparent rounded-2xl mr-5 border border-[#454545]">
            {isFetching ? (
              <View className="h-full flex justify-center self-center items-center">
                <ScoresSkeletonLoader />
              </View>
            ) : (
              <CricketMatchCard match={item} isLive={false} />
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="w-screen justify-center mt-10">
            <TextScallingFalse className="text-white self-center text-center pr-7">
              No recent matches available
            </TextScallingFalse>
          </View>
        }
      />
    </View>
  );
};

export default CricketRecentMatch;

const styles = StyleSheet.create({});
