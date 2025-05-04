import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageThemeView from "~/components/PageThemeView";
import CurrentTeams from "~/components/profilePage/CurrentTeams";

export default function CurrentTeamsPage() {
  return (
    <SafeAreaView style={styles.container}>
      <PageThemeView>
        <CurrentTeams />
      </PageThemeView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
