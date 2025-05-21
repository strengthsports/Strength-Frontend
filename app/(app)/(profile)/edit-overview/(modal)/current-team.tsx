import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import PageThemeView from "~/components/PageThemeView";
import CurrentTeams from "~/components/profilePage/CurrentTeams";
import { RootState } from "~/reduxStore";

export default function CurrentTeamsPage() {
  const { user, loading } = useSelector((state: RootState) => state?.profile);

  const [isTeamAvailable, setIsTeamAvailable] = useState(false);
  const [hasPerformedCheck, setHasPerformedCheck] = useState(false);

  useEffect(() => {
    if (!loading) {
      const hasTeams = user?.selectedSports?.some(
        (sport: any) => sport.teams && sport.teams.length > 0
      );
      setIsTeamAvailable(!!hasTeams);
      setHasPerformedCheck(true);
    }
  }, [user, loading]);

  useEffect(() => {
    if (hasPerformedCheck && !isTeamAvailable) {
      router.replace("/(app)/(team)/teams");
    }
  }, [hasPerformedCheck, isTeamAvailable, router]);

  if (isTeamAvailable) {
    return (
      <SafeAreaView style={styles.container}>
        <PageThemeView>
          <CurrentTeams />
        </PageThemeView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
