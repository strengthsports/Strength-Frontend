import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Platform, FlatList, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Swiper from "react-native-swiper";
import TextScallingFalse from "~/components/CentralText";
import { Colors } from "~/constants/Colors";
import { ExploreImageBanner, hashtagData,  } from "~/constants/hardCodedFiles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { countryCodes } from "~/constants/countryCodes";
import Hashtag from "~/components/explorePage/hashtag";
import MatchCard from "~/components/explorePage/cricketMatchCard";
import DummyCricketData from "~/constants/dummyCricketData";

const TrendingAll = () => {
  const [liveCricketMatches, setLiveCricketMatches] = useState<any[]>([]);
  const [nextCricMatch, setNextCricMatch] = useState<any | null>(null);

  const fetchCricketLiveScores = async () => {
    try {
      const data = DummyCricketData;
      console.log(data);

      const liveMatchesData = data?.data?.filter((match: any) => match.ms === "live" && match.status !== "Match not started") || [];

      const prioritizedLiveMatches = liveMatchesData.sort((a, b) => {
        const aPriority = Object.keys(countryCodes).some((country) =>
          [a.t1, a.t2].some((team) =>
            team.toLowerCase().includes(country.toLowerCase())
          )
        )
          ? 1
          : 0;

        const bPriority = Object.keys(countryCodes).some((country) =>
          [b.t1, b.t2].some((team) =>
            team.toLowerCase().includes(country.toLowerCase())
          )
        )
          ? 1
          : 0;

      return bPriority - aPriority; // Higher priority first
    });
      console.log(prioritizedLiveMatches);
      setLiveCricketMatches(prioritizedLiveMatches);

      const nextMatch =
        data?.data
          ?.filter((match: any) => match.ms === "fixture")
          ?.sort((a: any, b: any) => new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime())[0] || null;

      setNextCricMatch(nextMatch);
    } catch (error) {
      console.error("Error fetching live scores:", error);
    }
  };

  useEffect(() => {
    fetchCricketLiveScores();
  }, []);

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

  const renderCricketLiveMatches = () => (
    <View className="mt-7">
      <View className="flex-row items-center pl-7">
        <TextScallingFalse className="text-white text-6xl font-bold">Matches</TextScallingFalse>
        <MaterialCommunityIcons name="chevron-double-right" size={22} color="white" className="-mb-1" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
        {liveCricketMatches.map((match) => (
          <MatchCard key={match.id} match={match} isLive={true} />
        ))}
      </ScrollView>
    </View>
  );

  // Combine all sections into a single FlatList
  const sections = [
    { type: "swiper", content: renderSwiper() },
    { type: "divider", content: <View className="h-[0.6px] bg-neutral-600" /> },
    { type: "hashtags", content: renderHashtags() },
    { type: "CricketLiveMatches", content: renderCricketLiveMatches() },
  ];

  return (
    <FlatList
      data={sections}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => item.content}
      contentContainerStyle={{ paddingBottom: 400 }}
    />
  );
};

export default TrendingAll;
