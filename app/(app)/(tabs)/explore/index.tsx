import React, { useState } from "react";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Tab, TabView } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialCommunityIcons,
  Feather,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";

const Explore = () => {
  return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* <SearchBar /> */}
          {/* <View style={styles.centeredScrollView}>
            <ExploreHeader
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />
          </View> */}
            {/* <ScrollView vertical showsHorizontalScrollIndicator={false} style={styles.contentSection}>
            {selectedCategory === 'All' && <AllCategoryTab liveCricketMatches={liveCricketMatches} nextCricMatch={nextCricMatch} cricketMatchLoading={cricketMatchLoading} footballMatches={footballMatches} nextFootballMatch={nextFootballMatch}f ootballMatchLoading={footballMatchLoading} /> }
            {selectedCategory === "News" && <OtherComingSoonTabs text="News" />}
            {selectedCategory === "Matches" && (
              <OtherComingSoonTabs text="Matches" />
            )}
            {selectedCategory === "Transfers" && (
              <OtherComingSoonTabs text="Transfers" />
            )}
            {selectedCategory === "Leagues" && (
              <OtherComingSoonTabs text="Leagues" />
            )}
            {selectedCategory === "Ranking" && (
              <OtherComingSoonTabs text="Ranking" />
            )}
            {selectedCategory === "Articles" && (
              <OtherComingSoonTabs text="Articles" />
            )}
          </ScrollView> */}
        </ScrollView>
      </SafeAreaView>


  );
};

export default Explore;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes up the full screen
  },
});