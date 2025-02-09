import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';

const exploreSubCategories = [
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

const AllCategoryTrending = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState("Trending");

  return (
    <View className=" bg-gray-900">
      {/* Subcategory ScrollView */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        {exploreSubCategories.map((category, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedSubCategory(category)}>
            <Text
              className={`text-xl font-bold mx-2 py-2 ${
                category === selectedSubCategory ? "text-white" : "text-gray-400"
              }`}
            >
              {category}
            </Text>
            {category === selectedSubCategory && (
              <View className="h-0.5 bg-white mt-1 rounded" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Divider */}
      <View className="h-0.5 bg-gray-500 my-2" />

      {/* Subcategory Content */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-lg font-bold">
          {`Content for ${selectedSubCategory}`}
        </Text>
      </View>
    </View>
  );
};

export default AllCategoryTrending;
