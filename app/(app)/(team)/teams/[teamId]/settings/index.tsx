import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import PageThemeView from "~/components/PageThemeView";

const Settings = () => {
  return (
    <PageThemeView>
      <TextScallingFalse className="text-white text-center mt-3">
        Settings Page
      </TextScallingFalse>
    </PageThemeView>
  );
};

export default Settings;

const styles = StyleSheet.create({});
