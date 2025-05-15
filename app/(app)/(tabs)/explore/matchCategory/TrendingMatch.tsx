import React, { useState } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import {
  useGetCricketLiveMatchesQuery,
  useGetCricketNextMatchesQuery,
  useGetCricketNextMatchesBySeriesQuery,
} from "~/reduxStore/api/explore/cricketApi";
import {
  useGetFootballLiveMatchesQuery,
  useGetFootballNextMatchesQuery,
} from "~/reduxStore/api/explore/footballApi";
import {
  useGetBasketballLiveMatchesQuery,
  useGetBasketballNextMatchesQuery,
} from "~/reduxStore/api/explore/basketballApi";
import CricketLiveMatch from "~/components/explorePage/liveMatch/CricketLiveMatch";
import CricketNextMatch from "~/components/explorePage/nextMatch/CricketNextMatch";
import FootballLiveMatch from "~/components/explorePage/liveMatch/FootballLiveMatch";
import FootballNextMatch from "~/components/explorePage/nextMatch/FootballNextMatch";
// import TrendingLiveMatch from "~/components/explorePage/liveMatch/TrendingLiveMatch";
import TrendingLiveMatch from "~/components/explorePage/match/TrendingLiveMatch";
import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";
import BasketballNextMatch from "~/components/explorePage/nextMatch/BasketballNextMatch";
import CricketNextBySeriesMatch from "~/components/explorePage/nextMatch/CricketNextBySeriesMatch";
// import { ExploreSportsCategoryHeader } from '~/components/explorePage/exploreHeader';

