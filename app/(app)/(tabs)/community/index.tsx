import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import SuggestionCard from "@/components/Cards/SuggestionCard";
import { Divider } from "react-native-elements";
import { RelativePathString, useRouter } from "expo-router";
import {
  useGetPagesToFollowQuery,
  useGetTeamsToSupportQuery,
  useGetUsersBasedOnActivityQuery,
  useSuggestUsersQuery,
} from "~/reduxStore/api/community/communityApi";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchHeader from "~/components/search/SearchHeader";
import PageSuggestionCard from "~/components/Cards/PageSuggestionCard";
import TeamSuggestionCard from "~/components/Cards/TeamSuggestionCard";
import { SuggestionUser } from "~/types/user";
import { SuggestTeam } from "~/types/team";
import TextScallingFalse from "~/components/CentralText";
import { showFeedback } from "~/utils/feedbackToast";

const Community = () => {
  const router = useRouter();
  // Fetch different types of suggestions
  const {
    data: similarSportsUsers,
    isLoading: loadingSimilarSportsUsers,
    error: similarSportsError,
  } = useSuggestUsersQuery({ limit: 6, sports: true });
  const {
    data: popularUsers,
    isLoading: loadingPopularUsers,
    error: popularUsersError,
  } = useSuggestUsersQuery({ limit: 6, popularUser: true });
  const {
    data: citywiseUsers,
    isLoading: loadingCitywiseUsers,
    error: cityUsersError,
  } = useSuggestUsersQuery({ limit: 6, city: "kolkata" });
  const {
    data: usersBasedOnActivity,
    isLoading: loadingUsersBasedOnActivity,
    error: activityUsersError,
  } = useGetUsersBasedOnActivityQuery({ limit: 6 });
  //Pages
  const {
    data: pagesToSupport,
    isLoading: loadingPagesToSupport,
    error: pagesError,
  } = useGetPagesToFollowQuery({ limit: 2 });
  //Teams
  const {
    data: popularTeams,
    isLoading: loadingPopularTeams,
    error: teamsError,
  } = useGetTeamsToSupportQuery({ limit: 2 });

  // console.log("User based on activity : ", usersBasedOnActivity);
  // console.log("Pages : ", pagesToSupport);
  // console.log("Teams : ", popularTeams);
  console.log("Popular users : ", popularUsers);

  // Define sections grouped by suggestion type
  const sections = useMemo(
    () => [
      {
        title: "people you may know in similar sports",
        type: "User",
        data: similarSportsUsers?.users || [],
        hasMore: similarSportsUsers?.hasMore,
      },
      {
        title: "suggested people based on your activity",
        type: "User",
        data: usersBasedOnActivity || [],
        hasMore: true,
      },
      {
        title: "people you may know in greater kolkata",
        type: "User",
        data: citywiseUsers?.users || [],
        hasMore: citywiseUsers?.hasMore,
      },
      {
        title: "teams to support",
        type: "Team",
        data: popularTeams?.teams || [],
        hasMore: popularTeams?.hasMore,
      },
      {
        title: "teams popular on strength",
        type: "Team",
        data: popularTeams?.teams || [],
        hasMore: popularTeams?.hasMore,
      },
      {
        title: "pages to follow",
        type: "Page",
        data: pagesToSupport?.pages || [],
        hasMore: pagesToSupport?.hasMore,
      },
      {
        title: "popular on Strength",
        type: "User",
        data: popularUsers?.users || [],
        hasMore: popularUsers?.hasMore,
      },
    ],
    [
      similarSportsUsers?.users,
      usersBasedOnActivity,
      citywiseUsers?.users,
      popularUsers?.users,
      popularTeams?.teams,
      pagesToSupport?.pages,
    ]
  );

  // Filter out sections with no data
  const filteredSections = useMemo(
    () => sections.filter((section) => section.data?.length > 0),
    [sections]
  );

  // Track removed user IDs
  const [removedUserIds, setRemovedUserIds] = useState<Set<string>>(new Set());

  // Add user ID to removed list
  const removeSuggestion = (userId: string) => {
    setRemovedUserIds((prev) => new Set([...prev, userId]));
  };

  // Render each section with removed users filtered out
  const renderSection = ({
    item,
  }: {
    item: {
      title: string;
      type: string;
      data: SuggestionUser[] | SuggestTeam[];
      hasMore: boolean;
    };
  }) => {
    // Filter out removed users
    const filteredData = item.data.filter(
      (user) => !removedUserIds.has(user._id)
    );
    if (filteredData.length === 0) return null;

    const isSingleColumn = item.type === "Page" || item.type === "Team";

    return (
      <View className="mt-4 pb-6 border-b-[4px] border-[#1E1E1E]">
        <Text className="text-white text-3xl font-medium ml-2 mb-2 capitalize">
          {item.title}
        </Text>
        <FlatList
          data={filteredData}
          keyExtractor={(user) => user._id}
          renderItem={({ item }) =>
            item.empty ? (
              <View style={{ flex: 1, margin: 4 }} />
            ) : item.type === "User" ? (
              <SuggestionCard
                user={item as SuggestionUser}
                size="regular"
                removeSuggestion={removeSuggestion}
              />
            ) : item.type === "Page" ? (
              <PageSuggestionCard
                user={item as SuggestionUser}
                size="regular"
                removeSuggestion={removeSuggestion}
              />
            ) : (
              <TeamSuggestionCard
                team={item as SuggestTeam}
                size="regular"
                removeSuggestion={removeSuggestion}
              />
            )
          }
          numColumns={isSingleColumn ? 1 : 2}
          columnWrapperStyle={
            isSingleColumn
              ? undefined
              : {
                  justifyContent: "space-evenly",
                  width: "auto",
                  marginTop: 16,
                  gap: 8,
                }
          }
          ListFooterComponent={
            <TouchableOpacity
              className="mt-4 self-center rounded-full"
              onPress={() =>
                router.push(
                  `/(app)/(tabs)/community/more?filter=${item.type.toLocaleLowerCase()}&sports=true` as RelativePathString
                )
              }
            >
              <Text className="text-white text-2xl font-normal">
                See more {`>`}
              </Text>
            </TouchableOpacity>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  if (
    similarSportsError &&
    popularUsersError &&
    pagesError &&
    teamsError &&
    cityUsersError &&
    activityUsersError
  ) {
    console.log(
      similarSportsError,
      popularUsersError,
      pagesError,
      teamsError,
      cityUsersError,
      activityUsersError
    );
    showFeedback("Can't retrieve suggestions now ! Try again later !");
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Search Bar */}
      <View
        style={{ width: "100%", borderColor: "#181818", borderBottomWidth: 1 }}
      >
        <SearchHeader />
      </View>

      <View className="px-4">
        {/* Suggestions List */}
        {loadingSimilarSportsUsers ||
        loadingCitywiseUsers ||
        loadingPopularUsers ||
        loadingUsersBasedOnActivity ||
        loadingPagesToSupport ||
        loadingPopularTeams ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#12956B" />
          </View>
        ) : (
          <FlatList
            data={filteredSections as any}
            keyExtractor={(section) => section.title}
            renderItem={renderSection}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 65 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center">
                <TextScallingFalse className="text-[#808080]">
                  No suggestions found
                </TextScallingFalse>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Community;
