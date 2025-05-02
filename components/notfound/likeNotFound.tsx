import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextScallingFalse from "../CentralText";

const LikeNotFound = () => {
  return (
    <View className="w-4/5">
      <TextScallingFalse className="font-bold text-[#eaeaea] text-7xl leading-none">
        Score the first like
      </TextScallingFalse>
      <View>
        <TextScallingFalse className="text-[#808080]">
          Stands are empty! Be the first to cheer!
        </TextScallingFalse>
      </View>
    </View>
  );
};

export default LikeNotFound;

const styles = StyleSheet.create({});