const TrendingMatch = () => {
  const [refreshing, setRefreshing] = useState(false);
  const renderMatches = () => {
    return (
      <View className="flex-row items-center pl-3.5 mt-3">
        <TextScallingFalse className="text-white text-5xl font-bold">
          Matches
        </TextScallingFalse>
        <MaterialCommunityIcons
          name="chevron-double-right"
          size={22}
          color="white"
          className="-mb-1"
        />
      </View>
    );
  };

  const renderDontMiss = () => {
    return (
      <View className="flex-row items-center justify-between pl-4 mt-7 mb-6">
        <TextScallingFalse className="text-white text-3xl font-bold">
          Don’t Miss
        </TextScallingFalse>
      </View>
    );
  };

  const {
    data: cricketLiveData,
    isFetching: isCricketLiveFetching,
    refetch: refetchLiveCricket,
  } = useGetCricketLiveMatchesQuery({});
  const { liveMatches: liveCricketMatches = [] } = cricketLiveData || {};

  const {
    data: cricketNextData,
    isFetching: isCricketNextFetching,
    refetch: refetchNextCricket,
  } = useGetCricketNextMatchesQuery({});
  const { nextMatches: nextCricketMatches = [] } = cricketNextData || {};

  const {
    data: cricketNextBySeriesData,
    isFetching: isCricketNextBySeriesFetching,
    refetch: refetchNextBySeriesCricket,
  } = useGetCricketNextMatchesBySeriesQuery(9237);
  const { seriesMatches: nextBySeriesCricketMatches = [] } =
    cricketNextBySeriesData || {};

  const {
    data: footballLiveData,
    isFetching: isFootballLiveFetching,
    refetch: refetchLiveFootball,
  } = useGetFootballLiveMatchesQuery({});
  const { liveMatches: liveFootballMatches } = footballLiveData || {};

  const {
    data: footballNextData,
    isFetching: isFootballNextFetching,
    refetch: refetchNextFootball,
  } = useGetFootballNextMatchesQuery({});
  const { nextMatches: nextFootballMatches = [] } = footballNextData || {};

  const {
    data: basketballLiveData,
    isFetching: isBasketballLiveFetching,
    refetch: refetchLiveBasketball,
  } = useGetBasketballLiveMatchesQuery({});
  const { liveMatches: liveBasketballMatches } = basketballLiveData || {};

  const {
    data: basketballNextData,
    isFetching: isBasketballNextFetching,
    refetch: refetchNextBasketball,
  } = useGetBasketballNextMatchesQuery({});
  const { nextMatches: nextBasketballMatches = [] } = basketballNextData || {};

  // Top 2 live matches for each sport
  const singleLiveCricketMatch = liveCricketMatches?.slice(0, 2);
  const singleLiveFootballMatch = liveFootballMatches?.slice(0, 2);
  const singleLiveBasketballMatch = liveBasketballMatches?.slice(0, 2);

  const renderTrendingLiveMatches = () => {
    const isLoading = isCricketLiveFetching || isFootballLiveFetching;

    if (isLoading) {
      return (
        <View className="mt-5">
          <ScoresSkeletonLoader />
        </View>
      );
    }
    return (
      <TrendingLiveMatch
        liveCricketMatches={singleLiveCricketMatch}
        liveFootballMatches={singleLiveFootballMatch}
        liveBasketballMatches={singleLiveBasketballMatch}
        isCricketFetching={isCricketLiveFetching}
        isFootballFetching={isFootballLiveFetching}
        isBasketballFetching={isBasketballLiveFetching}
      />
    );
  };

  const topThreeCricketNextMatches =
    nextCricketMatches.length > 0
      ? [
          {
            seriesId: nextCricketMatches[0].seriesId,
            seriesName: nextCricketMatches[0].seriesName,
            matches: nextCricketMatches[0].matches.slice(0, 3),
          },
        ]
      : [];

  const renderCricketNextMatches = () => {
    return (
      <CricketNextMatch
        nextMatches={topThreeCricketNextMatches}
        isFetching={isCricketNextFetching}
      />
    );
  };

  const renderCricketNextBySeriesMatches = () => {
    return (
      <CricketNextBySeriesMatch
        nextMatches={nextBySeriesCricketMatches.slice(0, 3)}
        isFetching={isCricketNextBySeriesFetching}
      />
    );
  };

  const topThreeFootballNextMatches =
    nextFootballMatches.length > 0
      ? [
          {
            league: nextFootballMatches[0].league,
            matches: nextFootballMatches[0].matches.slice(0, 3),
          },
        ]
      : [];

  const renderFootballNextMatches = () => {
    return (
      <FootballNextMatch
        nextMatches={topThreeFootballNextMatches}
        isFetching={isFootballNextFetching}
      />
    );
  };

  const topThreeBasketballNextMatches =
    nextBasketballMatches.length > 0
      ? [
          {
            league: nextBasketballMatches[0].league,
            matches: nextBasketballMatches[0].matches.slice(0, 3),
          },
        ]
      : [];

  const renderBasketballNextMatches = () => {
    return (
      <BasketballNextMatch
        nextMatches={topThreeBasketballNextMatches}
        isFetching={isBasketballNextFetching}
      />
    );
  };

  const sections = [
    { type: "matches", content: renderMatches() },
    { type: "trendingLiveMatches", content: renderTrendingLiveMatches() },
    { type: "dontMiss", content: renderDontMiss() },
    // { type: "cricketNextMatches", content: renderCricketNextMatches() },
    {
      type: "cricketNextBySeriesMatches",
      content: renderCricketNextBySeriesMatches(),
    },
    { type: "footballNextMatches", content: renderFootballNextMatches() },
    { type: "basketballNextMatches", content: renderBasketballNextMatches() },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchLiveCricket(),
        refetchNextCricket(),
        refetchLiveFootball(),
        refetchNextFootball(),
        refetchLiveBasketball(),
        refetchNextBasketball(),
      ]);
    } catch (error) {
      console.error("Refresh failed", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View className="flex-1">
      <FlatList
        data={sections}
        keyExtractor={(item) => item.type}
        // keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => item.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#12956B", "#6E7A81"]}
            tintColor="#6E7A81"
            progressViewOffset={60}
            progressBackgroundColor="#181A1B"
          />
        }
        ListHeaderComponent={
          <View>{/* Add any additional header content here if needed */}</View>
        }
      />
    </View>
  );
};

export default TrendingMatch;
