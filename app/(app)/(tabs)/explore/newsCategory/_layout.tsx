import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { ExploreAllSportsCategoryHeader } from "~/components/explorePage/exploreHeader";
import { RootState } from "~/reduxStore";
import TrendingNews from "./TrendingNews";
import ComingSoon from "~/components/explorePage/comingSoon";

// Define content components for each sports category

const DefaultContent = () => <ComingSoon text="More" />;

// Define the type for sports category keys
type ExploreSportsCategoriesKeys =
  | "Trending"
  | "Cricket"
  | "Football"
  | "Badminton"
  | "Hockey"
  | "Basketball"
  | "Kabbadi"
  | "Tennis"
  | "Table Tennis"
  | "More \u2193"
  | "Default";

// Create a component map for sports categories
const componentMap: Record<ExploreSportsCategoriesKeys, () => JSX.Element> = {
  Trending: TrendingNews,
  Cricket: TrendingNews,
  Football: TrendingNews,
  Badminton: TrendingNews,
  Hockey: TrendingNews,
  Basketball: TrendingNews,
  Kabbadi: TrendingNews,
  Tennis: TrendingNews,
  "Table Tennis": TrendingNews,
  "More \u2193": DefaultContent,
  Default: DefaultContent,
};

const ExploreNewsLayout = () => {
  const selectedCategory = useSelector(
    (state: RootState) => state.explore.selectedExploreSportsCategory
  );

  // Safely access the component from the map
  const CategoryComponent =
    componentMap[selectedCategory as ExploreSportsCategoriesKeys] ||
    componentMap.Default;

  return (
    <View className="bg-black px">
      <ExploreAllSportsCategoryHeader />
      <CategoryComponent />
    </View>
  );
};
export default ExploreNewsLayout;
