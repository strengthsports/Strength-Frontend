import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import CricketNextMatchCard from "../matchCard/CricketNextMatchCard";
import { Colors } from "~/constants/Colors";
// import NextMatchCard from "../matchCard/CricketNextMatchCard";

interface NextCricketMatchProps {
  nextMatches: any[];
  isFetching: boolean;
}

const CricketNextMatch: React.FC<NextCricketMatchProps> = ({
  nextMatches,
  isFetching,
}) => {
  return (
    <View className="">
      <FlatList
        data={nextMatches}
        keyExtractor={(item, index) => `${item.series}_${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View className="min-h-56 w-full mr-5 mb-5 px-4">
            {isFetching ? (
              <View className="h-full flex justify-center self-center items-center">
                <ActivityIndicator size="large" color={Colors.themeColor} />
              </View>
            ) : (
              <View className="border border-[#454545] rounded-xl">
                <CricketNextMatchCard
                  seriesId={item.seriesId}
                  seriesName={item.seriesName}
                  matches={item.matches}
                />
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="w-screen justify-center">
            {/* <TextScallingFalse className="text-white self-center text-center pr-7">
              No upcoming matches available
            </TextScallingFalse> */}
          </View>
        }
      />
    </View>
  );
};

export default CricketNextMatch;

const styles = StyleSheet.create({});
