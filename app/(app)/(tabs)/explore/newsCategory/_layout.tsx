import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ExploreSportsCategoryHeader } from '~/components/explorePage/exploreHeader';
import { RootState } from '~/reduxStore';
import TrendingNews from './TrendingNews';
import CricketAll from './CricketAll';
import FootballAll from './FootballAll';
import BadmintonAll from './BadmintonAll';
import HockeyAll from './HockeyAll';
import AllBasketball from './BasketballAll';
import KabaddiAll from './KabaddiAll';
import TennisAll from './TennisAll';
import TableTennisAll from './TableTennisAll';
import ComingSoon from '~/components/explorePage/comingSoon';

// Define content components for each sports category

const DefaultContent = () => (
  <ComingSoon text='More' />
);

// Define the type for sports category keys
type ExploreSportsCategoriesKeys =
  | 'Trending'
  | 'Cricket'
  | 'Football'
  | 'Badminton'
  | 'Hockey'
  | 'Basketball'
  | 'Kabbadi'
  | 'Tennis'
  | 'Table Tennis'
  | 'More \u2193'
  | 'Default';

// Create a component map for sports categories
const componentMap: Record<ExploreSportsCategoriesKeys, () => JSX.Element> = {
  Trending: TrendingNews,
  Cricket: CricketAll,
  Football: FootballAll,
  Badminton: BadmintonAll,
  Hockey: HockeyAll,
  Basketball: AllBasketball,
  Kabbadi: KabaddiAll,
  Tennis: TennisAll,
  'Table Tennis': TableTennisAll,
  'More \u2193': DefaultContent,
  Default: DefaultContent,
};

const ExploreNewsLayout = () => {
  const selectedCategory = useSelector(
    (state: RootState) => state.explore.selectedExploreSportsCategory
  );

  // Safely access the component from the map
  const CategoryComponent = componentMap[selectedCategory as ExploreSportsCategoriesKeys] || componentMap.Default;

  return (
    <View className="bg-black px">
      <ExploreSportsCategoryHeader />
      <CategoryComponent />
    </View>
    );
}
export default ExploreNewsLayout