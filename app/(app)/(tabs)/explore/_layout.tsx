import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { ExploreCategoryHeader } from "~/components/explorePage/exploreHeader";
import SearchBar from "~/components/search/searchbar";
import { RootState } from "~/reduxStore";
import TrendingAll from "./allCategory";
import TrendingNews from "./newsCategory/TrendingNews";

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
    <Text style={styles.text}>Defauslt Category</Text>
  </View>
);

// Define the type for category keys
type CategoryKeys =
  | "All"
  | "News"
  | "Matches"
  | "Transfers"
  | "Leagues"
  | "Ranking"
  | "Articles"
  | "Default";

// Create a component map
const componentMap: Record<CategoryKeys, () => JSX.Element> = {
  All: TrendingAll,
  News: TrendingNews,
  Matches: MatchesCategory,
  Transfers: TransfersCategory,
  Leagues: LeaguesCategory,
  Ranking: RankingCategory,
  Articles: ArticlesCategory,
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
      <View className="">
        <SearchBar />
        {/* <ExploreCategoryHeader /> */}
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
