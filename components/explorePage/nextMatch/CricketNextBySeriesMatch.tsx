import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import CricketNextBySeriesMatchCard from "../matchCard/CricketNextBySeriesMatchCard";
import { Colors } from "~/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import NextMatchCard from "../matchCard/CricketNextMatchCard";

interface NextBySeriesCricketMatchProps {
  nextMatches: any[];
  isFetching: boolean;
}

const CricketNextBySeriesMatch: React.FC<NextBySeriesCricketMatchProps> = ({
  nextMatches,
  isFetching,
}) => {
  // console.log("next by series", nextMatches);

  if (isFetching) {
    return (
      <View className="h-full flex justify-center self-center items-center">
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );
  }

  return (
    <View className="px-4">
      <View className="border border-[#454545] rounded-xl">
        <CricketNextBySeriesMatchCard matches={nextMatches} />
      </View>
    </View>
  );
};

export default CricketNextBySeriesMatch;

const styles = StyleSheet.create({});
