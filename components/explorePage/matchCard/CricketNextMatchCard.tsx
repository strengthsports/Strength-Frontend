import { Image, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import TextScallingFalse from "../../CentralText";
import CountryFlag from "react-native-country-flag";
import { countryCodes } from "~/constants/countryCodes";
import teamLogos from "~/constants/teamLogos";
import NameFlagSubCard from ".././nameFlagSubCard";

// interface MatchCardProps {
//   match: {
//     id: string;
//     series: string;
//     matchType: string;
//     t1: string;
//     t1s: string;
//     t2: string;
//     t2s: string;
//     status: string;
//     tournamentImg?: string;
//     dateTimeGMT: string;
//   };
//   isLive?: boolean;
// }

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

const CricketNextMatchCard = ({ match }: MatchCardProps) => {
  const [numberOfLinesTitle, setNumberOfLinesTitle] = useState(1);
  const toggleNumberOfLines = () => {
    setNumberOfLinesTitle((prev) => (prev === 1 ? 2 : 1));
  };

  //Extracting match day and match date
  const parts = match.date_wise.split(", ");
  const fullDay = parts[1]; // "Wednesday"
  const shortDay = fullDay.slice(0, 3); // "Wed"
  const matchDate = match.match_date.replace("-", " ");

  return (
    <>
      {/* <View className="w-full h-full rounded-t-2xl bg-neutral-700" > */}

      {/* Title Section */}
      <View className="px-6 pt-3 mt-[0.7] pb-2 w-full h-16 rounded-t-2xl bg-[#262626]">
        <TouchableOpacity
          className="flex-row items-center w-4/5 gap-2"
          onPress={toggleNumberOfLines}
        >
          {/* {match?.tournamentImg && (
            <View className="p-1 rounded-md">
              <Image
                source={{ uri: match?.tournamentImg }}
                className="w-8 h-8 rounded-md self-center"
              />
            </View>
          )} */}
          <TextScallingFalse
            className="text-white text-3xl w-4/5"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
          >
            {match.series}
          </TextScallingFalse>
        </TouchableOpacity>

        {/* Game Type and Round */}
        <View className="flex-row items-center p-1">
          <TextScallingFalse className="text-theme text-base font-bold">
            {"\u25B6"} Cricket{" "}
          </TextScallingFalse>
        </View>
      </View>

      <View className="h-[0.8] bg-neutral-700" />

      <View className="pl-10 pt-5">
        <TextScallingFalse className="text-[#9E9E9E] text-base uppercase">
          {" \u2022 "} {match.match_type}
        </TextScallingFalse>
      </View>
      <View className="flex-row items-center justify-between px-10 pt-5">
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
            {shortDay} {matchDate}
          </TextScallingFalse>
          <TextScallingFalse className="text-neutral-300 text-center text-base">
            {match.match_time}
          </TextScallingFalse>
        </View>
      </View>

      {/* <TextScallingFalse className="text-white text-center text-base mb-2">{match?.t1}</TextScallingFalse> */}
    </>
  );
};
export default CricketNextMatchCard;
