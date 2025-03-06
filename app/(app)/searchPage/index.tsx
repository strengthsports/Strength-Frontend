import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "~/components/search/searchInput";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import SearchHistoryText from "~/components/search/searchHistoryText";
import TextScallingFalse from "~/components/CentralText";
import SearchHistoryProfile from "~/components/search/searchHistoryProfile";

const SearchPage = () => {
  const router = useRouter();
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView>
      {/* Header Section */}
      <View className="flex-row items-center my-4 gap-x-2 max-w-[640px] w-[90%] mx-auto">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <SearchInput />
      </View>

      <View className="px-5">
        {/* Horizontal Recent Profiles List */}
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl text-[#808080] mb-2">Recent</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dummyData}
          renderItem={({ item }) => (
            <SearchHistoryProfile name={item.name} username={item.username} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: 0,
            gap: 16,
          }}
          // Ensure 5 items fit initially
          initialNumToRender={5}
          windowSize={5}
          getItemLayout={(data, index) => ({
            length: width * 0.2,
            offset: width * 0.2 * index,
            index,
          })}
        />

        {/* Vertical Search History List */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={dummyData2}
          renderItem={({ item }) => (
            <SearchHistoryText searchText={item.searchText} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ gap: 14, paddingVertical: 16 }}
        />
      </View>
    </SafeAreaView>
  );
};

const dummyData = [
  { id: 1, name: "Elon Musk", username: "elonmusk" },
  { id: 2, name: "Satya Nadella", username: "satyanadella" },
  { id: 3, name: "Tim Cook", username: "tim_cook" },
  { id: 4, name: "Mark Zuckerberg", username: "zuck" },
  { id: 5, name: "Bill Gates", username: "billgates" },
  // Add more items for scrolling
  { id: 6, name: "Sundar Pichai", username: "sundarpichai" },
  { id: 7, name: "Jeff Bezos", username: "jeffbezos" },
];

const dummyData2 = [
  { id: 1, searchText: "hello" },
  { id: 2, searchText: "react native tutorials" },
  { id: 3, searchText: "expo router" },
  { id: 4, searchText: "UI components" },
  { id: 5, searchText: "animation techniques" },
  { id: 6, searchText: "best practices" },
  { id: 7, searchText: "state management" },
];

export default SearchPage;
