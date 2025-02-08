import type {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  useTheme,
  type ParamListBase,
  type TabNavigationState,
} from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import ExploreHeader from '~/components/explorePage/categoryHeader';
import SearchBar from '~/components/explorePage/searchbar';
import { RootState } from '~/reduxStore';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const exploreCategories = [
  "All",
  "News",
  "Matches",
  "Transfers",
  "Leagues",
  "Ranking",
  "Articles",
];

export default function MaterialTopTabsLayout() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state: RootState) => state.explore.selectedCategory);

  // const handleCategoryClick = (category) => {
  //   dispatch(setSelectedCategory(category));
  // };
  const { colors } = useTheme();
  return (
    <>
      <SafeAreaView className="">
        <SearchBar />
        <ExploreHeader />


      </SafeAreaView>
      <MaterialTopTabs
        initialRouteName='index'
        screenOptions={{
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: 'grey',
          swipeEnabled: false,
          tabBarLabelStyle: {
            fontSize: 14,
            textTransform: 'capitalize',
            fontWeight: 'bold',
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.text,
          },
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 'auto', minWidth: 100 },
        }}
      >
        <MaterialTopTabs.Screen name='index' options={{ title: 'Blue', }} />
        <MaterialTopTabs.Screen name='red' options={{ title: 'Red', }} />
        <MaterialTopTabs.Screen name='green' options={{ title: 'Green', }} />
        <MaterialTopTabs.Screen name='blue' options={{ title: 'blue', }} />
        <MaterialTopTabs.Screen name='pink' options={{ title: 'pink', }} />

      </MaterialTopTabs>

    </>
  );
}