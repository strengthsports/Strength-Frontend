import React, { useEffect, useRef, useState } from "react";
import { View, Image, TouchableOpacity, Animated } from "react-native";
import TextScallingFalse from "~/components/CentralText";
import NameFlagSubCard from "./nameFlagSubCard";
import { countryCodes } from "~/constants/countryCodes";

interface BadmintonMatchCardProps {
  match: {
    id: string;
    series: string;
    round: string;
    t1: string;
    t1s: string[]; // Array of scores for team 1
    t2: string;
    t2s: string[]; // Array of scores for team 2
    status: string;
    tournamentImg?: string;
  };
  isLive?: boolean;
}

const extractShortName = (teamName: string) => {
  const match = teamName.match(/\[(.*?)\]/);
  return match ? match[1] : teamName;
};

const BadmintonMatchCard = ({ match, isLive }: BadmintonMatchCardProps) => {
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

  const getCountryCode = (teamName: string) =>
    countryCodes[teamName as keyof typeof countryCodes] || "Unknown";

  return (
    <>
      {/* Top Section - Tournament, Sport, Round */}
      <View className="px-4 pt-4 pb-2">
        <TouchableOpacity className="flex-row items-center w-4/5 gap-2">
          {match?.tournamentImg && (
            <View className="p-1 rounded-md">
              <Image
                source={{ uri: match?.tournamentImg }}
                className="w-8 h-8 rounded-md self-center"
              />
            </View>
          )}
          <TextScallingFalse className="text-[#EAEAEA] text-3xl w-4/5">
            {match.series}
          </TextScallingFalse>
        </TouchableOpacity>

        {/* Sport Name and Round */}
        <View className="flex-row items-center py-1 mt-1">
          <TextScallingFalse className="text-theme text-base font-bold">
            {"\u25B6"} Badminton
          </TextScallingFalse>
          <TextScallingFalse className="text-[#919191] text-base uppercase">
            {" \u2022 "} {match.round}
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

      {/* Teams & Scores Section */}
      <View className="px-4 mt-2">
        {/* Team 1 */}
        <View className="flex-row items-center justify-between my-2">
          <NameFlagSubCard
            flag={getCountryCode(match.t1)}
            teamName={extractShortName(match.t1)}
          />
          <View className="flex-row gap-4">
            {match.t1s.map((score, index) => (
              <TextScallingFalse key={index} className="text-white">
                {score}
              </TextScallingFalse>
            ))}
          </View>
        </View>

        {/* Team 2 */}
        <View className="flex-row items-center justify-between my-2">
          <NameFlagSubCard
            flag={getCountryCode(match.t2)}
            teamName={extractShortName(match.t2)}
          />
          <View className="flex-row gap-4">
            {match.t2s.map((score, index) => (
              <TextScallingFalse key={index} className="text-white">
                {score}
              </TextScallingFalse>
            ))}
          </View>
        </View>
      </View>

      {/* Match Status */}
      <TextScallingFalse className="absolute bottom-4 left-4 text-neutral-400 text-base mt-2">
        {match.status}
      </TextScallingFalse>
    </>
  );
};

export default BadmintonMatchCard;
