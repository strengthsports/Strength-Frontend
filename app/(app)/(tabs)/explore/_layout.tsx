import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import SearchBar from "~/components/search/searchbar";
import { RootState } from "~/reduxStore";
import TrendingAll from "./allCategory";
import TrendingMatch from "./matchCategory";
import TrendingArticle from "./articleCategory";
import TrendingTeam from "./teamCategory";
import TrendingClip from "./clipCategory";
import TrendingGroup from "./groupCategory";
import SearcHeader from "~/components/search/SearchHeader";
import SearchHeader from "~/components/search/SearchHeader";
import {
  ExploreCategoryHeader,
  ExploreAllSportsCategoryHeader,
} from "~/components/explorePage/exploreHeader";
import { CategoryKeys } from "~/types/exploreCateogryKeys";

// Define the Category components

// const NewsCategory = () => (
//   <View>
//     <Text style={styles.text}>News Category</Text>
//   </View>
// );
const MatchesCategory = () => (
  <View>
    <Text style={styles.text}>Matches Category</Text>
  </View>
);
const TransfersCategory = () => (
  <View>
    <Text style={styles.text}>Transfers Category</Text>
  </View>
);
const LeaguesCategory = () => (
  <View>
    <Text style={styles.text}>Leagues Category</Text>
  </View>
);
const RankingCategory = () => (
  <View>
    <Text style={styles.text}>Ranking Category</Text>
  </View>
);
const ArticlesCategory = () => (
  <View>
    <Text style={styles.text}>Articles Category</Text>
  </View>
);
const DefaultCategory = () => (
  <View>
    <Text style={styles.text}>Default Category</Text>
  </View>
);

// Define the type for category keys
// type CategoryKeys =
//   | "All"
//   | "News"
//   | "Matches"
//   | "Transfers"
//   | "Leagues"
//   | "Ranking"
//   | "Articles"
//   | "Default";

// Create a component map
const componentMap: Record<CategoryKeys, () => JSX.Element> = {
  All: TrendingAll,
  Matches: TrendingMatch,
  Articles: TrendingArticle,
  Teams: TrendingTeam,
  Clips: TrendingClip,
  Groups: TrendingGroup,
  Default: DefaultCategory,
};

export default function ExploreMainLayout() {
  const selectedCategory = useSelector(
    (state: RootState) => state.explore.selectedExploreCategory
  );

  const CategoryComponent =
    componentMap[selectedCategory as CategoryKeys] || componentMap.Default;

  return (
    <SafeAreaView className="flex-1">
      <View className="border-b-[0.5px] bg-black border-b-[#505050]">
        {/* <SearchBar /> */}
        <SearchHeader />
        <ExploreCategoryHeader />
        <ExploreAllSportsCategoryHeader />
      </View>
      <CategoryComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
  },
});
