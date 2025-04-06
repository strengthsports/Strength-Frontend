import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TextScallingFalse from "~/components/CentralText";

const FootballNextMatch = () => {
  return (
    <View className="mt-7">
      <View className="flex-row items-center justify-between pl-7 pr-10 mb-4">
        <TextScallingFalse className="text-white text-6xl font-bold">
          Don’t Miss
        </TextScallingFalse>
      </View>
      <TextScallingFalse className="text-white">
        FootballNextMatch
      </TextScallingFalse>
    </View>
  );
};

export default FootballNextMatch;

const styles = StyleSheet.create({});
