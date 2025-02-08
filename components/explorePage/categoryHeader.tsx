import React from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/reduxStore'; // Your RootState type
import { setSelectedCategory } from '~/reduxStore/slices/explore/exploreSlice';

const exploreCategories = [
  "All",
  "News",
  "Matches",
  "Transfers",
  "Leagues",
  "Ranking",
  "Articles",
];

const ExploreHeader = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state: RootState) => state.explore.selectedCategory);

  const handleCategoryClick = (category: string) => {
    dispatch(setSelectedCategory(category)); // Dispatch the action to update the selected category
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
                category === selectedCategory
                  ? 'text-black bg-white'
                  : 'text-white bg-neutral-700'
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

export default ExploreHeader;