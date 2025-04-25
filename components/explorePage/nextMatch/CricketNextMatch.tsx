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
    <View className="mt-7">
      <FlatList
        data={nextMatches}
        keyExtractor={(item) => item?.match_id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View className="h-56 w-full rounded-2xl bg-[#0B0B0B] mr-5 border border-[#454545] mb-10">
            {isFetching ? (
              <View className="h-full flex justify-center self-center items-center">
                <ActivityIndicator size="large" color={Colors.themeColor} />
              </View>
            ) : (
              <CricketNextMatchCard match={item} />
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="w-screen justify-center mt-10">
            <TextScallingFalse className="text-white self-center text-center pr-7">
              No upcoming matches available
            </TextScallingFalse>
          </View>
        }
      />
    </View>
  );
};

export default CricketNextMatch;

const styles = StyleSheet.create({});
