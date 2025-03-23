import React, { lazy, Suspense } from "react";
import { View, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { ExploreAllSportsCategoryHeader } from "~/components/explorePage/exploreHeader";
import { RootState } from "~/reduxStore";
import ComingSoon from "~/components/explorePage/comingSoon";
import { Colors } from "~/constants/Colors";

// Lazy loading for sports categories
const TrendingAll = lazy(() => import("./TrendingAll"));
const CricketAll = lazy(() => import("./CricketAll"));
const FootballAll = lazy(() => import("./FootballAll"));
const BadmintonAll = lazy(() => import("./BadmintonAll"));
const HockeyAll = lazy(() => import("./HockeyAll"));
const AllBasketball = lazy(() => import("./BasketballAll"));
const KabaddiAll = lazy(() => import("./KabaddiAll"));
// const TennisAll = lazy(() => import("./TennisAll"));
const TableTennisAll = lazy(() => import("./TableTennisAll"));

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
  Cricket: CricketAll,
  Football: FootballAll,
  Badminton: BadmintonAll,
  Hockey: HockeyAll,
  Basketball: AllBasketball,
  Kabbadi: KabaddiAll,
  Tennis: TableTennisAll,
  "Table Tennis": TableTennisAll,
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
      <ExploreAllSportsCategoryHeader />
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
