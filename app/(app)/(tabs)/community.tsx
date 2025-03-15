import React, { useEffect, useState, useMemo } from "react";
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
import { Divider } from "react-native-elements";
import {
  useGetPopularUsersQuery,
  useGetUsersBasedOnActivityQuery,
  useGetUsersOfSimilarSportsQuery,
  useLazyGetUsersOfSpecificCityQuery,
} from "~/reduxStore/api/community/communityApi";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const sections = useMemo(
    () => [
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
    ],
    [similarSportsUsers, usersBasedOnActivity, citywiseUsers, popularUsers]
  );

  // Filter out sections with no data
  const filteredSections = useMemo(
    () => sections.filter((section) => section.data?.length > 0),
    [sections]
  );

  // Maintain local state for sections based on API data
  const [sectionsState, setSectionsState] = useState(filteredSections);

  // Track removed user IDs
  const [removedUserIds, setRemovedUserIds] = useState<Set<string>>(new Set());

  // When fetched sections change, update local state
  useEffect(() => {
    setSectionsState(filteredSections);
  }, [filteredSections]);

  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // Add user ID to removed list
  const removeSuggestion = (userId: string) => {
    setRemovedUserIds((prev) => new Set([...prev, userId]));
  };

  // Render each section with removed users filtered out
  const renderSection = ({
    item,
  }: {
    item: { title: string; data: any[] };
  }) => {
    // Filter out removed users
    const filteredData = item.data.filter(
      (user) => !removedUserIds.has(user._id)
    );
    if (filteredData.length === 0) return null;

    const isExpanded = expandedSections[item.title] || false;
    const showButton = filteredData.length > 6 && !isExpanded;
    const dataToRender = showButton ? filteredData.slice(0, 6) : filteredData;

    return (
      <View className="mt-4 pb-6 border-b-[4px] border-[#1E1E1E]">
        <Text className="text-white text-3xl font-normal mb-2 capitalize">
          {item.title}
        </Text>
        <FlatList
          data={dataToRender}
          keyExtractor={(user) => user._id}
          renderItem={({ item }) =>
            item.empty ? (
              <View style={{ flex: 1, margin: 4 }} />
            ) : (
              <SuggestionCard
                user={item}
                size="regular"
                removeSuggestion={removeSuggestion}
              />
            )
          }
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-evenly",
            width: "auto",
            marginTop: 16,
            gap: 8,
            // backgroundColor: "yellow",
          }}
          contentContainerStyle={{
            alignItems: "center", // Ensures content stays centered inside the parent
            paddingHorizontal: 16, // Adds some padding on both sides
          }}
          showsVerticalScrollIndicator={false}
        />
        {showButton && (
          <TouchableOpacity
            onPress={() =>
              setExpandedSections((prev) => ({ ...prev, [item.title]: true }))
            }
            className="mt-4 self-center rounded-full"
          >
            <Text className="text-white text-2xl font-semibold">Show All</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505] pt-4 px-4">
      {/* Search Bar */}
      <View className="flex-row items-center bg-[#1E1E1E] px-3  rounded-full mb-3">
        <Ionicons name="search" size={20} color="gray" className="ml-2" />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="gray"
          className="text-white flex-1 ml-2 p-3"
        />
      </View>

      <Divider width={3} color="#1e1e1e" />

      {/* Suggestions List */}
      {loadingSimilarSportsUsers ||
      loadingCitywiseUsers ||
      loadingPopularUsers ||
      loadingUsersBasedOnActivity ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#12956B" />
        </View>
      ) : (
        <FlatList
          data={sectionsState}
          keyExtractor={(section) => section.title}
          renderItem={renderSection}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Community;
