import React, { lazy, Suspense } from "react";
import { View, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { ExploreAllSportsCategoryHeader } from "~/components/explorePage/exploreHeader";
import { RootState } from "~/reduxStore";
import ComingSoon from "~/components/explorePage/comingSoon";
import { Colors } from "~/constants/Colors";

// Lazy loading for sports categories
const TrendingAll = lazy(() => import("./TrendingAll"));

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

// Component map for lazy-loaded categories
const componentMap: Record<
  ExploreSportsCategoriesKeys,
  React.LazyExoticComponent<() => JSX.Element>
> = {
  Trending: TrendingAll,
  Cricket: TrendingAll,
  Football: TrendingAll,
  Badminton: TrendingAll,
  Hockey: TrendingAll,
  Basketball: TrendingAll,
  Kabbadi: TrendingAll,
  Tennis: TrendingAll,
  "Table Tennis": TrendingAll,
  "More \u2193": DefaultContent,
  Default: DefaultContent,
};

const ExploreAllLayout = () => {
  const selectedCategory = useSelector(
    (state: RootState) => state.explore.selectedExploreSportsCategory
  );

  // Get the correct component from the map
  const CategoryComponent =
    componentMap[selectedCategory as ExploreSportsCategoriesKeys] ||
    componentMap.Default;

  return (
    <View className="bg-black flex-1">
      {/* <ExploreAllSportsCategoryHeader /> */}
      <Suspense
        fallback={
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={Colors.themeColor} />
          </View>
        }
      >
        <CategoryComponent />
      </Suspense>
    </View>
  );
};

export default ExploreAllLayout;
