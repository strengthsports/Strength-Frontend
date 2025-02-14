import React, { useEffect, useState } from "react";
import { View, Image, ScrollView, Text, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Swiper from "react-native-swiper";
import TextScallingFalse from "~/components/CentralText"; 
import { Colors } from "~/constants/Colors";
import { ExploreImageBanner, hashtagData, DummyCricketData } from "~/constants/hardCodedFiles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { countryCodes } from "~/constants/countryCodes";
import Hashtag from "~/components/explorePage/hashtag";
import MatchCard from "~/components/explorePage/cricketMatchCard";
import { FlatList } from "react-native-gesture-handler";
// import NameFlagSubCard from "~/components/explorePage/nameFlagSubCard"; // Assuming this is the correct path

const TrendingAll = () => {
  const [liveCricketMatches, setLiveCricketMatches] = useState<any[]>([]);
  const [nextCricMatch, setNextCricMatch] = useState<any | null>(null);
  
  const determineColor = (teamScore: string, opponentScore: string, matchStatus: string, isTeam1: boolean): string => {
    const teamScoreNum = teamScore ? parseInt(teamScore) : null;
    const opponentScoreNum = opponentScore ? parseInt(opponentScore) : null;
  
    if (matchStatus && matchStatus.toLowerCase().includes("won")) {
      return "transparent";
    }
  
    if (matchStatus === "ended") {
      if (Math.abs((teamScoreNum || 0) - (opponentScoreNum || 0)) < 6) {
        return "transparent";
      }
      return "transparent";
    }
  
    if (
      (teamScore === "" && opponentScore === "Yet to bat") ||
      (opponentScore === "" && teamScore === "Yet to bat")
    ) {
      return "transparent";
    }
  
    if (teamScore === "") {
      return isTeam1 ? "green" : "transparent";
    }
  
    if (opponentScore === "") {
      return isTeam1 ? "transparent" : "green";
    }
  
    if (teamScoreNum !== null && opponentScoreNum !== null && teamScoreNum < opponentScoreNum) {
      return "green";
    }
  
    return "transparent";
  };

  const fetchCricketLiveScores = async () => {
    try {
        const data = DummyCricketData;
        console.log(data);

        const liveMatchesData = data?.data?.filter((match: any) => match.ms === 'live' && match.status !== 'Match not started') || [];

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

        const nextMatch = data?.data
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

  const getCountryCode = (teamName: string): string => {
    // Implement this function to return the country code based on the team name
    return "IN"; // Placeholder
  };

  

  return (
    <ScrollView contentContainerStyle={{ paddingBottom:400}}>
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
            <Image
              source={{ uri: item.url }}
              className="w-full h-72" 
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
              className="absolute bottom-0 left-0 right-0 h-40" 
            />

            <View className="absolute bottom-9 pl-5">
              <TextScallingFalse className="text-white text-6xl font-bold">
                {item.title}
              </TextScallingFalse>

              <View className="flex-row items-center"> 
                <TextScallingFalse className="text-[#12956B] text-xl font-bold text-start">
                  {item.game}
                </TextScallingFalse>
                <TextScallingFalse className="text-white text-xl">
                  {" "}
                  • {item.date}
                </TextScallingFalse>
                <TextScallingFalse className="text-white text-xl">
                  {" "}
                  • {item.time}
                </TextScallingFalse>
              </View>
            </View>
          </View>
        ))}
      </Swiper>
      <View className="h-[0.6px] bg-neutral-600 " />

      {/* hashtags */}
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
      <View className="flex-row items-center pl-7 mt-7">
        <TextScallingFalse className="text-white text-6xl font-bold">Matches</TextScallingFalse>
        <MaterialCommunityIcons
          name="chevron-double-right"
          size={22}
          color="white"
          className="-mb-1"
        />
      </View>

      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 20 * scaleFactor, gap: 24 * scaleFactor}} >
        {liveCricketMatches.map((match) => (
          <View key={match.id} style={styles.matchCardContainer}>
            <MatchCard
              title={match.series}
              game="Cricket"
              roundDescription={match.matchType}
              islive={true}
            />
            
            Team 1
            <View style={styles.otherSportsContainer}>
              <NameFlagSubCard flag={getCountryCode(match.t1)} teamName={match.t1} />
              <Text
                style={[
                  styles.otherSportsTeamName,
                  { 
                    color: match.t1s === '' ? 'grey' : 'white'
                  },
                ]}
              >
                {match.t1s === '' ? 'Yet to bat' : match.t1s}
                <Text style={{fontSize: 9, color: match.t1s === '' ? 'transparent' : determineColor(match.t1s, match.t2s, match.status, true)}}> &#9664;</Text>
              </Text>
            </View>

            Team 2
            <View style={styles.otherSportsContainer}>
              <NameFlagSubCard
                flag={getCountryCode(match.t2)}
                teamName={match.t2}
              />
              <Text
                style={[
                  styles.otherSportsTeamName,
                  {
                    color: match.t2s === "" ? "grey" : "white",
                  },
                ]}
              >
                {match.t2s === "" ? "Yet to bat" : match.t2s}
                <Text
                  style={{
                    fontSize: 9,
                    color: match.t2s === "" ? "transparent" : determineColor(match.t2s, match.t1s, match.status, false),
                  }}
                >
                  {" "}
                  &#9664;
                </Text>
              </Text>
            </View>

            Match Status
            <Text
              style={{
                position: "absolute",
                color: Colors.greyText,
                fontSize: 10,
                bottom: 10,
                left: 16,
              }}
            >
              {match.status}
            </Text>
          </View>
        ))}
      </ScrollView> */}

      {/* <MatchCard title='Premiere Leagure Cricket Match sadsa ads ad' game='Football' roundDescription='Round 5' islive={true} tournamentImg='https://images.unsplash.com/photo-1739389716979-d62f1d6fe559?q=80&w=2079&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' /> */}

      <FlatList
        data={liveCricketMatches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20,  }}
        renderItem={({ item }) => (
        <MatchCard
          key={item.id}
          match={item} // Pass the entire match object
          // getCountryCode={getCountryCode} // Pass the getCountryCode function if needed
          // determineColor={determineColor} // Pass the determineColor function if needed
          isLive={true}
        />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        // contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      {/* {liveCricketMatches.map((match) => (

  ))} */}

    </ScrollView>
  );
};

