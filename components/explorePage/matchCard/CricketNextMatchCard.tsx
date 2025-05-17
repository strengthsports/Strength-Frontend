import { Image, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import TextScallingFalse from "../../CentralText";
import CountryFlag from "react-native-country-flag";
import { countryCodes } from "~/constants/countryCodes";
import teamLogos from "~/constants/teamLogos";
import NameFlagSubCard from ".././nameFlagSubCard";

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
  seriesId: number;
  seriesName: string;
  matches: MatchCardProps[];
}


const CricketNextMatchCard = ({
  seriesId,
  seriesName,
  matches,
}: GroupedMatchProps) => {
  const [numberOfLinesTitle, setNumberOfLinesTitle] = useState(1);
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

  return (
    <>
      {/* <View className="w-full h-full rounded-t-2xl bg-neutral-700" > */}

      {/* Title Section */}
      <View className="px-6 pt-3 pb-2 w-full rounded-t-xl bg-[#262626]">
        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={toggleNumberOfLines}
        >
          {/* <View className="py-1">
            <Image
              source={iplImg}
              className="w-[24px] h-[16px] rounded-[2px]"
            />
          </View> */}
          <TextScallingFalse
            className="text-white text-3xl w-[88%]"
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

      {matches &&
        matches.map((match) => (
          <View key={match.matchInfo.matchId}>
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
                  flag={match.matchInfo.team1.teamName}
                  teamName={match.matchInfo.team1.teamSName}
                />

                {/* Team 2 */}
                <NameFlagSubCard
                  flag={match.matchInfo.team2.teamName}
                  teamName={match.matchInfo.team2.teamSName}
                />
              </View>
              <View className="w-[1px] h-12 bg-neutral-700 absolute right-[124px] top-[26px]" />
              {/* Match Date and time */}
              <View className="items-center w-[84px]">
                {extractDateDayTime(match.matchInfo.startDate)}
              </View>
            </View>
          </View>
        ))}

      {/* <TextScallingFalse className="text-white text-center text-base mb-2">{match?.t1}</TextScallingFalse> */}
    </>
  );
};

export default CricketNextMatchCard;
