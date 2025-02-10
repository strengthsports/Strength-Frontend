import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/reduxStore'; // Your RootState type
import { setSelectedExploreCategory, setSelectedExploreSportsCategory } from '~/reduxStore/slices/explore/exploreSlice';

const exploreCategories = [
  "All",
  "News",
  "Matches",
  "Transfers",
  "Leagues",
  "Ranking",
  "Articles",
];

export const ExploreCategoryHeader = () => {
  const dispatch = useDispatch();
  const selectedExploreCategory = useSelector((state: RootState) => state.explore.selectedExploreCategory);

  const handleCategoryClick = (category: string) => {
    dispatch(setSelectedExploreCategory(category));
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 8, marginVertical: 8 }}
    >
      {exploreCategories.map((category, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleCategoryClick(category)}
        >
          <View>
            <Text
              className={`px-4 py-2 rounded-lg mx-1 text-xl overflow-hidden ${
                category === selectedExploreCategory
                  ? 'text-black bg-white'
                  : 'text-white bg-neutral-800'
              }`}
            >
              {category}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const exploreSportsCategories = [
  "Trending",
  "Cricket",
  "Football",
  "Badminton",
  "Hockey",
  "Basketball",
  "Kabbadi",
  "Tennis",
  "Table Tennis",
  "More \u2193",
];

export const ExploreSportsCategoryHeader = () => {
  const dispatch = useDispatch();
  const selectedExploreSportsCategory = useSelector((state: RootState) => state.explore.selectedExploreSportsCategory);

  const handleSportsCategoryClick = (sportsCategory: string) => {
    dispatch(setSelectedExploreSportsCategory(sportsCategory));
  };

  return (
    <View className=" bg-black">
      {/* Sportscategory ScrollView */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingTop: 8 }}
      >
        {exploreSportsCategories.map((sportsCategory, index) => (
          <TouchableOpacity key={index} onPress={() => handleSportsCategoryClick(sportsCategory)}>
            <Text
              className={`text-xl font-bold mx-6 py-2 ${
                sportsCategory === selectedExploreSportsCategory ? "text-white" : "text-neutral-400"
              }`}
            >
              {sportsCategory}
            </Text>
            {sportsCategory === selectedExploreSportsCategory && (
              <View className="h-1 bg-theme mt-0 w-3/4 self-center rounded" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Divider */}
      <View className="h-[1px] bg-neutral-500 " />

      {/* Sportscategory Content */}

    </View>
  );
};