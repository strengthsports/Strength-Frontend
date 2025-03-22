import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/reduxStore"; // Your RootState type
import {
  setSelectedExploreCategory,
  setSelectedExploreSportsCategory,
} from "~/reduxStore/slices/explore/exploreSlice";

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
  const selectedExploreCategory = useSelector(
    (state: RootState) => state.explore.selectedExploreCategory
  );

  const handleCategoryClick = (category: string) => {
    dispatch(setSelectedExploreCategory(category));
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: 8,
        marginVertical: 8,
      }}
    >
      {exploreCategories.map((category, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleCategoryClick(category)}
        >
          <View>
            <Text
              className={`px-5 py-3 rounded-[24px] mx-1 text-xl text-center overflow-hidden border-[#2E2E2E] border ${
                category === selectedExploreCategory
                  ? "text-black bg-white"
                  : "text-[#ABABAB] bg-black"
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

export const ExploreAllSportsCategoryHeader = () => {
  const dispatch = useDispatch();
  const selectedExploreSportsCategory = useSelector(
    (state: RootState) => state.explore.selectedExploreSportsCategory
  );

  const handleSportsCategoryClick = (sportsCategory: string) => {
    dispatch(setSelectedExploreSportsCategory(sportsCategory));
  };

  return (
    <View className=" bg-black">
      <Text className="text-white ml-4 mt-2">Sports</Text>
      {/* Sportscategory ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8 }}
      >
        {exploreSportsCategories.map((sportsCategory, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSportsCategoryClick(sportsCategory)}
            className="flex-row justify-between items-center px-2 my-1.5"
          >
            {/* sport category name */}
            <Text className={`text-[#ABABAB] text-xl mx-5 my-2 `}>
              {sportsCategory}
            </Text>
            {/* check Box of that sport*/}
            <View
              className={`w-5 h-5 border rounded-xl mr-3 ${
                sportsCategory === selectedExploreSportsCategory
                  ? "bg-theme border-[#ABABAB]"
                  : "bg-gray-700 border-[#ABABAB]"
              }`}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Divider */}
      <View className="h-[0.6px] bg-neutral-600 " />

      {/* Sportscategory Content */}
    </View>
  );
};
