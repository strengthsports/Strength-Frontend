import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SuggestionCard from "@/components/Cards/SuggestionCard";
import {
  useGetPopularUsersQuery,
  useGetUsersBasedOnActivityQuery,
  useGetUsersOfSimilarSportsQuery,
  useLazyGetUsersOfSpecificCityQuery,
} from "~/reduxStore/api/community/communityApi";
import { Divider } from "react-native-elements";

const Community = () => {
  // Fetch different types of suggestions
  const { data: similarSportsUsers, isLoading: loadingSimilarSportsUsers } =
    useGetUsersOfSimilarSportsQuery({ limit: 10 });
  const { data: popularUsers, isLoading: loadingPopularUsers } =
    useGetPopularUsersQuery({ limit: 10 });
  const [trigger, { data: citywiseUsers, isLoading: loadingCitywiseUsers }] =
    useLazyGetUsersOfSpecificCityQuery();
  const { data: usersBasedOnActivity, isLoading: loadingUsersBasedOnActivity } =
    useGetUsersBasedOnActivityQuery({ limit: 10 });

  useEffect(() => {
    trigger({ city: "Kolkata", limit: 10 });
  }, [trigger]);

  // Define sections grouped by suggestion type
  const sections = [
    {
      title: "people you may know in similar sports",
      data: similarSportsUsers || [],
    },
    {
      title: "suggested people based on your activity",
      data: usersBasedOnActivity || [],
    },
    {
      title: "people you may know in greater kolkata",
      data: citywiseUsers || [],
    },
    {
      title: "popular on Strength",
      data: popularUsers || [],
    },
  ];

  // Filter out sections that have no data
  const filteredSections = sections.filter(
    (section: any) => section.data && section.data.length > 0
  );

  // State to track which sections are expanded (to show all cards)
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // Render each section as a grid with two columns. If more than 6 items, show only the first 6 items with a "Show All" button.
  const renderSection = ({
    item,
  }: {
    item: { title: string; data: any[] };
  }) => {
    const isExpanded = expandedSections[item.title] || false;
    const showButton = item.data.length > 6 && !isExpanded;
    const dataToRender = showButton ? item.data.slice(0, 6) : item.data;

    return (
      <View className="mt-4 pb-6 border-b-[4px] border-[#1E1E1E]">
        <Text className="text-white text-3xl font-normal mb-2 capitalize">
          {item.title}
        </Text>
        {/* Render grid of cards using FlatList with numColumns */}
        <FlatList
          data={dataToRender}
          keyExtractor={(user) => user._id}
          renderItem={({ item }) => <SuggestionCard user={item} />}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "center",
            marginHorizontal: "auto",
            gap: 8,
            marginTop: 8,
          }}
          contentContainerStyle={{ paddingHorizontal: 5 }}
          showsVerticalScrollIndicator={false}
        />
        {showButton && (
          <TouchableOpacity
            onPress={() =>
              setExpandedSections((prev) => ({ ...prev, [item.title]: true }))
            }
            className="mt-4 self-center"
          >
            <Text className="text-white text-xl font-semibold">Show All</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#161616ed] pt-4 px-4">
      {/* Search Bar */}
      <View className="flex-row items-center bg-[#1E1E1E] px-3 py-[0.5px] rounded-full mb-3">
        <Ionicons name="search" size={20} color="gray" className="ml-2" />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="gray"
          className="text-white flex-1 ml-2"
        />
      </View>

      <Divider width={3} color="#1e1e1e" />

      {/* Suggestions List */}
      {loadingSimilarSportsUsers ||
      loadingCitywiseUsers ||
      loadingPopularUsers ||
      loadingUsersBasedOnActivity ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white">Loading Suggestions...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSections}
          keyExtractor={(section) => section.title}
          renderItem={renderSection}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Community;
