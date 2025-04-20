import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageThemeView from "~/components/PageThemeView";
import TextScallingFalse from "~/components/CentralText";

const ProfileNotFound = () => {
  return (
    <PageThemeView>
      <View className="h-full justify-center items-start px-10">
        <TextScallingFalse className="text-white text-8xl font-extrabold">
          Profile
        </TextScallingFalse>
        <TextScallingFalse className="text-white text-8xl font-extrabold">
          Not Found
        </TextScallingFalse>
      </View>
    </PageThemeView>
  );
};

export default ProfileNotFound;

const styles = StyleSheet.create({});
