import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import FootballNextMatchCard from "../matchCard/FootballNextMatchCard";
import { Colors } from "~/constants/Colors";

interface NextFootballMatchProps {
  nextMatches: any[];
  isFetching: boolean;
}

const FootballNextMatch: React.FC<NextFootballMatchProps> = ({
  nextMatches,
  isFetching,
}) => {
  return (
    <View className="mt-7 items-center">
      <TextScallingFalse className="text-white">
        FootballNextMatch
      </TextScallingFalse>
    </View>
  );
};

export default FootballNextMatch;

const styles = StyleSheet.create({});
