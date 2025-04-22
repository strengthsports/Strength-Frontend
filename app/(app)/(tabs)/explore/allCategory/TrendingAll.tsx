import React, { useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { ExploreImageBanner, hashtagData } from "~/constants/hardCodedFiles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Hashtag from "~/components/explorePage/hashtag";
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
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";
import DiscoverPeopleList from "~/components/discover/discoverPeopleList";
import SwiperTop from "~/components/explorePage/SwiperTop";
import HashtagModal from "~/components/explorePage/hashtagModal";
import CricketLiveMatch from "~/components/explorePage/liveMatch/CricketLiveMatch";
import CricketNextMatch from "~/components/explorePage/nextMatch/CricketNextMatch";
import FootballLiveMatch from "~/components/explorePage/liveMatch/FootballLiveMatch";
import FootballNextMatch from "~/components/explorePage/nextMatch/FootballNextMatch";
import TrendingLiveMatch from "~/components/explorePage/liveMatch/TrendingLiveMatch";
import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";
import SwipperSkeletonLoader from "~/components/skeletonLoaders/SwipperSkeletonLoader";
import HastagSkeletonLoader from "~/components/skeletonLoaders/HastagSkeletonLoader";
import { RefreshControl } from "react-native";
// import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";

const TrendingAll = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const renderSwiper = () => {
    const { data: articles, error, isLoading } = useGetSportArticleQuery();
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
    return <SwiperTop swiperData={articles ?? []} />;
  };

  const renderHashtags = () => (
    <View className="mt-10">
      {hashtagData ? (
        <>
          <Hashtag data={hashtagData.slice(0, 3)} />
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
        </>
      ) : (
        <HastagSkeletonLoader />
      )}
    </View>
  );

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
    { type: "swiper", content: renderSwiper() },
    { type: "divider", content: <View className="h-[0.6px] bg-neutral-600" /> },
    { type: "hashtags", content: renderHashtags() },
    { type: "discoverPeople", content: <DiscoverPeopleList /> },
    { type: "matches", content: renderMatches() },
    { type: "trendingLiveMatches", content: renderTrendingLiveMatches() },
    { type: "dontMiss", content: renderDontMiss() },
    { type: "cricketNextMatches", content: renderCricketNextMatches() },
    { type: "footballNextMatches", content: renderFootballNextMatches() },
  ];

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
