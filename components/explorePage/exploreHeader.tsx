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
  "Matches",
  "Articles",
  "Teams",
  "Clips",
  "Groups",
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
        marginVertical: 4,
        paddingStart: 10,
        paddingEnd: 10,
      }}
    >
      {exploreCategories.map((category, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleCategoryClick(category)}
          activeOpacity={0.5}
        >
          <View>
            <Text
              className={`px-4 py-2.5 rounded-[8px] mx-1.5 text-xl text-center overflow-hidden ${
                category === selectedExploreCategory
                  ? "text-black bg-white font-semibold"
                  : "text-white bg-[#262626]"
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
  "Basketball",
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
      {/* Sportscategory ScrollView */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8 }}
      >
        {exploreSportsCategories.map((sportsCategory, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSportsCategoryClick(sportsCategory)}
            className="px-1"
            activeOpacity={0.7}
          >
            <View className="items-center">
              <Text
                className={`text-xl px-3.5 py-1 text-center rounded-xl overflow-hidden text-[#ABABAB] ${
                  sportsCategory === selectedExploreSportsCategory
                    ? "text-white"
                    : ""
                }`}
              >
                {sportsCategory}
              </Text>
              {sportsCategory === selectedExploreSportsCategory && (
                <View className="w-3/4 h-1 bg-[#12956B] rounded-full mt-1" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Divider */}
      <View className="h-[0.6px] bg-neutral-600 " />

      {/* Sportscategory Content */}
    </View>
  );
};
