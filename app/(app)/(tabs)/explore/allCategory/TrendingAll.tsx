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
import { LinearGradient } from "expo-linear-gradient";
import Swiper from "react-native-swiper";
import TextScallingFalse from "~/components/CentralText";
import { Colors } from "~/constants/Colors";
import { ExploreImageBanner, hashtagData } from "~/constants/hardCodedFiles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Hashtag from "~/components/explorePage/hashtag";
import MatchCard from "~/components/explorePage/cricketMatchCard";
// import { useGetLiveCricketMatchesQuery, useGetNextCricketMatchQuery } from "~/reduxStore/api/explore/cricketApi";
import NextMatchCard from "~/components/explorePage/cricketNextMatchCard";
import { useGetCricketMatchesQuery } from "~/reduxStore/api/explore/cricketApi";
import { useGetFootballMatchesQuery } from "~/reduxStore/api/explore/footballApi";
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";
// import CricketLiveMatch from "~/components/explorePage/liveMatch/CricketLiveMatch";
// import CricketNextMatch from "~/components/explorePage/nextMatch/CricketNextMatch";
// import FootballLiveMatch from "~/components/explorePage/liveMatch/FootballLiveMatch";
// import FootballNextMatch from "~/components/explorePage/nextMatch/FootballNextMatch";
import FootballNextMatchCard from "~/components/explorePage/footballMatchCard";
import DiscoverPeopleList from "~/components/discover/discoverPeopleList";
import SwiperTop from "~/components/explorePage/SwiperTop";
import HashtagModal from "~/components/explorePage/hashtagModal";
import ScoresSkeletonLoader from "~/components/skeletonLoaders/ScoresSkeletonLoader";

const TrendingAll = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const { data: articles, error, isLoading } = useGetSportArticleQuery();

  const renderSwiper = () => {
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

  const renderTrendingLiveMatches = () => {};

  const renderCricketLiveMatches = () => {
    return (
      <View className="mt-7">
        <View className="flex-row items-center justify-between pl-7 pr-10 mb-4">
          <View className="flex-row items-center ">
            <TextScallingFalse className="text-white text-6xl font-bold">
              Matches
            </TextScallingFalse>
            <MaterialCommunityIcons
              name="chevron-double-right"
              size={22}
              color="white"
              className="-mb-1"
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={refetchLiveCricket}
            style={{
              width: 40,
              height: 20,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <MaterialCommunityIcons
              name="reload"
              size={22}
              color="grey"
              className="-mb-1"
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={liveCricketMatches}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <View className="h-52 w-96 bg-transparent rounded-2xl mr-5 border border-[#454545] ">
              {isCricketFetching ? (
                <View className="h-full flex justify-center self-center items-center">
                  {/* <ActivityIndicator size="large" color={Colors.themeColor} /> */}
                  <ScoresSkeletonLoader />
                </View>
              ) : (
                <MatchCard match={item} isLive={true} />
              )}
            </View>
          )}
          ListEmptyComponent={
            <View className="w-screen justify-center mt-10">
              <TextScallingFalse className="text-white self-center text-center pr-7">
                No live matches available
              </TextScallingFalse>
            </View>
          }
        />
      </View>
    );
  };

  const renderCricketNextMatches = () => {
    return (
      <View className="mt-7">
        <View className="flex-row items-center justify-between pl-7 pr-10 mb-4">
          <TextScallingFalse className="text-white text-6xl font-bold">
            Don't Miss
          </TextScallingFalse>
        </View>
        {nextCricketMatches ? (
          <View className="px-6">
            <View className="h-56 w-full rounded-2xl bg-[#0B0B0B] mr-5 border border-[#454545]">
              {isCricketFetching ? (
                <View className="h-full flex justify-center self-center items-center">
                  <ActivityIndicator size="large" color={Colors.themeColor} />
                </View>
              ) : (
                <NextMatchCard match={nextCricketMatches} />
              )}
            </View>
          </View>
        ) : (
          <View className="w-screen justify-center mt-10">
            <TextScallingFalse className="text-white self-center text-center pr-7">
              No Upcoming matches available
            </TextScallingFalse>
          </View>
        )}
      </View>
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
      <View className="mt-4">
        {/* <View className="flex-row items-center justify-end pl-7 pr-10 mb-4">
          <MaterialCommunityIcons
            name="reload"
            size={22}
            color="grey"
            className="-mb-1"
            onPress={refetchFootball}
          />
        </View> */}
        <FlatList
          data={liveFootballMatches}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <View className="h-48 w-96 bg-transparent rounded-2xl mr-5 border border-[#454545] ">
              {isFootballFetching ? (
                <View className="h-full flex justify-center self-center items-center">
                  <ActivityIndicator size="large" color={Colors.themeColor} />
                </View>
              ) : (
                <FootballNextMatchCard match={item} isLive={true} />
              )}
            </View>
          )}
          // ListEmptyComponent={
          //   <View className="w-screen justify-center mt-10">
          //     <TextScallingFalse className="text-white self-center text-center pr-7">
          //       No live matches available
          //     </TextScallingFalse>
          //   </View>
          // }
        />
      </View>
    );
  };

  const sections = [
    { type: "swiper", content: renderSwiper() },
    { type: "divider", content: <View className="h-[0.6px] bg-neutral-600" /> },
    { type: "hashtags", content: renderHashtags() },
    { type: "discoverPeople", content: <DiscoverPeopleList /> },
    { type: "CricketLiveMatches", content: renderCricketLiveMatches() },
    { type: "FootballLiveMatches", content: renderFootballLiveMatches() },
    { type: "CricketNextMatches", content: renderCricketNextMatches() },
  ];

  return (
    <View className="flex-1">
      <FlatList
        data={sections}
        keyExtractor={(item, index) => index.toString()}
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
