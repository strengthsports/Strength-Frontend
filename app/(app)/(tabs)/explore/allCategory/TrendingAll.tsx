import React, { useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  RefreshControl,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
// import { ExploreImageBanner, hashtagData } from "~/constants/hardCodedFiles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Hashtag from "~/components/explorePage/hashtag";
import { useGetTrendingHashtagQuery } from "~/reduxStore/api/explore/hashtagApi";
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
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";
import DiscoverPeopleList from "~/components/discover/discoverPeopleList";
import SwiperTop from "~/components/explorePage/SwiperTop";
import HashtagModal from "~/components/explorePage/hashtagModal";
import CricketLiveMatch from "~/components/explorePage/liveMatch/CricketLiveMatch";
import CricketNextMatch from "~/components/explorePage/nextMatch/CricketNextMatch";
import CricketNextBySeriesMatch from "~/components/explorePage/nextMatch/CricketNextBySeriesMatch";
import FootballLiveMatch from "~/components/explorePage/liveMatch/FootballLiveMatch";
import FootballNextMatch from "~/components/explorePage/nextMatch/FootballNextMatch";
// import TrendingLiveMatch from "~/components/explorePage/liveMatch/TrendingLiveMatch";
import TrendingLiveMatch from "~/components/explorePage/match/TrendingLiveMatch";
import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";
import SwipperSkeletonLoader from "~/components/skeletonLoaders/SwipperSkeletonLoader";
import HastagSkeletonLoader from "~/components/skeletonLoaders/HastagSkeletonLoader";
import BasketballNextMatch from "~/components/explorePage/nextMatch/BasketballNextMatch";
// import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";

const TrendingAll = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const {
    data: articles,
    error,
    isLoading,
    refetch: refetchSportArticles,
  } = useGetSportArticleQuery();
  const topFiveArticles = articles?.slice(0, 5);
  const renderSwiper = () => {
    if (isLoading) {
      return <SwipperSkeletonLoader />;
    }

    if (error) {
      return (
        <View
          style={{
            height: 240,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextScallingFalse className="text-white">
            Error loading swipper slides.
          </TextScallingFalse>
        </View>
      );
    }
    return <SwiperTop swiperData={topFiveArticles ?? []} />;
  };

  const renderHashtags = () => {
    const {
      data: hashtagData,
      isLoading,
      error,
    } = useGetTrendingHashtagQuery({});

    if (isLoading) return <HastagSkeletonLoader />;
    // console.log("Hashtag error:", error);
    if (error)
      return (
        <View
          style={{
            height: 240,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextScallingFalse className="text-white">
            Error loading Hashtags.
          </TextScallingFalse>
        </View>
      );

    return (
      <View className="mt-8">
        <Hashtag
          setModalVisible={setModalVisible}
          data={hashtagData.slice(0, 3)}
        />
        <TouchableOpacity
          className="bg-[#191919] mt-3 mb-10 py-3 px-14 w-full max-w-96 flex self-center rounded-full border border-[0.5px] border-[#303030]"
          activeOpacity={0.6}
          onPress={() => setModalVisible(true)}
        >
          <View className="flex-row items-center justify-center">
            <Text className="text-white">See more</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color="#E9E9E9"
              className="mt-0.5 ml-1.5"
            />
          </View>
        </TouchableOpacity>

        {/* Include HashtagModal */}
        <HashtagModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          hashtagData={hashtagData}
        />
      </View>
    );
  };

  const renderMatches = () => {
    return (
      <View className="flex-row items-center pl-3.5 mt-10">
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

  // Top two live matches for each sport
  const singleLiveCricketMatch = liveCricketMatches?.slice(0, 2);
  const singleLiveFootballMatch = liveFootballMatches?.slice(0, 2);
  const singleLiveBasketballMatch = liveBasketballMatches?.slice(0, 2);

  const renderTrendingLiveMatches = () => {
    const isLoading =
      isCricketLiveFetching ||
      isFootballLiveFetching ||
      isBasketballLiveFetching;

    if (isLoading) {
      return (
        <View className="mt-5">
          <ActivityIndicator color={"white"} size={"small"} />
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
    { type: "swiper", content: renderSwiper() },
    { type: "divider", content: <View className="h-[1px] bg-[#1c1c1c]" /> },
    { type: "hashtags", content: renderHashtags() },
    { type: "discoverPeople", content: <DiscoverPeopleList /> },
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
        refetchSportArticles(),
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

export default TrendingAll;
