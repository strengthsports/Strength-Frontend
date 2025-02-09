import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import ExploreCategoryHeader from '~/components/explorePage/exploreCategoryHeader';
import SearchBar from '~/components/explorePage/searchbar';
import { RootState } from '~/reduxStore';
import AllCategoryTrending from './AllCategory/AllCategoryTrending';

// Define the Category components
const AllCategory = () => (
  <View>
    <Text style={{color:'white'}}>All Category</Text>
  </View>
);
const NewsCategory = () => (
  <View>
    <Text style={styles.text}>News Category</Text>
  </View>
);
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
type CategoryKeys = 
  | 'All' 
  | 'News' 
  | 'Matches' 
  | 'Transfers' 
  | 'Leagues' 
  | 'Ranking' 
  | 'Articles' 
  | 'Default';

// Create a component map
const componentMap: Record<CategoryKeys, () => JSX.Element> = {
  All: AllCategoryTrending,
  News: NewsCategory,
  Matches: MatchesCategory,
  Transfers: TransfersCategory,
  Leagues: LeaguesCategory,
  Ranking: RankingCategory,
  Articles: ArticlesCategory,
  Default: DefaultCategory,
};

export default function ExplorePage() {
  const selectedCategory = useSelector(
    (state: RootState) => state.explore.selectedCategory
  );

  // Safely access the component from the map
  const CategoryComponent = componentMap[selectedCategory as CategoryKeys] || componentMap.Default;

  return (
    <SafeAreaView >
      <SearchBar />
      <ExploreCategoryHeader />
        <CategoryComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
});