export default TrendingAll;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  exploreText: {
    marginLeft: 20,
    marginTop: 5,
    fontSize: 22,
    color: "white",
    fontWeight: "500",
  },
  plusIcon: {
    marginLeft: 230,
    marginTop: 11,
  },
  messageIcon: {
    marginTop: 11,
    marginLeft: 8,
  },
  centeredScrollView: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  scrollViewContent: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  categoryText: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    fontSize: 12,
    overflow: "hidden",
  },
  underline: {
    width: "68%",
    height: 4,
    backgroundColor: "#12956B",
    marginHorizontal: 20,
    alignSelf: "center",
    borderRadius: 5,
  },
  contentSection: {
    marginTop: 20,
  },
  comingSoonContainer: {
    alignItems: "center",
    marginVertical: "30%",
  },
  gradientCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#12956B",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  comingSoonText: {
    width: 350,
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    paddingEnd: 22,
    marginTop: 13,
  },
  matchCardContainer: {
    marginVertical: 10,
    borderRadius: 8,
    borderColor: "grey",
    borderWidth: Platform.OS === "android" ? 0.3 : 0.4,
    width: 340,
    height: 200,
  },
  teamName: {
    color: "white",
    fontSize: 11,
    textAlign: "center",
  },
  otherSportsTeamName: {
    color: "white",
    fontSize: 12,
  },
  otherSportsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 16,
    marginRight: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  badmintonScores: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  cricketNextMatchInteriorColoumn: {
    alignItems: 'center',
    flex: 1,
    marginTop: 12
  },
  footballInteriorColoumn: {
    alignItems: 'center',
    flex: 1,
  },
  scoreText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  halfText: {
    color: "grey",
    fontSize: 8,
    marginTop: 4,
  },
  timeText: {
    color: "grey",
    fontSize: 8,
  },
});