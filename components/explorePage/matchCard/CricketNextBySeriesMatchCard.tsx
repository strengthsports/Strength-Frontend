import { Image, TouchableOpacity, View, FlatList } from "react-native";
import { useState } from "react";
import TextScallingFalse from "../../CentralText";
import CountryFlag from "react-native-country-flag";
import { countryCodes } from "~/constants/countryCodes";
import teamLogos from "~/constants/teamLogos";
import NameFlagSubCard from ".././nameFlagSubCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface MatchCardProps {
  matchInfo: {
    matchId: number;
    seriesId: number;
    seriesName: string;
    matchDesc: string;
    matchFormat: string;
    startDate: string;
    endDate: string;
    state: string;
    status: string;
    stateTitle: string;

    team1: {
      teamId: number;
      teamName: string;
      teamSName: string;
      imageId: number;
    };
    team2: {
      teamId: number;
      teamName: string;
      teamSName: string;
      imageId: number;
    };

    venueInfo: {
      id: number;
      ground: string;
      city: string;
      timezone: string;
      latitude: string;
      longitude: string;
    };

    currBatTeamId?: number;
    seriesStartDt: string;
    seriesEndDt: string;
    isTimeAnnounced: boolean;
  };
}

interface GroupedMatchProps {
  matches: MatchCardProps[];
}

const iplImg = require("~/assets/images/ipl.png.png");

const CricketNextBySeriesMatchCard = ({ matches }: GroupedMatchProps) => {
  const [numberOfLinesTitle, setNumberOfLinesTitle] = useState(1);
  const initialSeriesName =
    matches?.[0]?.matchInfo?.seriesName ?? "Upcoming Matches";
  const [seriesName, setSeriesName] = useState(initialSeriesName);
  const [visibleCount, setVisibleCount] = useState(3);
  const loadMoreMatches = () => {
    setVisibleCount((prev) => prev + 3);
  };
  const isAllMatchesLoaded = visibleCount >= matches.length;
  //   console.log(matches);

  const toggleNumberOfLines = () => {
    setNumberOfLinesTitle((prev) => (prev === 1 ? 2 : 1));
  };

  const extractMatchNum = (matchNum: string): string | null => {
    const match = matchNum.match(/\d+/);
    const number = match ? match[0] : null;

    return `${number}`;
  };

  const extractDateDayTime = (epochString: string) => {
    const date = new Date(Number(epochString));

    const shortDay = date.toLocaleDateString("en-US", { weekday: "short" }); // e.g., "Sat"
    const matchDate = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    }); // e.g., "10 May 2025"
    const matchTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // e.g., "09:00 AM"

    return (
      <>
        <TextScallingFalse className="text-neutral-300 text-center text-base">
          {shortDay}, {matchDate}
        </TextScallingFalse>
        <TextScallingFalse className="text-neutral-300 text-center text-base">
          {matchTime}
        </TextScallingFalse>
      </>
    );
  };

  const renderItem = ({ item }: { item: MatchCardProps }) => {
    const match = item;

    return (
      <>
        <View className="h-[1px] bg-[#262626]" />

        <View className="pl-6 pt-5">
          <TextScallingFalse className="text-[#9E9E9E] text-base">
            {match.matchInfo.matchFormat}
            {" \u2022 "}
            {extractMatchNum(match.matchInfo.matchDesc)}
          </TextScallingFalse>
        </View>
        <View className="flex-row items-center justify-between p-6">
          <View className="flex-column gap-y-3">
            {/* Team 1 */}
            <NameFlagSubCard
              flag={match.matchInfo.team1.teamSName}
              teamName={match.matchInfo.team1.teamSName}
            />

            {/* Team 2 */}
            <NameFlagSubCard
              flag={match.matchInfo.team2.teamSName}
              teamName={match.matchInfo.team2.teamSName}
            />
          </View>
          <View className="w-[1px] h-12 bg-neutral-700 absolute right-[124px] top-[26px]" />
          {/* Match Date and time */}
          <View className="items-center w-[84px]">
            {extractDateDayTime(match.matchInfo.startDate)}
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      {/* <View className="w-full h-full rounded-t-2xl bg-neutral-700" > */}

      {/* Title Section */}
      <View className="px-6 pt-3 pb-2 w-full rounded-t-xl bg-[#262626]">
        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={toggleNumberOfLines}
        >
          <View className="py-1">
            <Image
              source={iplImg}
              className="w-[24px] h-[16px] rounded-[2px] self-center"
            />
          </View>
          <TextScallingFalse
            className="text-white text-3xl w-[88%] "
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
          >
            {seriesName}
          </TextScallingFalse>
        </TouchableOpacity>

        {/* Game Type and Round */}
        <View className="flex-row items-center mt-2">
          <TextScallingFalse className="text-theme text-base font-semibold">
            {"\u25B6"} Cricket{" "}
          </TextScallingFalse>
        </View>
      </View>

      <FlatList
        data={matches.slice(0, visibleCount)}
        keyExtractor={(item) => item.matchInfo.matchId.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
      />
      {!isAllMatchesLoaded && (
        <TouchableOpacity
          className="mt-3 mb-10 pt-3 pb-3 px-8 flex self-center rounded-full border border-[1px] border-[#303030]"
          activeOpacity={0.6}
          onPress={loadMoreMatches}
        >
          <View className="flex-row items-center justify-center">
            <TextScallingFalse className="text-white">
              See more
            </TextScallingFalse>
            <MaterialCommunityIcons
              name="chevron-down"
              size={18}
              color="#E9E9E9"
              className="mt-0.5 ml-1.5"
            />
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default CricketNextBySeriesMatchCard;
