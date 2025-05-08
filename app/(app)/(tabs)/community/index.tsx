import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter, RelativePathString } from "expo-router";

import {
  useGetPagesToFollowQuery,
  useGetTeamsToSupportQuery,
  useGetUsersBasedOnActivityQuery,
  useSuggestUsersQuery,
} from "~/reduxStore/api/community/communityApi";

import SearchHeader from "~/components/search/SearchHeader";
import SuggestionCard from "@/components/Cards/SuggestionCard";
import PageSuggestionCard from "~/components/Cards/PageSuggestionCard";
import TeamSuggestionCard from "~/components/Cards/TeamSuggestionCard";
import TextScallingFalse from "~/components/CentralText";
import { showFeedback } from "~/utils/feedbackToast";
import { debounce } from "~/utils/debounce";

import { SuggestionUser } from "~/types/user";
import { SuggestTeam } from "~/types/team";
import PageThemeView from "~/components/PageThemeView";
import BackIcon2 from "~/components/SvgIcons/Common_Icons/BackIcon2";
import RightArrow from "~/components/SvgIcons/teams/RightArrow";
import SeeMore from "~/components/SvgIcons/Common_Icons/SeeMore";
import UserCardSkeleton from "~/components/skeletonLoaders/onboarding/SuggestedUserCardLoader";
import SearchSkeletonLoader from "~/components/skeletonLoaders/SearchSkeletonLoader";
import SingleLineTextSkeleton from "~/components/skeletonLoaders/SingleLineTextSkeleton";

const DEBOUNCE_DELAY = 1000;

const Community = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [removedUserIds, setRemovedUserIds] = useState<Set<string>>(new Set());

  const {
    data: similarSportsUsers,
    isLoading: loadingSimilarSportsUsers,
    error: similarSportsError,
    refetch,
  } = useSuggestUsersQuery({ limit: 4, start: 0, sports: true });

  const {
    data: popularUsers,
    isLoading: loadingPopularUsers,
    error: popularUsersError,
  } = useSuggestUsersQuery({ limit: 4, start: 0 });

  const {
    data: citywiseUsers,
    isLoading: loadingCitywiseUsers,
    error: cityUsersError,
  } = useSuggestUsersQuery({ limit: 4, start: 0, city: "kolkata" });

  const {
    data: usersBasedOnActivity,
    isLoading: loadingUsersBasedOnActivity,
    error: activityUsersError,
  } = useGetUsersBasedOnActivityQuery({ limit: 4 });

  const {
    data: pagesToSupport,
    isLoading: loadingPagesToSupport,
    error: pagesError,
  } = useGetPagesToFollowQuery({ limit: 2, start: 0 });

  const {
    data: popularTeams,
    isLoading: loadingPopularTeams,
    error: teamsError,
  } = useGetTeamsToSupportQuery({ limit: 2, start: 0 });

  console.log("Popular Teams : ", popularTeams);

  const debouncedRefetch = useRef(
    debounce(async () => {
      try {
        await refetch();
      } finally {
        setRefreshing(false);
      }
    }, DEBOUNCE_DELAY)
  ).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    debouncedRefetch();
  }, [debouncedRefetch]);

  const removeSuggestion = useCallback((userId: string) => {
    setRemovedUserIds((prev) => new Set(prev).add(userId));
  }, []);

  const sections = useMemo(() => {
    return [
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
    ].filter((section) => section.data.length > 0);
  }, [
    similarSportsUsers,
    usersBasedOnActivity,
    citywiseUsers,
    popularUsers,
    popularTeams,
    pagesToSupport,
  ]);

  const renderSection = useCallback(
    ({
      item,
    }: {
      item: {
        title: string;
        type: string;
        data: SuggestionUser[] | SuggestTeam[];
        hasMore: boolean;
      };
    }) => {
      const isLoading = item.type === "User" && item.data.length === 0;
      
      const filteredData = item.data.filter(
        (user) => !removedUserIds.has(user._id)
      );
      if (filteredData.length === 0) return null;

      const isSingleColumn = item.type === "Page" || item.type === "Team";

      return (
        <View className="mt-4 pb-6 border-b-[1px] mb-3 border-[#1E1E1E]">
          <TextScallingFalse className="text-white text-3xl font-medium ml-2 mb-2 capitalize">
            {item.title}
          </TextScallingFalse>
            <FlatList
            data={filteredData}
            keyExtractor={(user) => user._id}
            renderItem={({ item }) =>
              item.type === "User" ? (
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
                className="mt-7 self-center" style={{justifyContent:'center', alignItems:'center', height: 30, flexDirection:'row', gap: 10}}
                activeOpacity={0.5}
                onPress={() =>
                  router.push(
                    `/(app)/(tabs)/community/more?filter=${item.type.toLowerCase()}` as RelativePathString
                  )
                }
              >
                <TextScallingFalse className="text-white text-2xl font-normal">
                  See more
                </TextScallingFalse>
                <View style={{marginTop: 2}}>
                <SeeMore />
                </View>
              </TouchableOpacity>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    },
    [removeSuggestion, removedUserIds]
  );

  const allLoading =
    loadingSimilarSportsUsers ||
    loadingCitywiseUsers ||
    loadingPopularUsers ||
    loadingUsersBasedOnActivity ||
    loadingPagesToSupport ||
    loadingPopularTeams;

  const allErrors =
    similarSportsError &&
    popularUsersError &&
    pagesError &&
    teamsError &&
    cityUsersError &&
    activityUsersError;

  useEffect(() => {
    if (allErrors) {
      console.log(
        similarSportsError,
        popularUsersError,
        pagesError,
        teamsError,
        cityUsersError,
        activityUsersError
      );
      showFeedback("Can't retrieve suggestions now! Try again later.");
    }
  }, [allErrors]);

  return (
    <PageThemeView>
      <View
        style={{ width: "100%", borderColor: "#181818", borderBottomWidth: 1 }}
      >
        <SearchHeader />
      </View>

      <View className="px-4 pb-20">
        {allLoading ? (
          <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
            <View style={{ transform: [{ scale: 1.5 }]} }>
            <ActivityIndicator color={'grey'} size={'small'} />
            </View>
          </View>
        ) : (
          <FlatList
            data={sections}
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#12956B", "#6E7A81"]}
                tintColor="#6E7A81"
                progressBackgroundColor="#181A1B"
              />
            }
          />
        )}
      </View>
    </PageThemeView>
  );
};

export default Community;
