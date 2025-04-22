import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import nopic from "@/assets/images/nopic.jpg";

const MultipleProfiles = ({
  users,
  profileCount,
  size = "regular",
}: {
  users: any;
  profileCount?: number;
  size?: string;
}) => {
  return (
    <View
      className="flex-row justify-center items-center"
      style={{ overflow: "visible" }}
    >
      {users.map((user: any, index: any) => (
        <Image
          key={user._id}
          source={nopic}
          style={{
            marginLeft: index === 0 ? 0 : size === "regular" ? -20 : -10,
            zIndex: 3 - index,
            width: size === "regular" ? 48 : 30,
            height: size === "regular" ? 48 : 30,
            borderRadius: 100,
            borderWidth: size === "regular" ? 4 : 1,
            borderColor: "#000",
          }}
        />
      ))}
    </View>
  );
};

export default MultipleProfiles;

const styles = StyleSheet.create({});
