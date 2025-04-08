import React, { lazy, Suspense } from "react";
import { View, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";
import ComingSoon from "~/components/explorePage/comingSoon";
import { Colors } from "~/constants/Colors";
import { ExploreSportsCategoriesKeys } from "~/types/exploreSportKeys";

// Lazy loading for sports categories
const TrendingAll = lazy(() => import("./TrendingAll"));
const SelectedSport = lazy(() => import("./SelectedSport"));

const DefaultContent = lazy(
  () =>
    new Promise<{ default: React.FC<{ sportsName: string }> }>((resolve) =>
      resolve({
        default: () => <ComingSoon text="More sports" />,
      })
    )
);

// Define the type for sports category keys
// type ExploreSportsCategoriesKeys =
//   | "Trending"
//   | "Cricket"
//   | "Football"
//   | "Badminton"
//   | "Hockey"
//   | "Basketball"
//   | "Kabbadi"
//   | "Tennis"
//   | "Table Tennis"
//   | "More \u2193"
//   | "Default";

// Component map for lazy-loaded categories
const componentMap: Record<
  ExploreSportsCategoriesKeys,
  React.LazyExoticComponent<React.FC<{ sportsName: string }>>
> = {
  Trending: TrendingAll,
  Cricket: SelectedSport,
  Football: SelectedSport,
  Badminton: SelectedSport,
  Basketball: SelectedSport,
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
      <Suspense
        fallback={
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={Colors.themeColor} />
          </View>
        }
      >
        <CategoryComponent sportsName={selectedCategory} />
      </Suspense>
    </View>
  );
};

export default ExploreAllLayout;
