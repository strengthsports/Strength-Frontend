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

    // Parse the match date properly
    // match_date example: "19-Apr"
    const currentYear = today.getFullYear();
    const matchDateParts = match_date.split("-");
    const matchDay = parseInt(matchDateParts[0], 10);
    const matchMonthStr = matchDateParts[1];

    const monthMap: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const matchMonth = monthMap[matchMonthStr];
    if (matchMonth === undefined) {
      console.error("Invalid month:", matchMonthStr);
      return null;
    }

    const matchDateObj = new Date(currentYear, matchMonth, matchDay);

    // Compare only dates, ignore time
    const isToday =
      matchDateObj.getFullYear() === today.getFullYear() &&
      matchDateObj.getMonth() === today.getMonth() &&
      matchDateObj.getDate() === today.getDate();

    const isTomorrow =
      matchDateObj.getFullYear() === tomorrow.getFullYear() &&
      matchDateObj.getMonth() === tomorrow.getMonth() &&
      matchDateObj.getDate() === tomorrow.getDate();

    const parts = match_dateWise.split(", ");
    const fullDay = parts[1] || ""; // "Saturday"
    let shortDay = fullDay.slice(0, 3); // "Sat"
    shortDay += ", ";
    let formattedMatchDate = match_date.replace("-", " ");

    if (isToday) {
      formattedMatchDate = "Today,";
      shortDay = "";
    } else if (isTomorrow) {
      formattedMatchDate = "Tomorrow,";
      shortDay = "";
    }

    return `${shortDay}${formattedMatchDate}`;
  };

  return (
    <>
      {/* <View className="w-full h-full rounded-t-2xl bg-neutral-700" > */}

      {/* Title Section */}
      <View className="px-6 pt-3 mt-[0.7] pb-2 w-full h-16 rounded-t-xl bg-[#262626]">
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

          <View className="pl-6 pt-5">
            <TextScallingFalse className="text-[#9E9E9E] text-base">
              {match.match_type}
              {" \u2022 "}
              {extractMatchNum(match.matchs)}
            </TextScallingFalse>
          </View>
          <View className="flex-row items-center justify-between p-6">
            <View className="flex-column gap-y-3">
              {/* Team 1 */}
              <NameFlagSubCard
                flag={match.team_a_img}
                teamName={match.team_a_short}
              />

              {/* Team 2 */}
              <NameFlagSubCard
                flag={match.team_b_img}
                teamName={match.team_b_short}
              />
            </View>
            <View className="w-[1px] h-12 bg-neutral-700 absolute right-[124px] top-[26px]" />
            {/* Match Date and time */}
            <View className="items-center w-[84px]">
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
