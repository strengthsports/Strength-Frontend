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
import { useGetCricketMatchesQuery } from "~/reduxStore/api/explore/cricketApi";
import { useGetFootballMatchesQuery } from "~/reduxStore/api/explore/footballApi";
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
// import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";

const TrendingAll = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderSwiper = () => {
    const { data: articles, error, isLoading } = useGetSportArticleQuery();
    if (isLoading) {
      return (
        <SwipperSkeletonLoader />
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

  const renderHashtags = () => (
    <View className="mt-10">
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

  const renderCricketNextMatches = () => {
    return (
      <CricketNextMatch
        nextMatch={nextCricketMatches}
        isFetching={isCricketFetching}
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

export default TrendingAll;
