import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageThemeView from "~/components/PageThemeView";
import TextScallingFalse from "~/components/CentralText";

const TeamForum = () => {
  return (
    <PageThemeView>
      <TextScallingFalse className="text-white">
        Team Forum Page
      </TextScallingFalse>
    </PageThemeView>
  );
};

export default TeamForum;

const styles = StyleSheet.create({});
