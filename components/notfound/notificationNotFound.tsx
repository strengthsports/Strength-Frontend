import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import TextScallingFalse from "../CentralText";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

const NotificationNotFound = ({ type }: { type: string }) => {
  const content = useMemo(() => {
    let content;
    switch (type) {
      case "Mentions":
        content = {
          text: "No new mentions yet",
          subText: "Time to join the conversation. Drop a highlight post!",
        };
        break;
      case "Teams":
        content = {
          text: "No new team alerts",
          subText: "Be the playmaker. Start the game yourelf.",
        };
        break;
      default:
        content = {
          text: "No notifications found",
          subText: "Create the action—post, tag, repeat!",
        };
        break;
    }
    return content;
  }, [type]);

  return (
    <View className="w-4/5">
      <TextScallingFalse className="font-bold text-[#eaeaea] text-7xl leading-none">
        {content?.text}
      </TextScallingFalse>
      <View>
        <TextScallingFalse className="text-[#808080]">
          {content?.subText}
        </TextScallingFalse>
      </View>
      <View className="w-fit flex-row">
        <TouchableOpacity
          className="mt-4 rounded-full border border-[#808080] px-5 py-2 flex-row items-center gap-x-2"
          activeOpacity={0.7}
          onPress={() =>
            type === "Teams"
              ? router.push("/(app)/(team)/teams")
              : router.push("/add-post")
          }
        >
          <TextScallingFalse className="text-[#eaeaea]">
            {type === "Mentions" ? "@" : "+"}
          </TextScallingFalse>
          <TextScallingFalse className="text-[#eaeaea]">
            {type === "Teams" ? "Create Team" : "Add Post"}
          </TextScallingFalse>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotificationNotFound;

const styles = StyleSheet.create({});
