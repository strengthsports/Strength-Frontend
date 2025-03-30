import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageThemeView from "~/components/PageThemeView";
import TextScallingFalse from "~/components/CentralText";

const Members = () => {
  return (
    <PageThemeView>
      <TextScallingFalse className="text-white">
        Members List Page
      </TextScallingFalse>
    </PageThemeView>
  );
};

export default Members;

const styles = StyleSheet.create({});
