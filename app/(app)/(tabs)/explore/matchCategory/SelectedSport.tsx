import React, { useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import {
  useGetCricketLiveMatchesQuery,
  useGetCricketNextMatchesQuery,
  useGetCricketNextMatchesBySeriesQuery,
  useGetCricketRecentMatchesQuery,
} from "~/reduxStore/api/explore/cricketApi";
import {
  useGetFootballLiveMatchesQuery,
  useGetFootballNextMatchesQuery,
  useGetFootballRecentMatchesQuery,
} from "~/reduxStore/api/explore/footballApi";
import {
  useGetBasketballLiveMatchesQuery,
  useGetBasketballNextMatchesQuery,
  useGetBasketballRecentMatchesQuery,
} from "~/reduxStore/api/explore/basketballApi";
import CricketLiveMatch from "~/components/explorePage/liveMatch/CricketLiveMatch";
import CricketNextMatch from "~/components/explorePage/nextMatch/CricketNextMatch";
import CricketNextBySeriesMatch from "~/components/explorePage/nextMatch/CricketNextBySeriesMatch";
import FootballLiveMatch from "~/components/explorePage/liveMatch/FootballLiveMatch";
import FootballNextMatch from "~/components/explorePage/nextMatch/FootballNextMatch";
import BasketballRecentMatch from "~/components/explorePage/recentMatch/BasketballRecentMatch";
import BasketballLiveMatch from "~/components/explorePage/liveMatch/BasketballLiveMatch";
import CricketRecentMatch from "~/components/explorePage/recentMatch/CricketRecentMatch";
import FootballRecentMatch from "~/components/explorePage/recentMatch/FootballRecentMatch";
import BasketballNextMatch from "~/components/explorePage/nextMatch/BasketballNextMatch";
import CricketMatch from "~/components/explorePage/match/CricketMatch";
import FootballMatch from "~/components/explorePage/match/FootballMatch";
import BasketballMatch from "~/components/explorePage/match/BasketballMatch";

interface SelectedSportProps {
  sportsName: string;
}

const SelectedSport: React.FC<SelectedSportProps> = ({ sportsName }) => {
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
      <View className="flex-row items-center justify-between pl-3.5 mt-7 mb-6">
        <TextScallingFalse className="text-white text-5xl font-bold">
          Upcoming Matches
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
  } = useGetCricketNextMatchesBySeriesQuery({9237});
  const { seriesMatches: nextBySeriesCricketMatches = [] } =
    cricketNextBySeriesData || {};

  const {
    data: cricketRecentData,
    isFetching: isCricketRecentFetching,
    refetch: refetchRecentCricket,
  } = useGetCricketRecentMatchesQuery({});
  const { recentMatches: recentCricketMatches = [] } = cricketRecentData || {};

  const renderCricketMatches = () => {
    return (
      <CricketMatch
        liveCricketMatches={liveCricketMatches}
        recentCricketMatches={recentCricketMatches}
        isCricketLiveFetching={isCricketLiveFetching}
        isCricketRecentFetching={isCricketRecentFetching}
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

  const renderCricketNextBySeriesMatches = () => {
    return (
      <CricketNextBySeriesMatch
        nextMatches={nextBySeriesCricketMatches}
        isFetching={isCricketNextBySeriesFetching}
      />
    );
  };

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
    data: footballRecentData,
    isFetching: isFootballRecentFetching,
    refetch: refetchRecentFootball,
  } = useGetFootballRecentMatchesQuery({});
  const { recentMatches: recentFootballMatches } = footballRecentData || {};

  const renderFootballMatches = () => {
    return (
      <FootballMatch
        liveFootballMatches={liveFootballMatches}
        recentFootballMatches={recentFootballMatches}
        isFootballLiveFetching={isFootballLiveFetching}
        isFootballRecentFetching={isFootballRecentFetching}
      />
    );
  };

  const renderFootballNextMatches = () => {
    return (
      <FootballNextMatch
        nextMatches={nextFootballMatches}
        isFetching={isFootballNextFetching}
      />
    );
  };

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

  const {
    data: basketballRecentData,
    isFetching: isBasketballRecentFetching,
    refetch: refetchRecentBasketball,
  } = useGetBasketballRecentMatchesQuery({});
  const { recentMatches: recentBasketballMatches } = basketballRecentData || {};

  const renderBasketballMatches = () => {
    return (
      <BasketballMatch
        liveBasketballMatches={liveBasketballMatches}
        recentBasketballMatches={recentBasketballMatches}
        isBasketballLiveFetching={isBasketballLiveFetching}
        isBasketballRecentFetching={isBasketballRecentFetching}
      />
    );
  };

  const renderBasketballNextMatches = () => {
    return (
      <BasketballNextMatch
        nextMatches={nextBasketballMatches}
        isFetching={isBasketballNextFetching}
      />
    );
  };

  const sections = [{ type: "matches", content: renderMatches() }];

  if (sportsName === "Cricket")
    sections.push({
      type: "CricketMatches",
      content: renderCricketMatches(),
    });
  else if (sportsName === "Football")
    sections.push({
      type: "FootballMatches",
      content: renderFootballMatches(),
    });
  else if (sportsName === "Basketball")
    sections.push({
      type: "BasketballMatches",
      content: renderBasketballMatches(),
    });

  sections.push({ type: "dontMiss", content: renderDontMiss() });

  if (sportsName === "Cricket") {
    sections.push({
      type: "CricketNextMatches",
      content: renderCricketNextMatches(),
    });
    sections.push({
      type: "CricketNextBySeriesMatches",
      content: renderCricketNextBySeriesMatches(),
    });
  } else if (sportsName === "Football")
    sections.push({
      type: "FootballNextMatches",
      content: renderFootballNextMatches(),
    });
  else if (sportsName === "Basketball")
    sections.push({
      type: "BasketballNextMatches",
      content: renderBasketballNextMatches(),
    });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchLiveCricket(),
        refetchNextCricket(),
        refetchNextBySeriesCricket(),
        // refetchRecentCricket(),
        refetchLiveFootball(),
        refetchNextFootball(),
        // refetchRecentFootball(),
        refetchLiveBasketball(),
        refetchNextBasketball(),
        // refetchRecentBasketball(),
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

export default SelectedSport;
