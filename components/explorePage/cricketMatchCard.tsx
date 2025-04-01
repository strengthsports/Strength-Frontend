import React, { useEffect, useRef, useState } from "react";
import { View, Image, TouchableOpacity, Animated } from "react-native";
import TextScallingFalse from "~/components/CentralText";
import NameFlagSubCard from "./nameFlagSubCard";
import { countryCodes } from "~/constants/countryCodes";

interface MatchCardProps {
  match: {
    id: string;
    series: string;
    matchType: string;
    t1: string;
    t1s: string;
    t2: string;
    t2s: string;
    status: string;
    tournamentImg?: string;
  };
  isLive?: boolean;
}

const MatchCard = ({ match, isLive }: MatchCardProps) => {
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

  const getCountryCode = (teamName: string) =>
    countryCodes[teamName as keyof typeof countryCodes] || "Unknown";

  const determineBatsman = ({
    teamScore,
    opponentScore,
    matchStatus,
    isTeam1,
  }: {
    teamScore: string;
    opponentScore: string;
    matchStatus: string;
    isTeam1: boolean;
  }) => {
    const teamScoreNum = teamScore ? parseInt(teamScore) : 0;
    const opponentScoreNum = opponentScore ? parseInt(opponentScore) : 0;

    // Check if match status includes the word "won"
    if (matchStatus && matchStatus.toLowerCase().includes("won")) {
      return "transparent"; // Both teams are grey if the match is won
    }

    if (matchStatus === "ended") {
      if (Math.abs((teamScoreNum || 0) - (opponentScoreNum || 0)) < 6) {
        return "transparent"; // Neither team is batting if the match ended and the score difference is <6
      }
      return "transparent"; // Match ended but one team had a clear lead
    }

    if (
      (teamScore === "" && opponentScore === "Yet to bat") ||
      (opponentScore === "" && teamScore === "Yet to bat")
    ) {
      return "transparent"; // Both yet to bat
    }

    if (teamScore === "") {
      return isTeam1 ? "green" : "transparent"; // Team 1 is batting if teamScore is empty
    }

    if (opponentScore === "") {
      return isTeam1 ? "transparent" : "green"; // Opponent is batting if opponentScore is empty
    }

    if (teamScoreNum < opponentScoreNum) {
      return "green"; // Current team is batting
    }

    return "transparent"; // Opponent is batting
  };

  const formatScore = (score: string) => {
    return score.replace("/", "-"); // Replace '/' with '-'
  };

  const extractShortName = (teamName: string) => {
    const match = teamName.match(/\[(.*?)\]/); // Extract text inside square brackets
    const shortName = match?.[1] || teamName; // Use short form if available, else full name
    return shortName; // Return short form if available, else full name
  };

  return (
    <>
      {/* Title Section */}
      <View className="px-4 pt-3 pb-1">
        <TouchableOpacity
          className="flex-row items-center w-4/5 gap-2"
          onPress={toggleNumberOfLines}
        >
          {match?.tournamentImg && (
            <View className="p-1 rounded-md">
              <Image
                source={{ uri: match?.tournamentImg }}
                className="w-8 h-8 rounded-md self-center"
              />
            </View>
          )}
          <TextScallingFalse
            className="text-[#EAEAEA] text-3xl w-4/5"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
          >
            {match.series}
          </TextScallingFalse>
        </TouchableOpacity>

        {/* Game Type and Round */}
        <View className="flex-row items-center py-1">
          <TextScallingFalse className="text-theme text-base font-bold">
            {"\u25B6"} Cricket
          </TextScallingFalse>
          <TextScallingFalse className="text-[#919191] text-base uppercase">
            {" \u2022 "} {match.matchType}
          </TextScallingFalse>
        </View>
      </View>

      {/* Live Indicator */}
      {isLive && (
        <View className="rounded-full absolute right-5 top-5 bg-[#BC3D40] px-2 py-0.5 flex-row items-center justify-center">
          <Animated.Text
            className="text-lg text-white font-bold"
            style={{ opacity: opacityValue }}
          >
            &bull;{" "}
          </Animated.Text>
          <TextScallingFalse className="text-lg text-white font-bold">
            LIVE
          </TextScallingFalse>
        </View>
      )}

      {/* Border */}
      <View className="h-[0.8] bg-[#454545] my-1" />

      {/* Teams Section */}
      <View className="px-4 mt-1">
        {/* Team 1 */}
        <View className="flex-row items-center justify-between my-2">
          <NameFlagSubCard
            flag={getCountryCode(match.t1)}
            teamName={extractShortName(match.t1)}
          />
          <TextScallingFalse
            className="ml-2"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
            style={{
              fontSize: 12,
              color: match.t1s === "yet to bat" ? "#464646" : "white",
            }}
          >
            {match.t1s === "" ? "Yet to bat" : formatScore(match.t1s)}
            <TextScallingFalse
              style={{
                fontSize: 9,
                color:
                  match.t1s === ""
                    ? "transparent"
                    : determineBatsman({
                        teamScore: match.t1s,
                        opponentScore: match.t2s,
                        matchStatus: match.status,
                        isTeam1: true,
                      }),
              }}
            >
              {" "}
              &#9664;
            </TextScallingFalse>
          </TextScallingFalse>
        </View>

        {/* Team 2 */}
        <View className="flex-row items-center justify-between my-2">
          <NameFlagSubCard
            flag={getCountryCode(match.t2)}
            teamName={extractShortName(match.t2)}
          />
          <TextScallingFalse
            className="ml-2"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
            style={{
              fontSize: 12,
              color: match.t2s === "yet to bat" ? "#464646" : "white",
            }}
          >
            {match.t2s === "" ? "Yet to bat" : formatScore(match.t2s)}
            <TextScallingFalse
              style={{
                fontSize: 9,
                color:
                  match.t1s === ""
                    ? "transparent"
                    : determineBatsman({
                        teamScore: match.t2s,
                        opponentScore: match.t1s,
                        matchStatus: match.status,
                        isTeam1: false,
                      }),
              }}
            >
              {" "}
              &#9664;
            </TextScallingFalse>
          </TextScallingFalse>
        </View>
      </View>
      {/* Match Status */}
      <TextScallingFalse className="p-1 ml-4 text-neutral-400 text-base">
        {match.status}
      </TextScallingFalse>
    </>
  );
};

export default MatchCard;
