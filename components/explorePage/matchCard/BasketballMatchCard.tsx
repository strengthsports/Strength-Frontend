import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import NameFlagSubCard from "../nameFlagSubCard";
import { countryCodes } from "~/constants/countryCodes";

interface MatchCardProps {
  match: {
    id: number;
    date: string;
    time: string;
    venue: string;
    status: {
      long: string;
      short: string;
      timer: string;
    };
    league: {
      id: number;
      name: string;
      type: string;
      season: number;
      logo: string;
    };
    country: {
      id: number;
      name: string;
      code: string;
      flag: string;
    };
    teams: {
      home: {
        id: number;
        name: string;
        logo: string;
      };
      away: {
        id: number;
        name: string;
        logo: string;
      };
    };
    scores: {
      home: {
        quarter_1: number;
        quarter_2: number;
        quarter_3: number;
        quarter_4: number;
        over_time: number | null;
        total: number;
      };
      away: {
        quarter_1: number;
        quarter_2: number;
        quarter_3: number;
        quarter_4: number;
        over_time: number | null;
        total: number;
      };
    };
  };
  isLive?: boolean;
}

type ScoreKey =
  | "quarter_1"
  | "quarter_2"
  | "quarter_3"
  | "quarter_4"
  | "over_time";

const extractShortName = (teamName: string) => {
  // Match all words in the team name
  const words = teamName.match(/\b\w+/g);

  if (!words) return teamName;

  // For single-word teams like "Changhua", return first 3 uppercase letters
  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase();
  }

  // For multi-word teams, take the first letter of each word and return uppercase
  return words.map((word) => word[0].toUpperCase()).join("");
};

const BasketballMatchCard = ({ match, isLive }: MatchCardProps) => {
  const opacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLive, opacityValue]);

  const [numberOfLinesTitle, setNumberOfLinesTitle] = useState(1);
  const toggleNumberOfLines = () => {
    setNumberOfLinesTitle((prev) => (prev === 1 ? 2 : 1));
  };

  const rawScores = match.scores;

  const scoreKeys: { key: ScoreKey; label: string }[] = [
    { key: "quarter_1", label: "Q1" },
    { key: "quarter_2", label: "Q2" },
    { key: "quarter_3", label: "Q3" },
    { key: "quarter_4", label: "Q4" },
    { key: "over_time", label: "OT" },
  ];

  const scoreColumns = [
    ...scoreKeys
      .map(({ key, label }) => ({
        label,
        home: rawScores.home[key],
        away: rawScores.away[key],
      }))
      .filter((item) => item.home !== null || item.away !== null), // Remove columns where both home and away are null
  ];

  scoreColumns.push({
    label: "Total",
    home: rawScores.home.total,
    away: rawScores.away.total,
  });
  scoreColumns.reverse();

  return (
    <>
      {/* Tittle Section */}
      <View className="px-4 pt-3 pb-2">
        <TouchableOpacity
          className="flex-row items-center w-[280px] gap-2"
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
          <View className="w-4/5 flex-row items-center">
            <TextScallingFalse
              className="text-[#EAEAEA] text-2xl w-4/5"
              numberOfLines={numberOfLinesTitle}
              ellipsizeMode="tail"
            >
              {match.country.name} -{match.league.name}
            </TextScallingFalse>
          </View>
        </TouchableOpacity>

        {/* Sport Name and Round */}
        <View className="flex-row items-center py-1">
          <TextScallingFalse className="text-theme text-base font-bold">
            {"\u25B6"} Basketball
          </TextScallingFalse>
          <TextScallingFalse className="text-[#919191] text-base">
            {" \u2022 "} {match.status.long}
          </TextScallingFalse>
        </View>
      </View>

      {/* Live Indicator */}
      {isLive && (
        <View className="rounded-full absolute right-5 top-3 bg-[#BC3D40] px-[7px] flex-row items-center justify-center">
          <Animated.Text
            className="text-xs text-white font-bold"
            style={[
              { opacity: opacityValue },
              { fontSize: 14, lineHeight: 20 }, // Adjust to match LIVE text height
            ]}
          >
            &bull;
          </Animated.Text>
          <TextScallingFalse className="ml-1 text-[11px] text-white font-semibold">
            LIVE
          </TextScallingFalse>
        </View>
      )}

      {/* Border */}
      <View className="h-[0.8] bg-[#252525] my-1" />

      {/* Teams & Scores Section */}

      <View className="mt-1">
        <View className="mt-5 px-5">
          {/* Team 1 */}
          <View className="flex-row items-center justify-between mt-2 mb-1">
            <NameFlagSubCard
              flag={match.teams.home.logo}
              teamName={extractShortName(match.teams.home.name)}
            />
          </View>

          {/* Team 2 */}
          <View className="flex-row items-center justify-between mt-2 mb-1">
            <NameFlagSubCard
              flag={match.teams.away.logo}
              teamName={extractShortName(match.teams.away.name)}
            />
          </View>
        </View>

        {/* Home team and away team scores */}
        <View className="max-w-[150px] absolute right-3 mt-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 0 }}
            nestedScrollEnabled={true}
          >
            <View className="flex-column">
              {/* Header Row */}
              <View className="flex-row mb-2">
                {scoreColumns.map((item) => (
                  <TextScallingFalse
                    key={item.label}
                    className="text-neutral-400 text-sm text-center mx-1 w-10"
                  >
                    {item.label}
                  </TextScallingFalse>
                ))}
              </View>

              {/* Home Team Scores */}
              <View className="flex-row mb-3.5">
                {scoreColumns.map((item) => (
                  <TextScallingFalse
                    key={`home-${item.label}`}
                    className={`text-lg text-center mx-1 w-10 ${
                      item.label === "Total" ? "font-bold" : "font-normal"
                    }
                    ${
                      item.label !== "Total" ? "text-[#A7A7A7]" : "text-white"
                    }`}
                  >
                    {item.home}
                  </TextScallingFalse>
                ))}
              </View>

              {/* Away Team Scores */}
              <View className="flex-row">
                {scoreColumns.map((item) => (
                  <TextScallingFalse
                    key={`away-${item.label}`}
                    className={`text-lg text-center mx-1 w-10 ${
                      item.label === "Total" ? "font-bold" : "font-normal"
                    }
                  ${item.label !== "Total" ? "text-[#A7A7A7]" : "text-white"}`}
                  >
                    {item.away}
                  </TextScallingFalse>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Match Status */}
      {/* <TextScallingFalse className="absolute bottom-4 left-4 text-neutral-400 text-base mt-2">
        {match.status.long} - {match.status.timer}
      </TextScallingFalse> */}
    </>
  );
};

export default BasketballMatchCard;
