import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import PageThemeView from "~/components/PageThemeView";
import ProfileNotFound from "~/components/notfound/profileNotFound";
import TextScallingFalse from "~/components/CentralText";
import { AntDesign } from "@expo/vector-icons";

const ProfileNotFoundPage = () => {
  return (
    <PageThemeView>
      <View className="flex-1 justify-center pl-10">
        <ProfileNotFound />
      </View>
    </PageThemeView>
  );
};

export default ProfileNotFoundPage;

const styles = StyleSheet.create({});
