import React from "react";
import { View, FlatList, ActivityIndicator} from "react-native";
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
import FootballNextMatchCard from "~/components/explorePage/footballMatchCard";
import DiscoverPeopleList from "~/components/discover/discoverPeopleList";
import SwiperTop from "~/components/explorePage/SwiperTop"

const TrendingAll = () => {
  const renderSwiper = () => (
    <SwiperTop/>
  );

  const renderHashtags = () => (
    <View className="mt-7">
      {hashtagData.map((item, index) => (
        <Hashtag
          key={index}
          index={index + 1}
          hashtag={item.hashtag}
          postsCount={item.postsCount}
        />
      ))}
    </View>
  );

  const {
    data: cricketData,
    isFetching: isCricketFetching,
    refetch: refetchLiveCricket,
  } = useGetCricketMatchesQuery({});
  const { liveMatches: liveCricketMatches, nextMatch: nextCricketMatches } =
    cricketData || {};

  const renderTrendingLiveMatches = () => {}

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
          <MaterialCommunityIcons
            name="reload"
            size={22}
            color="grey"
            className="-mb-1"
            onPress={refetchLiveCricket}
          />
        </View>
        <FlatList
          data={liveCricketMatches}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <View className="h-56 w-96 bg-transparent rounded-2xl mr-5 border border-neutral-600 ">
              {isCricketFetching ? (
                <View className="h-full flex justify-center self-center items-center">
                  <ActivityIndicator size="large" color={Colors.themeColor} />
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
            <View className="h-56 w-full rounded-2xl bg-neutral-900 mr-5 border border-neutral-600 ">
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
            <View className="h-56 w-96 bg-transparent rounded-2xl mr-5 border border-neutral-600 ">
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
