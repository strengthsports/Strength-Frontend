import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageThemeView from "~/components/PageThemeView";
import { Slot } from "expo-router";

const CommunityLayout = () => {
  return (
    <PageThemeView>
      <Slot />
    </PageThemeView>
  );
};

export default CommunityLayout;

const styles = StyleSheet.create({});
