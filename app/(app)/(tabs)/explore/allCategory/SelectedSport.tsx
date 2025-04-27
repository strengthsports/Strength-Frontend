import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";
import {
  useGetCricketLiveMatchesQuery,
  useGetCricketNextMatchesQuery,
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
import CricketRecentMatch from "~/components/explorePage/recentMatch/CricketRecentMatch";
import FootballLiveMatch from "~/components/explorePage/liveMatch/FootballLiveMatch";
import FootballNextMatch from "~/components/explorePage/nextMatch/FootballNextMatch";
import SwiperTop from "~/components/explorePage/SwiperTop";
import FootballRecentMatch from "~/components/explorePage/recentMatch/FootballRecentMatch";
import BasketballRecentMatch from "~/components/explorePage/recentMatch/BasketballRecentMatch";
import BasketballLiveMatch from "~/components/explorePage/liveMatch/BasketballLiveMatch";

interface SelectedSportProps {
  sportsName: string;
}

const SelectedSport: React.FC<SelectedSportProps> = ({ sportsName }) => {
  const [refreshing, setRefreshing] = useState(false);
  const renderSwiper = () => {
    const {
      data: articles,
      error,
      isLoading,
    } = useGetSportArticleQuery(sportsName);
    if (isLoading) {
      return (
        <TextScallingFalse className="text-white self-center text-center pr-7">
          No swipper slides available
        </TextScallingFalse>
      );
    }

    if (error) {
      return (
        <TextScallingFalse className="text-white">
          Error loading swipper slides.
        </TextScallingFalse>
      );
    }
    return <SwiperTop swiperData={articles ?? []} />;
  };

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
  const { nextMatches: nextCricketMatches = [] } = cricketNextData || {};

  const {
    data: cricketRecentData,
    isFetching: isCricketRecentFetching,
    refetch: refetchRecentCricket,
  } = useGetCricketRecentMatchesQuery({});
  const { recentMatches: recentCricketMatches } = cricketRecentData || {};

  // const renderTrendingLiveMatches = () => {};

  const renderCricketLiveMatches = () => {
    return (
      <CricketLiveMatch
        liveMatches={liveCricketMatches}
        isFetching={isCricketLiveFetching}
      />
    );
  };

  const renderCricketRecentMatches = () => {
    return (
      <CricketRecentMatch
        recentMatches={recentCricketMatches}
        isFetching={isCricketRecentFetching}
        onRefetch={refetchRecentCricket}
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
  const { nextMatches: nextFootballMatches } = footballNextData || {};

  const {
    data: footballRecentData,
    isFetching: isFootballRecentFetching,
    refetch: refetchRecentFootball,
  } = useGetFootballRecentMatchesQuery({});
  const { recentMatches: recentFootballMatches } = footballRecentData || {};

  const renderFootballLiveMatches = () => {
    return (
      <FootballLiveMatch
        liveMatches={liveFootballMatches}
        isFetching={isFootballLiveFetching}
      />
    );
  };

  const renderFootballRecentMatches = () => {
    return (
      <FootballRecentMatch
        recentMatches={recentFootballMatches}
        isFetching={isFootballRecentFetching}
        onRefetch={refetchRecentFootball}
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
    data: basketballRecentData,
    isFetching: isBasketballRecentFetching,
    refetch: refetchRecentBasketball,
  } = useGetBasketballRecentMatchesQuery({});
  const { recentMatches: recentBasketballMatches } = basketballRecentData || {};

  const renderBasketballLiveMatches = () => {
    return (
      <BasketballLiveMatch
        liveMatches={liveBasketballMatches}
        isFetching={isBasketballLiveFetching}
      />
    );
  };

  const renderBasketballRecentMatches = () => {
    return (
      <BasketballRecentMatch
        recentMatches={recentBasketballMatches}
        isFetching={isBasketballRecentFetching}
        onRefetch={refetchRecentBasketball}
      />
    );
  };

  // one imporvement can be done is using useMemo for sections to avoid re-render first consult about it
  //also can use configMap for reusing if/else statements
  const sections = [{ type: "swiper", content: renderSwiper() }];

  sections.push({ type: "matches", content: renderMatches() });

  if (sportsName === "Cricket") {
    sections.push({
      type: "CricketLiveMatches",
      content: renderCricketLiveMatches(),
    });
    sections.push({
      type: "CricketRecentMatches",
      content: renderCricketRecentMatches(),
    });
  } else if (sportsName === "Football") {
    sections.push({
      type: "FootballLiveMatches",
      content: renderFootballLiveMatches(),
    });
    sections.push({
      type: "FootballRecentMatches",
      content: renderFootballRecentMatches(),
    });
  } else if (sportsName === "Basketball") {
    sections.push({
      type: "BasketballLiveMatches",
      content: renderBasketballLiveMatches(),
    });
    sections.push({
      type: "BasketballRecentMatches",
      content: renderBasketballRecentMatches(),
    });
  }

  sections.push({ type: "dontMiss", content: renderDontMiss() });

  if (sportsName === "Cricket")
    sections.push({
      type: "CricketNextMatches",
      content: renderCricketNextMatches(),
    });
  else if (sportsName === "Football")
    sections.push({
      type: "FootballNextMatches",
      content: renderFootballNextMatches(),
    });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchLiveCricket(),
        refetchNextCricket(),
        refetchLiveFootball(),
        refetchLiveBasketball(),
        // Optionally refetch article data if needed:
        // refetchSportArticles?.(),
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
