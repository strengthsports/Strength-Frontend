import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageThemeView from "~/components/PageThemeView";
import TextScallingFalse from "~/components/CentralText";

const MemberDetails = () => {
  return (
    <PageThemeView>
      <TextScallingFalse className="text-white">
        Members Details Page
      </TextScallingFalse>
    </PageThemeView>
  );
};

export default MemberDetails;

const styles = StyleSheet.create({});
