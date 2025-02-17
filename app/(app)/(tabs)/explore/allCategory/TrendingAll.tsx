import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Platform, FlatList, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Swiper from "react-native-swiper";
import TextScallingFalse from "~/components/CentralText";
import { Colors } from "~/constants/Colors";
import { ExploreImageBanner, hashtagData } from "~/constants/hardCodedFiles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { countryCodes } from "~/constants/countryCodes";
import Hashtag from "~/components/explorePage/hashtag";
import MatchCard from "~/components/explorePage/cricketMatchCard";
import { useGetLiveCricketMatchesQuery, useGetNextCricketMatchQuery } from "~/reduxStore/api/explore/cricketApi";
import NextMatchCard from "~/components/explorePage/cricketNextMatchCard";

const TrendingAll = () => {

  const { data: liveCricketMatches, error: liveError, isFetching: isFetchingLiveCricket, refetch: refetchLiveCricket } = useGetLiveCricketMatchesQuery({});
  console.log(liveCricketMatches)

  const { data: nextCricketMatches, error: nextCricketError, isFetching: isFetchingNextCricket, refetch: refetchNextCricket} = useGetNextCricketMatchQuery({});

  // const { data: nextMatch, error: nextError, isLoading: nextLoading } = useGetNextCricketMatchQuery();


  const renderSwiper = () => (
    <Swiper
      autoplay={true}
      autoplayTimeout={3}
      showsPagination={true}
      paginationStyle={{ bottom: 8, gap: 4 }}
      dotStyle={{
        backgroundColor: Colors.greyText,
        width: 6,
        height: 6,
        marginHorizontal: 20,
      }}
      activeDotStyle={{
        backgroundColor: "white",
        width: 7,
        height: 7,
        marginHorizontal: 20,
      }}
      style={{ height: 250, marginTop: 0.5 }}
    >
      {ExploreImageBanner.map((item, index) => (
        <View key={index} className="flex-1">
          <Image source={{ uri: item.url }} className="w-full h-72" resizeMode="cover" />
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
            className="absolute bottom-0 left-0 right-0 h-40"
          />
          <View className="absolute bottom-9 pl-5">
            <TextScallingFalse className="text-white text-6xl font-bold">{item.title}</TextScallingFalse>
            <View className="flex-row items-center">
              <TextScallingFalse className="text-[#12956B] text-xl font-bold text-start">
                {item.game}
              </TextScallingFalse>
              <TextScallingFalse className="text-white text-xl"> • {item.date}</TextScallingFalse>
              <TextScallingFalse className="text-white text-xl"> • {item.time}</TextScallingFalse>
            </View>
          </View>
        </View>
      ))}
    </Swiper>
  );

  const renderHashtags = () => (
    <View className="mt-7">
      {hashtagData.map((item, index) => (
        <Hashtag key={index} index={index + 1} hashtag={item.hashtag} postsCount={item.postsCount} />
      ))}
    </View>
  );

  const renderCricketLiveMatches = () => {
    return (
      <View className="mt-7">
        <View className="flex-row items-center justify-between pl-7 pr-10 mb-4">
          <View className="flex-row items-center ">
            <TextScallingFalse className="text-white text-6xl font-bold">Matches</TextScallingFalse>
            <MaterialCommunityIcons name="chevron-double-right" size={22} color="white" className="-mb-1" />
          </View>
          <MaterialCommunityIcons name="reload" size={22} color="grey" className="-mb-1" onPress={refetchLiveCricket} />
        </View>
        {/* {isFetching ? ( <ActivityIndicator size="large" color={Colors.themeColor} /> ) : ( */}
        <FlatList
          data={liveCricketMatches}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) =>
           <View className="h-56 w-96 bg-transparent rounded-2xl mr-5 border border-neutral-600 ">
            {isFetchingLiveCricket ? (<View className="h-full flex justify-center self-center items-center">
              <ActivityIndicator size="large"  color={Colors.themeColor} />
              </View>) : (
              <MatchCard match={item} isLive={true} />)}
          </View>}
          ListEmptyComponent={<View className="w-screen justify-center mt-10"><TextScallingFalse className="text-white self-center text-center pr-7">No live matches available</TextScallingFalse></View>}
        />
      </View>
    );
  };

  const renderCricketNextMatches = () => {
    return (
      <View className="mt-7">
        <View className="flex-row items-center justify-between pl-7 pr-10 mb-4">
            <TextScallingFalse className="text-white text-6xl font-bold">Don't Miss</TextScallingFalse>
          <MaterialCommunityIcons name="reload" size={22} color="grey" className="-mb-1" onPress={refetchNextCricket} />
        </View>
          {/* match card */}
          {nextCricketMatches ? (
          <View className="px-6">
            <View className="h-56 w-full rounded-2xl bg-neutral-900  mr-5 border border-neutral-600 ">
              {isFetchingNextCricket ? (<View className="h-full flex justify-center self-center items-center">
                <ActivityIndicator size="large"  color={Colors.themeColor} />
                </View>) : (
                <NextMatchCard match={nextCricketMatches} />)}
            </View>
          </View>) : (
            <View className="w-screen justify-center mt-10"><TextScallingFalse className="text-white self-center text-center pr-7">No Upcoming matches available</TextScallingFalse></View>
          )}
  
      </View>
    );
  };



  // Combine all sections into a single FlatList
  const sections = [
    { type: "swiper", content: renderSwiper() },
    { type: "divider", content: <View className="h-[0.6px] bg-neutral-600" /> },
    { type: "hashtags", content: renderHashtags() },
    { type: "CricketLiveMatches", content: renderCricketLiveMatches() },
    { type: "CricketNextMatches", content: renderCricketNextMatches() },
  ];

  return (
    <FlatList
      data={sections}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => item.content}
      contentContainerStyle={{ paddingBottom: 300 }}
    />
  );
};

export default TrendingAll;
