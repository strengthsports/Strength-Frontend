import React from "react";
import { View, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import { useGetCricketMatchesQuery } from "~/reduxStore/api/explore/cricketApi";
import { useGetFootballMatchesQuery } from "~/reduxStore/api/explore/footballApi";
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
    data: cricketData,
    isFetching: isCricketFetching,
    refetch: refetchLiveCricket,
  } = useGetCricketMatchesQuery({});
  const { liveMatches: liveCricketMatches, nextMatch: nextCricketMatches } =
    cricketData || {};

  const {
    data: footballData,
    isFetching: isFootballFetching,
    refetch: refetchFootball,
  } = useGetFootballMatchesQuery({});
  const { liveMatches: liveFootballMatches, nextMatch: nextFootballMatches } =
    footballData || {};

  const singleLiveCricketMatch = liveCricketMatches?.slice(1, 2);
  const singleLiveFootballMatch = liveFootballMatches?.slice(0, 1);

  const renderTrendingLiveMatches = () => {
    const isLoading = isCricketFetching || isFootballFetching;

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
        isCricketFetching={isCricketFetching}
        isFootballFetching={isFootballFetching}
      />
    );
  };
  const renderCricketLiveMatches = () => {
    return (
      <CricketLiveMatch
        liveMatches={liveCricketMatches}
        isFetching={isCricketFetching}
        onRefetch={refetchLiveCricket}
      />
    );
  };

  const renderCricketNextMatches = () => {
    return (
      <CricketNextMatch
        nextMatch={nextCricketMatches}
        isFetching={isCricketFetching}
      />
    );
  };

  const renderFootballLiveMatches = () => {
    return (
      <FootballLiveMatch
        liveMatches={liveFootballMatches}
        isFetching={isFootballFetching}
        onRefetch={refetchFootball}
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
