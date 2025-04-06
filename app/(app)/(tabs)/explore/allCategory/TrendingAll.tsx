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
// import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";

const TrendingAll = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderSwiper = () => {
    const { data: articles, error, isLoading } = useGetSportArticleQuery();
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
          Error loading articles.
        </TextScallingFalse>
      );
    }
    return <SwiperTop swiperData={articles ?? []} />;
  };

  const renderHashtags = () => (
    <View className="mt-10">
      <Hashtag data={hashtagData.slice(0, 3)} />
      <TouchableOpacity
        className="bg-[#303030] my-5 py-3 px-14 w-full max-w-96 flex self-center rounded-full"
        activeOpacity={0.6}
        onPress={() => setModalVisible(true)}
      >
        <View className="flex-row items-center justify-center">
          <Text className="text-[#E9E9E9] font-semibold">See more</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color="#E9E9E9"
            className="mt-1 ml-1.5"
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

  const {
    data: cricketData,
    isFetching: isCricketFetching,
    refetch: refetchLiveCricket,
  } = useGetCricketMatchesQuery({});
  const { liveMatches: liveCricketMatches, nextMatch: nextCricketMatches } =
    cricketData || {};

  // const renderTrendingLiveMatches = () => {};

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

  const {
    data: footballData,
    isFetching: isFootballFetching,
    refetch: refetchFootball,
  } = useGetFootballMatchesQuery({});
  const { liveMatches: liveFootballMatches, nextMatch: nextFootballMatches } =
    footballData || {};

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
    { type: "swiper", content: renderSwiper() },
    { type: "divider", content: <View className="h-[0.6px] bg-neutral-600" /> },
    { type: "hashtags", content: renderHashtags() },
    { type: "discoverPeople", content: <DiscoverPeopleList /> },
    { type: "CricketLiveMatches", content: renderCricketLiveMatches() },
    { type: "FootballLiveMatches", content: renderFootballLiveMatches() },
    { type: "CricketNextMatches", content: renderCricketNextMatches() },
    { type: "FootballNextMatches", content: renderFootballNextMatches() },
  ];

  return (
    <View className="flex-1">
      <FlatList
        data={sections}
        keyExtractor={(item) => item.type}
        // keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => item.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <View>{/* Add any additional header content here if needed */}</View>
        }
      />
    </View>
  );
};

export default TrendingAll;
