import React from "react";
import { View, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import {
  useGetCricketLiveMatchesQuery,
  useGetCricketNextMatchesQuery,
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
import TrendingLiveMatch from "~/components/explorePage/liveMatch/TrendingLiveMatch";
import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";
// import { ExploreSportsCategoryHeader } from '~/components/explorePage/exploreHeader';

const TrendingMatch = () => {
  const renderMatches = () => {
    return (
      <View className="flex-row items-center pl-7 mt-3">
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
      <View className="flex-row items-center justify-between pl-7 pr-10 mt-10">
        <TextScallingFalse className="text-white text-5xl font-bold">
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
  const { liveMatches: liveCricketMatches } = cricketLiveData || {};

  const {
    data: cricketNextData,
    isFetching: isCricketNextFetching,
    refetch: refetchNextCricket,
  } = useGetCricketNextMatchesQuery({});
  const { nextMatches: nextCricketMatches } = cricketNextData || {};

  const {
    data: footballLiveData,
    isFetching: isFootballLiveFetching,
    refetch: refetchLiveFootball,
  } = useGetFootballLiveMatchesQuery({});
  const { liveMatches: liveFootballMatches } = footballLiveData || {};

  const {
    data: basketballLiveData,
    isFetching: isBasketballLiveFetching,
    refetch: refetchLiveBasketball,
  } = useGetBasketballLiveMatchesQuery({});
  const { liveMatches: liveBasketballMatches } = basketballLiveData || {};

  const singleLiveCricketMatch = liveCricketMatches?.slice(0, 1);
  const singleLiveFootballMatch = liveFootballMatches?.slice(0, 1);
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

  const renderCricketNextMatches = () => {
    return (
      <CricketNextMatch
        nextMatches={nextCricketMatches}
        isFetching={isCricketNextFetching}
      />
    );
  };

  const renderFootballNextMatches = () => {
    return <FootballNextMatch />;
  };

  const sections = [
    { type: "matches", content: renderMatches() },
    { type: "trendingLiveMatches", content: renderTrendingLiveMatches() },
    { type: "dontMiss", content: renderDontMiss() },
    { type: "cricketNextMatches", content: renderCricketNextMatches() },
    { type: "footballNextMatches", content: renderFootballNextMatches() },
  ];

  return (
    <View className="flex-1">
      <FlatList
        data={sections}
        keyExtractor={(item) => item.type}
        // keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => item.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>{/* Add any additional header content here if needed */}</View>
        }
      />
    </View>
  );
};

export default TrendingMatch;
