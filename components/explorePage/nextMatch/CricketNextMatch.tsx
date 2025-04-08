import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import TextScallingFalse from "~/components/CentralText";
import CricketNextMatchCard from "../matchCard/CricketNextMatchCard";
import { Colors } from "~/constants/Colors";
// import NextMatchCard from "../matchCard/CricketNextMatchCard";

interface NextCricketMatchProps {
  nextMatch: any;
  isFetching: boolean;
}

const CricketNextMatch: React.FC<NextCricketMatchProps> = ({
  nextMatch,
  isFetching,
}) => {
  return (
    <View className="mt-7">
      {nextMatch ? (
        <View className="px-6">
          <View className="h-56 w-full rounded-2xl bg-[#0B0B0B] mr-5 border border-[#454545]">
            {isFetching ? (
              <View className="h-full flex justify-center self-center items-center">
                <ActivityIndicator size="large" color={Colors.themeColor} />
              </View>
            ) : (
              <CricketNextMatchCard match={nextMatch} />
            )}
          </View>
        </View>
      ) : (
        <View className="w-screen justify-center mt-10">
          <TextScallingFalse className="text-white self-center text-center pr-7">
            No Upcoming matches available
          </TextScallingFalse>
        </View>
      )}
    </View>
  );
};

export default CricketNextMatch;

const styles = StyleSheet.create({});
