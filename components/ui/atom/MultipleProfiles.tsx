import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import nopic from "@/assets/images/nopic.jpg";
import { useRouter } from "expo-router";

const MultipleProfiles = ({
  users,
  profileCount,
  size = "regular",
}: {
  users: any;
  profileCount?: number;
  size?: string;
}) => {
  const router = useRouter();
  return (
    <View
      className="flex-row justify-center items-center"
      style={{ overflow: "visible" }}
    >
      {users.map((user: any, index: any) => (
        <TouchableOpacity
          key={user._id || index}
          onPress={() => {
            const serializedUser = encodeURIComponent(
              JSON.stringify({ id: user._id, type: user.type })
            );
            router.push(`/(app)/(profile)/profile/${serializedUser}`);
          }}
          activeOpacity={0.7}
        >
          <Image
            source={user.profilePic}
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
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MultipleProfiles;

const styles = StyleSheet.create({});
