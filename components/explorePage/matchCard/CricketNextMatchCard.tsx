import { Image, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import TextScallingFalse from "../../CentralText";
import CountryFlag from "react-native-country-flag";
import { countryCodes } from "~/constants/countryCodes";
import teamLogos from "~/constants/teamLogos";
import NameFlagSubCard from ".././nameFlagSubCard";

interface MatchCardProps {
  match: {
    // Match Identification
    match_id: number;
    match_status: string;
    match_type: string;
    matchs: string; // e.g., "36th Match"
    series: string;
    series_id: number;
    series_type: string;

    // Date & Time
    match_date: string; // e.g., "19-Apr"
    match_time: string; // e.g., "07:30 PM"
    date_wise: string; // e.g., "19 Apr 2025, Saturday"

    // Venue
    venue: string;
    venue_id: number;

    // Team A Details
    team_a_id: number;
    team_a: string;
    team_a_short: string;
    team_a_img: string;

    // Team B Details
    team_b_id: number;
    team_b: string;
    team_b_short: string;
    team_b_img: string;

    // Favorites & Odds
    fav_team: string;
    min_rate: string;
    max_rate: string;

    // Special Match Info
    is_hundred: number;
  };
}

interface GroupedMatchProps {
  series: string;
  groupedMatches: MatchCardProps["match"][];
}

const iplImg = require("~/assets/images/ipl.png");

const CricketNextMatchCard = ({
  series,
  groupedMatches,
}: GroupedMatchProps) => {
  const [numberOfLinesTitle, setNumberOfLinesTitle] = useState(1);
  const toggleNumberOfLines = () => {
    setNumberOfLinesTitle((prev) => (prev === 1 ? 2 : 1));
  };

  const extractMatchNum = (matchNum: string): string | null => {
    const match = matchNum.match(/\d+/);
    const number = match ? match[0] : null;

    return `${number} of 74`;
  };

  //Extracting match day and match date
  const extractDayAndDate = (
    match_dateWise: string,
    match_date: string
  ): string | null => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayFormatted = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    const parts = match_dateWise.split(", ");
    const fullDay = parts[1]; // "Wednesday"
    let shortDay = fullDay.slice(0, 3); // "Wed"
    shortDay += ", ";
    let matchDate = match_date.replace("-", " ");
    // matchDate = "," + matchDate;
    const trimMatchDate = matchDate.split(" ")[0].slice(1, matchDate.length);
    if (todayFormatted.includes(trimMatchDate)) {
      matchDate = "Today,";
      shortDay = "";
    }
    if (tomorrowFormatted.includes(trimMatchDate)) {
      matchDate = "Tomorrow,";
      shortDay = "";
    }
    return `${shortDay}${matchDate}`;
  };

  return (
    <>
      {/* <View className="w-full h-full rounded-t-2xl bg-neutral-700" > */}

      {/* Title Section */}
      <View className="px-6 pt-3 mt-[0.7] pb-2 w-full h-16 rounded-t-2xl bg-[#262626]">
        <TouchableOpacity
          className="flex-row items-center w-4/5 gap-2"
          onPress={toggleNumberOfLines}
        >
          <View className="py-1 pl-1">
            <Image
              source={iplImg}
              className="w-[24px] h-[14px] rounded-[2px] self-center"
            />
          </View>
          <TextScallingFalse
            className="text-white text-3xl w-4/5"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
          >
            {series}
          </TextScallingFalse>
        </TouchableOpacity>

        {/* Game Type and Round */}
        <View className="flex-row items-center p-1">
          <TextScallingFalse className="text-theme text-base font-bold">
            {"\u25B6"} Cricket{" "}
          </TextScallingFalse>
        </View>
      </View>

      {groupedMatches.map((match) => (
        <View key={match.match_id}>
          <View className="h-[0.8] bg-neutral-700" />
          <View className="pl-10 pt-5">
            <TextScallingFalse className="text-[#9E9E9E] text-base">
              {match.match_type}
              {" \u2022 "}
              {extractMatchNum(match.matchs)}
            </TextScallingFalse>
          </View>
          <View className="flex-row items-center justify-between px-10 p-7">
            <View className="flex-column gap-y-3">
              {/* view 1 */}
              <NameFlagSubCard
                flag={match.team_a_img}
                teamName={match.team_a_short}
              />

              {/* view 3 */}
              <NameFlagSubCard
                flag={match.team_b_img}
                teamName={match.team_b_short}
              />
            </View>
            <View className="w-[1px] h-12 bg-neutral-700 ml-28" />
            {/* view 2 */}
            <View className="items-center">
              <TextScallingFalse className="text-neutral-300 text-center text-base">
                {extractDayAndDate(match.date_wise, match.match_date)}
              </TextScallingFalse>
              <TextScallingFalse className="text-neutral-300 text-center text-base">
                {match.match_time}
              </TextScallingFalse>
            </View>
          </View>
        </View>
      ))}

      {/* <TextScallingFalse className="text-white text-center text-base mb-2">{match?.t1}</TextScallingFalse> */}
    </>
  );
};
export default CricketNextMatchCard;
