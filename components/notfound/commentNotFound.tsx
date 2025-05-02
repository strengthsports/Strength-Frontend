import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextScallingFalse from "../CentralText";

const CommentNotFound = () => {
  return (
    <View>
      <TextScallingFalse className="font-bold text-[#eaeaea] text-6xl text-center leading-none">
        Start the conversation
      </TextScallingFalse>
      <View>
        <TextScallingFalse className="text-[#808080] text-center text-base">
          Drop the first comment and start the chant!
        </TextScallingFalse>
      </View>
    </View>
  );
};

export default CommentNotFound;

const styles = StyleSheet.create({});
